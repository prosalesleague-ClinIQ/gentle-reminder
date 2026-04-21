import React from 'react';
import Link from 'next/link';

interface Resource {
  title: string;
  description: string;
  path: string;
  status: 'drafted' | 'template' | 'ready' | 'in-progress';
  priority: 'critical' | 'high' | 'medium';
}

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  resources: Resource[];
}

const SECTIONS: Section[] = [
  {
    id: 'grants',
    title: '📄 Grant Application Materials',
    color: '#d29922',
    description: 'NIA SBIR Phase I — ready to customize and submit.',
    resources: [
      {
        title: 'SBIR Phase I — README / Submission Guide',
        description: 'Application components, deadlines, registrations needed',
        path: 'docs/grants/nia-sbir-phase-1/README.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Specific Aims (1-page)',
        description: 'Core SBIR Phase I Specific Aims — 3 aims targeting MMSE/MoCA validation',
        path: 'docs/grants/nia-sbir-phase-1/specific-aims.md',
        status: 'drafted',
        priority: 'critical',
      },
      {
        title: 'Project Summary / Abstract (30 lines)',
        description: 'Lay summary for grant reviewers',
        path: 'docs/grants/nia-sbir-phase-1/project-summary.md',
        status: 'drafted',
        priority: 'critical',
      },
      {
        title: 'Project Narrative (2-3 sentences)',
        description: 'Plain-language public description',
        path: 'docs/grants/nia-sbir-phase-1/project-narrative.md',
        status: 'drafted',
        priority: 'critical',
      },
      {
        title: 'Research Strategy (6 pages)',
        description: 'Significance, Innovation, Approach — full research plan',
        path: 'docs/grants/nia-sbir-phase-1/research-strategy.md',
        status: 'drafted',
        priority: 'critical',
      },
      {
        title: 'Commercialization Plan (12 pages)',
        description: 'Value prop, market, IP, business model, regulatory, partnerships',
        path: 'docs/grants/nia-sbir-phase-1/commercialization-plan.md',
        status: 'drafted',
        priority: 'critical',
      },
      {
        title: 'Budget Justification ($275K)',
        description: 'Personnel, consultants, subaward, supplies, travel — fully itemized',
        path: 'docs/grants/nia-sbir-phase-1/budget-justification.md',
        status: 'drafted',
        priority: 'critical',
      },
      {
        title: 'Biosketch Template (5 pages each)',
        description: 'NIH SF424 biosketch format; fill in personal details',
        path: 'docs/grants/nia-sbir-phase-1/biosketch-template.md',
        status: 'template',
        priority: 'high',
      },
      {
        title: 'Letters of Support Templates',
        description: '4 templates (academic collaborator, facility exec, FDA expert, advocacy)',
        path: 'docs/grants/nia-sbir-phase-1/letters-of-support-template.md',
        status: 'template',
        priority: 'high',
      },
    ],
  },
  {
    id: 'registrations',
    title: '📋 Registration Playbook',
    color: '#58a6ff',
    description: 'Every registration required to form the company and submit grants, in order.',
    resources: [
      {
        title: 'Master Registration Playbook',
        description: 'C-Corp, EIN, bank, SAM.gov UEI, eRA Commons, Grants.gov, SBC, USPTO — all with deep links',
        path: 'docs/registrations/README.md',
        status: 'ready',
        priority: 'critical',
      },
    ],
  },
  {
    id: 'ip-protection',
    title: '🔒 Poor-Man\'s IP Protection Pack',
    color: '#f85149',
    description: 'Low-cost DIY protections to layer on top of formal USPTO filings.',
    resources: [
      {
        title: 'IP Protection Overview',
        description: 'Stack of protections in order of speed × cost',
        path: 'docs/ip-protection/README.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Cryptographic Timestamping (OpenTimestamps)',
        description: 'Free Bitcoin-anchored proof of file existence at specific date — bash script ready to run',
        path: 'docs/ip-protection/01-cryptographic-timestamping.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Timestamp Portfolio Script',
        description: 'One-command bash script to stamp all 23 IP drafts + manifest',
        path: 'scripts/ip-protection/timestamp-ip-portfolio.sh',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Signed Git Commits (GPG)',
        description: 'Setup guide for tamper-evident authorship trail',
        path: 'docs/ip-protection/02-signed-git-commits.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'US Copyright Registration ($65/work)',
        description: 'eCO filing guide, deposit preparation, trade secret coordination',
        path: 'docs/ip-protection/03-copyright-registration.md',
        status: 'ready',
        priority: 'medium',
      },
      {
        title: 'USPTO Trademark Registration',
        description: 'TEAS filing guide for "Gentle Reminder" word mark in Class 9 + 44 ($500 total)',
        path: 'docs/ip-protection/04-trademark-registration.md',
        status: 'ready',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'patents',
    title: '⚖ USPTO Provisional Patent Drafts (23)',
    color: '#a371f7',
    description: 'Pre-drafted provisional patent applications in USPTO-compliant format.',
    resources: [
      {
        title: 'IP Portfolio Overview',
        description: '23 patent drafts in 3 tiers, filing strategy, budget',
        path: 'docs/ip/README.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'USPTO Template',
        description: 'USPTO 35 USC §111(b) compliant provisional patent template',
        path: 'docs/ip/TEMPLATE-provisional-patent.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Filing Checklist',
        description: 'Step-by-step USPTO EFS-Web filing walkthrough',
        path: 'docs/ip/FILING-CHECKLIST.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Prior Art Search (per IP)',
        description: 'Catalog of known prior art + differentiation per patent',
        path: 'docs/ip/PRIOR-ART-SEARCH.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Inventor Disclosure + Assignment Template',
        description: 'Inventor attribution per IP + Invention Assignment Agreement template',
        path: 'docs/ip/INVENTOR-DISCLOSURE.md',
        status: 'template',
        priority: 'critical',
      },
    ],
  },
  {
    id: 'monetization',
    title: '💰 Monetization Playbook',
    color: '#3fb950',
    description: 'Investor outreach, strategic partnerships, grant opportunities, IP valuation.',
    resources: [
      {
        title: 'Immediate Actions (30-day plan)',
        description: 'Day-by-day execution plan for next 30 days',
        path: 'docs/monetization/IMMEDIATE-ACTIONS.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Patent Filing Action Plan',
        description: '3-year patent filing strategy with budget',
        path: 'docs/monetization/PATENT-FILING-ACTION-PLAN.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Investor Outreach',
        description: 'Target VC list, cold email templates, data room contents',
        path: 'docs/monetization/INVESTOR-OUTREACH.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Strategic Partner Outreach',
        description: 'Pharma/MedTech/payer/care operator targeting, licensing terms',
        path: 'docs/monetization/STRATEGIC-PARTNER-OUTREACH.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Grant Opportunities',
        description: 'NIH/NIA/SBIR/foundation grants, academic PI list, specific aims templates',
        path: 'docs/monetization/GRANT-OPPORTUNITIES.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'IP Valuation',
        description: 'Portfolio valuation methodologies, per-IP values, exit scenarios',
        path: 'docs/monetization/IP-VALUATION.md',
        status: 'ready',
        priority: 'medium',
      },
      {
        title: 'Advisors & Capital-Raising Partners',
        description: 'Patent attorneys (equity/contingency) + capital raisers (FINRA-verified success-fee)',
        path: 'docs/monetization/ADVISORS-AND-PARTNERS.md',
        status: 'ready',
        priority: 'high',
      },
    ],
  },
  {
    id: 'legal-templates',
    title: '⚖️ Legal Templates (Phase 38)',
    color: '#a371f7',
    description:
      'Entity-formation-week prep + pre-entity-safe outreach guardrails. All templates require counsel review before execution.',
    resources: [
      {
        title: 'Pre-Entity Outreach Safety Guide',
        description: 'The one-sentence rule for this week: what is / is NOT safe to send or sign while the DE C-Corp is forming',
        path: 'docs/legal/pre-entity-outreach-safety.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Founder IP Assignment Agreement (FIAA-001)',
        description: 'Execute on entity-formation day. Exhibits A-D for 23 patents, TM, copyrights. Post-exec recordation checklist.',
        path: 'docs/legal/ip-assignment-agreement-template.md',
        status: 'template',
        priority: 'critical',
      },
      {
        title: 'Cap Table Starter (CT-001)',
        description: '10M shares, 4-founder split, 15% option pool, 83(b) mechanics, Carta/Pulley/spreadsheet tradeoffs',
        path: 'docs/legal/cap-table-starter.md',
        status: 'template',
        priority: 'critical',
      },
      {
        title: 'Trademark Filing Checklist',
        description: 'USPTO ITU for "GENTLE REMINDER", Classes 9 + 44, Path A (post-entity) vs Path B (founder-first), ~$500',
        path: 'docs/legal/trademark-filing-checklist.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Vendor Vetting Worksheets (VVW-001)',
        description: 'Patent attorney + placement agent + fractional CFO + grant specialist due-diligence worksheets',
        path: 'docs/legal/vendor-vetting-worksheets.md',
        status: 'template',
        priority: 'high',
      },
      {
        title: 'IP Disclosure Log (DL-001)',
        description: 'Per-disclosure audit trail: counterparty, cover agreement, materials, delivery, watermark, GHL stage',
        path: 'docs/legal/disclosure-log-template.md',
        status: 'template',
        priority: 'high',
      },
      {
        title: 'Subaward Agreement Template (SA-001)',
        description: 'Academic collaboration prime/subaward with IP split (platform-derived vs clinical findings), Bayh-Dole flow-down',
        path: 'docs/legal/subaward-agreement-template.md',
        status: 'template',
        priority: 'high',
      },
      {
        title: 'Data Use Agreement Template (DUA-001)',
        description: 'HIPAA 45 CFR 164.514(e) Limited Data Set transfer template',
        path: 'docs/legal/data-use-agreement-template.md',
        status: 'template',
        priority: 'high',
      },
      {
        title: 'Bayh-Dole Obligations Reference (BD-001)',
        description: '2-month/2-year/1-year deadlines, iEdison mechanics, federal-funding statement, march-in rights',
        path: 'docs/legal/bayh-dole-obligations.md',
        status: 'ready',
        priority: 'high',
      },
    ],
  },
  {
    id: 'clinical-validation',
    title: '🏥 Clinical Validation Package',
    color: '#3fb950',
    description: 'IRB-ready protocol + companion docs. Drafted and complete; awaiting academic PI + IRB submission.',
    resources: [
      {
        title: 'Study Protocol (CVP-001)',
        description: '190-line protocol: MMSE/MoCA validation, N=200, 6-month, ICC + Bland-Altman',
        path: 'docs/clinical-validation/study-protocol.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Informed Consent Template (ICF-001)',
        description: 'Site-customizable consent form with LAR assent section for MMSE < 18',
        path: 'docs/clinical-validation/informed-consent-template.md',
        status: 'template',
        priority: 'critical',
      },
      {
        title: 'Data Management Plan (DMP-001)',
        description: '21 CFR Part 11 compliant: double-coding, audit trail, 25-yr retention, HIPAA Safe Harbor',
        path: 'docs/clinical-validation/data-management-plan.md',
        status: 'ready',
        priority: 'critical',
      },
      {
        title: 'Safety Monitoring Plan (SMP-001)',
        description: 'AE/SAE/UADE definitions + reporting timelines, DSMB charter, stopping rules',
        path: 'docs/clinical-validation/safety-monitoring-plan.md',
        status: 'ready',
        priority: 'critical',
      },
    ],
  },
  {
    id: 'data-room',
    title: '📂 Data Room',
    color: '#58a6ff',
    description: '3-tier access structure (public / post-NDA / post-LOI). User sets up Docsend when ready.',
    resources: [
      {
        title: 'Data Room README',
        description: 'Tier 1 / 2 / 3 model, Docsend recommended, operating rhythm',
        path: 'docs/data-room/README.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Data Room Document Checklist',
        description: 'Every doc by tier — Tier 1 complete, Tier 2 gated on entity, Tier 3 gated on LOI',
        path: 'docs/data-room/checklist.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Data Room Access Policy',
        description: 'Grant rules, revocation, watermark policy, weekly review cadence, incident response',
        path: 'docs/data-room/access-policy.md',
        status: 'ready',
        priority: 'high',
      },
    ],
  },
  {
    id: 'crm-ghl',
    title: '🔁 GHL CRM Playbook',
    color: '#d29922',
    description: 'Documentation-only: pipeline, tags, automations, snippets. No API integration.',
    resources: [
      {
        title: 'GHL Setup README',
        description: 'Orientation, custom fields, operating rhythm, integration points',
        path: 'docs/crm-ghl/README.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Pipeline Configuration',
        description: '11-stage opportunity pipeline with entry/exit criteria, owners, SLAs',
        path: 'docs/crm-ghl/pipeline-config.md',
        status: 'ready',
        priority: 'high',
      },
      {
        title: 'Tag Taxonomy',
        description: 'Controlled vocabulary, max 5 tags per contact, mutually-exclusive groups',
        path: 'docs/crm-ghl/tags-taxonomy.md',
        status: 'ready',
        priority: 'medium',
      },
      {
        title: 'Automation Recipes',
        description: '9 workflows: Day-7 follow-up, meeting → materials, NDA chase, diligence → data room, etc.',
        path: 'docs/crm-ghl/automations.md',
        status: 'ready',
        priority: 'medium',
      },
      {
        title: 'Email Snippets',
        description: 'Ready-to-paste templates for GHL snippet library, mapped to response-templates.ts',
        path: 'docs/crm-ghl/snippets.md',
        status: 'ready',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'outreach-worksheets',
    title: '🧭 Outreach Prep Worksheets',
    color: '#f85149',
    description: 'Fill in once per counterparty before the critical interaction.',
    resources: [
      {
        title: 'VC Meeting Prep Worksheet (VCP-001)',
        description: 'Fund / partner / thesis / competing-offers / specific ask — satisfies fund-research + partner-research items',
        path: 'docs/outreach/vc-meeting-prep-worksheet.md',
        status: 'template',
        priority: 'high',
      },
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  drafted: '#3fb950',
  template: '#d29922',
  ready: '#58a6ff',
  'in-progress': '#a371f7',
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: '🔥 Critical',
  high: '⚠ High',
  medium: '○ Medium',
};

export default function MaterialsPage() {
  const githubBase = 'https://github.com/prosalesleague-ClinIQ/gentle-reminder/blob/main/';

  const totalResources = SECTIONS.reduce((sum, s) => sum + s.resources.length, 0);
  const criticalCount = SECTIONS.flatMap((s) => s.resources).filter((r) => r.priority === 'critical').length;

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#f0f6fc', marginBottom: 8 }}>Materials Library</h1>
        <p style={{ fontSize: 15, color: '#c9d1d9', marginBottom: 24 }}>
          All generated content in one place. Click any link to view on GitHub.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total Materials', value: totalResources, color: '#f0f6fc' },
            { label: 'Critical Priority', value: criticalCount, color: '#f85149' },
            { label: 'Sections', value: SECTIONS.length, color: '#58a6ff' },
            { label: 'Ready to Use', value: SECTIONS.flatMap((s) => s.resources).filter((r) => r.status === 'ready').length, color: '#3fb950' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 14 }}
            >
              <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: 20,
            background: 'linear-gradient(135deg, rgba(248, 81, 73, 0.08), rgba(210, 153, 34, 0.06))',
            border: '1px solid rgba(248, 81, 73, 0.3)',
            borderRadius: 10,
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 11, color: '#f85149', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 10 }}>
            🔥 DO FIRST (Highest-Leverage, Lowest-Cost)
          </div>
          <ol style={{ marginLeft: 20, color: '#c9d1d9', fontSize: 14, lineHeight: 1.9 }}>
            <li>
              <strong>Run the IP timestamp script</strong> (free, 10 min):{' '}
              <code style={{ color: '#58a6ff', fontSize: 12 }}>
                bash scripts/ip-protection/timestamp-ip-portfolio.sh
              </code>
            </li>
            <li>
              <strong>Start SAM.gov UEI registration</strong> (free, 30 min) — 3-5 weeks is the long pole
            </li>
            <li>
              <strong>Form Delaware C-Corp via Stripe Atlas</strong> ($500, 2 hours)
            </li>
            <li>
              <strong>Send 3 parallel patent attorney inquiries</strong> (free, 30 min) — use equity-model template
            </li>
            <li>
              <strong>Send 3 parallel grant specialist inquiries</strong> (free, 30 min) — contingency fee firms
            </li>
            <li>
              <strong>USPTO TESS trademark search</strong> for "Gentle Reminder" (free, 20 min)
            </li>
          </ol>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.id} style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: section.color, marginBottom: 4 }}>
                {section.title}
              </h2>
              <p style={{ fontSize: 13, color: '#8b949e' }}>{section.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.resources.map((r) => (
                <a
                  key={r.path}
                  href={`${githubBase}${r.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: 16,
                    background: '#0d1117',
                    border: `1px solid ${r.priority === 'critical' ? 'rgba(248, 81, 73, 0.3)' : '#21262d'}`,
                    borderRadius: 8,
                    textDecoration: 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 16,
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                          marginBottom: 4,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#f0f6fc' }}>{r.title}</span>
                        <span
                          style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 3,
                            background: `${STATUS_COLORS[r.status]}20`,
                            color: STATUS_COLORS[r.status],
                            border: `1px solid ${STATUS_COLORS[r.status]}40`,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}
                        >
                          {r.status}
                        </span>
                        <span style={{ fontSize: 10, color: '#8b949e' }}>{PRIORITY_LABELS[r.priority]}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.5, marginBottom: 4 }}>
                        {r.description}
                      </p>
                      <code style={{ fontSize: 11, color: '#6e7681' }}>{r.path}</code>
                    </div>
                    <span style={{ fontSize: 14, color: '#58a6ff', flexShrink: 0 }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
