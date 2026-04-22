#!/usr/bin/env node
/**
 * Generate a flattened, signable PDF of the Delaware Certificate of Incorporation
 * from docs/legal/formation/certificate-of-incorporation.md.
 *
 * - Strips the "## Filing instructions", "## Compliance notes", "## References"
 *   trailing sections (those are internal notes, not part of the Cert).
 * - Fills the signature block with "/s/ Christopher McPherson" + today's date.
 *   (DE GCL § 103 + 6 Del. C. § 12A-107 — electronic signature valid.)
 * - Outputs to docs/legal/formation/certificate-of-incorporation.pdf
 *
 * Usage: node scripts/legal/generate-cert-pdf.js
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const REPO = path.join(__dirname, '..', '..');
const MD = path.join(REPO, 'docs', 'legal', 'formation', 'certificate-of-incorporation.md');
const OUT = path.join(REPO, 'docs', 'legal', 'formation', 'certificate-of-incorporation.pdf');

// ----- Minimal, accurate markdown → HTML converter for this specific doc ----
// The Cert is plain markdown with: # / ## / ### headings, **bold**, *italic*,
// > blockquote, paragraphs, and a horizontal rule (---). Tables and lists are
// not used in the body of the Cert (they appear only in the stripped trailing
// sections).

function mdToHtml(md) {
  // Escape HTML special chars first.
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Split into blocks separated by blank lines, process each.
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Horizontal rule
    if (/^---\s*$/.test(line)) {
      out.push('<hr/>');
      i++;
      continue;
    }
    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }
    // Blockquote block (one or more lines starting with `>`)
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote><p>${inline(buf.join(' ').trim())}</p></blockquote>`);
      continue;
    }
    // Blank line
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    // Paragraph — gather until blank line / heading / hr / blockquote
    const buf = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^---\s*$/.test(lines[i]) &&
      !/^>\s?/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    if (buf.length) out.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  function inline(s) {
    let t = esc(s);
    // Bold **...**
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic *...*  (avoid matching ** already replaced)
    t = t.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    // Inline code `...`
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    return t;
  }

  return out.join('\n');
}

// ----- Build the filing-ready HTML -------------------------------------------

function buildHtml() {
  let md = fs.readFileSync(MD, 'utf8');

  // Trim trailing internal-only sections (keep through the signature block).
  // The Cert body ends right after the signature block, which ends before
  // the first `## Filing instructions` heading.
  const cutIdx = md.indexOf('## Filing instructions');
  if (cutIdx > 0) md = md.slice(0, cutIdx).trimEnd();

  // Fill signature block: replace the blank date + blank signature line.
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  md = md.replace(
    /\*\*Date:\*\*\s*_{5,}/,
    `**Date:** ${today}`
  );
  md = md.replace(
    /_{5,}\s*\n\*\*Christopher McPherson\*\*\s*\nIncorporator/,
    `/s/ Christopher McPherson\n**Christopher McPherson**\nIncorporator`
  );

  const body = mdToHtml(md);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Certificate of Incorporation — Gentle Reminder Health Corp</title>
<style>
  @page { size: Letter; margin: 1in; }
  html, body { background: #fff; color: #000; }
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 11.5pt;
    line-height: 1.55;
    max-width: 6.5in;
    margin: 0 auto;
    padding: 0;
  }
  h1 {
    font-size: 16pt;
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    margin: 0 0 0.4in;
    letter-spacing: 0.02em;
  }
  h2 {
    font-size: 12pt;
    margin: 0.35in 0 0.1in;
    text-transform: uppercase;
    font-weight: bold;
    border-bottom: 1px solid #000;
    padding-bottom: 2pt;
  }
  h3 {
    font-size: 11.5pt;
    margin: 0.2in 0 0.05in;
    font-weight: bold;
  }
  p { margin: 0 0 0.12in; text-align: justify; }
  strong { font-weight: bold; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #000; margin: 0.3in 0; }
  blockquote {
    margin: 0.1in 0 0.1in 0.3in;
    padding-left: 0.2in;
    border-left: 2px solid #444;
    color: #222;
  }
  blockquote p { font-size: 10.5pt; font-style: italic; }
  code {
    font-family: "Courier New", monospace;
    font-size: 10.5pt;
  }
  /* De-emphasize the "Document ID" meta block at the top */
  body > p:first-of-type { font-size: 10pt; color: #444; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

(async () => {
  const html = buildHtml();

  // Write a temp HTML file so Puppeteer can load it as file://.
  const tmpHtml = path.join(REPO, 'docs', 'legal', 'formation', '.cert-tmp.html');
  fs.writeFileSync(tmpHtml, html);

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.goto('file://' + tmpHtml, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    await page.pdf({
      path: OUT,
      format: 'Letter',
      printBackground: true,
      margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
    });
    console.log('wrote ' + OUT);
  } finally {
    await browser.close();
    try {
      fs.unlinkSync(tmpHtml);
    } catch {}
  }
})().catch((e) => {
  console.error('Cert PDF generation failed:', e);
  process.exit(1);
});
