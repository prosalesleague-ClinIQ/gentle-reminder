import { graphClient } from '../graph/GraphClient.js';
import { createPerson } from '../graph/PersonNode.js';
import { createStory, linkStoryToPerson } from '../graph/StoryNode.js';
import { createRelationship } from '../graph/RelationshipEdge.js';

/**
 * Seed the memory graph with demo data for Margaret's family.
 * Run manually or on first startup to populate the graph for demos.
 */

export async function seedGraph(): Promise<void> {
  console.log('[Seed] Seeding memory graph with demo data...');

  // ── People ──────────────────────────────────────────────
  const margaret = await createPerson('Margaret', 'patient', {
    role: 'patient',
    dateOfBirth: '1948-03-15',
    notes: 'Retired schoolteacher. Loves gardening and classical music.',
  });

  const robert = await createPerson('Robert', 'Spouse', {
    role: 'family',
    dateOfBirth: '1946-07-22',
    notes: 'Married to Margaret since 1970. Retired engineer.',
  });

  const lisa = await createPerson('Lisa', 'Daughter', {
    role: 'family',
    dateOfBirth: '1975-11-08',
    notes: 'Primary caregiver. Lives nearby. Works as a nurse.',
  });

  const james = await createPerson('James', 'Son', {
    role: 'family',
    dateOfBirth: '1978-04-12',
    notes: 'Lives in another city. Calls every Sunday.',
  });

  const emma = await createPerson('Emma', 'Grandchild', {
    role: 'family',
    dateOfBirth: '2005-09-20',
    notes: 'Lisa\'s daughter. Margaret loves reading to her.',
  });

  console.log('[Seed] Created 5 people');

  // ── Relationships ───────────────────────────────────────
  await createRelationship(robert.id, margaret.id, 'SPOUSE_OF', { since: '1970' });
  await createRelationship(margaret.id, lisa.id, 'PARENT_OF');
  await createRelationship(margaret.id, james.id, 'PARENT_OF');
  await createRelationship(lisa.id, emma.id, 'PARENT_OF');

  console.log('[Seed] Created 4 relationships');

  // ── Stories ─────────────────────────────────────────────
  const weddingDay = await createStory(
    'Wedding Day',
    [margaret.id, robert.id],
    '1970-06-20',
    {
      location: 'St. Mary\'s Church, Meadowbrook',
      emotionalTone: 'happy',
      summary: 'Margaret and Robert\'s wedding at St. Mary\'s Church. The garden reception had white roses everywhere — Margaret\'s favourite.',
    },
  );

  const firstDayTeaching = await createStory(
    'First Day Teaching',
    [margaret.id],
    '1972-09-04',
    {
      location: 'Oakwood Primary School',
      emotionalTone: 'happy',
      summary: 'Margaret\'s first day as a primary school teacher. She was so nervous but the children loved her immediately.',
    },
  );

  const christmas1985 = await createStory(
    'Christmas 1985',
    [margaret.id, robert.id, lisa.id, james.id],
    '1985-12-25',
    {
      location: 'Family home, 42 Maple Lane',
      emotionalTone: 'happy',
      summary: 'The family Christmas when Lisa got her first bicycle and James opened his train set. Margaret made her famous plum pudding.',
    },
  );

  const lisasWedding = await createStory(
    'Lisa\'s Wedding',
    [margaret.id, robert.id, lisa.id],
    '2002-08-17',
    {
      location: 'Riverside Gardens',
      emotionalTone: 'happy',
      summary: 'Lisa\'s outdoor wedding at Riverside Gardens. Margaret cried happy tears walking Lisa down the aisle alongside Robert.',
    },
  );

  const emmasBirth = await createStory(
    'Emma\'s Birth',
    [margaret.id, lisa.id, emma.id],
    '2005-09-20',
    {
      location: 'City General Hospital',
      emotionalTone: 'happy',
      summary: 'The day Emma was born. Margaret was the first grandparent to hold her. She sang a lullaby right away.',
    },
  );

  console.log('[Seed] Created 5 stories');

  // ── Link stories to participants ────────────────────────
  await linkStoryToPerson(weddingDay.id, margaret.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(weddingDay.id, robert.id, 'PARTICIPATED_IN');

  await linkStoryToPerson(firstDayTeaching.id, margaret.id, 'PARTICIPATED_IN');

  await linkStoryToPerson(christmas1985.id, margaret.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(christmas1985.id, robert.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(christmas1985.id, lisa.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(christmas1985.id, james.id, 'PARTICIPATED_IN');

  await linkStoryToPerson(lisasWedding.id, margaret.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(lisasWedding.id, robert.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(lisasWedding.id, lisa.id, 'PARTICIPATED_IN');

  await linkStoryToPerson(emmasBirth.id, margaret.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(emmasBirth.id, lisa.id, 'PARTICIPATED_IN');
  await linkStoryToPerson(emmasBirth.id, emma.id, 'PARTICIPATED_IN');

  console.log('[Seed] Linked all stories to participants');
  console.log('[Seed] Demo data seeding complete!');
}
