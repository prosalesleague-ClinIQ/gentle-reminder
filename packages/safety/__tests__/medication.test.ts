import { checkInteractions, MedicationInteractionChecker } from '../src/MedicationInteractionChecker';
import type { InteractionWarning } from '../src/MedicationInteractionChecker';

describe('checkInteractions', () => {
  it('returns empty array for a single medication', () => {
    const result = checkInteractions(['Donepezil']);
    expect(result).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    const result = checkInteractions([]);
    expect(result).toEqual([]);
  });

  it('detects donepezil + NSAID GI bleeding risk', () => {
    const result = checkInteractions(['Donepezil', 'Ibuprofen']);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('severe');
    expect(result[0].medications).toContain('Donepezil');
    expect(result[0].medications).toContain('Ibuprofen');
    expect(result[0].description).toContain('gastrointestinal bleeding');
  });

  it('detects memantine + amantadine NMDA antagonist interaction', () => {
    const result = checkInteractions(['Memantine', 'Amantadine']);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('moderate');
    expect(result[0].description).toContain('NMDA receptor antagonists');
  });

  it('detects donepezil + anticholinergic reduced effectiveness', () => {
    const result = checkInteractions(['Donepezil', 'Oxybutynin']);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('severe');
    expect(result[0].description).toContain('Anticholinergic');
  });

  it('detects rivastigmine + beta-blocker bradycardia risk', () => {
    const result = checkInteractions(['Rivastigmine', 'Metoprolol']);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('moderate');
    expect(result[0].description).toContain('bradycardia');
  });

  it('detects galantamine + quinidine increased levels', () => {
    const result = checkInteractions(['Galantamine', 'Quinidine']);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('moderate');
    expect(result[0].description).toContain('CYP2D6');
  });

  it('works with brand names (case-insensitive)', () => {
    const result = checkInteractions(['aricept', 'naproxen']);
    expect(result).toHaveLength(1);
    expect(result[0].severity).toBe('severe');
  });

  it('detects multiple interactions across several medications', () => {
    const result = checkInteractions(['Donepezil', 'Ibuprofen', 'Oxybutynin']);
    expect(result.length).toBeGreaterThanOrEqual(2);
    const severities = result.map((w) => w.severity);
    expect(severities.filter((s) => s === 'severe')).toHaveLength(2);
  });

  it('returns no warnings for non-interacting medications', () => {
    const result = checkInteractions(['Donepezil', 'Memantine']);
    expect(result).toEqual([]);
  });

  it('handles medications in any order', () => {
    const forward = checkInteractions(['Donepezil', 'Ibuprofen']);
    const reverse = checkInteractions(['Ibuprofen', 'Donepezil']);
    expect(forward).toHaveLength(1);
    expect(reverse).toHaveLength(1);
    expect(forward[0].severity).toBe(reverse[0].severity);
  });
});

describe('MedicationInteractionChecker class', () => {
  const checker = new MedicationInteractionChecker();

  it('hasSevereInteractions returns true for severe pairs', () => {
    expect(checker.hasSevereInteractions(['Donepezil', 'Ibuprofen'])).toBe(true);
  });

  it('hasSevereInteractions returns false for moderate-only pairs', () => {
    expect(checker.hasSevereInteractions(['Memantine', 'Amantadine'])).toBe(false);
  });

  it('getSeverityCount returns correct breakdown', () => {
    const counts = checker.getSeverityCount(['Donepezil', 'Ibuprofen', 'Oxybutynin', 'Fluoxetine']);
    expect(counts.severe).toBeGreaterThanOrEqual(2);
    expect(counts.mild).toBeGreaterThanOrEqual(1);
  });
});
