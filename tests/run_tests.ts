import { runEligibilityTests } from './eligibility.test.ts';
import { verifyOutputIntegrity } from '../src/llm/guardrails.ts';
import { matchSpecialty } from '../src/providers/npiClient.ts';
import { auditClaimsForBillingErrors } from '../src/claims/blueButtonChecker.ts';
import { isWithinQuietHours } from '../src/alerts/scheduler.ts';
import { processInboundSms } from '../src/conversation/engine.ts';

async function main() {
  console.log('=====================================================');
  console.log('   Haven NY - Comprehensive Phase Verification Test  ');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${name}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${name}`);
    }
  }

  // 1. Eligibility Tests
  const elResults = runEligibilityTests();
  passed += elResults.passed;
  failed += elResults.failed;

  console.log('\n--- Running Phase 3 Integrity Guardrail Tests ---');
  {
    const allowedContext = 'Medicare Savings Program pays $185 per month. Apply at https://health.ny.gov';
    const cleanOutput = 'You may qualify for $185 per month with NY MSP. Visit https://health.ny.gov';
    const hallucinatedDollar = 'You get $950 in cash assistance.';
    const hallucinatedUrl = 'Visit https://fake-benefit-scam.com';
    const absoluteClaim = 'You qualify for free money.';

    const check1 = verifyOutputIntegrity(cleanOutput, allowedContext);
    assert(check1.valid, 'Integrity check passes when dollars & URLs match context');

    const check2 = verifyOutputIntegrity(hallucinatedDollar, allowedContext);
    assert(!check2.valid && check2.violations.some((v) => v.includes('$950')), 'Catches unverified hallucinated dollar amounts');

    const check3 = verifyOutputIntegrity(hallucinatedUrl, allowedContext);
    assert(!check3.valid && check3.violations.some((v) => v.includes('fake-benefit-scam')), 'Catches unverified hallucinated URLs');

    const check4 = verifyOutputIntegrity(absoluteClaim, allowedContext);
    assert(!check4.valid && check4.violations.some((v) => v.includes('qualify')), 'Catches disallowed absolute qualification claims');
  }

  console.log('\n--- Running Phase 4 Alerts & Quiet Hours Tests ---');
  {
    const dayDate = new Date('2026-10-23T14:00:00-04:00'); // 2:00 PM EDT
    const nightDate = new Date('2026-10-23T04:00:00-04:00'); // 4:00 AM EDT

    assert(!isWithinQuietHours(dayDate), '2:00 PM local time is not quiet hours');
    assert(isWithinQuietHours(nightDate), '4:00 AM local time is recognized as quiet hours');
  }

  console.log('\n--- Running Phase 5 Provider Finder Taxonomy Tests ---');
  {
    const cardiMatch = matchSpecialty('find me a heart doctor near me');
    assert(cardiMatch.slug === 'cardiologist', 'Maps "heart doctor" alias to Cardiologist taxonomy');

    const eyeMatch = matchSpecialty('eye doctor for cataract exam');
    assert(eyeMatch.slug === 'ophthalmologist', 'Maps "eye doctor" alias to Ophthalmology taxonomy');

    const pcpMatch = matchSpecialty('general checkup');
    assert(pcpMatch.slug === 'primary-care', 'Defaults general checkup to Primary Care taxonomy');
  }

  console.log('\n--- Running Phase 6 Blue Button Billing Rules Tests ---');
  {
    const flags = auditClaimsForBillingErrors('test-patient-user');
    assert(flags.length >= 2, 'Rule engine flags at least 2 billing discrepancies in synthetic claims');

    const preventiveFlag = flags.find((f) => f.ruleId === 'RULE_PREVENTIVE_ZERO_COST');
    assert(preventiveFlag !== undefined, 'Flags preventive Annual Wellness Visit incorrectly charged $250 out of pocket');
    assert(Boolean(preventiveFlag && preventiveFlag.callScript.includes('Annual Wellness Visit')), 'Call script includes actionable dispute script for patient');

    const exceedsFlag = flags.find((f) => f.ruleId === 'RULE_PATIENT_RESPONSIBILITY_EXCEEDS_EOB');
    assert(exceedsFlag !== undefined, 'Flags billed amount exceeding Medicare Explanation of Benefits');
  }

  console.log('\n--- Running Phase 2 SMS State Machine Tests ---');
  {
    const testPhone = '+17185559988';
    // 1. Initial text triggers consent greeting
    const r1 = await processInboundSms(testPhone, 'Hi');
    assert(r1.newState === 'WELCOME_AWAITING_CONSENT', 'Unknown user is put into WELCOME_AWAITING_CONSENT state');
    assert(r1.replyText.includes('YES'), 'Consent greeting mentions replying YES');

    // 2. User consents
    const r2 = await processInboundSms(testPhone, 'YES');
    assert(r2.newState === 'SCREENER_FOR_WHOM', 'Replying YES transitions to SCREENER_FOR_WHOM');

    // 3. User sends STOP
    const r3 = await processInboundSms(testPhone, 'STOP');
    assert(r3.newState === 'STOPPED', 'Replying STOP transitions to STOPPED');
    assert(r3.replyText.toLowerCase().includes('unsubscribed'), 'STOP reply confirms unsubscription');

    // 4. Blocked while stopped
    const r4 = await processInboundSms(testPhone, 'Hello?');
    assert(r4.newState === 'STOPPED', 'Blocked while stopped');

    // 5. START unblocks
    const r5 = await processInboundSms(testPhone, 'START');
    assert(r5.newState === 'SCREENER_FOR_WHOM', 'START re-opts in and resumes screener');
  }

  console.log('\n=====================================================');
  console.log(`Verification Complete: ${passed} Passed, ${failed} Failed.`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
