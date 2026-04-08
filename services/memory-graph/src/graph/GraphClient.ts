import neo4j, { Driver, Session, Result } from 'neo4j-driver';
import { logEvent } from '../middleware/logger.js';

/**
 * Neo4j driver wrapper with connection pooling, retry logic, and graceful error handling.
 * Operates in "offline" mode when Neo4j is not available, returning empty results
 * so the rest of the application can function without a graph database.
 */

interface GraphClientConfig {
  uri: string;
  username: string;
  password: string;
  database?: string;
  maxConnectionPoolSize?: number;
  queryTimeoutMs?: number;
  maxRetries?: number;
}

const DEFAULT_CONFIG: GraphClientConfig = {
  uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
  username: process.env.NEO4J_USER || 'neo4j',
  password: process.env.NEO4J_PASSWORD || 'password',
  database: process.env.NEO4J_DATABASE || 'neo4j',
  maxConnectionPoolSize: 50,
  queryTimeoutMs: 5000,
  maxRetries: 3,
};

/**
 * Determines if an error is transient and worth retrying.
 */
function isTransientError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('connection refused') ||
    message.includes('session expired') ||
    message.includes('connection reset') ||
    message.includes('deadlock') ||
    message.includes('temporarily unavailable')
  );
}

/**
 * Wait with exponential backoff: base * 2^attempt (200ms, 400ms, 800ms).
 */
function backoffDelay(attempt: number): Promise<void> {
  const ms = 200 * Math.pow(2, attempt);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class GraphClient {
  private driver: Driver | null = null;
  private config: GraphClientConfig;
  private connected = false;

  constructor(config?: Partial<GraphClientConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Establish connection to Neo4j. Fails gracefully if the server is unavailable.
   */
  async connect(): Promise<boolean> {
    try {
      this.driver = neo4j.driver(
        this.config.uri,
        neo4j.auth.basic(this.config.username, this.config.password),
        {
          maxConnectionPoolSize: this.config.maxConnectionPoolSize,
          connectionAcquisitionTimeout: 5000,
          connectionTimeout: 5000,
        },
      );

      // Verify connectivity
      await this.driver.verifyConnectivity();
      this.connected = true;
      logEvent('info', `Connected to Neo4j at ${this.config.uri}`);
      return true;
    } catch (error) {
      logEvent('warn', 'Could not connect to Neo4j — running in offline mode', {
        error: (error as Error).message,
      });
      this.connected = false;
      return false;
    }
  }

  /**
   * Close the Neo4j driver and release all connections.
   */
  async disconnect(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
      this.connected = false;
      logEvent('info', 'Disconnected from Neo4j');
    }
  }

  /**
   * Run a Cypher query against Neo4j with retry on transient failures.
   * Returns an empty result set when operating in offline mode.
   */
  async runQuery(cypher: string, params: Record<string, unknown> = {}): Promise<Result | null> {
    if (!this.connected || !this.driver) {
      return null;
    }

    const maxRetries = this.config.maxRetries || 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const session: Session = this.driver.session({
        database: this.config.database,
      });

      try {
        const result = await session.run(cypher, params);
        return result;
      } catch (error) {
        if (attempt < maxRetries - 1 && isTransientError(error as Error)) {
          logEvent('warn', `Query retry ${attempt + 1}/${maxRetries}`, {
            error: (error as Error).message,
            query: cypher.slice(0, 80),
          });
          await backoffDelay(attempt);
          continue;
        }
        logEvent('error', `Query failed: ${(error as Error).message}`, {
          query: cypher.slice(0, 80),
        });
        throw error;
      } finally {
        await session.close();
      }
    }

    return null;
  }

  /**
   * Run a Cypher query in a write transaction with retry on transient failures.
   */
  async writeQuery(cypher: string, params: Record<string, unknown> = {}): Promise<Result | null> {
    if (!this.connected || !this.driver) {
      return null;
    }

    const maxRetries = this.config.maxRetries || 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const session: Session = this.driver.session({
        database: this.config.database,
        defaultAccessMode: neo4j.session.WRITE,
      });

      try {
        const result = await session.executeWrite((tx) => tx.run(cypher, params));
        return result;
      } catch (error) {
        if (attempt < maxRetries - 1 && isTransientError(error as Error)) {
          logEvent('warn', `Write retry ${attempt + 1}/${maxRetries}`, {
            error: (error as Error).message,
            query: cypher.slice(0, 80),
          });
          await backoffDelay(attempt);
          continue;
        }
        logEvent('error', `Write failed: ${(error as Error).message}`, {
          query: cypher.slice(0, 80),
        });
        throw error;
      } finally {
        await session.close();
      }
    }

    return null;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Singleton instance
export const graphClient = new GraphClient();
export { GraphClient };
export type { GraphClientConfig };
