import { matchPrograms, isProgramStale } from '../src/eligibility/index.ts';
import { Program, UserProfile } from '../src/eligibility/types.ts';
import fs from 'fs';
import path from 'path';

export function runEligibilityTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  const programsPath = path.resolve(process.cwd(), 'data/programs.json');
  const programs: Program[] = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

  function assert(condition: boolean, msg: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${msg}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${msg}`);
      errors.push(msg);
    }
  }

  console.log('\n--- Running Eligibility Engine Tests ---');

  // Test 1: Low-income NY Senior
  {
    const profile: UserProfile = {
      forWhom: 'self',
      ageBand: '65_plus',
      exactAge: 72,
      zip: '11201',
      householdSize: 1,
      incomeBand: '1700_2500',
      exactMonthlyIncome: 1800,
      coverage: 'medicare',
      disabilityOrLTC: false,
    };
    const res = matchPrograms(profile, programs);
    const matchedIds = res.matches.map((m) => m.programId);

    assert(matchedIds.includes('ny-msp'), 'Senior $1,800/mo matches Medicare Savings Program (likely)');
    assert(matchedIds.includes('ny-extra-help'), 'Senior $1,800/mo matches Part D Extra Help');
    assert(matchedIds.includes('ny-snap'), 'Senior $1,800/mo matches NY SNAP');
    assert(matchedIds.includes('ny-epic'), 'Senior $1,800/mo matches NY EPIC');
    assert(!matchedIds.includes('ny-essential-plan'), 'Senior on Medicare is excluded from Essential Plan');

    const mspMatch = res.matches.find((m) => m.programId === 'ny-msp');
    assert(mspMatch?.confidence === 'likely', 'MSP confidence is "likely" when strictly under limit');
  }

  // Test 2: Borderline Income Band
  {
    const profile: UserProfile = {
      forWhom: 'self',
      ageBand: '65_plus',
      zip: '10001',
      householdSize: 1,
      incomeBand: '2500_3400', // MSP limit is 2564 for 1 person
      coverage: 'medicare',
    };
    const res = matchPrograms(profile, programs);
    const mspMatch = res.matches.find((m) => m.programId === 'ny-msp');
    assert(mspMatch !== undefined, 'Borderline income band is included');
    assert(mspMatch?.confidence === 'possible', 'Borderline income band gives confidence "possible"');
  }

  // Test 3: Non-Senior Low Income Adult
  {
    const profile: UserProfile = {
      forWhom: 'self',
      ageBand: '18_49',
      exactAge: 32,
      zip: '10451',
      householdSize: 1,
      incomeBand: '1700_2500',
      coverage: 'none',
      disabilityOrLTC: false,
    };
    const res = matchPrograms(profile, programs);
    const matchedIds = res.matches.map((m) => m.programId);

    assert(matchedIds.includes('ny-essential-plan'), 'Uninsured adult matches Essential Plan');
    assert(!matchedIds.includes('ny-msp'), 'Non-senior without Medicare excluded from MSP');
    assert(!matchedIds.includes('ny-epic'), 'Under 65 excluded from EPIC');
  }

  // Test 4: High Income Senior
  {
    const profile: UserProfile = {
      forWhom: 'self',
      ageBand: '65_plus',
      exactAge: 70,
      zip: '10021',
      householdSize: 1,
      incomeBand: 'over_4500',
      exactMonthlyIncome: 12000,
      coverage: 'medicare',
    };
    const res = matchPrograms(profile, programs);
    const matchedIds = res.matches.map((m) => m.programId);

    assert(!matchedIds.includes('ny-msp'), 'High income ($12k/mo) excluded from MSP');
    assert(!matchedIds.includes('ny-extra-help'), 'High income ($12k/mo) excluded from Extra Help');
    assert(!matchedIds.includes('ny-epic'), 'Income over $75k annual ($6,250/mo) excluded from EPIC');
  }

  // Test 5: Staleness Exclusion Rule
  {
    const staleProgram: Program = {
      ...programs[0],
      id: 'stale-test-prog',
      lastVerified: '2022-01-01', // over 400 days old
    };
    const testList = [staleProgram, ...programs];
    const profile: UserProfile = {
      forWhom: 'self',
      ageBand: '65_plus',
      zip: '11201',
      householdSize: 1,
      incomeBand: 'under_1700',
      coverage: 'medicare',
    };
    const res = matchPrograms(profile, testList, { today: new Date('2026-10-23') });
    assert(res.stalePrograms.includes('stale-test-prog'), 'Stale program is caught in stalePrograms list');
    assert(!res.matches.some((m) => m.programId === 'stale-test-prog'), 'Stale program is strictly excluded from active matches');
  }

  console.log(`Eligibility Tests Finished: ${passed} passed, ${failed} failed.`);
  return { passed, failed, errors };
}
