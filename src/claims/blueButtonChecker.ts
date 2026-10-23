import fs from 'fs';
import path from 'path';
import { BillFlag, db } from '../db/store.ts';

export interface SyntheticEOBClaim {
  id: string;
  patientId: string;
  providerName: string;
  providerPhone: string;
  serviceDate: string;
  procedureCode: string;
  procedureDescription: string;
  providerBilledAmount: number;
  medicareApprovedAmount: number;
  medicarePaidAmount: number;
  eobPatientResponsibility: number;
  providerInvoicedToPatient: number;
  status: 'active';
}

// 3 Synthetic CMS Blue Button 2.0 Sandbox EOB claims illustrating realistic scenarios
export const SYNTHETIC_BLUE_BUTTON_CLAIMS: SyntheticEOBClaim[] = [
  {
    id: 'EOB-BB2-001',
    patientId: 'patient-synthetic-ny',
    providerName: 'Metropolitan Community Health Center',
    providerPhone: '(718) 555-8390',
    serviceDate: '2026-10-12',
    procedureCode: 'G0438',
    procedureDescription: 'Annual Wellness Visit (Initial)',
    providerBilledAmount: 250.0,
    medicareApprovedAmount: 184.2,
    medicarePaidAmount: 184.2,
    eobPatientResponsibility: 0.0, // Should be $0 under Medicare Part B
    providerInvoicedToPatient: 250.0, // Doctor incorrectly invoiced patient
    status: 'active',
  },
  {
    id: 'EOB-BB2-002',
    patientId: 'patient-synthetic-ny',
    providerName: 'Kings County Specialty Associates',
    providerPhone: '(718) 555-4921',
    serviceDate: '2026-09-28',
    procedureCode: '99214',
    procedureDescription: 'Office/Outpatient Visit Moderate Complexity',
    providerBilledAmount: 380.0,
    medicareApprovedAmount: 135.0,
    medicarePaidAmount: 108.0,
    eobPatientResponsibility: 27.0, // 20% Medicare coinsurance
    providerInvoicedToPatient: 195.0, // Balance billed beyond allowed charge
    status: 'active',
  },
  {
    id: 'EOB-BB2-003',
    patientId: 'patient-synthetic-ny',
    providerName: 'Flatbush Diagnostic Imaging',
    providerPhone: '(718) 555-7712',
    serviceDate: '2026-10-05',
    procedureCode: '71046',
    procedureDescription: 'Radiologic Examination Chest 2 Views (Duplicate Entry)',
    providerBilledAmount: 175.0,
    medicareApprovedAmount: 48.0,
    medicarePaidAmount: 38.4,
    eobPatientResponsibility: 9.6,
    providerInvoicedToPatient: 48.0,
    status: 'active',
  },
];

export function auditClaimsForBillingErrors(userId: string, claims = SYNTHETIC_BLUE_BUTTON_CLAIMS): BillFlag[] {
  const flags: BillFlag[] = [];

  for (const claim of claims) {
    // Rule 1: Preventive service billed with patient cost share
    const preventiveCodes = ['G0438', 'G0439', 'G0402', '99387', '99397'];
    if (preventiveCodes.includes(claim.procedureCode) && claim.providerInvoicedToPatient > 0) {
      const overcharge = claim.providerInvoicedToPatient;
      const flag: BillFlag = {
        id: `flag-${claim.id}-preventive`,
        userId,
        claimId: claim.id,
        ruleId: 'RULE_PREVENTIVE_ZERO_COST',
        title: 'Preventive Care Charged Out-of-Pocket',
        explanation: `Your bill shows a charge of $${claim.providerInvoicedToPatient.toFixed(2)} for an Annual Wellness Visit (${claim.procedureCode}). Medicare covers routine annual wellness exams at 100% with $0 patient copay.`,
        billedAmount: claim.providerInvoicedToPatient,
        medicareApprovedAmount: claim.medicareApprovedAmount,
        eobPatientOwedAmount: claim.eobPatientResponsibility,
        potentialOvercharge: overcharge,
        callScript: `Hi, I am calling about billing for my visit on ${claim.serviceDate} (${claim.procedureDescription}). Under Medicare Part B preventive care rules, this exam carries $0 patient cost-share, and my Medicare EOB shows $0 owed. Could you please re-process this claim or zero out the balance?`,
        providerName: claim.providerName,
        providerPhone: claim.providerPhone,
        serviceDate: claim.serviceDate,
        sentAt: new Date().toISOString(),
      };
      flags.push(flag);
      db.recordBillFlag(flag);
    }

    // Rule 2: Patient responsibility exceeds Medicare EOB
    if (claim.providerInvoicedToPatient > claim.eobPatientResponsibility + 10 && !preventiveCodes.includes(claim.procedureCode)) {
      const overcharge = claim.providerInvoicedToPatient - claim.eobPatientResponsibility;
      const flag: BillFlag = {
        id: `flag-${claim.id}-exceeds-eob`,
        userId,
        claimId: claim.id,
        ruleId: 'RULE_PATIENT_RESPONSIBILITY_EXCEEDS_EOB',
        title: 'Billed Amount Exceeds Medicare EOB',
        explanation: `The clinic billed you $${claim.providerInvoicedToPatient.toFixed(2)}, but Medicare's official Explanation of Benefits states your maximum patient responsibility is only $${claim.eobPatientResponsibility.toFixed(2)}.`,
        billedAmount: claim.providerInvoicedToPatient,
        medicareApprovedAmount: claim.medicareApprovedAmount,
        eobPatientOwedAmount: claim.eobPatientResponsibility,
        potentialOvercharge: overcharge,
        callScript: `Hello, I received a bill for $${claim.providerInvoicedToPatient.toFixed(2)} for services on ${claim.serviceDate}. However, my Medicare Explanation of Benefits indicates my coinsurance is only $${claim.eobPatientResponsibility.toFixed(2)}. Can you please verify Medicare's contractual adjustment?`,
        providerName: claim.providerName,
        providerPhone: claim.providerPhone,
        serviceDate: claim.serviceDate,
        sentAt: new Date().toISOString(),
      };
      flags.push(flag);
      db.recordBillFlag(flag);
    }
  }

  return flags;
}
