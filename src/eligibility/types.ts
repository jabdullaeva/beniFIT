export interface ProgramSource {
  title?: string;
  url: string;
  retrievedOn: string;
}

export interface ProgramDeadline {
  title: string;
  description: string;
}

export interface ProgramAudience {
  ageMin: number | null;
  ageMax: number | null;
  requiresCoverage: string[];
  notCoveredBy: string[];
}

export interface ProgramEligibility {
  incomeRule: {
    type: string;
    byHouseholdSize: Record<string, number>;
    notes?: string;
    asOfYear: string;
  };
  assetRule: string | null;
  otherConditions: string[];
}

export interface Program {
  id: string;
  name: string;
  agency: string;
  summary_plain: string;
  audience: ProgramAudience;
  eligibility: ProgramEligibility;
  benefit: {
    description: string;
    estMonthlyValue: number | null;
  };
  howToApply: {
    url: string;
    phone: string;
    steps: string[];
  };
  deadlines: ProgramDeadline[];
  sources: ProgramSource[];
  lastVerified: string;
  verifiedBy: string;
}

export type AgeBand = 'under_18' | '18_49' | '50_64' | '65_plus';
export type CoverageType = 'medicare' | 'medicaid' | 'full_medicaid' | 'employer' | 'marketplace' | 'none' | 'not_sure';
export type IncomeBand = 'under_1700' | '1700_2500' | '2500_3400' | '3400_4500' | 'over_4500';

export interface UserProfile {
  forWhom: 'self' | 'other';
  ageBand: AgeBand | string;
  exactAge?: number;
  zip: string;
  county?: string;
  householdSize: number;
  incomeBand: IncomeBand | string;
  exactMonthlyIncome?: number;
  coverage: CoverageType | string;
  disabilityOrLTC?: boolean;
}

export interface MatchResult {
  programId: string;
  programName: string;
  agency: string;
  summaryPlain: string;
  confidence: 'likely' | 'possible';
  estMonthlyValue: number;
  reasons: string[];
  howToApply: {
    url: string;
    phone: string;
    steps: string[];
  };
  lastVerified: string;
  isStale?: boolean;
}

export interface EligibilityEvaluation {
  matches: MatchResult[];
  stalePrograms: string[];
  excludedPrograms: { programId: string; reasons: string[] }[];
}
