import { graphClient } from './GraphClient.js';
import { v4 as uuidv4 } from 'crypto';

/**
 * CRUD operations for Person nodes in the memory graph.
 * A Person represents a patient, family member, friend, or caregiver.
 */

export interface PersonMetadata {
  photoUrl?: string;
  dateOfBirth?: string;
  notes?: string;
  role?: 'patient' | 'family' | 'friend' | 'caregiver';
  [key: string]: unknown;
}

export interface PersonRecord {
  id: string;
  name: string;
  relationship: string;
  metadata: PersonMetadata;
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Create a person node in the graph.
 */
export async function createPerson(
  name: string,
  relationship: string,
  metadata: PersonMetadata = {},
): Promise<PersonRecord> {
  const id = generateId();
  const now = new Date().toISOString();

  const result = await graphClient.writeQuery(
    `CREATE (p:Person {
      id: $id,
      name: $name,
      relationship: $relationship,
      metadata: $metadata,
      createdAt: $createdAt,
      updatedAt: $updatedAt
    })
    RETURN p`,
    {
      id,
      name,
      relationship,
      metadata: JSON.stringify(metadata),
      createdAt: now,
      updatedAt: now,
    },
  );

  if (!result) {
    // Offline mode — return the record we would have created
    return { id, name, relationship, metadata, createdAt: now, updatedAt: now };
  }

  return parsePersonRecord(result.records[0].get('p').properties);
}

/**
 * Retrieve a person by their ID.
 */
export async function getPerson(id: string): Promise<PersonRecord | null> {
  const result = await graphClient.runQuery(
    'MATCH (p:Person {id: $id}) RETURN p',
    { id },
  );

  if (!result || result.records.length === 0) {
    return null;
  }

  return parsePersonRecord(result.records[0].get('p').properties);
}

/**
 * Get all people related to a given person (one hop).
 */
export async function getRelatedPeople(personId: string): Promise<PersonRecord[]> {
  const result = await graphClient.runQuery(
    `MATCH (p:Person {id: $personId})-[r]-(related:Person)
     RETURN related, type(r) AS relType`,
    { personId },
  );

  if (!result) return [];

  return result.records.map((record) =>
    parsePersonRecord(record.get('related').properties),
  );
}

/**
 * Update fields on an existing person node.
 */
export async function updatePerson(
  id: string,
  updates: Partial<Pick<PersonRecord, 'name' | 'relationship' | 'metadata'>>,
): Promise<PersonRecord | null> {
  const setClauses: string[] = ['p.updatedAt = $updatedAt'];
  const params: Record<string, unknown> = {
    id,
    updatedAt: new Date().toISOString(),
  };

  if (updates.name !== undefined) {
    setClauses.push('p.name = $name');
    params.name = updates.name;
  }
  if (updates.relationship !== undefined) {
    setClauses.push('p.relationship = $relationship');
    params.relationship = updates.relationship;
  }
  if (updates.metadata !== undefined) {
    setClauses.push('p.metadata = $metadata');
    params.metadata = JSON.stringify(updates.metadata);
  }

  const result = await graphClient.writeQuery(
    `MATCH (p:Person {id: $id})
     SET ${setClauses.join(', ')}
     RETURN p`,
    params,
  );

  if (!result || result.records.length === 0) {
    return null;
  }

  return parsePersonRecord(result.records[0].get('p').properties);
}

function parsePersonRecord(props: Record<string, unknown>): PersonRecord {
  return {
    id: props.id as string,
    name: props.name as string,
    relationship: props.relationship as string,
    metadata: typeof props.metadata === 'string'
      ? JSON.parse(props.metadata as string)
      : (props.metadata as PersonMetadata) || {},
    createdAt: props.createdAt as string,
    updatedAt: props.updatedAt as string,
  };
}
