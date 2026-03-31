import { graphClient } from './GraphClient.js';

/**
 * CRUD operations for Story nodes in the memory graph.
 * A Story represents a shared memory, event, or life moment.
 */

export interface StoryMetadata {
  location?: string;
  emotionalTone?: 'happy' | 'neutral' | 'bittersweet' | 'sad';
  mediaUrls?: string[];
  summary?: string;
  [key: string]: unknown;
}

export interface StoryRecord {
  id: string;
  title: string;
  participants: string[];
  date: string;
  metadata: StoryMetadata;
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Create a story node in the graph.
 */
export async function createStory(
  title: string,
  participants: string[],
  date: string,
  metadata: StoryMetadata = {},
): Promise<StoryRecord> {
  const id = generateId();
  const now = new Date().toISOString();

  const result = await graphClient.writeQuery(
    `CREATE (s:Story {
      id: $id,
      title: $title,
      participants: $participants,
      date: $date,
      metadata: $metadata,
      createdAt: $createdAt,
      updatedAt: $updatedAt
    })
    RETURN s`,
    {
      id,
      title,
      participants,
      date,
      metadata: JSON.stringify(metadata),
      createdAt: now,
      updatedAt: now,
    },
  );

  if (!result) {
    return { id, title, participants, date, metadata, createdAt: now, updatedAt: now };
  }

  return parseStoryRecord(result.records[0].get('s').properties);
}

/**
 * Get all stories linked to a person.
 */
export async function getStoriesForPerson(personId: string): Promise<StoryRecord[]> {
  const result = await graphClient.runQuery(
    `MATCH (p:Person {id: $personId})-[:PARTICIPATED_IN|:MENTIONED_IN]-(s:Story)
     RETURN s
     ORDER BY s.date DESC`,
    { personId },
  );

  if (!result) return [];

  return result.records.map((record) =>
    parseStoryRecord(record.get('s').properties),
  );
}

/**
 * Link a story to a person with a specified role.
 */
export async function linkStoryToPerson(
  storyId: string,
  personId: string,
  role: 'PARTICIPATED_IN' | 'MENTIONED_IN' | 'WITNESSED' = 'PARTICIPATED_IN',
): Promise<boolean> {
  const result = await graphClient.writeQuery(
    `MATCH (s:Story {id: $storyId}), (p:Person {id: $personId})
     MERGE (p)-[r:${role}]->(s)
     SET r.linkedAt = $linkedAt
     RETURN r`,
    {
      storyId,
      personId,
      linkedAt: new Date().toISOString(),
    },
  );

  return result !== null && result.records.length > 0;
}

function parseStoryRecord(props: Record<string, unknown>): StoryRecord {
  return {
    id: props.id as string,
    title: props.title as string,
    participants: Array.isArray(props.participants)
      ? (props.participants as string[])
      : [],
    date: props.date as string,
    metadata: typeof props.metadata === 'string'
      ? JSON.parse(props.metadata as string)
      : (props.metadata as StoryMetadata) || {},
    createdAt: props.createdAt as string,
    updatedAt: props.updatedAt as string,
  };
}
