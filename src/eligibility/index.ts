import {
  Program,
  UserProfile,
  MatchResult,
  EligibilityEvaluation,
  IncomeBand,
  AgeBand,
} from './types.ts';
import { lookupNyZip } from './zipUtils.ts';

const INCOME_BAND_RANGES: Record<string, { min: number; max: number; label: string }> = {
  under_1700: { min: 0, max: 1700, label: 'Under $1,700/mo' },
  '1700_2500': { min: 1700, max: 2500, label: '$1,700 - $2,500/mo' },
  '2500_3400': { min: 2500, max: 3400, label: '$2,500 - $3,400/mo' },
  '3400_4500': { min: 3400, max: 4500, label: '$3,400 - $4,500/mo' },
  over_4500: { min: 4500, max: 999999, label: 'Over $4,500/mo' },
};

export interface MatchOptions {
  today?: Date;
  staleThresholdDays?: number;
}

export function isProgramStale(program: Program, today = new Date(), thresholdDays = 400): boolean {
  if (!program.lastVerified) return true;
  const verifiedDate = new Date(program.lastVerified);
  if (isNaN(verifiedDate.getTime())) return true;
  const diffTime = today.getTime() - verifiedDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays > thresholdDays;
}

export function parseIncomeRange(profile: UserProfile): { min: number; max: number } {
  if (profile.exactMonthlyIncome !== undefined && profile.exactMonthlyIncome !== null) {
    return { min: profile.exactMonthlyIncome, max: profile.exactMonthlyIncome };
  }

  const band = profile.incomeBand?.toLowerCase().trim();
  if (band && INCOME_BAND_RANGES[band]) {
    return { min: INCOME_BAND_RANGES[band].min, max: INCOME_BAND_RANGES[band].max };
  }

  // Fallback parsing for human strings like "$2,000" or "under 2000"
  if (typeof band === 'string') {
    const numMatches = band.replace(/,/g, '').match(/\d+/g);
    if (numMatches && numMatches.length > 0) {
      const val = parseInt(numMatches[0], 10);
      if (val > 0) {
        return { min: Math.max(0, val - 300), max: val + 300 };
      }
    }
  }

  // Default unknown band
  return { min: 0, max: 3000 };
}

export function parseAgeRange(profile: UserProfile): { isSenior: boolean; isAdult: boolean; isUnder18: boolean } {
  if (profile.exactAge !== undefined && profile.exactAge !== null) {
    return {
      isSenior: profile.exactAge >= 65,
      isAdult: profile.exactAge >= 18 && profile.exactAge < 65,
      isUnder18: profile.exactAge < 18,
    };
  }

  const band = (profile.ageBand || '').toLowerCase();
  if (band.includes('65') || band.includes('senior')) {
    return { isSenior: true, isAdult: false, isUnder18: false };
  }
  if (band.includes('50_64') || band.includes('18_49') || band.includes('adult')) {
    return { isSenior: false, isAdult: true, isUnder18: false };
  }
  if (band.includes('under_18') || band.includes('child')) {
    return { isSenior: false, isAdult: false, isUnder18: true };
  }

  // Default assumption if not sure: adult
  return { isSenior: false, isAdult: true, isUnder18: false };
}

export function matchPrograms(
  profile: UserProfile,
  programs: Program[],
  options: MatchOptions = {}
): EligibilityEvaluation {
  const today = options.today || new Date();
  const thresholdDays = options.staleThresholdDays || 400;

  const matches: MatchResult[] = [];
  const stalePrograms: string[] = [];
  const excludedPrograms: { programId: string; reasons: string[] }[] = [];

  const incomeRange = parseIncomeRange(profile);
  const ageInfo = parseAgeRange(profile);
  const zipInfo = lookupNyZip(profile.zip);
  const hhSize = Math.max(1, Math.min(profile.householdSize || 1, 8));
  const hhKey = String(Math.min(hhSize, 4));

  const hasMedicare =
    profile.coverage === 'medicare' ||
    ageInfo.isSenior ||
    profile.disabilityOrLTC === true;

  for (const program of programs) {
    // 1. Check staleness rule: Refuse to include if lastVerified is older than threshold
    if (isProgramStale(program, today, thresholdDays)) {
      stalePrograms.push(program.id);
      excludedPrograms.push({
        programId: program.id,
        reasons: [`Excluded from results: data last verified on ${program.lastVerified} exceeds ${thresholdDays}-day freshness threshold`],
      });
      continue;
    }

    const reasons: string[] = [];
    let isExcluded = false;
    let confidence: 'likely' | 'possible' = 'likely';

    // 2. Audience / Age Check
    if (program.audience.ageMin !== null) {
      if (program.audience.ageMin >= 65 && !ageInfo.isSenior && !hasMedicare) {
        isExcluded = true;
        reasons.push(`Requires age 65 or older or Medicare coverage.`);
      }
    }
    if (program.audience.ageMax !== null) {
      if (program.audience.ageMax < 65 && ageInfo.isSenior) {
        isExcluded = true;
        reasons.push(`Program is designed for New Yorkers under age 65.`);
      }
    }

    // 3. Coverage requirements
    if (program.audience.requiresCoverage && program.audience.requiresCoverage.length > 0) {
      const reqMedicare = program.audience.requiresCoverage.includes('medicare');
      if (reqMedicare && !hasMedicare) {
        isExcluded = true;
        reasons.push(`Requires Medicare enrollment or eligibility.`);
      }
    }

    // 4. Coverage exclusions
    if (program.audience.notCoveredBy && program.audience.notCoveredBy.length > 0) {
      if (program.audience.notCoveredBy.includes('medicare') && hasMedicare) {
        isExcluded = true;
        reasons.push(`Individuals enrolled in Medicare are not eligible for this plan.`);
      }
      if (program.audience.notCoveredBy.includes('full_medicaid') && profile.coverage === 'full_medicaid') {
        isExcluded = true;
        reasons.push(`Cannot be receiving full Medicaid benefits with zero spenddown.`);
      }
    }

    // 5. Income Rule Check
    const incomeRule = program.eligibility?.incomeRule;
    if (incomeRule && incomeRule.byHouseholdSize) {
      const limit = incomeRule.byHouseholdSize[hhKey] || incomeRule.byHouseholdSize['4'];

      if (limit) {
        if (incomeRange.min > limit) {
          isExcluded = true;
          reasons.push(`Household income appears above the monthly limit of $${limit.toLocaleString()} for a household of ${hhSize}.`);
        } else if (incomeRange.max > limit && incomeRange.min <= limit) {
          // Borderline band: income range spans across the threshold
          confidence = 'possible';
          reasons.push(`Income is near the $${limit.toLocaleString()}/mo threshold for household of ${hhSize} (borderline eligible).`);
        } else {
          reasons.push(`Monthly income meets the guidelines (under $${limit.toLocaleString()}/mo for household of ${hhSize}).`);
        }
      }
    }

    if (isExcluded) {
      excludedPrograms.push({ programId: program.id, reasons });
      continue;
    }

    // Additional program-specific transparent reasons
    if (program.id === 'ny-msp') {
      reasons.push('New York State does not impose any asset or savings test for MSP.');
      if (hasMedicare) {
        reasons.push('Can pay your monthly Medicare Part B premium ($185.00/mo).');
      }
    } else if (program.id === 'ny-extra-help') {
      reasons.push('Qualifying for NY MSP automatically triggers Extra Help prescription relief.');
    } else if (program.id === 'ny-epic') {
      reasons.push('High NY income limit ($75,000 single / $100,000 married). Supplements Part D.');
    } else if (program.id === 'ny-snap') {
      reasons.push('Monthly grocery funds loaded directly to NY EBT card.');
    } else if (program.id === 'ny-essential-plan') {
      reasons.push('Expanded in New York to cover up to 250% FPL with $0 monthly premium.');
    } else if (program.id === 'ny-heap') {
      reasons.push('Provides direct heating/utility assistance during seasonal NY windows.');
    }

    matches.push({
      programId: program.id,
      programName: program.name,
      agency: program.agency,
      summaryPlain: program.summary_plain,
      confidence,
      estMonthlyValue: program.benefit.estMonthlyValue || 0,
      reasons,
      howToApply: program.howToApply,
      lastVerified: program.lastVerified,
    });
  }

  // Order by estimated monthly value descending
  matches.sort((a, b) => b.estMonthlyValue - a.estMonthlyValue);

  return {
    matches,
    stalePrograms,
    excludedPrograms,
  };
}
