import { SupportedLang } from './translations.ts';

export interface FindingItem {
  id: string;
  type: 'may_qualify' | 'confirmed';
  category: 'hidden_benefit' | 'unclaimed_program' | 'bill_error' | 'fsa' | 'food';
  title: string;
  subtitle: string;
  amount: number;
  amountLabel: string;
  source: string;
  actionLabel: string;
  actionKind: 'call' | 'open_app' | 'claim' | 'view' | 'apply' | 'learn_more';
  deadline?: string;
  explanation: string;
}

export interface DemoPersona {
  id: 'maria' | 'ana' | 'joe';
  name: string;
  age: number;
  location: string;
  coverageName: string;
  claimsCount: number;
  totalSavings: number;
  mayQualifyTotal: number;
  confirmedTotal: number;
  incomeMonthly: number;
  householdSize: number;
  memberId: string;
  groupNumber: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
  copays: {
    pcp: string;
    specialist: string;
    urgentCare?: string;
    genericRx: string;
    er: string;
  };
  deductible: {
    total: number;
    met: number;
  };
  outOfPocketMax: {
    total: number;
    met: number;
  };
  fsaBalance?: number;
  fsaCardNumber?: string;
  fsaExpires?: string;
  findings: FindingItem[];
  mriBill: {
    billed: number;
    patientOwedPerPlan: number;
    discrepancy: number;
    errorSummary: string;
    source: string;
    providerName: string;
    providerPhone: string;
    providerEmail: string;
    disputeDraft: string;
  };
}

export function getLocalizedPersona(
  baseKey: 'maria' | 'ana' | 'joe',
  lang: SupportedLang
): DemoPersona {
  if (baseKey === 'ana') {
    const titles = {
      en: {
        f1: 'Emergency room balance bill',
        f1Sub: '$1,150 • Hospital bill',
        f1Exp: 'New York Medicaid covers emergency department visits in full. Providers are strictly prohibited from balance billing Medicaid patients.',
        f2: 'WIC Nutrition benefit ($100/mo)',
        f2Sub: '$1,200 • State program',
        f2Exp: 'Because you are pregnant or have a young baby, you may qualify for $100/mo in fruit, milk, and healthy groceries.',
        f3: 'Covered doula care services',
        f3Sub: '$750 • Medicaid perk',
        f3Exp: 'NY Medicaid covers certified doula birth workers at $0 out-of-pocket for prenatal, labor, and postpartum support.',
        err: 'Bronx Central Hospital billed $1,150.00 for emergency care. Under NY Public Health Law and federal Medicaid rules, participating providers cannot bill Medicaid members for covered emergency services.',
        actView: 'View details',
        actApply: 'Apply',
        actLearn: 'Learn more',
      },
      es: {
        f1: 'Factura indebida de urgencias',
        f1Sub: '$1,150 • Factura del hospital',
        f1Exp: 'Medicaid de Nueva York cubre las visitas a urgencias al 100%. Los proveedores tienen estrictamente prohibido emitir cobros de saldo.',
        f2: 'Beneficio de nutrición WIC ($100/mes)',
        f2Sub: '$1,200 • Programa del estado',
        f2Exp: 'Por estar embarazada o tener un bebé pequeño, podrías calificar para $100/mes en frutas, leche y alimentos saludables.',
        f3: 'Servicios de doula cubiertos',
        f3Sub: '$750 • Beneficio de Medicaid',
        f3Exp: 'Medicaid de NY cubre a doulas certificadas con $0 de desembolso para apoyo prenatal, parto y posparto.',
        err: 'Bronx Central Hospital facturó $1,150.00 por atención de emergencia. Bajo la Ley de Salud de NY y las normas federales de Medicaid, los proveedores participantes no pueden cobrar a los miembros por emergencias cubiertas.',
        actView: 'Ver detalles',
        actApply: 'Solicitar',
        actLearn: 'Más información',
      },
      fr: {
        f1: 'Facturation abusive des urgences',
        f1Sub: '$1,150 • Facture hospitalière',
        f1Exp: 'Medicaid de New York couvre intégralement les urgences. Il est formellement interdit aux hôpitaux de facturer un reste à charge.',
        f2: 'Aide nutritionnelle WIC ($100/mois)',
        f2Sub: '$1,200 • Programme d’État',
        f2Exp: 'En tant que femme enceinte ou jeune maman, vous pouvez prétendre à $100/mois pour des produits frais et sains.',
        f3: 'Accompagnement doula pris en charge',
        f3Sub: '$750 • Avantage Medicaid',
        f3Exp: 'Medicaid NY prend en charge à 100% sans reste à charge l’aide d’une doula pour la grossesse et l’accouchement.',
        err: 'L’hôpital Bronx Central a facturé $1,150.00 pour des soins d’urgence. Selon la loi de NY, les assurés Medicaid bénéficient d’une prise en charge totale.',
        actView: 'Voir détails',
        actApply: 'Postuler',
        actLearn: 'En savoir plus',
      },
      uk: {
        f1: 'Неправомірний рахунок за невідкладну допомогу',
        f1Sub: '$1,150 • Госпітальний рахунок',
        f1Exp: 'Програма Medicaid штату Нью-Йорк повністю покриває невідкладну допомогу. Медичним закладам суворо заборонено виставляти залишковий рахунок.',
        f2: 'Допомога на харчування WIC ($100/міс.)',
        f2Sub: '$1,200 • Державна програма',
        f2Exp: 'Під час вагітності та догляду за немовлям ви маєте право на $100 щомісяця на фрукти, молоко та корисні продукти.',
        f3: 'Покриті послуги доули',
        f3Sub: '$750 • Пільга Medicaid',
        f3Exp: 'Medicaid NY покриває сертифікованих доул із $0 доплати для дородової підтримки та допомоги при пологах.',
        err: 'Bronx Central Hospital нарахував $1,150.00 за невідкладну допомогу. Згідно із законодавством штату Нью-Йорк, учасники Medicaid звільнені від цих оплат.',
        actView: 'Деталі',
        actApply: 'Подати',
        actLearn: 'Дізнатися більше',
      },
    }[lang];

    return {
      id: 'ana',
      name: 'Ana Torres',
      age: 26,
      location: 'Bronx, NY 10451',
      coverageName: 'HarborCare NY Medicaid Managed Care',
      claimsCount: 3,
      totalSavings: 3100,
      mayQualifyTotal: 1950,
      confirmedTotal: 1150,
      incomeMonthly: 1650,
      householdSize: 2,
      memberId: 'HB-33819-BX',
      groupNumber: 'NY-MED-04',
      rxBin: '012345',
      rxPcn: 'NYRX',
      rxGroup: 'NYMED',
      copays: {
        pcp: '$0',
        specialist: '$0',
        urgentCare: '$0',
        genericRx: '$1-$3',
        er: '$0',
      },
      deductible: { total: 0, met: 0 },
      outOfPocketMax: { total: 0, met: 0 },
      findings: [
        {
          id: 'f-ana-1',
          type: 'confirmed',
          category: 'bill_error',
          title: titles.f1,
          subtitle: titles.f1Sub,
          amount: 1150,
          amountLabel: '$1,150',
          source: 'Bronx Central Bill #BC-99214 vs HarborCare Medicaid',
          actionLabel: titles.actView,
          actionKind: 'view',
          explanation: titles.f1Exp,
        },
        {
          id: 'f-ana-2',
          type: 'may_qualify',
          category: 'food',
          title: titles.f2,
          subtitle: titles.f2Sub,
          amount: 1200,
          amountLabel: '$1,200/yr',
          source: 'NY DOH WIC Guidelines p.2',
          actionLabel: titles.actApply,
          actionKind: 'apply',
          explanation: titles.f2Exp,
        },
        {
          id: 'f-ana-3',
          type: 'may_qualify',
          category: 'hidden_benefit',
          title: titles.f3,
          subtitle: titles.f3Sub,
          amount: 750,
          amountLabel: '100% Covered',
          source: 'HarborCare 2026 Medicaid Benefits',
          actionLabel: titles.actLearn,
          actionKind: 'learn_more',
          explanation: titles.f3Exp,
        },
      ],
      mriBill: {
        billed: 1150.0,
        patientOwedPerPlan: 0.0,
        discrepancy: 1150.0,
        errorSummary: titles.err,
        source: 'Bronx Central Bill #BC-99214 + HarborCare Medicaid',
        providerName: 'Bronx Central Hospital',
        providerPhone: '(718) 555-0199',
        providerEmail: 'billing@bronxcentral.org',
        disputeDraft: `To Bronx Central Billing Department:\nRe: Patient Ana Torres (Medicaid ID: HB-33819-BX, Invoice #BC-99214)\n\nI am disputing the billed balance of $1,150.00. I am an active beneficiary of HarborCare NY Medicaid. Under NY State regulations, emergency room care is covered at 100% with $0 copay.\n\nParticipating providers are legally prohibited from balance billing Medicaid members. Please cancel this balance immediately and confirm $0 balance in writing.\n\nSincerely,\nAna Torres`,
      },
    };
  }

  if (baseKey === 'joe') {
    const titles = {
      en: {
        f1: 'Insulin copay overcharge',
        f1Sub: '$85 • Pharmacy receipt',
        f1Exp: 'Pharmacy charged $120. Under Medicare Part D senior caps, insulin copay is legally capped at $35.00/month.',
        f2: 'Medicare Savings Program (Part B)',
        f2Sub: '$2,220 • State assistance',
        f2Exp: 'New York will pay your $185 monthly Part B premium directly into your Social Security check if you meet income limits.',
        f3: 'SNAP senior grocery support',
        f3Sub: '$1,895 • State program',
        f3Exp: 'You may be eligible for about $158 a month on an EBT card for grocery markets.',
        err: 'Main St Pharmacy charged $120.00 cash price for a 30-day insulin supply. Under the federal Inflation Reduction Act and NY Senior protections, Medicare Part D insulin is legally capped at $35.00 per month.',
        actView: 'View details',
        actApply: 'Apply',
      },
      es: {
        f1: 'Sobrecargo en copago de insulina',
        f1Sub: '$85 • Recibo de farmacia',
        f1Exp: 'La farmacia cobró $120. Bajo los límites federales de Medicare Parte D, el copago de insulina está topado por ley en $35.00/mes.',
        f2: 'Programa de Ahorros de Medicare (Parte B)',
        f2Sub: '$2,220 • Ayuda estatal',
        f2Exp: 'Nueva York pagará tu prima mensual de $185 de la Parte B directamente en tu cheque de Seguro Social.',
        f3: 'Apoyo para alimentos SNAP adultos mayores',
        f3Sub: '$1,895 • Programa estatal',
        f3Exp: 'Podrías calificar para recibir cerca de $158 al mes en una tarjeta EBT para comprar alimentos.',
        err: 'Main St Pharmacy cobró $120.00 por un suministro de insulina de 30 días. Bajo las protecciones de Medicare Parte D, la insulina tiene un tope legal de $35.00/mes.',
        actView: 'Ver detalles',
        actApply: 'Solicitar',
      },
      fr: {
        f1: 'Surfacturation de l’insuline',
        f1Sub: '$85 • Ticket de pharmacie',
        f1Exp: 'La pharmacie a facturé $120. Le plafond légal de Medicare Part D limite l’insuline à $35.00/mois pour les seniors.',
        f2: 'Programme d’aide Medicare (Partie B)',
        f2Sub: '$2,220 • Aide de l’État de NY',
        f2Exp: 'New York prend en charge votre cotisation mensuelle Part B de $185 versée directement sur votre pension de retraite.',
        f3: 'Aide aux courses SNAP pour seniors',
        f3Sub: '$1,895 • Programme public',
        f3Exp: 'Vous pourriez être éligible à environ $158 par mois sur une carte EBT pour vos achats alimentaires.',
        err: 'La pharmacie Main St a facturé $120.00 pour un mois d’insuline. Selon la loi fédérale et de New York, le plafond senior est fixé à $35.00 par mois.',
        actView: 'Voir détails',
        actApply: 'Postuler',
      },
      uk: {
        f1: 'Переплата за інсулін понад ліміт',
        f1Sub: '$85 • Чек з аптеки',
        f1Exp: 'Аптека списала $120. За федеральним законом Medicare Part D доплата за місячний запас інсуліну суворо обмежена $35.00.',
        f2: 'Програма економії Medicare (Частина B)',
        f2Sub: '$2,220 • Державна допомога',
        f2Exp: 'Штат Нью-Йорк оплачуватиме вашу щомісячну премію Part B ($185) безпосередньо у виплаті Social Security.',
        f3: 'Продовольча підтримка SNAP для літніх',
        f3Sub: '$1,895 • Програма штату',
        f3Exp: 'Ви можете щомісяця отримувати близько $158 на картку EBT на купівлю продуктів.',
        err: 'Main St Pharmacy нарахувала $120.00 за місячний курс інсуліну. Згідно із захистом для пенсіонерів, ціна обмежена $35.00/міс.',
        actView: 'Деталі',
        actApply: 'Подати',
      },
    }[lang];

    return {
      id: 'joe',
      name: 'Joe Kowalski',
      age: 72,
      location: 'Queens, NY 11355',
      coverageName: 'SilverPath Choice Medicare Advantage (HMO)',
      claimsCount: 3,
      totalSavings: 4200,
      mayQualifyTotal: 4115,
      confirmedTotal: 85,
      incomeMonthly: 1800,
      householdSize: 1,
      memberId: '1EG4-TE5-MK72',
      groupNumber: 'SP-MED-77',
      rxBin: '610014',
      rxPcn: 'MEDD',
      rxGroup: 'PARTD',
      copays: {
        pcp: '$0',
        specialist: '$15',
        urgentCare: '$20',
        genericRx: '$0 Tier 1',
        er: '$90',
      },
      deductible: { total: 240, met: 240 },
      outOfPocketMax: { total: 3400, met: 890 },
      fsaBalance: 85,
      fsaCardNumber: '9912',
      fsaExpires: 'Quarter End',
      findings: [
        {
          id: 'f-joe-1',
          type: 'confirmed',
          category: 'bill_error',
          title: titles.f1,
          subtitle: titles.f1Sub,
          amount: 85,
          amountLabel: '$85 refund',
          source: 'Main St Pharmacy Receipt #RX-4412',
          actionLabel: titles.actView,
          actionKind: 'view',
          explanation: titles.f1Exp,
        },
        {
          id: 'f-joe-2',
          type: 'may_qualify',
          category: 'unclaimed_program',
          title: titles.f2,
          subtitle: titles.f2Sub,
          amount: 2220,
          amountLabel: '$185 / mo',
          source: 'NY DOH MSP Guidelines 2026',
          actionLabel: titles.actApply,
          actionKind: 'apply',
          explanation: titles.f2Exp,
        },
        {
          id: 'f-joe-3',
          type: 'may_qualify',
          category: 'food',
          title: titles.f3,
          subtitle: titles.f3Sub,
          amount: 1895,
          amountLabel: '$158 / mo',
          source: 'OTDA NY SNAP Guidelines',
          actionLabel: titles.actApply,
          actionKind: 'apply',
          explanation: titles.f3Exp,
        },
      ],
      mriBill: {
        billed: 120.0,
        patientOwedPerPlan: 35.0,
        discrepancy: 85.0,
        errorSummary: titles.err,
        source: 'Main St. Pharmacy Receipt #RX-4412 vs. Medicare Part D',
        providerName: 'Main St. Pharmacy',
        providerPhone: '(718) 555-0144',
        providerEmail: 'rx@mainstpharmacy.com',
        disputeDraft: `To Main St. Pharmacy Manager:\nRe: Patient Joe Kowalski (Rx #RX-4412, SilverPath Medicare ID: 1EG4-TE5-MK72)\n\nI was charged $120.00 for my Novolog insulin refill. Under federal Medicare Part D regulations, insulin copays are capped at $35.00 for a 30-day supply.\n\nPlease process an immediate refund of the $85.00 overcharge to my account.\n\nThank you,\nJoe Kowalski`,
      },
    };
  }

  // Default: Maria Alvarez
  const titles = {
    en: {
      f1: 'Unused FSA funds',
      f1Sub: '$320 • Employer benefits',
      f1Exp: 'You have $320 in your Flexible Spending Account. Prescription glasses, sunscreen, and first-aid items qualify.',
      f2: 'Food assistance program',
      f2Sub: '$150 • State program',
      f2Exp: 'Based on your household size in Brooklyn, you may qualify for $150/mo in grocery purchasing help.',
      f3: 'Free ride assistance',
      f3Sub: '$310 • Health exchange / plan',
      f3Exp: 'Your ClearPath plan covers up to 12 free roundtrip rides per year to doctors and imaging centers via Uber Health.',
      f4: 'Duplicate MRI charge',
      f4Sub: '$485 • Hospital bill',
      f4Exp: 'This charge appears to be a duplicate of a claim already paid by your insurance. Insurance paid $720, contractual liability is $180.',
      err: 'This charge appears to be a duplicate of a claim already paid by your insurance. Mercy Grove Hospital billed line 70553 twice; ClearPath denied the second line as duplicate care, but the hospital moved it to patient balance.',
      actClaim: 'Claim it',
      actApply: 'Apply',
      actLearn: 'Learn more',
      actView: 'View details',
    },
    es: {
      f1: 'Fondos FSA no utilizados',
      f1Sub: '$320 • Beneficios de empleo',
      f1Exp: 'Tienes $320 en tu Cuenta de Gastos Flexibles (FSA). Lentes recetados, protector solar y botiquines califican.',
      f2: 'Programa de asistencia de alimentos',
      f2Sub: '$150 • Programa estatal',
      f2Exp: 'Según el tamaño de tu hogar en Brooklyn, podrías calificar para $150/mes de ayuda para comprar alimentos.',
      f3: 'Transporte médico gratuito',
      f3Sub: '$310 • Beneficio de tu plan',
      f3Exp: 'Tu plan ClearPath cubre hasta 12 traslados ida y vuelta al año a médicos y centros de imágenes con Uber Health.',
      f4: 'Cargo duplicado de resonancia (MRI)',
      f4Sub: '$485 • Factura de hospital',
      f4Exp: 'Este cargo parece ser un cobro duplicado de un servicio ya cubierto por tu seguro. El seguro pagó $720 y tu responsabilidad es $180.',
      err: 'Este cargo parece ser un cobro duplicado de una reclamación ya pagada por tu seguro médico. Mercy Grove Hospital facturó la línea 70553 dos veces.',
      actClaim: 'Reclamar',
      actApply: 'Solicitar',
      actLearn: 'Más información',
      actView: 'Ver detalles',
    },
    fr: {
      f1: 'Fonds FSA non utilisés',
      f1Sub: '$320 • Avantages employeur',
      f1Exp: 'Vous disposez de $320 sur votre compte FSA. Lunettes de vue, crème solaire et trousses de secours sont éligibles.',
      f2: 'Aide alimentaire de l’État',
      f2Sub: '$150 • Programme public',
      f2Exp: 'Selon la taille de votre foyer à Brooklyn, vous pourriez recevoir $150/mois d’aide pour vos courses.',
      f3: 'Transport médical gratuit',
      f3Sub: '$310 • Avantage de mutuelle',
      f3Exp: 'Votre couverture ClearPath inclut 12 trajets aller-retour par an vers vos rendez-vous médicaux via Uber Health.',
      f4: 'Frais d’IRM facturés en double',
      f4Sub: '$485 • Facture d’hôpital',
      f4Exp: 'Ce montant semble être un doublon pour un acte déjà réglé par votre assurance. Votre part contractuelle n’est que de $180.',
      err: 'Ce montant semble être une facturation en double pour un soin déjà réglé. L’hôpital Mercy Grove a facturé la ligne 70553 deux fois.',
      actClaim: 'Réclamer',
      actApply: 'Postuler',
      actLearn: 'En savoir plus',
      actView: 'Voir détails',
    },
    uk: {
      f1: 'Невикористані кошти FSA',
      f1Sub: '$320 • Пільги від компанії',
      f1Exp: 'У вас є $320 на рахунку FSA. Окуляри за рецептом, захисний крем від сонця та аптечки покриваються.',
      f2: 'Програма допомоги на харчування',
      f2Sub: '$150 • Державна програма',
      f2Exp: 'З огляду на розмір сім’ї у Брукліні, ви можете отримувати $150/міс. допомоги на купівлю продуктів.',
      f3: 'Безкоштовний медичний доїзд',
      f3Sub: '$310 • Додаткова пільга плану',
      f3Exp: 'Ваш план ClearPath надає до 12 безкоштовних поїздок на рік до лікарів та центрів діагностики через Uber Health.',
      f4: 'Помилкове подвійне нарахування за МРТ',
      f4Sub: '$485 • Рахунок лікарні',
      f4Exp: 'Цей платіж є повторним нарахуванням за послугу, яку вже сплатила ваша страховка. Ваша частка за договором — $180.',
      err: 'Цей платіж є повторним нарахуванням за послугу, яку вже покрила ваша страховка. Mercy Grove Hospital нарахував код 70553 двічі.',
      actClaim: 'Отримати',
      actApply: 'Подати',
      actLearn: 'Дізнатися більше',
      actView: 'Деталі',
    },
  }[lang];

  return {
    id: 'maria',
    name: 'Maria Alvarez',
    age: 38,
    location: 'Brooklyn, NY 11201',
    coverageName: 'ClearPath Comprehensive PPO',
    claimsCount: 4,
    totalSavings: 1265,
    mayQualifyTotal: 780,
    confirmedTotal: 485,
    incomeMonthly: 4200,
    householdSize: 1,
    memberId: 'CP-90214-NY',
    groupNumber: 'NY-772',
    rxBin: '004336',
    rxPcn: 'ADV',
    rxGroup: 'RX772',
    copays: {
      pcp: '$20',
      specialist: '$40',
      urgentCare: '$35',
      genericRx: '$15',
      er: '$150',
    },
    deductible: { total: 1000, met: 450 },
    outOfPocketMax: { total: 4500, met: 1200 },
    fsaBalance: 320,
    fsaCardNumber: '4821',
    fsaExpires: 'Dec 31, 2027',
    findings: [
      {
        id: 'f-1',
        type: 'may_qualify',
        category: 'fsa',
        title: titles.f1,
        subtitle: titles.f1Sub,
        amount: 320,
        amountLabel: '$320',
        source: 'Brightway 2027 Benefits Guide p.11',
        actionLabel: titles.actClaim,
        actionKind: 'claim',
        deadline: '⏰ Dec 31',
        explanation: titles.f1Exp,
      },
      {
        id: 'f-2',
        type: 'may_qualify',
        category: 'food',
        title: titles.f2,
        subtitle: titles.f2Sub,
        amount: 150,
        amountLabel: '$150',
        source: 'NY State Food Relief Guidelines',
        actionLabel: titles.actApply,
        actionKind: 'apply',
        explanation: titles.f2Exp,
      },
      {
        id: 'f-3',
        type: 'may_qualify',
        category: 'hidden_benefit',
        title: titles.f3,
        subtitle: titles.f3Sub,
        amount: 310,
        amountLabel: '$310',
        source: 'ClearPath RideCare Guide p.7',
        actionLabel: titles.actLearn,
        actionKind: 'learn_more',
        explanation: titles.f3Exp,
      },
      {
        id: 'f-4',
        type: 'confirmed',
        category: 'bill_error',
        title: titles.f4,
        subtitle: titles.f4Sub,
        amount: 485,
        amountLabel: '$485',
        source: 'Mercy Grove Bill MG-88213 vs. Claim EOB-0004',
        actionLabel: titles.actView,
        actionKind: 'view',
        explanation: titles.f4Exp,
      },
    ],
    mriBill: {
      billed: 485.0,
      patientOwedPerPlan: 180.0,
      discrepancy: 485.0,
      errorSummary: titles.err,
      source: 'Hospital bill MG-88213 + insurance claim EOB-0004',
      providerName: 'Mercy Grove Hospital (City Imaging)',
      providerPhone: '(212) 555-0180',
      providerEmail: 'billing@mercygrove.org',
      disputeDraft: `To Mercy Grove Billing Office:\nRe: Patient Maria Alvarez (DOB: 1988-06-14, Invoice #MG-88213)\n\nI am disputing the billed patient balance of $485.00 for MRI procedure 70553 performed on 2027-10-12. ClearPath EOB #EOB-0004 confirms the contractual allowed amount was paid ($720.00), leaving patient responsibility as $180.00.\n\nThe second charge on my invoice is an identical duplicate that was denied by ClearPath as non-payable duplicate care. Under New York balance billing protections, duplicate charges cannot be transferred to the patient.\n\nPlease zero out this duplicate balance of $485.00 and issue a corrected statement.\n\nThank you,\nMaria Alvarez`,
    },
  };
}
