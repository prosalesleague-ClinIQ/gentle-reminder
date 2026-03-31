import { graphClient } from './GraphClient.js';

/**
 * Operations for relationship edges between Person nodes in the memory graph.
 */

export const RELATIONSHIP_TYPES = [
  'PARENT_OF',
  'CHILD_OF',
  'SPOUSE_OF',
  'SIBLING_OF',
  'FRIEND_OF',
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export interface RelationshipMetadata {
  since?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface RelationshipRecord {
  fromId: string;
  toId: string;
  type: RelationshipType;
  metadata: RelationshipMetadata;
  createdAt: string;
}

/**
 * Create a relationship edge between two people.
 */
export async function createRelationship(
  fromId: string,
  toId: string,
  type: RelationshipType,
  metadata: RelationshipMetadata = {},
): Promise<RelationshipRecord> {
  const now = new Date().toISOString();

  if (!RELATIONSHIP_TYPES.includes(type)) {
    throw new Error(`Invalid relationship type: ${type}. Must be one of: ${RELATIONSHIP_TYPES.join(', ')}`);
  }

  const result = await graphClient.writeQuery(
    `MATCH (a:Person {id: $fromId}), (b:Person {id: $toId})
     MERGE (a)-[r:${type}]->(b)
     SET r.metadata = $metadata, r.createdAt = $createdAt
     RETURN a.id AS fromId, b.id AS toId, type(r) AS relType`,
    {
      fromId,
      toId,
      metadata: JSON.stringify(metadata),
      createdAt: now,
    },
  );

  const record: RelationshipRecord = {
    fromId,
    toId,
    type,
    metadata,
    createdAt: now,
  };

  if (!result) {
    // Offline mode
    return record;
  }

  return record;
}

/**
 * Get all relationships for a person (both inbound and outbound).
 */
export async function getRelationships(personId: string): Promise<RelationshipRecord[]> {
  const result = await graphClient.runQuery(
    `MATCH (p:Person {id: $personId})-[r]-(other:Person)
     RETURN p.id AS fromId, other.id AS toId, type(r) AS relType,
            r.metadata AS metadata, r.createdAt AS createdAt`,
    { personId },
  );

  if (!result) return [];

  return result.records.map((record) => ({
    fromId: record.get('fromId') as string,
    toId: record.get('toId') as string,
    type: record.get('relType') as RelationshipType,
    metadata: typeof record.get('metadata') === 'string'
      ? JSON.parse(record.get('metadata') as string)
      : (record.get('metadata') as RelationshipMetadata) || {},
    createdAt: (record.get('createdAt') as string) || new Date().toISOString(),
  }));
}
