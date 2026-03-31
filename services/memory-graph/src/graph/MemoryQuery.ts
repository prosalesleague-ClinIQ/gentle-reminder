import { graphClient } from './GraphClient.js';
import { getRelatedPeople, type PersonRecord } from './PersonNode.js';
import { getStoriesForPerson, type StoryRecord } from './StoryNode.js';
import { getRelationships, type RelationshipRecord } from './RelationshipEdge.js';

/**
 * High-level context retrieval for AI conversation prompts.
 * Aggregates graph data into structured context objects.
 */

export interface PatientContext {
  patient: PersonRecord | null;
  familyMembers: PersonRecord[];
  relationships: RelationshipRecord[];
  stories: StoryRecord[];
}

export interface ConversationContext {
  patient: PersonRecord | null;
  relevantPeople: PersonRecord[];
  relevantStories: StoryRecord[];
  suggestedTopics: string[];
}

export interface MemorySearchResult {
  stories: StoryRecord[];
  people: PersonRecord[];
}

/**
 * Retrieve the full family and story context for a patient.
 * Used to prime AI conversations with background knowledge.
 */
export async function getPatientContext(patientId: string): Promise<PatientContext> {
  const result = await graphClient.runQuery(
    'MATCH (p:Person {id: $patientId}) RETURN p',
    { patientId },
  );

  const patient = result && result.records.length > 0
    ? parsePersonFromResult(result.records[0].get('p').properties)
    : null;

  const [familyMembers, relationships, stories] = await Promise.all([
    getRelatedPeople(patientId),
    getRelationships(patientId),
    getStoriesForPerson(patientId),
  ]);

  return {
    patient,
    familyMembers,
    relationships,
    stories,
  };
}

/**
 * Retrieve context relevant to a specific conversation intent.
 * Filters family members and stories based on the intent keywords.
 */
export async function getConversationContext(
  patientId: string,
  intent: string,
): Promise<ConversationContext> {
  const fullContext = await getPatientContext(patientId);
  const intentLower = intent.toLowerCase();

  // Filter stories by intent relevance (title or participant match)
  const relevantStories = fullContext.stories.filter((story) => {
    const titleMatch = story.title.toLowerCase().includes(intentLower);
    const metaMatch = story.metadata.summary
      ? story.metadata.summary.toLowerCase().includes(intentLower)
      : false;
    return titleMatch || metaMatch;
  });

  // Filter people by intent relevance (name or relationship match)
  const relevantPeople = fullContext.familyMembers.filter((person) => {
    const nameMatch = person.name.toLowerCase().includes(intentLower);
    const relMatch = person.relationship.toLowerCase().includes(intentLower);
    return nameMatch || relMatch;
  });

  // Generate suggested topics from available stories
  const suggestedTopics = fullContext.stories
    .slice(0, 5)
    .map((s) => s.title);

  return {
    patient: fullContext.patient,
    relevantPeople: relevantPeople.length > 0 ? relevantPeople : fullContext.familyMembers.slice(0, 3),
    relevantStories: relevantStories.length > 0 ? relevantStories : fullContext.stories.slice(0, 3),
    suggestedTopics,
  };
}

/**
 * Semantic search scaffold. Currently performs keyword matching
 * against story titles and person names. Will integrate vector
 * embeddings in a future phase.
 */
export async function findRelatedMemories(query: string): Promise<MemorySearchResult> {
  const queryLower = query.toLowerCase();

  // Search stories by title
  const storyResult = await graphClient.runQuery(
    `MATCH (s:Story)
     WHERE toLower(s.title) CONTAINS $query
     RETURN s
     ORDER BY s.date DESC
     LIMIT 10`,
    { query: queryLower },
  );

  const stories: StoryRecord[] = storyResult
    ? storyResult.records.map((r) => parseStoryFromResult(r.get('s').properties))
    : [];

  // Search people by name
  const personResult = await graphClient.runQuery(
    `MATCH (p:Person)
     WHERE toLower(p.name) CONTAINS $query
     RETURN p
     LIMIT 10`,
    { query: queryLower },
  );

  const people: PersonRecord[] = personResult
    ? personResult.records.map((r) => parsePersonFromResult(r.get('p').properties))
    : [];

  return { stories, people };
}

function parsePersonFromResult(props: Record<string, unknown>): PersonRecord {
  return {
    id: props.id as string,
    name: props.name as string,
    relationship: props.relationship as string,
    metadata: typeof props.metadata === 'string'
      ? JSON.parse(props.metadata as string)
      : (props.metadata as any) || {},
    createdAt: props.createdAt as string,
    updatedAt: props.updatedAt as string,
  };
}

function parseStoryFromResult(props: Record<string, unknown>): StoryRecord {
  return {
    id: props.id as string,
    title: props.title as string,
    participants: Array.isArray(props.participants)
      ? (props.participants as string[])
      : [],
    date: props.date as string,
    metadata: typeof props.metadata === 'string'
      ? JSON.parse(props.metadata as string)
      : (props.metadata as any) || {},
    createdAt: props.createdAt as string,
    updatedAt: props.updatedAt as string,
  };
}
