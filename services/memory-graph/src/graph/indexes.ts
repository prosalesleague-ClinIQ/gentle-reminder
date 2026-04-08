import { graphClient } from './GraphClient.js';
import { logEvent } from '../middleware/logger.js';

/**
 * Creates Neo4j indexes for optimal query performance.
 * Safe to call multiple times — uses CREATE ... IF NOT EXISTS.
 */
export async function ensureIndexes(): Promise<void> {
  const indexes = [
    // Unique constraints (also serve as indexes)
    'CREATE CONSTRAINT person_id_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.id IS UNIQUE',
    'CREATE CONSTRAINT story_id_unique IF NOT EXISTS FOR (s:Story) REQUIRE s.id IS UNIQUE',

    // Property indexes for common lookups
    'CREATE INDEX person_name_index IF NOT EXISTS FOR (p:Person) ON (p.name)',
    'CREATE INDEX story_date_index IF NOT EXISTS FOR (s:Story) ON (s.date)',
    'CREATE INDEX person_relationship_index IF NOT EXISTS FOR (p:Person) ON (p.relationship)',
  ];

  for (const indexQuery of indexes) {
    try {
      await graphClient.writeQuery(indexQuery);
    } catch (error) {
      logEvent('warn', `Index creation skipped: ${(error as Error).message}`, {
        query: indexQuery.slice(0, 100),
      });
    }
  }

  // Full-text index for search (separate because syntax differs)
  try {
    await graphClient.writeQuery(
      `CREATE FULLTEXT INDEX memory_search IF NOT EXISTS
       FOR (n:Story|Person) ON EACH [n.title, n.name]`,
    );
  } catch (error) {
    logEvent('warn', `Full-text index creation skipped: ${(error as Error).message}`);
  }

  logEvent('info', 'Neo4j indexes ensured');
}
