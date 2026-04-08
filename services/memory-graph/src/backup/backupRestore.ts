import { graphClient } from '../graph/GraphClient.js';
import { logEvent } from '../middleware/logger.js';

export interface GraphBackup {
  version: 1;
  exportedAt: string;
  persons: Record<string, unknown>[];
  stories: Record<string, unknown>[];
  relationships: { from: string; to: string; type: string; properties: Record<string, unknown> }[];
}

/**
 * Export the entire graph as a JSON structure.
 * Works without APOC by querying nodes and relationships directly.
 */
export async function exportGraph(): Promise<GraphBackup> {
  const backup: GraphBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    persons: [],
    stories: [],
    relationships: [],
  };

  // Export all persons
  const personResult = await graphClient.runQuery('MATCH (p:Person) RETURN p');
  if (personResult) {
    backup.persons = personResult.records.map((r) => r.get('p').properties);
  }

  // Export all stories
  const storyResult = await graphClient.runQuery('MATCH (s:Story) RETURN s');
  if (storyResult) {
    backup.stories = storyResult.records.map((r) => r.get('s').properties);
  }

  // Export all relationships
  const relResult = await graphClient.runQuery(
    `MATCH (a)-[r]->(b)
     WHERE (a:Person OR a:Story) AND (b:Person OR b:Story)
     RETURN a.id AS from, b.id AS to, type(r) AS type, properties(r) AS props`,
  );
  if (relResult) {
    backup.relationships = relResult.records.map((r) => ({
      from: r.get('from'),
      to: r.get('to'),
      type: r.get('type'),
      properties: r.get('props') || {},
    }));
  }

  logEvent('info', 'Graph exported', {
    persons: backup.persons.length,
    stories: backup.stories.length,
    relationships: backup.relationships.length,
  });

  return backup;
}

/**
 * Import a graph backup. Merges by ID so existing data is updated, not duplicated.
 */
export async function importGraph(backup: GraphBackup): Promise<{ imported: number }> {
  let imported = 0;

  // Import persons
  for (const person of backup.persons) {
    await graphClient.writeQuery(
      `MERGE (p:Person {id: $id})
       SET p += $props`,
      { id: person.id, props: person },
    );
    imported++;
  }

  // Import stories
  for (const story of backup.stories) {
    await graphClient.writeQuery(
      `MERGE (s:Story {id: $id})
       SET s += $props`,
      { id: story.id, props: story },
    );
    imported++;
  }

  // Import relationships
  for (const rel of backup.relationships) {
    await graphClient.writeQuery(
      `MATCH (a {id: $from}), (b {id: $to})
       MERGE (a)-[r:${rel.type}]->(b)
       SET r += $props`,
      { from: rel.from, to: rel.to, props: rel.properties },
    );
    imported++;
  }

  logEvent('info', 'Graph imported', { imported });
  return { imported };
}
