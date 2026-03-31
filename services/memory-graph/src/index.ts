import express from 'express';
import cors from 'cors';
import { graphClient } from './graph/GraphClient.js';
import { getPerson, createPerson, getRelatedPeople, updatePerson } from './graph/PersonNode.js';
import { createStory, getStoriesForPerson, linkStoryToPerson } from './graph/StoryNode.js';
import { createRelationship, getRelationships } from './graph/RelationshipEdge.js';
import { getPatientContext, getConversationContext, findRelatedMemories } from './graph/MemoryQuery.js';
import { seedGraph } from './seed/seedGraph.js';

const app = express();
const PORT = parseInt(process.env.MEMORY_GRAPH_PORT || '4000', 10);

app.use(cors());
app.use(express.json());

// ── Health ────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      neo4jConnected: graphClient.isConnected(),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// ── Person routes ─────────────────────────────────────────
app.post('/api/v1/persons', async (req, res, next) => {
  try {
    const { name, relationship, metadata } = req.body;
    const person = await createPerson(name, relationship, metadata);
    res.status(201).json({ success: true, data: person });
  } catch (error) { next(error); }
});

app.get('/api/v1/persons/:id', async (req, res, next) => {
  try {
    const person = await getPerson(req.params.id);
    if (!person) {
      res.status(404).json({ success: false, error: { message: 'Person not found' } });
      return;
    }
    res.json({ success: true, data: person });
  } catch (error) { next(error); }
});

app.put('/api/v1/persons/:id', async (req, res, next) => {
  try {
    const person = await updatePerson(req.params.id, req.body);
    if (!person) {
      res.status(404).json({ success: false, error: { message: 'Person not found' } });
      return;
    }
    res.json({ success: true, data: person });
  } catch (error) { next(error); }
});

app.get('/api/v1/persons/:id/related', async (req, res, next) => {
  try {
    const people = await getRelatedPeople(req.params.id);
    res.json({ success: true, data: people });
  } catch (error) { next(error); }
});

// ── Relationship routes ───────────────────────────────────
app.post('/api/v1/relationships', async (req, res, next) => {
  try {
    const { fromId, toId, type, metadata } = req.body;
    const rel = await createRelationship(fromId, toId, type, metadata);
    res.status(201).json({ success: true, data: rel });
  } catch (error) { next(error); }
});

app.get('/api/v1/relationships/:personId', async (req, res, next) => {
  try {
    const rels = await getRelationships(req.params.personId);
    res.json({ success: true, data: rels });
  } catch (error) { next(error); }
});

// ── Story routes ──────────────────────────────────────────
app.post('/api/v1/stories', async (req, res, next) => {
  try {
    const { title, participants, date, metadata } = req.body;
    const story = await createStory(title, participants, date, metadata);
    res.status(201).json({ success: true, data: story });
  } catch (error) { next(error); }
});

app.get('/api/v1/stories/person/:personId', async (req, res, next) => {
  try {
    const stories = await getStoriesForPerson(req.params.personId);
    res.json({ success: true, data: stories });
  } catch (error) { next(error); }
});

app.post('/api/v1/stories/:storyId/link/:personId', async (req, res, next) => {
  try {
    const { role } = req.body;
    const linked = await linkStoryToPerson(req.params.storyId, req.params.personId, role);
    res.json({ success: true, data: { linked } });
  } catch (error) { next(error); }
});

// ── Context queries (for AI) ──────────────────────────────
app.get('/api/v1/context/patient/:patientId', async (req, res, next) => {
  try {
    const context = await getPatientContext(req.params.patientId);
    res.json({ success: true, data: context });
  } catch (error) { next(error); }
});

app.get('/api/v1/context/conversation/:patientId', async (req, res, next) => {
  try {
    const intent = (req.query.intent as string) || '';
    const context = await getConversationContext(req.params.patientId, intent);
    res.json({ success: true, data: context });
  } catch (error) { next(error); }
});

app.get('/api/v1/search/memories', async (req, res, next) => {
  try {
    const query = (req.query.q as string) || '';
    const results = await findRelatedMemories(query);
    res.json({ success: true, data: results });
  } catch (error) { next(error); }
});

// ── Seed endpoint (dev only) ──────────────────────────────
app.post('/api/v1/seed', async (_req, res, next) => {
  try {
    await seedGraph();
    res.json({ success: true, data: { message: 'Graph seeded with demo data' } });
  } catch (error) { next(error); }
});

// ── Error handler ─────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[MemoryGraph] Error:', err.message);
  res.status(500).json({
    success: false,
    error: { message: err.message },
  });
});

// ── Start ─────────────────────────────────────────────────
async function start() {
  await graphClient.connect();

  app.listen(PORT, () => {
    console.log(`[MemoryGraph] Memory Graph service running on port ${PORT}`);
    console.log(`[MemoryGraph] Health check: http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error('[MemoryGraph] Failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
async function shutdown(signal: string) {
  console.log(`\n[MemoryGraph] Received ${signal}. Shutting down...`);
  await graphClient.disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
