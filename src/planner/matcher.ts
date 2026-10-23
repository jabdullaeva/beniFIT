import fs from 'fs';
import path from 'path';

export interface BeniIntervention {
  planText: string;
  category: 'before_care' | 'hidden_perk' | 'alert' | 'billing';
  beniMessage: string;
  dollarHighlight?: string;
  sourceDoc: string;
  actionButton: {
    label: string;
    actionType: 'call' | 'book' | 'app' | 'claim' | 'dispute' | 'compare' | 'questions';
    detail?: string;
  };
}

export interface PlannerEntry {
  id: string;
  dateStr: string;
  text: string;
  completed?: boolean;
  intervention?: BeniIntervention;
}

// Canonical matching rules from the beniFIT Product Brief (Pages 3-4)
const BENI_MATCH_RULES: Array<{
  triggers: string[];
  category: 'before_care' | 'hidden_perk';
  beniMessage: string;
  dollarHighlight?: string;
  sourceDoc: string;
  actionButton: {
    label: string;
    actionType: 'call' | 'book' | 'app' | 'claim' | 'dispute' | 'compare' | 'questions';
    detail?: string;
  };
}> = [
  {
    triggers: ['mri', 'imaging', 'scan', 'city imaging'],
    category: 'before_care',
    beniMessage:
      'City Imaging is in-network. Expected cost is about $180. Ask if the radiologist is in-network too, and whether you need prior approval.',
    dollarHighlight: 'Est. $180 vs $900 out-of-network',
    sourceDoc: 'ClearPath PPO • Schedule of Benefits p. 12',
    actionButton: {
      label: 'Call ClearPath',
      actionType: 'call',
      detail: '1-800-555-PATH (Auth Line)',
    },
  },
  {
    triggers: ['checkup', 'annual physical', 'wellness visit', 'doctor exam'],
    category: 'before_care',
    beniMessage:
      'Your checkup is free ($0 copay). If you bring up a new problem, they may bill a separate visit, so ask first.',
    dollarHighlight: '$0 Preventive Care (100% Covered)',
    sourceDoc: 'ClearPath PPO • Preventive Schedule p. 4',
    actionButton: {
      label: 'Add questions',
      actionType: 'questions',
      detail: 'Add checklist for doctor appointment',
    },
  },
  {
    triggers: ['dermatologist', 'skin', 'rash', 'mole'],
    category: 'before_care',
    beniMessage:
      "You don't need a referral. The 4.5-star doctor nearby has a $45 copay instead of $130.",
    dollarHighlight: '$45 Copay vs $130 Specialist Non-Tier',
    sourceDoc: 'ClearPath Tier-1 Specialist Network p. 6',
    actionButton: {
      label: 'Compare doctors',
      actionType: 'compare',
      detail: 'View in-network dermatologists',
    },
  },
  {
    triggers: ['knee surgery', 'surgery consult', 'orthopedic surgery', 'operation'],
    category: 'before_care',
    beniMessage:
      'Before surgery, you can get a free expert second opinion through SecondLook at $0 cost to you.',
    dollarHighlight: 'Free $850 Clinical Review',
    sourceDoc: 'Brightway Benefits Guide p. 13 • SecondLook Program',
    actionButton: {
      label: 'Call SecondLook',
      actionType: 'call',
      detail: '1-888-2ND-LOOK',
    },
  },
  {
    triggers: ['uber', 'lyft', 'ride', 'transit', 'taxi to hospital', 'cab'],
    category: 'hidden_perk',
    beniMessage:
      'Your plan covers up to 12 free rides a year to appointments. Book at least 48 hours ahead.',
    dollarHighlight: '12 Free Rides (~$360 Value)',
    sourceDoc: 'Brightway Benefits Guide p. 7 • RideCare Benefit',
    actionButton: {
      label: 'Book a ride',
      actionType: 'book',
      detail: 'ClearPath RideCare Portal',
    },
  },
  {
    triggers: ['dietitian', 'nutrition', 'eat healthier', 'gym', 'fitness', 'workout'],
    category: 'hidden_perk',
    beniMessage:
      'Free dietitian visits, plus access to a 10,000+ gym network from just $10 a month.',
    dollarHighlight: 'Save ~$300/yr on fitness & nutrition',
    sourceDoc: 'Brightway Benefits Guide p. 9 • NutriFit & ActiveFit',
    actionButton: {
      label: 'Book dietitian',
      actionType: 'book',
      detail: 'NutriFit Virtual Portal',
    },
  },
  {
    triggers: ['mom', 'elder', 'aging parent', 'caregiver', 'stressed about mom', 'counseling', 'therapy', 'stress', 'burnout'],
    category: 'hidden_perk',
    beniMessage:
      '5 free counseling sessions, and backup elder care for Mom subsidized at just $6 an hour.',
    dollarHighlight: '5 Free Sessions + $6/hr Care (~$450 Value)',
    sourceDoc: 'Brightway Benefits Guide p. 14 • Talk Line EAP & CareBridge',
    actionButton: {
      label: 'Call Talk Line',
      actionType: 'call',
      detail: '1-888-555-TALK',
    },
  },
  {
    triggers: ['knee hurts', 'running injury', 'joint pain', 'back pain', 'physical therapy', 'pt'],
    category: 'hidden_perk',
    beniMessage:
      'Free virtual physical therapy with MoveWell, with a motion-sensor equipment kit shipped home.',
    dollarHighlight: '100% Covered Digital PT (~$400 Value)',
    sourceDoc: 'Brightway Benefits Guide p. 11 • MoveWell Digital MSK',
    actionButton: {
      label: 'Open MoveWell',
      actionType: 'app',
      detail: 'Launch MoveWell Health Kit',
    },
  },
  {
    triggers: ['data course', 'course', 'class', 'tuition', 'degree', 'mba', 'certificate', 'learning'],
    category: 'hidden_perk',
    beniMessage:
      'Up to $5,250 a year in Brightway tuition help. Be sure to get approval before the course starts.',
    dollarHighlight: '$5,250/yr Tuition Assistance',
    sourceDoc: 'Brightway Benefits Guide p. 15 • LearnUp Tuition Portal',
    actionButton: {
      label: 'Open LearnUp',
      actionType: 'app',
      detail: 'Brightway LearnUp Reimbursement Portal',
    },
  },
  {
    triggers: ['quit vaping', 'quit smoking', 'vape', 'tobacco', 'nicotine', 'cigarettes'],
    category: 'hidden_perk',
    beniMessage:
      'Finish 5 free coaching sessions and get back the $40 per paycheck surcharge ($960/year saved).',
    dollarHighlight: 'Save $960/yr ($40/paycheck refund)',
    sourceDoc: 'Brightway Benefits Guide p. 8 • Quit Kit Program',
    actionButton: {
      label: 'Call Quit Kit',
      actionType: 'call',
      detail: '1-800-QUIT-NOW',
    },
  },
  {
    triggers: ['fsa', 'glasses', 'sunscreen', 'first aid', 'contact lenses'],
    category: 'hidden_perk',
    beniMessage:
      'You have $420 left in your Health Care FSA expiring Dec 31. Prescription glasses, OTC sunscreen, and first-aid kits count.',
    dollarHighlight: '$420 Balance Expiring Dec 31',
    sourceDoc: 'ClearPath FSA Portal • Plan Year 2027',
    actionButton: {
      label: 'Claim it',
      actionType: 'claim',
      detail: 'FSA Store / Upload Receipt',
    },
  },
];

export function matchPlanToBeniIntervention(planText: string): BeniIntervention | undefined {
  const lower = planText.toLowerCase().trim();

  for (const rule of BENI_MATCH_RULES) {
    for (const trigger of rule.triggers) {
      if (lower.includes(trigger)) {
        return {
          planText,
          category: rule.category,
          beniMessage: rule.beniMessage,
          dollarHighlight: rule.dollarHighlight,
          sourceDoc: rule.sourceDoc,
          actionButton: rule.actionButton,
        };
      }
    }
  }

  return undefined;
}
