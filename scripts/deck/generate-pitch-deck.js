/**
 * Gentle Reminder — Investor Pitch Deck (.pptx generator)
 *
 * Generates Gentle-Reminder-Pitch-Deck.pptx in apps/pitch-site/public/
 * so it can be downloaded from the public pitch site.
 *
 * Run with: node scripts/deck/generate-pitch-deck.js
 */

const pptxgen = require('pptxgenjs');
const path = require('path');

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.3" x 7.5" — true widescreen 16:9
pres.author = 'Christo Mac';
pres.company = 'Gentle Reminder';
pres.title = 'Gentle Reminder — Seed Pitch';
pres.subject = 'Clinical-grade dementia care platform seed round';

// ============================================================
// COLOR PALETTE — "Midnight Executive" adapted for medtech
// ============================================================
const C = {
  bg: '0A0E1A', // deep navy-black
  bgLight: '161B22', // lighter dark for cards
  bgCard: '0D1117', // deepest black for inner cards
  border: '21262D',
  textBright: 'F0F6FC',
  text: 'C9D1D9',
  textMuted: '8B949E',
  textDim: '6E7681',
  blue: '58A6FF',
  green: '3FB950',
  red: 'F85149',
  amber: 'D29922',
  purple: 'A371F7',
  white: 'FFFFFF',
};

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function addSlideNumber(slide, n) {
  slide.addText(`${String(n).padStart(2, '0')} / 16  ·  GENTLE REMINDER`, {
    x: 0.4, y: 7.1, w: 10, h: 0.3,
    fontSize: 9, color: C.textDim, fontFace: 'Calibri',
    charSpacing: 4,
  });
}

function addKicker(slide, text, color = C.red) {
  slide.addText(text, {
    x: 0.6, y: 0.5, w: 10, h: 0.4,
    fontSize: 11, color: color, bold: true, fontFace: 'Arial',
    charSpacing: 6,
  });
}

function addTitle(slide, text, y = 1.0) {
  slide.addText(text, {
    x: 0.6, y: y, w: 12, h: 1.1,
    fontSize: 40, color: C.textBright, bold: true, fontFace: 'Arial Black',
    charSpacing: -1, valign: 'top',
  });
}

function addFooter(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 7.45, w: 13.3, h: 0.05,
    fill: { color: C.blue },
    line: { color: C.blue, width: 0 },
  });
}

function setDarkBg(slide) {
  slide.background = { color: C.bg };
}

// ============================================================
// SLIDE 1: TITLE
// ============================================================
let s = pres.addSlide();
setDarkBg(s);

// Gradient simulation — multiple soft rectangles
s.addShape(pres.shapes.OVAL, {
  x: -3, y: -3, w: 10, h: 10,
  fill: { color: C.blue, transparency: 85 },
  line: { color: C.blue, width: 0, transparency: 100 },
});
s.addShape(pres.shapes.OVAL, {
  x: 7, y: 3, w: 10, h: 10,
  fill: { color: C.green, transparency: 90 },
  line: { color: C.green, width: 0, transparency: 100 },
});

s.addText('SEED PITCH  ·  CONFIDENTIAL', {
  x: 0.8, y: 1.0, w: 12, h: 0.4,
  fontSize: 12, color: C.blue, bold: true, fontFace: 'Arial',
  charSpacing: 8,
});

s.addText('Gentle Reminder', {
  x: 0.8, y: 1.5, w: 12, h: 1.8,
  fontSize: 80, color: C.textBright, bold: true, fontFace: 'Arial Black',
  charSpacing: -2,
});

s.addText('The clinical-grade dementia care platform', {
  x: 0.8, y: 3.5, w: 12, h: 0.6,
  fontSize: 26, color: C.text, fontFace: 'Calibri',
});

s.addText('23 patented innovations  ·  $186B market  ·  FDA SaMD pathway', {
  x: 0.8, y: 4.2, w: 12, h: 0.5,
  fontSize: 18, color: C.green, bold: true, fontFace: 'Arial',
});

// Bottom contact card
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 5.5, w: 11.5, h: 1.4,
  fill: { color: C.bgLight, transparency: 20 },
  line: { color: C.border, width: 1 },
});
s.addText([
  { text: 'Christo Mac', options: { fontSize: 18, bold: true, color: C.textBright, breakLine: true } },
  { text: 'Founder & CEO/COO', options: { fontSize: 13, color: C.blue, breakLine: true } },
  { text: 'mack@matrixadvancedsolutions.com  ·  https://gentle-reminder-pitch.vercel.app', options: { fontSize: 12, color: C.textMuted } },
], { x: 1.0, y: 5.6, w: 11.0, h: 1.2, fontFace: 'Calibri', margin: 0 });

addSlideNumber(s, 1);

// ============================================================
// SLIDE 2: PROBLEM
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'THE PROBLEM', C.red);
addTitle(s, 'Dementia care is broken.');

// Left big stat
s.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 2.5, w: 5.5, h: 4,
  fill: { color: C.bgCard },
  line: { color: C.red, width: 2 },
});
s.addText('55M+', {
  x: 0.8, y: 2.8, w: 5.1, h: 1.8,
  fontSize: 100, bold: true, color: C.red, fontFace: 'Arial Black',
  charSpacing: -3,
});
s.addText('people with dementia globally', {
  x: 0.8, y: 4.5, w: 5.1, h: 0.5,
  fontSize: 18, color: C.textBright, fontFace: 'Calibri', bold: true,
});
s.addText('10M new cases / year  ·  $1.3T annual cost  ·  zero curative therapy', {
  x: 0.8, y: 5.1, w: 5.1, h: 0.9,
  fontSize: 13, color: C.text, fontFace: 'Calibri',
});

// Right: pain points
s.addText('The problem compounds:', {
  x: 6.5, y: 2.5, w: 6.3, h: 0.5,
  fontSize: 15, bold: true, color: C.textBright, fontFace: 'Arial',
});
s.addText([
  { text: 'Standard cognitive tests (MMSE, MoCA, ADAS-Cog) produce pass/fail feedback that triggers documented anxiety, agitation, and session abandonment in dementia patients.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'Caregivers lack real-time digital biomarkers for decline detection.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'Clinicians lack longitudinal decline-tracking tools that scale.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'Pharma trials (Leqembi, Kisunla) lack scalable digital endpoints for anti-amyloid therapy.', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'No dementia-safe alternative exists. Digital competitors replicate the pass/fail paradigm.', options: { bullet: true } },
], {
  x: 6.5, y: 3.0, w: 6.3, h: 4.0,
  fontSize: 13, color: C.text, fontFace: 'Calibri',
});

addFooter(s);
addSlideNumber(s, 2);

// ============================================================
// SLIDE 3: SOLUTION
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'THE SOLUTION', C.green);
addTitle(s, 'Built from the algorithm up — for dementia.');

const solutions = [
  {
    title: 'THREE-STATE FEEDBACK',
    desc: 'CELEBRATED / GUIDED / SUPPORTED — never negative. Architecturally guarantees no failure reaches the patient.',
    color: C.blue,
  },
  {
    title: 'DIGITAL BIOMARKERS',
    desc: 'Speech hesitation, response time, sleep irregularity, routine disruption, medication adherence. Composite score for decline tracking.',
    color: C.green,
  },
  {
    title: 'FDA SaMD READY',
    desc: 'Full documentation (IEC 62304, ISO 14971, QMS, CFR Part 11). 510(k) predicate identified. Medicare reimbursement pathway.',
    color: C.purple,
  },
];

solutions.forEach((sol, i) => {
  const x = 0.6 + i * 4.23;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.3, w: 4.1, h: 4.5,
    fill: { color: C.bgCard },
    line: { color: sol.color, width: 2 },
  });
  // Top accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.3, w: 4.1, h: 0.1,
    fill: { color: sol.color },
    line: { color: sol.color, width: 0 },
  });
  s.addText(sol.title, {
    x: x + 0.3, y: 2.7, w: 3.5, h: 0.6,
    fontSize: 16, bold: true, color: sol.color, fontFace: 'Arial',
    charSpacing: 3,
  });
  s.addText(sol.desc, {
    x: x + 0.3, y: 3.5, w: 3.5, h: 3.0,
    fontSize: 14, color: C.text, fontFace: 'Calibri', valign: 'top',
  });
});

addFooter(s);
addSlideNumber(s, 3);

// ============================================================
// SLIDE 4: PRODUCT
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'THE PRODUCT', C.blue);
addTitle(s, 'Production-ready platform.');

const metrics = [
  { v: '53K+', l: 'Lines of production code' },
  { v: '5', l: 'Deployed applications' },
  { v: '30+', l: 'API routes' },
  { v: '30+', l: 'Database models' },
  { v: '10', l: 'Languages (RTL-aware)' },
  { v: 'FHIR R4', l: 'EHR integration ready' },
];

metrics.forEach((m, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.6 + col * 4.23;
  const y = 2.3 + row * 1.8;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 4.0, h: 1.5,
    fill: { color: C.bgLight },
    line: { color: C.border, width: 1 },
  });
  s.addText(m.v, {
    x: x + 0.2, y: y + 0.15, w: 3.6, h: 0.9,
    fontSize: 44, bold: true, color: C.blue, fontFace: 'Arial Black', valign: 'middle',
  });
  s.addText(m.l, {
    x: x + 0.2, y: y + 1.0, w: 3.6, h: 0.4,
    fontSize: 11, color: C.textMuted, fontFace: 'Calibri',
  });
});

s.addText('5 apps: iPad patient app, caregiver dashboard, clinician dashboard, admin portal, family dashboard. Apple Watch with HealthKit. FHIR R4. Multi-tenant. 10 languages with RTL. 95+ test files. Full FDA SaMD documentation.', {
  x: 0.6, y: 6.2, w: 12.1, h: 0.9,
  fontSize: 13, color: C.text, fontFace: 'Calibri', italic: true,
});

addFooter(s);
addSlideNumber(s, 4);

// ============================================================
// SLIDE 5: MARKET
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'MARKET', C.amber);
addTitle(s, '$186B global market.  $450M 5-year SOM.');

const markets = [
  { size: '$186B', label: 'TAM', desc: 'Global dementia care market (Alzheimer\'s Disease International, 2023). 55M+ patients, $1.3T in total costs.', color: C.blue },
  { size: '$23B',  label: 'SAM', desc: 'US digital therapeutics + digital health addressable segment. 26% CAGR.', color: C.green },
  { size: '$450M', label: 'SOM', desc: 'US memory care facilities + DTx prescription + MA contracts, 5-year obtainable.', color: C.amber },
];

markets.forEach((m, i) => {
  const x = 0.6 + i * 4.23;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.4, w: 4.1, h: 4.5,
    fill: { color: C.bgCard },
    line: { color: m.color, width: 2 },
  });
  s.addText(m.size, {
    x: x + 0.3, y: 2.7, w: 3.5, h: 1.5,
    fontSize: 70, bold: true, color: m.color, fontFace: 'Arial Black', charSpacing: -3,
  });
  s.addText(m.label, {
    x: x + 0.3, y: 4.3, w: 3.5, h: 0.5,
    fontSize: 15, bold: true, color: C.textBright, fontFace: 'Arial', charSpacing: 4,
  });
  s.addText(m.desc, {
    x: x + 0.3, y: 4.9, w: 3.5, h: 1.8,
    fontSize: 12, color: C.text, fontFace: 'Calibri', valign: 'top',
  });
});

addFooter(s);
addSlideNumber(s, 5);

// ============================================================
// SLIDE 6: IP MOAT
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'IP MOAT', C.purple);
addTitle(s, '23 patent-pending innovations.');

const tiers = [
  { tier: 'Tier 1', count: '5', color: C.red, label: 'Foundational' },
  { tier: 'Tier 2', count: '7', color: C.amber, label: 'Strong claims' },
  { tier: 'Tier 3', count: '11', color: C.blue, label: 'System-level' },
];

tiers.forEach((t, i) => {
  const x = 0.6 + i * 2.15;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.4, w: 1.95, h: 2.0,
    fill: { color: C.bgCard },
    line: { color: t.color, width: 2 },
  });
  s.addText(t.count, {
    x, y: 2.5, w: 1.95, h: 1.0,
    fontSize: 56, bold: true, color: t.color, fontFace: 'Arial Black', align: 'center',
  });
  s.addText(t.tier, {
    x, y: 3.6, w: 1.95, h: 0.4,
    fontSize: 13, bold: true, color: C.textBright, fontFace: 'Arial', align: 'center',
  });
  s.addText(t.label, {
    x, y: 4.0, w: 1.95, h: 0.3,
    fontSize: 10, color: C.textMuted, fontFace: 'Calibri', align: 'center',
  });
});

// Right side: highlights
s.addText('TIER 1 HIGHLIGHTS:', {
  x: 7.2, y: 2.4, w: 5.5, h: 0.4,
  fontSize: 12, bold: true, color: C.textMuted, fontFace: 'Arial', charSpacing: 4,
});
s.addText([
  { text: 'GR-01: Three-state positive-only feedback — the only architectural dementia-safe scoring', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
  { text: 'GR-02: Asymmetric adaptive difficulty (70-85% comfort zone)', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
  { text: 'GR-03: Dementia-adapted SM-2 spaced repetition', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
  { text: 'GR-04: Multimodal cognitive state classifier', options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
  { text: 'GR-05: Dementia-specific speech emotion detection', options: { bullet: true } },
], {
  x: 7.2, y: 2.9, w: 5.5, h: 3.2, fontSize: 12, color: C.text, fontFace: 'Calibri',
});

s.addText('Portfolio valuation: $22M–$57M (sum-of-parts, pre-seed)', {
  x: 0.6, y: 5.2, w: 12.0, h: 0.4,
  fontSize: 14, color: C.green, bold: true, fontFace: 'Arial',
});
s.addText('All USPTO provisionals in flight · 12-month priority window · Trade-secret parameters retained separately', {
  x: 0.6, y: 5.7, w: 12.0, h: 0.4,
  fontSize: 12, color: C.textMuted, fontFace: 'Calibri', italic: true,
});

addFooter(s);
addSlideNumber(s, 6);

// ============================================================
// SLIDE 7: FDA PATHWAY
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'REGULATORY PATHWAY', C.green);
addTitle(s, 'FDA SaMD Class II via 510(k).');

s.addText('DOCUMENTATION STATUS', {
  x: 0.6, y: 2.4, w: 6, h: 0.4,
  fontSize: 12, bold: true, color: C.textMuted, charSpacing: 4,
});

const docs = [
  ['IEC 62304 Software Lifecycle', 'Complete'],
  ['ISO 14971 Risk Management (FMEA)', 'Complete'],
  ['ISO 13485 QMS Framework', 'Complete'],
  ['21 CFR Part 11 Electronic Records', 'Complete'],
  ['STRIDE Cybersecurity Assessment', 'Complete'],
  ['Algorithm Transparency Module', 'Complete'],
  ['Clinical Validation Protocol', 'Drafted'],
  ['510(k) Predicate Analysis', 'K201738 Linus Health'],
];

docs.forEach((doc, i) => {
  const y = 2.9 + i * 0.45;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y, w: 6.2, h: 0.4,
    fill: { color: i % 2 === 0 ? C.bgCard : C.bg },
    line: { color: C.border, width: 0.5 },
  });
  s.addText(doc[0], {
    x: 0.8, y, w: 4.2, h: 0.4, fontSize: 11, color: C.text, valign: 'middle', fontFace: 'Calibri',
  });
  s.addText(`✓ ${doc[1]}`, {
    x: 5.1, y, w: 1.7, h: 0.4, fontSize: 11, color: C.green, valign: 'middle', bold: true, fontFace: 'Calibri',
  });
});

// Right side: predicate + timeline
s.addText('PREDICATE PATH', {
  x: 7.4, y: 2.4, w: 5.5, h: 0.4,
  fontSize: 12, bold: true, color: C.textMuted, charSpacing: 4,
});

s.addShape(pres.shapes.RECTANGLE, {
  x: 7.4, y: 2.9, w: 5.5, h: 1.0,
  fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
});
s.addText([
  { text: 'K201738 — Linus Health', options: { fontSize: 13, bold: true, color: C.blue, breakLine: true } },
  { text: 'Digital Clock and Recall; cleared 2020. Substantial equivalence basis for our 510(k).', options: { fontSize: 11, color: C.text } },
], { x: 7.6, y: 3.0, w: 5.1, h: 0.9, fontFace: 'Calibri', valign: 'top' });

s.addShape(pres.shapes.RECTANGLE, {
  x: 7.4, y: 4.0, w: 5.5, h: 1.0,
  fill: { color: C.bgCard }, line: { color: C.border, width: 1 },
});
s.addText([
  { text: 'K182554 — Cogstate', options: { fontSize: 13, bold: true, color: C.blue, breakLine: true } },
  { text: 'Brief computerized cognitive assessment. Secondary predicate.', options: { fontSize: 11, color: C.text } },
], { x: 7.6, y: 4.1, w: 5.1, h: 0.9, fontFace: 'Calibri', valign: 'top' });

s.addText([
  { text: 'Target:', options: { bold: true, color: C.textBright } },
  { text: ' 510(k) submission within 12 months of seed close.', options: { color: C.text, breakLine: true } },
  { text: 'Clearance timeline:', options: { bold: true, color: C.textBright } },
  { text: ' 12-18 months from submission (P50 ~15 months).', options: { color: C.text } },
], { x: 7.4, y: 5.2, w: 5.5, h: 1.0, fontSize: 12, fontFace: 'Calibri' });

addFooter(s);
addSlideNumber(s, 7);

// ============================================================
// SLIDE 8: BUSINESS MODEL
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'BUSINESS MODEL', C.green);
addTitle(s, 'Multi-channel revenue. Defensible economics.');

const streams = [
  { label: 'B2B FACILITY SAAS', price: '$6,000 / bed / year', desc: '30,000+ US memory care facilities. Patient app + caregiver dashboard + clinical reporting. Annual contracts with 5% escalation.', color: C.blue },
  { label: 'B2B2C DTx (POST-510K)', price: '$180 / patient / month', desc: 'Provider-prescribed DTx. CPT-code reimbursable. Medicare + Medicare Advantage coverage target.', color: C.green },
  { label: 'PHARMA LICENSING', price: '$2M-$10M / deal', desc: 'Digital endpoint for anti-amyloid therapy trials (Biogen, Eisai, Lilly). Upfront + milestones + royalties.', color: C.amber },
  { label: 'PAYER VALUE-BASED', price: 'Per-member outcomes', desc: 'Medicare Advantage risk stratification. Cost-reduction sharing on early intervention.', color: C.purple },
];

streams.forEach((s0, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.6 + col * 6.2;
  const y = 2.4 + row * 2.3;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 6.0, h: 2.1,
    fill: { color: C.bgLight },
    line: { color: s0.color, width: 2 },
  });
  s.addText(s0.label, {
    x: x + 0.2, y: y + 0.15, w: 5.6, h: 0.35,
    fontSize: 11, bold: true, color: s0.color, fontFace: 'Arial', charSpacing: 4,
  });
  s.addText(s0.price, {
    x: x + 0.2, y: y + 0.55, w: 5.6, h: 0.6,
    fontSize: 26, bold: true, color: C.textBright, fontFace: 'Arial Black',
  });
  s.addText(s0.desc, {
    x: x + 0.2, y: y + 1.2, w: 5.6, h: 0.85,
    fontSize: 12, color: C.text, fontFace: 'Calibri', valign: 'top',
  });
});

addFooter(s);
addSlideNumber(s, 8);

// ============================================================
// SLIDE 9: REVENUE PROJECTIONS
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'PROJECTIONS', C.green);
addTitle(s, 'Path to $85M ARR in Year 5.');

const tableRows = [
  [
    { text: '', options: { fill: { color: C.bg } } },
    { text: 'Y1', options: { fill: { color: C.bgLight }, bold: true, color: C.textMuted, align: 'right', fontSize: 13 } },
    { text: 'Y2', options: { fill: { color: C.bgLight }, bold: true, color: C.textMuted, align: 'right', fontSize: 13 } },
    { text: 'Y3', options: { fill: { color: C.bgLight }, bold: true, color: C.textMuted, align: 'right', fontSize: 13 } },
    { text: 'Y4', options: { fill: { color: C.bgLight }, bold: true, color: C.textMuted, align: 'right', fontSize: 13 } },
    { text: 'Y5', options: { fill: { color: C.bgLight }, bold: true, color: C.textMuted, align: 'right', fontSize: 13 } },
  ],
  [
    { text: 'Facilities', options: { fill: { color: C.bg }, color: C.text, bold: true, fontSize: 13 } },
    { text: '8', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '32', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '110', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '280', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '580', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
  ],
  [
    { text: 'Patients', options: { fill: { color: C.bg }, color: C.text, bold: true, fontSize: 13 } },
    { text: '640', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '2,560', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '8,800', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '22,400', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
    { text: '46,400', options: { fill: { color: C.bg }, color: C.text, align: 'right', fontSize: 13 } },
  ],
  [
    { text: 'ARR', options: { fill: { color: C.bgLight }, color: C.textBright, bold: true, fontSize: 16 } },
    { text: '$500K', options: { fill: { color: C.bgLight }, color: C.green, bold: true, align: 'right', fontSize: 17 } },
    { text: '$3.8M', options: { fill: { color: C.bgLight }, color: C.green, bold: true, align: 'right', fontSize: 17 } },
    { text: '$14M', options: { fill: { color: C.bgLight }, color: C.green, bold: true, align: 'right', fontSize: 17 } },
    { text: '$38M', options: { fill: { color: C.bgLight }, color: C.green, bold: true, align: 'right', fontSize: 17 } },
    { text: '$85M', options: { fill: { color: C.bgLight }, color: C.green, bold: true, align: 'right', fontSize: 17 } },
  ],
];

s.addTable(tableRows, {
  x: 0.6, y: 2.5, w: 12, colW: [2.4, 1.92, 1.92, 1.92, 1.92, 1.92],
  rowH: [0.5, 0.55, 0.55, 0.75],
  border: { type: 'solid', pt: 1, color: C.border }, fontFace: 'Calibri',
});

s.addText([
  { text: 'Y3+ includes DTx prescription revenue (post-510k clearance).', options: { color: C.text, breakLine: true } },
  { text: 'Excludes potential $10M-$50M strategic pharma licensing deals.', options: { color: C.textMuted } },
], { x: 0.6, y: 5.5, w: 12.0, h: 0.9, fontSize: 12, fontFace: 'Calibri', italic: true });

addFooter(s);
addSlideNumber(s, 9);

// ============================================================
// SLIDE 10: UNIT ECONOMICS
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'UNIT ECONOMICS', C.blue);
addTitle(s, 'LTV/CAC of 60×. Top-quartile.');

const unitEcons = [
  { metric: 'Facility ACV', value: '$60,000', note: '10 beds × $6K/year' },
  { metric: 'CAC (Facility)', value: '$3,000', note: 'Inside sales + pilot' },
  { metric: 'LTV (Facility)', value: '$180,000', note: '37.5-month lifetime' },
  { metric: 'LTV / CAC', value: '60×', note: 'Top-quartile SaaS' },
  { metric: 'Gross Margin', value: '82%', note: 'Cloud SaaS + support' },
  { metric: 'Annual Churn', value: '8%', note: 'vs 10-15% benchmark' },
];

unitEcons.forEach((u, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.6 + col * 4.23;
  const y = 2.4 + row * 2.3;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 4.1, h: 2.1,
    fill: { color: C.bgLight },
    line: { color: C.border, width: 1 },
  });
  s.addText(u.metric, {
    x: x + 0.25, y: y + 0.2, w: 3.6, h: 0.35,
    fontSize: 12, color: C.textMuted, fontFace: 'Calibri',
  });
  s.addText(u.value, {
    x: x + 0.25, y: y + 0.6, w: 3.6, h: 1.0,
    fontSize: 50, bold: true, color: C.blue, fontFace: 'Arial Black',
  });
  s.addText(u.note, {
    x: x + 0.25, y: y + 1.65, w: 3.6, h: 0.4,
    fontSize: 11, color: C.text, fontFace: 'Calibri',
  });
});

addFooter(s);
addSlideNumber(s, 10);

// ============================================================
// SLIDE 11: COMPETITIVE LANDSCAPE
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'COMPETITIVE LANDSCAPE', C.amber);
addTitle(s, 'Nobody else has built this for dementia.');

const compRows = [
  [
    { text: 'Company', options: { fill: { color: C.bgLight }, color: C.textMuted, bold: true, fontSize: 11 } },
    { text: 'Focus', options: { fill: { color: C.bgLight }, color: C.textMuted, bold: true, fontSize: 11 } },
    { text: 'Why they lose', options: { fill: { color: C.bgLight }, color: C.textMuted, bold: true, fontSize: 11 } },
  ],
  [
    { text: 'Linus Health', options: { fill: { color: C.bgCard }, color: C.textBright, bold: true, fontSize: 12 } },
    { text: 'Digital cognitive assessment', options: { fill: { color: C.bgCard }, color: C.text, fontSize: 12 } },
    { text: 'Pass/fail delivery; not dementia-safe UX', options: { fill: { color: C.bgCard }, color: C.red, fontSize: 12 } },
  ],
  [
    { text: 'Cogstate', options: { fill: { color: C.bg }, color: C.textBright, bold: true, fontSize: 12 } },
    { text: 'Computerized cognitive testing', options: { fill: { color: C.bg }, color: C.text, fontSize: 12 } },
    { text: 'Trial-only; no caregiver platform or biomarkers', options: { fill: { color: C.bg }, color: C.red, fontSize: 12 } },
  ],
  [
    { text: 'Neurotrack', options: { fill: { color: C.bgCard }, color: C.textBright, bold: true, fontSize: 12 } },
    { text: 'Eye-tracking cognitive assessment', options: { fill: { color: C.bgCard }, color: C.text, fontSize: 12 } },
    { text: 'Narrow modality (eye-tracking only)', options: { fill: { color: C.bgCard }, color: C.red, fontSize: 12 } },
  ],
  [
    { text: 'Akili / EndeavorRx', options: { fill: { color: C.bg }, color: C.textBright, bold: true, fontSize: 12 } },
    { text: 'Pediatric ADHD DTx', options: { fill: { color: C.bg }, color: C.text, fontSize: 12 } },
    { text: 'Different indication; collapsed post-IPO', options: { fill: { color: C.bg }, color: C.red, fontSize: 12 } },
  ],
];

s.addTable(compRows, {
  x: 0.6, y: 2.4, w: 12, colW: [3.0, 4.5, 4.5],
  rowH: 0.5,
  border: { type: 'solid', pt: 0.5, color: C.border }, fontFace: 'Calibri',
});

s.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 5.4, w: 12, h: 1.5,
  fill: { color: C.bgCard },
  line: { color: C.green, width: 2 },
});
s.addText('OUR MOAT', {
  x: 0.9, y: 5.5, w: 12, h: 0.4,
  fontSize: 12, bold: true, color: C.green, fontFace: 'Arial', charSpacing: 4,
});
s.addText('23-patent IP portfolio architecturally blocks competitors from dementia-safe assessment. Production platform 18-24 months ahead of ground-zero competitor builds. FDA SaMD documentation unusually mature for stage.', {
  x: 0.9, y: 5.9, w: 11.5, h: 1.0,
  fontSize: 13, color: C.textBright, fontFace: 'Calibri', valign: 'top',
});

addFooter(s);
addSlideNumber(s, 11);

// ============================================================
// SLIDE 12: TRACTION
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'TRACTION', C.blue);
addTitle(s, 'Pre-seed signals.');

const tractions = [
  { icon: '⚖️', count: '23', label: 'USPTO provisional patents', sub: 'Full IP portfolio filed or in flight' },
  { icon: '💾', count: '53K+', label: 'Lines of production code', sub: '5 deployed applications' },
  { icon: '🌍', count: '10', label: 'Languages supported', sub: 'RTL-aware, ready for international' },
  { icon: '📋', count: '12', label: 'FDA SaMD documents', sub: 'IEC 62304, ISO 14971, QMS, Part 11, STRIDE' },
  { icon: '🏥', count: '3-5', label: 'Target memory centers', sub: 'UCSF, MGH, Emory partnership prep' },
  { icon: '💰', count: '4', label: 'Non-dilutive grants drafted', sub: 'NIA SBIR, R21, BrightFocus, Alz Assoc' },
];

tractions.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.6 + col * 4.23;
  const y = 2.4 + row * 2.3;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 4.1, h: 2.1,
    fill: { color: C.bgLight },
    line: { color: C.border, width: 1 },
  });
  s.addText(t.icon, { x: x + 0.15, y: y + 0.2, w: 0.9, h: 0.9, fontSize: 36, valign: 'middle' });
  s.addText(t.count, {
    x: x + 1.1, y: y + 0.2, w: 2.8, h: 0.6,
    fontSize: 28, bold: true, color: C.blue, fontFace: 'Arial Black',
  });
  s.addText(t.label, {
    x: x + 1.1, y: y + 0.85, w: 2.8, h: 0.4,
    fontSize: 12, bold: true, color: C.textBright, fontFace: 'Calibri',
  });
  s.addText(t.sub, {
    x: x + 0.2, y: y + 1.3, w: 3.7, h: 0.7,
    fontSize: 10, color: C.textMuted, fontFace: 'Calibri',
  });
});

addFooter(s);
addSlideNumber(s, 12);

// ============================================================
// SLIDE 13: TEAM
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'TEAM', C.purple);
addTitle(s, 'Experienced founding team.');

const team = [
  { name: 'Christo Mac', role: 'Founder & CEO/COO', initials: 'CM', color: C.blue },
  { name: 'Leo Kinsman', role: 'CTO', initials: 'LK', color: C.green },
  { name: 'Chris Hamel', role: 'CFO', initials: 'CH', color: C.amber },
  { name: 'Jayla Patzer', role: 'Nat. Dir., Clinic & Provider Partnerships', initials: 'JP', color: C.purple },
];

team.forEach((m, i) => {
  const x = 0.6 + i * 3.17;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y: 2.3, w: 3.0, h: 2.4,
    fill: { color: C.bgLight },
    line: { color: C.border, width: 1 },
  });
  s.addShape(pres.shapes.OVAL, {
    x: x + 1.0, y: 2.5, w: 1.0, h: 1.0,
    fill: { color: m.color },
    line: { color: m.color, width: 0 },
  });
  s.addText(m.initials, {
    x: x + 1.0, y: 2.5, w: 1.0, h: 1.0,
    fontSize: 24, bold: true, color: C.white, align: 'center', valign: 'middle', fontFace: 'Arial Black',
  });
  s.addText(m.name, {
    x: x + 0.1, y: 3.6, w: 2.8, h: 0.4,
    fontSize: 15, bold: true, color: C.textBright, align: 'center', fontFace: 'Arial',
  });
  s.addText(m.role, {
    x: x + 0.1, y: 4.0, w: 2.8, h: 0.6,
    fontSize: 11, color: m.color, align: 'center', fontFace: 'Calibri',
  });
});

s.addText('ADVISORY BOARD — RECRUITING', {
  x: 0.6, y: 5.0, w: 12, h: 0.4,
  fontSize: 12, bold: true, color: C.textMuted, charSpacing: 4, fontFace: 'Arial',
});
s.addText([
  { text: 'Clinical: ', options: { bold: true, color: C.green } },
  { text: 'Bruce Miller (UCSF), Reisa Sperling (Harvard), Ronald Petersen (Mayo), Constantine Lyketsos (JHU) · ', options: { color: C.text } },
  { text: 'Tech/AI: ', options: { bold: true, color: C.blue } },
  { text: 'Eric Topol (Scripps), Glen Tullman (Livongo), Atul Butte (UCSF) · ', options: { color: C.text } },
  { text: 'Regulatory: ', options: { bold: true, color: C.amber } },
  { text: 'Former FDA CDRH reviewer (SaMD expert)', options: { color: C.text } },
], { x: 0.6, y: 5.5, w: 12.0, h: 1.5, fontSize: 12, fontFace: 'Calibri' });

addFooter(s);
addSlideNumber(s, 13);

// ============================================================
// SLIDE 14: THE ASK
// ============================================================
s = pres.addSlide();
setDarkBg(s);

s.addShape(pres.shapes.OVAL, {
  x: -3, y: -3, w: 10, h: 10,
  fill: { color: C.blue, transparency: 88 },
  line: { color: C.blue, width: 0, transparency: 100 },
});
s.addShape(pres.shapes.OVAL, {
  x: 7, y: 3, w: 10, h: 10,
  fill: { color: C.green, transparency: 92 },
  line: { color: C.green, width: 0, transparency: 100 },
});

addKicker(s, 'THE ASK', C.green);

s.addText('We\'re raising', {
  x: 0.6, y: 1.9, w: 12, h: 0.5,
  fontSize: 22, color: C.textMuted, align: 'center', fontFace: 'Calibri',
});

s.addText('$5M', {
  x: 0.6, y: 2.4, w: 12, h: 2.5,
  fontSize: 200, bold: true, color: C.textBright, align: 'center', fontFace: 'Arial Black', charSpacing: -6,
});

s.addText('Seed Round', {
  x: 0.6, y: 4.8, w: 12, h: 0.6,
  fontSize: 32, color: C.green, bold: true, align: 'center', fontFace: 'Arial',
});

s.addText('$25M post-money  ·  20% dilution  ·  12-month runway to Series A', {
  x: 0.6, y: 5.5, w: 12, h: 0.5,
  fontSize: 16, color: C.text, align: 'center', fontFace: 'Calibri',
});

s.addText('Funds FDA 510(k), 3 facility pilots, engineering build-out, non-provisional patent conversions.', {
  x: 0.6, y: 6.1, w: 12, h: 0.5,
  fontSize: 14, color: C.textMuted, align: 'center', fontFace: 'Calibri', italic: true,
});

addSlideNumber(s, 14);

// ============================================================
// SLIDE 15: USE OF FUNDS
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'USE OF FUNDS', C.amber);
addTitle(s, 'Every dollar allocated.');

const useFunds = [
  { cat: 'FDA 510(k) preparation + clinical validation', amount: '$1.27M', pct: '25%', color: C.red },
  { cat: 'Engineering team (6 FTE × 12 months)', amount: '$1.42M', pct: '28%', color: C.blue },
  { cat: 'Pilot deployments (3 facilities)', amount: '$600K', pct: '12%', color: C.green },
  { cat: 'IP portfolio (non-provisional conversions)', amount: '$600K', pct: '12%', color: C.purple },
  { cat: 'Sales & partnerships', amount: '$450K', pct: '9%', color: C.amber },
  { cat: 'Operations + reserve', amount: '$410K', pct: '8%', color: C.textMuted },
  { cat: 'Clinical validation supplies + travel', amount: '$250K', pct: '5%', color: C.textMuted },
];

useFunds.forEach((f, i) => {
  const y = 2.4 + i * 0.55;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y, w: 12.1, h: 0.48,
    fill: { color: i % 2 === 0 ? C.bgLight : C.bg },
    line: { color: C.border, width: 0.5 },
  });
  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y, w: 0.12, h: 0.48,
    fill: { color: f.color }, line: { color: f.color, width: 0 },
  });
  s.addText(f.cat, {
    x: 0.95, y, w: 8.5, h: 0.48,
    fontSize: 14, color: C.text, valign: 'middle', fontFace: 'Calibri',
  });
  s.addText(f.amount, {
    x: 9.4, y, w: 2.2, h: 0.48,
    fontSize: 16, bold: true, color: C.green, align: 'right', valign: 'middle', fontFace: 'Arial',
  });
  s.addText(f.pct, {
    x: 11.7, y, w: 1.0, h: 0.48,
    fontSize: 12, color: C.textMuted, align: 'right', valign: 'middle', fontFace: 'Calibri',
  });
});

addFooter(s);
addSlideNumber(s, 15);

// ============================================================
// SLIDE 16: MILESTONES + CONTACT
// ============================================================
s = pres.addSlide();
setDarkBg(s);
addKicker(s, 'MILESTONES · CONTACT', C.blue);
addTitle(s, "Let's build this together.");

// Left: milestones
s.addText('MILESTONES (POST-CLOSE)', {
  x: 0.6, y: 2.4, w: 7, h: 0.4,
  fontSize: 12, bold: true, color: C.textMuted, charSpacing: 4, fontFace: 'Arial',
});

const milestones = [
  ['M3', 'Seed close; FDA Pre-Sub meeting'],
  ['M6', 'Pilot deployments live; SBIR Phase I submitted'],
  ['M9', 'Clinical validation data released'],
  ['M12', '510(k) submission; Series A prep'],
  ['M18', '510(k) clearance; Medicare reimbursement application'],
  ['M24', 'Commercial launch; Series A close'],
];

milestones.forEach((m, i) => {
  const y = 2.9 + i * 0.55;
  s.addText(m[0], {
    x: 0.6, y, w: 0.8, h: 0.4,
    fontSize: 14, bold: true, color: C.blue, fontFace: 'Arial Black', valign: 'middle',
  });
  s.addText(m[1], {
    x: 1.5, y, w: 6, h: 0.4,
    fontSize: 13, color: C.text, fontFace: 'Calibri', valign: 'middle',
  });
  // Divider
  s.addShape(pres.shapes.LINE, {
    x: 0.6, y: y + 0.45, w: 7, h: 0,
    line: { color: C.border, width: 0.5 },
  });
});

// Right: contact card
s.addShape(pres.shapes.RECTANGLE, {
  x: 8.3, y: 2.4, w: 4.5, h: 4.5,
  fill: { color: C.bgCard },
  line: { color: C.blue, width: 2 },
});

s.addText('CONTACT', {
  x: 8.5, y: 2.6, w: 4.3, h: 0.4,
  fontSize: 12, bold: true, color: C.textMuted, charSpacing: 4, fontFace: 'Arial',
});

s.addText('Christo Mac', {
  x: 8.5, y: 3.1, w: 4.3, h: 0.5,
  fontSize: 22, bold: true, color: C.textBright, fontFace: 'Arial',
});
s.addText('Founder & CEO/COO', {
  x: 8.5, y: 3.65, w: 4.3, h: 0.4,
  fontSize: 12, color: C.blue, fontFace: 'Calibri',
});

s.addText([
  { text: 'mack@matrixadvancedsolutions.com', options: { color: C.blue, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'https://www.linkedin.com/in/christomac', options: { color: C.textMuted, breakLine: true, paraSpaceAfter: 8 } },
  { text: 'Pitch site:', options: { color: C.textMuted, breakLine: true } },
  { text: 'gentle-reminder-pitch.vercel.app', options: { color: C.blue } },
], { x: 8.5, y: 4.3, w: 4.3, h: 2.0, fontSize: 11, fontFace: 'Calibri' });

s.addShape(pres.shapes.RECTANGLE, {
  x: 8.5, y: 6.4, w: 4.1, h: 0.4,
  fill: { color: C.green, transparency: 80 },
  line: { color: C.green, width: 1 },
});
s.addText('Full data room available under NDA', {
  x: 8.5, y: 6.4, w: 4.1, h: 0.4,
  fontSize: 11, bold: true, color: C.green, align: 'center', valign: 'middle', fontFace: 'Calibri',
});

addSlideNumber(s, 16);

// ============================================================
// WRITE FILE
// ============================================================
const outputPath = path.join(
  '/Users/christomac/Projects/Gentle Reminder',
  'apps/pitch-site/public/Gentle-Reminder-Pitch-Deck.pptx'
);

pres.writeFile({ fileName: outputPath }).then((fileName) => {
  console.log(`✓ Pitch deck generated: ${fileName}`);
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
