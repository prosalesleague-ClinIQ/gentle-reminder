export interface InteractionWarning {
  medications: string[];
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

interface InteractionRule {
  drugA: string[];
  drugB: string[];
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

const KNOWN_INTERACTIONS: InteractionRule[] = [
  {
    drugA: ['donepezil', 'aricept'],
    drugB: ['ibuprofen', 'naproxen', 'aspirin', 'celecoxib', 'diclofenac', 'meloxicam'],
    severity: 'severe',
    description:
      'Donepezil combined with NSAIDs significantly increases the risk of gastrointestinal bleeding. Monitor for signs of GI distress, dark stools, or abdominal pain.',
  },
  {
    drugA: ['memantine', 'namenda'],
    drugB: ['amantadine', 'symmetrel'],
    severity: 'moderate',
    description:
      'Memantine and amantadine are both NMDA receptor antagonists. Concurrent use increases the risk of CNS side effects including confusion, dizziness, and hallucinations.',
  },
  {
    drugA: ['donepezil', 'aricept'],
    drugB: [
      'diphenhydramine',
      'benadryl',
      'oxybutynin',
      'ditropan',
      'tolterodine',
      'detrol',
      'atropine',
      'benztropine',
      'trihexyphenidyl',
    ],
    severity: 'severe',
    description:
      'Anticholinergic medications directly counteract the mechanism of donepezil (a cholinesterase inhibitor), reducing its therapeutic effectiveness for dementia symptoms.',
  },
  {
    drugA: ['rivastigmine', 'exelon'],
    drugB: ['metoprolol', 'atenolol', 'propranolol', 'carvedilol', 'bisoprolol'],
    severity: 'moderate',
    description:
      'Rivastigmine combined with beta-blockers increases the risk of bradycardia (dangerously slow heart rate). Heart rate should be monitored regularly.',
  },
  {
    drugA: ['galantamine', 'razadyne'],
    drugB: ['quinidine', 'quinaglute'],
    severity: 'moderate',
    description:
      'Quinidine inhibits CYP2D6 metabolism of galantamine, leading to increased galantamine plasma levels and heightened risk of cholinergic side effects such as nausea, vomiting, and diarrhea.',
  },
  {
    drugA: ['donepezil', 'aricept', 'rivastigmine', 'exelon', 'galantamine', 'razadyne'],
    drugB: ['succinylcholine', 'anectine'],
    severity: 'severe',
    description:
      'Cholinesterase inhibitors can prolong the neuromuscular blockade of succinylcholine during anesthesia. Anesthesiologists must be informed of cholinesterase inhibitor use.',
  },
  {
    drugA: ['memantine', 'namenda'],
    drugB: ['dextromethorphan'],
    severity: 'mild',
    description:
      'Both memantine and dextromethorphan act on NMDA receptors. Concurrent use may increase the risk of CNS side effects such as dizziness or drowsiness.',
  },
  {
    drugA: ['donepezil', 'aricept', 'rivastigmine', 'exelon', 'galantamine', 'razadyne'],
    drugB: ['fluoxetine', 'paroxetine', 'prozac', 'paxil'],
    severity: 'mild',
    description:
      'SSRIs (particularly fluoxetine and paroxetine) may inhibit CYP2D6/CYP3A4 metabolism of cholinesterase inhibitors, potentially increasing their plasma levels and side effects.',
  },
];

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function matchesDrug(medication: string, drugNames: string[]): boolean {
  const normalized = normalize(medication);
  return drugNames.some((drug) => normalized === drug || normalized.includes(drug));
}

export function checkInteractions(medications: string[]): InteractionWarning[] {
  const warnings: InteractionWarning[] = [];

  if (medications.length < 2) {
    return warnings;
  }

  for (const rule of KNOWN_INTERACTIONS) {
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const medA = medications[i];
        const medB = medications[j];

        const matchForward = matchesDrug(medA, rule.drugA) && matchesDrug(medB, rule.drugB);
        const matchReverse = matchesDrug(medA, rule.drugB) && matchesDrug(medB, rule.drugA);

        if (matchForward || matchReverse) {
          const alreadyReported = warnings.some(
            (w) =>
              w.description === rule.description &&
              w.medications.includes(medA) &&
              w.medications.includes(medB),
          );
          if (!alreadyReported) {
            warnings.push({
              medications: [medA, medB],
              severity: rule.severity,
              description: rule.description,
            });
          }
        }
      }
    }
  }

  return warnings;
}

export class MedicationInteractionChecker {
  check(medications: string[]): InteractionWarning[] {
    return checkInteractions(medications);
  }

  hasSevereInteractions(medications: string[]): boolean {
    return checkInteractions(medications).some((w) => w.severity === 'severe');
  }

  getSeverityCount(medications: string[]): Record<string, number> {
    const warnings = checkInteractions(medications);
    return {
      mild: warnings.filter((w) => w.severity === 'mild').length,
      moderate: warnings.filter((w) => w.severity === 'moderate').length,
      severe: warnings.filter((w) => w.severity === 'severe').length,
    };
  }
}
