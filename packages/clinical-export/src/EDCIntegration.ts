/**
 * Electronic Data Capture (EDC) integration.
 * Supports CDISC ODM-XML export and REDCap API client.
 */

import {
  DeidentifiedRecord,
  EDCExportConfig,
  EDCAdapter,
  TrialCohort,
} from './types';

// ── ODM-XML Export ──

/**
 * Export a cohort's data in CDISC ODM-XML format.
 * Generates a complete ODM document with ClinicalData containing subject data.
 */
export function exportToODM(
  records: DeidentifiedRecord[],
  config: EDCExportConfig
): string {
  const creationDateTime = config.creationDateTime || new Date().toISOString();

  const subjectDataXml = records
    .map((record) => buildSubjectData(record, config))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     ODMVersion="1.3.2"
     FileType="Snapshot"
     FileOID="${config.studyOID}-export-${Date.now()}"
     CreationDateTime="${creationDateTime}">
  <Study OID="${config.studyOID}">
    <GlobalVariables>
      <StudyName>${escapeXml(config.studyName)}</StudyName>
      <StudyDescription>${escapeXml(config.protocolName)}</StudyDescription>
      <ProtocolName>${escapeXml(config.protocolName)}</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.1" Name="Version 1">
      <Protocol>
        <StudyEventRef StudyEventOID="SE.VISIT" Mandatory="Yes" OrderNumber="1"/>
      </Protocol>
      <StudyEventDef OID="SE.VISIT" Name="Visit" Repeating="Yes" Type="Scheduled">
        <FormRef FormOID="F.COGNITIVE" Mandatory="Yes" OrderNumber="1"/>
        <FormRef FormOID="F.BIOMARKERS" Mandatory="No" OrderNumber="2"/>
      </StudyEventDef>
      <FormDef OID="F.COGNITIVE" Name="Cognitive Assessment" Repeating="No">
        <ItemGroupRef ItemGroupOID="IG.COGNITIVE" Mandatory="Yes" OrderNumber="1"/>
      </FormDef>
      <FormDef OID="F.BIOMARKERS" Name="Biomarkers" Repeating="No">
        <ItemGroupRef ItemGroupOID="IG.BIOMARKERS" Mandatory="No" OrderNumber="1"/>
      </FormDef>
      <ItemGroupDef OID="IG.COGNITIVE" Name="Cognitive Scores" Repeating="No">
        <ItemRef ItemOID="IT.SCORE" Mandatory="Yes" OrderNumber="1"/>
        <ItemRef ItemOID="IT.ORIENTATION" Mandatory="No" OrderNumber="2"/>
        <ItemRef ItemOID="IT.IDENTITY" Mandatory="No" OrderNumber="3"/>
        <ItemRef ItemOID="IT.MEMORY" Mandatory="No" OrderNumber="4"/>
        <ItemRef ItemOID="IT.RESPONSE_TIME" Mandatory="No" OrderNumber="5"/>
      </ItemGroupDef>
      <ItemGroupDef OID="IG.BIOMARKERS" Name="Biomarker Data" Repeating="Yes">
        <ItemRef ItemOID="IT.BM_TYPE" Mandatory="Yes" OrderNumber="1"/>
        <ItemRef ItemOID="IT.BM_VALUE" Mandatory="Yes" OrderNumber="2"/>
        <ItemRef ItemOID="IT.BM_UNIT" Mandatory="Yes" OrderNumber="3"/>
      </ItemGroupDef>
      <ItemDef OID="IT.SCORE" Name="Overall Score" DataType="float"/>
      <ItemDef OID="IT.ORIENTATION" Name="Orientation" DataType="float"/>
      <ItemDef OID="IT.IDENTITY" Name="Identity" DataType="float"/>
      <ItemDef OID="IT.MEMORY" Name="Memory" DataType="float"/>
      <ItemDef OID="IT.RESPONSE_TIME" Name="Response Time (ms)" DataType="integer"/>
      <ItemDef OID="IT.BM_TYPE" Name="Biomarker Type" DataType="text"/>
      <ItemDef OID="IT.BM_VALUE" Name="Biomarker Value" DataType="float"/>
      <ItemDef OID="IT.BM_UNIT" Name="Unit" DataType="text"/>
    </MetaDataVersion>
  </Study>
  <ClinicalData StudyOID="${config.studyOID}" MetaDataVersionOID="MDV.1">
${subjectDataXml}
  </ClinicalData>
</ODM>`;
}

function buildSubjectData(record: DeidentifiedRecord, config: EDCExportConfig): string {
  const siteRef = config.siteOID
    ? `\n        <SiteRef LocationOID="${config.siteOID}"/>`
    : '';

  const studyEvents = record.scores.map((score, index) => {
    const items = [
      `            <ItemData ItemOID="IT.SCORE" Value="${score.overallScore}"/>`,
    ];
    if (score.orientation !== undefined) {
      items.push(`            <ItemData ItemOID="IT.ORIENTATION" Value="${score.orientation}"/>`);
    }
    if (score.identity !== undefined) {
      items.push(`            <ItemData ItemOID="IT.IDENTITY" Value="${score.identity}"/>`);
    }
    if (score.memory !== undefined) {
      items.push(`            <ItemData ItemOID="IT.MEMORY" Value="${score.memory}"/>`);
    }
    if (score.responseTimeMs !== undefined) {
      items.push(`            <ItemData ItemOID="IT.RESPONSE_TIME" Value="${score.responseTimeMs}"/>`);
    }

    return `      <StudyEventData StudyEventOID="SE.VISIT" StudyEventRepeatKey="${index + 1}">
        <FormData FormOID="F.COGNITIVE">
          <ItemGroupData ItemGroupOID="IG.COGNITIVE">
${items.join('\n')}
          </ItemGroupData>
        </FormData>
      </StudyEventData>`;
  });

  // Add biomarker events
  if (record.biomarkers.length > 0) {
    const bmItems = record.biomarkers.map(
      (bm) => `            <ItemData ItemOID="IT.BM_TYPE" Value="${escapeXml(bm.type)}"/>
            <ItemData ItemOID="IT.BM_VALUE" Value="${bm.value}"/>
            <ItemData ItemOID="IT.BM_UNIT" Value="${escapeXml(bm.unit)}"/>`
    );

    studyEvents.push(`      <StudyEventData StudyEventOID="SE.VISIT" StudyEventRepeatKey="${record.scores.length + 1}">
        <FormData FormOID="F.BIOMARKERS">
          <ItemGroupData ItemGroupOID="IG.BIOMARKERS">
${bmItems.join('\n')}
          </ItemGroupData>
        </FormData>
      </StudyEventData>`);
  }

  return `    <SubjectData SubjectKey="${record.subjectId}">${siteRef}
${studyEvents.join('\n')}
    </SubjectData>`;
}

// ── REDCap Client ──

/**
 * REDCap API client for importing and exporting clinical records.
 */
export class REDCapClient implements EDCAdapter {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor(apiUrl: string, token: string) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  /**
   * Export records as a JSON string suitable for REDCap import.
   */
  async exportRecords(records: DeidentifiedRecord[]): Promise<string> {
    const redcapRecords = records.flatMap((record) =>
      record.scores.map((score, index) => ({
        record_id: record.subjectId,
        redcap_event_name: `visit_${index + 1}_arm_1`,
        age: record.age,
        gender: record.gender ?? '',
        cognitive_stage: record.cognitiveStage,
        cognitive_score: score.overallScore,
        orientation_score: score.orientation ?? '',
        identity_score: score.identity ?? '',
        memory_score: score.memory ?? '',
        response_time_ms: score.responseTimeMs ?? '',
        session_date: score.date,
      }))
    );
    return JSON.stringify(redcapRecords, null, 2);
  }

  /**
   * Import records from REDCap JSON format into DeidentifiedRecord format.
   */
  async importRecords(data: string): Promise<DeidentifiedRecord[]> {
    const rawRecords = JSON.parse(data) as Array<Record<string, unknown>>;

    // Group by record_id
    const grouped = new Map<string, Array<Record<string, unknown>>>();
    for (const raw of rawRecords) {
      const id = String(raw.record_id);
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id)!.push(raw);
    }

    const results: DeidentifiedRecord[] = [];
    for (const [subjectId, entries] of grouped) {
      const first = entries[0];
      results.push({
        subjectId,
        age: Number(first.age) || 0,
        gender: first.gender ? String(first.gender) : undefined,
        cognitiveStage: String(first.cognitive_stage || ''),
        scores: entries.map((e) => ({
          date: String(e.session_date || ''),
          overallScore: Number(e.cognitive_score) || 0,
          orientation: e.orientation_score ? Number(e.orientation_score) : undefined,
          identity: e.identity_score ? Number(e.identity_score) : undefined,
          memory: e.memory_score ? Number(e.memory_score) : undefined,
          responseTimeMs: e.response_time_ms ? Number(e.response_time_ms) : undefined,
        })),
        biomarkers: [],
      });
    }

    return results;
  }

  /**
   * Fetch project metadata from REDCap API.
   * Returns field definitions for the project.
   */
  async getMetadata(): Promise<object[]> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: this.token,
        content: 'metadata',
        format: 'json',
        returnFormat: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`REDCap API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<object[]>;
  }
}

// ── ODM Adapter (wraps exportToODM as an EDCAdapter) ──

/**
 * EDCAdapter implementation for CDISC ODM-XML export.
 */
export class ODMAdapter implements EDCAdapter {
  private readonly config: EDCExportConfig;

  constructor(config: EDCExportConfig) {
    this.config = config;
  }

  exportRecords(records: DeidentifiedRecord[]): string {
    return exportToODM(records, this.config);
  }

  importRecords(_data: string): DeidentifiedRecord[] {
    throw new Error('ODM import is not supported. Use a dedicated ODM parser.');
  }
}

// ── Utility ──

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
