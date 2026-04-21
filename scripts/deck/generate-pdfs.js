#!/usr/bin/env node
/**
 * Generate the two distribution PDFs from the pitch-site's private pages:
 *   - apps/pitch-site/public/Gentle-Reminder-Pitch-Deck.pdf
 *   - apps/pitch-site/public/Gentle-Reminder-Exec-Summary.pdf
 *
 * Requires the pitch-site dev server to be running on http://localhost:3003.
 * Start it with: npm --workspace=apps/pitch-site run dev
 */

const puppeteer = require('puppeteer');
const path = require('path');

const BASE = process.env.PITCH_SITE_URL || 'http://localhost:3003';
const OUT_DIR = path.join(__dirname, '..', '..', 'apps', 'pitch-site', 'public');

const JOBS = [
  {
    url: `${BASE}/private/deck`,
    out: path.join(OUT_DIR, 'Gentle-Reminder-Pitch-Deck.pdf'),
    format: 'Letter',
    landscape: true,
  },
  {
    url: `${BASE}/private/exec-summary`,
    out: path.join(OUT_DIR, 'Gentle-Reminder-Exec-Summary.pdf'),
    format: 'Letter',
    landscape: false,
  },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    for (const job of JOBS) {
      const page = await browser.newPage();
      console.log(`→ ${job.url}`);
      await page.goto(job.url, { waitUntil: 'networkidle0', timeout: 60_000 });
      await page.emulateMediaType('print');
      await page.pdf({
        path: job.out,
        format: job.format,
        landscape: job.landscape,
        printBackground: true,
        margin: { top: '0.25in', right: '0.25in', bottom: '0.25in', left: '0.25in' },
      });
      console.log(`  wrote ${job.out}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error('PDF generation failed:', e.message);
  process.exit(1);
});
