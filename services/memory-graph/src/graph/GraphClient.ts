import neo4j, { Driver, Session, Result } from 'neo4j-driver';

/**
 * Neo4j driver wrapper with connection pooling and graceful error handling.
 * Operates in "offline" mode when Neo4j is not available, returning empty results
 * so the rest of the application can function without a graph database.
 */

interface GraphClientConfig {
  uri: string;
  username: string;
  password: string;
  database?: string;
  maxConnectionPoolSize?: number;
}

const DEFAULT_CONFIG: GraphClientConfig = {
  uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
  username: process.env.NEO4J_USER || 'neo4j',
  password: process.env.NEO4J_PASSWORD || 'password',
  database: process.env.NEO4J_DATABASE || 'neo4j',
  maxConnectionPoolSize: 50,
};

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
      console.log('[MemoryGraph] Connected to Neo4j at', this.config.uri);
      return true;
    } catch (error) {
      console.warn('[MemoryGraph] Could not connect to Neo4j — running in offline mode');
      console.warn('[MemoryGraph]', (error as Error).message);
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
      console.log('[MemoryGraph] Disconnected from Neo4j');
    }
  }

  /**
   * Run a Cypher query against Neo4j.
   * Returns an empty result set when operating in offline mode.
   */
  async runQuery(cypher: string, params: Record<string, unknown> = {}): Promise<Result | null> {
    if (!this.connected || !this.driver) {
      console.warn('[MemoryGraph] Query skipped (offline mode):', cypher.slice(0, 80));
      return null;
    }

    const session: Session = this.driver.session({
      database: this.config.database,
    });

    try {
      const result = await session.run(cypher, params);
      return result;
    } catch (error) {
      console.error('[MemoryGraph] Query error:', (error as Error).message);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Run a Cypher query in a write transaction.
   */
  async writeQuery(cypher: string, params: Record<string, unknown> = {}): Promise<Result | null> {
    if (!this.connected || !this.driver) {
      console.warn('[MemoryGraph] Write skipped (offline mode):', cypher.slice(0, 80));
      return null;
    }

    const session: Session = this.driver.session({
      database: this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });

    try {
      const result = await session.executeWrite((tx) => tx.run(cypher, params));
      return result;
    } catch (error) {
      console.error('[MemoryGraph] Write error:', (error as Error).message);
      throw error;
    } finally {
      await session.close();
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Singleton instance
export const graphClient = new GraphClient();
export { GraphClient, GraphClientConfig };
