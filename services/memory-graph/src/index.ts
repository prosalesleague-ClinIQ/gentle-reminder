import express from 'express';
import cors from 'cors';
import { graphClient } from './graph/GraphClient.js';
import { getPerson, createPerson, getRelatedPeople, updatePerson } from './graph/PersonNode.js';
import { createStory, getStoriesForPerson, linkStoryToPerson } from './graph/StoryNode.js';
import { createRelationship, getRelationships } from './graph/RelationshipEdge.js';
import { getPatientContext, getConversationContext, findRelatedMemories } from './graph/MemoryQuery.js';
import { seedGraph } from './seed/seedGraph.js';
import { ensureIndexes } from './graph/indexes.js';
import { exportGraph, importGraph } from './backup/backupRestore.js';
import { authenticate, requireRole } from './middleware/auth.js';
import { readLimiter, writeLimiter } from './middleware/rateLimiter.js';
import { requestLogger, logEvent } from './middleware/logger.js';

const app = express();
const PORT = parseInt(process.env.MEMORY_GRAPH_PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ── Pagination helper ────────────────────────────────────────
function parsePagination(query: { skip?: string; limit?: string }): { skip: number; limit: number } {
  const skip = Math.max(0, parseInt(query.skip || '0', 10) || 0);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '25', 10) || 25));
  return { skip, limit };
}

// ── Health (unauthenticated) ─────────────────────────────────
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

// ── Apply auth + rate limiting to API routes ─────────────────
const apiRouter = express.Router();
apiRouter.use(authenticate);

// Apply rate limiters by method
apiRouter.use((req, res, next) => {
  if (req.method === 'GET') {
    readLimiter(req, res, next);
  } else {
    writeLimiter(req, res, next);
  }
});

// ── Person routes ────────────────────────────────────────────
apiRouter.post('/persons', async (req, res, next) => {
  try {
    const { name, relationship, metadata } = req.body;
    if (!name || !relationship) {
      res.status(400).json({ success: false, error: { message: 'name and relationship are required' } });
      return;
    }
    const person = await createPerson(name, relationship, metadata);
    res.status(201).json({ success: true, data: person });
  } catch (error) { next(error); }
});

apiRouter.get('/persons/:id', async (req, res, next) => {
  try {
    const person = await getPerson(req.params.id);
    if (!person) {
      res.status(404).json({ success: false, error: { message: 'Person not found' } });
      return;
    }
    res.json({ success: true, data: person });
  } catch (error) { next(error); }
});

apiRouter.put('/persons/:id', async (req, res, next) => {
  try {
    const person = await updatePerson(req.params.id, req.body);
    if (!person) {
      res.status(404).json({ success: false, error: { message: 'Person not found' } });
      return;
    }
    res.json({ success: true, data: person });
  } catch (error) { next(error); }
});

apiRouter.get('/persons/:id/related', async (req, res, next) => {
  try {
    const people = await getRelatedPeople(req.params.id);
    const { skip, limit } = parsePagination(req.query as any);
    const paginated = people.slice(skip, skip + limit);
    res.json({ success: true, data: paginated, pagination: { skip, limit, total: people.length } });
  } catch (error) { next(error); }
});

// ── Relationship routes ──────────────────────────────────────
apiRouter.post('/relationships', async (req, res, next) => {
  try {
    const { fromId, toId, type, metadata } = req.body;
    if (!fromId || !toId || !type) {
      res.status(400).json({ success: false, error: { message: 'fromId, toId, and type are required' } });
      return;
    }
    const rel = await createRelationship(fromId, toId, type, metadata);
    res.status(201).json({ success: true, data: rel });
  } catch (error) { next(error); }
});

apiRouter.get('/relationships/:personId', async (req, res, next) => {
  try {
    const rels = await getRelationships(req.params.personId);
    const { skip, limit } = parsePagination(req.query as any);
    const paginated = rels.slice(skip, skip + limit);
    res.json({ success: true, data: paginated, pagination: { skip, limit, total: rels.length } });
  } catch (error) { next(error); }
});

// ── Story routes ─────────────────────────────────────────────
apiRouter.post('/stories', async (req, res, next) => {
  try {
    const { title, participants, date, metadata } = req.body;
    if (!title) {
      res.status(400).json({ success: false, error: { message: 'title is required' } });
      return;
    }
    const story = await createStory(title, participants || [], date || new Date().toISOString(), metadata);
    res.status(201).json({ success: true, data: story });
  } catch (error) { next(error); }
});

apiRouter.get('/stories/person/:personId', async (req, res, next) => {
  try {
    const stories = await getStoriesForPerson(req.params.personId);
    const { skip, limit } = parsePagination(req.query as any);
    const paginated = stories.slice(skip, skip + limit);
    res.json({ success: true, data: paginated, pagination: { skip, limit, total: stories.length } });
  } catch (error) { next(error); }
});

apiRouter.post('/stories/:storyId/link/:personId', async (req, res, next) => {
  try {
    const { role } = req.body;
    const linked = await linkStoryToPerson(req.params.storyId, req.params.personId, role);
    res.json({ success: true, data: { linked } });
  } catch (error) { next(error); }
});

// ── Context queries (for AI) ─────────────────────────────────
// All tenant-scoped per fortress-audit C-1 (2026-04-22).
// System admins (tenantId=null, role=system_admin) see across tenants;
// any other role with null tenantId is rejected by authenticate() in prod.
apiRouter.get('/context/patient/:patientId', async (req, res, next) => {
  try {
    const tenantId = req.user?.role === 'system_admin' ? null : (req.user?.tenantId ?? null);
    const context = await getPatientContext(req.params.patientId, tenantId);
    if (!context.patient) {
      // Not found OR cross-tenant — same response either way to avoid enumeration.
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Patient not found' } });
      return;
    }
    res.json({ success: true, data: context });
  } catch (error) { next(error); }
});

apiRouter.get('/context/conversation/:patientId', async (req, res, next) => {
  try {
    const intent = (req.query.intent as string) || '';
    const tenantId = req.user?.role === 'system_admin' ? null : (req.user?.tenantId ?? null);
    const context = await getConversationContext(req.params.patientId, intent, tenantId);
    if (!context.patient) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Patient not found' } });
      return;
    }
    res.json({ success: true, data: context });
  } catch (error) { next(error); }
});

apiRouter.get('/search/memories', async (req, res, next) => {
  try {
    const query = (req.query.q as string) || '';
    if (!query) {
      res.status(400).json({ success: false, error: { message: 'Query parameter q is required' } });
      return;
    }
    const tenantId = req.user?.role === 'system_admin' ? null : (req.user?.tenantId ?? null);
    const results = await findRelatedMemories(query, tenantId);
    res.json({ success: true, data: results });
  } catch (error) { next(error); }
});

// ── Seed endpoint (dev only) ─────────────────────────────────
if (NODE_ENV === 'development') {
  apiRouter.post('/seed', requireRole('system_admin', 'facility_admin'), async (_req, res, next) => {
    try {
      await seedGraph();
      res.json({ success: true, data: { message: 'Graph seeded with demo data' } });
    } catch (error) { next(error); }
  });
}

// ── Backup/Restore (admin only) ──────────────────────────────
apiRouter.get('/admin/backup', requireRole('system_admin'), async (_req, res, next) => {
  try {
    const backup = await exportGraph();
    res.json({ success: true, data: backup });
  } catch (error) { next(error); }
});

apiRouter.post('/admin/restore', requireRole('system_admin'), async (req, res, next) => {
  try {
    const result = await importGraph(req.body);
    res.json({ success: true, data: result });
  } catch (error) { next(error); }
});

// Mount API router
app.use('/api/v1', apiRouter);

// ── Error handler ────────────────────────────────────────────
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logEvent('error', err.message, {
    path: req.path,
    method: req.method,
    requestId: (req as any).requestId,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
  });
  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' },
  });
});

// ── Start ────────────────────────────────────────────────────
async function start() {
  await graphClient.connect();
  await ensureIndexes();

  app.listen(PORT, () => {
    logEvent('info', `Memory Graph service running on port ${PORT}`, { env: NODE_ENV });
  });
}

start().catch((err) => {
  logEvent('error', `Failed to start: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
async function shutdown(signal: string) {
  logEvent('info', `Received ${signal}. Shutting down...`);
  await graphClient.disconnect();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
