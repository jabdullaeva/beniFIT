export type SupportedLang = 'en' | 'es' | 'fr' | 'uk';

export interface Translations {
  appName: string;
  tagline: string;
  subTagline: string;
  navHome: string;
  navPlanner: string;
  navBills: string;
  navChat: string;
  navConnect: string;
  navDoctors: string;
  navWallet: string;
  navLanguage: string;
  demoDataLabel: string;
  infoNotAdvice: string;
  mayQualify: string;
  confirmed: string;
  totalPotential: string;
  notConfirmed: string;
  fromDocuments: string;
  whatsBeniFound: string;
  getStarted: string;
  viewDetails: string;
  call: string;
  openApp: string;
  claimIt: string;
  apply: string;
  learnMore: string;
  draftMessage: string;
  copyLetter: string;
  copied: string;
  emailBilling: string;
  callBilling: string;
  connectTitle: string;
  connectSub: string;
  healthInsurance: string;
  employerBenefits: string;
  medicalBills: string;
  connectedNotice: string;
  plannerTitle: string;
  plannerSub: string;
  whatsComingUp: string;
  add: string;
  billCheckTitle: string;
  billCheckSub: string;
  mriChargeTitle: string;
  duplicateNotice: string;
  billSourceLabel: string;
  chatPlaceholder: string;
  askBeniTitle: string;
  askBeniSub: string;
  sourcesLabel: string;
  langWelcome: string;
  langGreeting: string;
  selectLanguage: string;
  medicareNotSure: string;
  medicaidNotSure: string;
  myAccount: string;
  alerts: string;
  doctorFinderTitle: string;
  doctorFinderSub: string;
  digitalWalletTitle: string;
  digitalWalletSub: string;
  inNetworkNotice: string;
  connectApi: string;
  apiSyncComplete: string;
  demoPersonaTitle: string;
  switchPersona: string;
  
  // Login Screen
  loginTagline: string;
  loginSub: string;
  loginDemoProfiles: string;
  loginEmailOrPhone: string;
  loginPassword: string;
  loginSignInBtn: string;
  loginZeroAssumptions: string;
  loginDemoPasswordNotice: string;
  loginOrEmail: string;

  // Connect & Income Screen
  incomeHeaderLabel: string;
  editIncomeBtn: string;
  step1IncomeTitle: string;
  step1RequiredBadge: string;
  step1IncomePrompt: string;
  monthSuffix: string;
  householdSizeLabel: string;
  nyZipLabel: string;
  personSingle: string;
  peoplePlural: string;
  step2ConnectTitle: string;
  cmsInteroperabilityTitle: string;
  cmsInteroperabilitySub: string;
  syncApiBtn: string;
  claimsCountLabel: string;
  auditedFlaggedLabel: string;
  verifyAndContinueBtn: string;

  // Planner Filter Tabs & Inputs
  filterAll: string;
  plannerPlaceholder: string;
  
  // Bill Check & Wallet Sub-tabs
  tabDiscrepancies: string;
  tabWallet: string;
  nyBalanceLawTitle: string;
  nyBalanceLawDesc: string;

  // Doctor Finder Component
  verifiedNetworkBadge: string;
  specialtyLabel: string;
  zipInputLabel: string;
  searchBtn: string;
  planNetworkLabel: string;
  inNetworkOnlyBtn: string;
  searchingDoctorsTitle: string;
  searchingDoctorsSub: string;
  foundDoctorsNear: string;
  withinMiles: string;
  inNetworkBadge: string;
  callDoctorBtn: string;
  directionsBtn: string;
  doctorDisclaimerTitle: string;
  doctorDisclaimerText: string;

  // Specialties
  specPrimaryCare: string;
  specCardiologist: string;
  specObGyn: string;
  specPediatrician: string;
  specEndocrinologist: string;
  specOrthopedics: string;
  specMentalHealth: string;

  // Digital Wallet Component
  digitalIdBadge: string;
  memberNameLabel: string;
  memberIdLabel: string;
  rxBinLabel: string;
  rxPcnLabel: string;
  groupNumLabel: string;
  pcpCopayLabel: string;
  specialistCopayLabel: string;
  genericRxCopayLabel: string;
  erCopayLabel: string;
  deductibleLabel: string;
  deductibleMetLabel: string;
  showClinicCode: string;
  hideClinicCode: string;
  tapToScan: string;
  receptionScannerCode: string;
  fsaCardTitle: string;
  fsaAvailableBalance: string;
  fsaExpiresLabel: string;
  fsaWhatCanIBuy: string;
  fsaHideItems: string;
  fsaEligibleTitle: string;
  fsaItem1: string;
  fsaItem2: string;
  fsaItem3: string;
  fsaItem4: string;
  fsaItem5: string;
  fsaItem6: string;

  // Account Modal
  accountCoverageProfile: string;
  activeMemberBadge: string;
  verifiedHouseholdIncomeTitle: string;
  incomeNoGuessNotice: string;
  lastAutoSyncLabel: string;
  manageApiConnectionBtn: string;
  alertPrefsLabel: string;
  alertsActiveStatus: string;
  alertsPausedStatus: string;
  configureBtn: string;
  switchJudgePersona: string;
  logOutBtn: string;
  doneBtn: string;

  // Alerts Modal & SMS System
  alertsModalTitle: string;
  alertsModalSub: string;
  alertsIntroDesc: string;
  enableAlertsMaster: string;
  enableAlertsMasterSub: string;
  alertTypeDuplicate: string;
  alertTypeDuplicateSub: string;
  alertTypeFsa: string;
  alertTypeFsaSub: string;
  alertTypeRenewal: string;
  alertTypeRenewalSub: string;
  alertTypeSms: string;
  alertTypeSmsSub: string;
  smsPhoneInputLabel: string;
  smsPhoneInputSub: string;
  smsSendTestBtn: string;
  smsSendingBtn: string;
  smsSuccessNotice: string;
  quietHoursTitle: string;
  quietHoursSub: string;
  liveDemoTriggerTitle: string;
  liveDemoTriggerSub: string;
  simulateLiveAlertBtn: string;
  savePreferencesBtn: string;

  // SMS Notification Banner
  smsIncomingHeader: string;
  smsMessagesNow: string;
  smsTapToReview: string;

  // Dispute Details Modal
  disputeModalHeader: string;
  providerBilledLabel: string;
  insuranceShareLabel: string;
  duplicateDiscrepancyLabel: string;
  findingsLabel: string;
  sourceDocumentsLabel: string;
  draftedDisputeLetterLabel: string;
  closeBtn: string;

  // Income Modal
  updateIncomeTitle: string;
  monthlyIncomeBeforeTaxes: string;
  cancelBtn: string;
  recalculateSavingsBtn: string;

  // API Connect Modal
  apiConnectHeader: string;
  cmsProtocolSub: string;
  fhirProtocolTitle: string;
  fhirProtocolDesc: string;
  selectHealthPlanPrompt: string;
  liveInteroperabilityStatus: string;
  tokenActiveBadge: string;
  authSmartFhir: string;
  queryingBundlesStatus: string;
  resyncApiLiveBtn: string;

  // Ask Beni Screen
  readingDocsText: string;
  chipMriBill: string;
  chipWhatMissing: string;
  chipFoodHelp: string;
  chipSafetyTest: string;
}

export const TRANSLATIONS: Record<SupportedLang, Translations> = {
  en: {
    appName: 'beniFIT',
    tagline: 'Your benefits. In plain sight.',
    subTagline: 'Small finds. Big relief.',
    navHome: 'Home',
    navPlanner: 'Planner',
    navBills: 'Bill check',
    navChat: 'Ask Beni',
    navConnect: 'Connect',
    navDoctors: 'Find Doctor',
    navWallet: 'Digital Wallet',
    navLanguage: 'Language',
    demoDataLabel: 'Demo data',
    infoNotAdvice: 'Information, not advice.',
    mayQualify: 'May qualify',
    confirmed: 'Confirmed',
    totalPotential: 'total potential savings & benefits',
    notConfirmed: 'not confirmed',
    fromDocuments: 'from your documents',
    whatsBeniFound: "Here's what Beni found:",
    getStarted: 'Get started →',
    viewDetails: 'View details',
    call: 'Call',
    openApp: 'Open app',
    claimIt: 'Claim it',
    apply: 'Apply',
    learnMore: 'Learn more',
    draftMessage: 'Draft message',
    copyLetter: 'Copy letter',
    copied: 'Copied!',
    emailBilling: 'Email billing office',
    callBilling: 'Call billing',
    connectTitle: 'Hi there!',
    connectSub:
      'Connect your insurance, employer benefits, and medical bills so Beni can find savings and answer your questions.',
    healthInsurance: 'Health insurance',
    employerBenefits: 'Employer benefits',
    medicalBills: 'Medical bills',
    connectedNotice: 'Connected: ClearPath PPO (4 claims found)',
    plannerTitle: 'Your savings plan',
    plannerSub: "Here's what you can do next.",
    whatsComingUp: "What's coming up on your calendar?",
    add: 'Add',
    billCheckTitle: 'Bill check',
    billCheckSub: 'We found a possible issue with your medical bill.',
    mriChargeTitle: 'MRI Charge',
    duplicateNotice:
      'This charge appears to be a duplicate of a claim already paid by your insurance.',
    billSourceLabel: 'Source: Hospital bill + insurance claim',
    chatPlaceholder: 'Ask Beni about your coverage, bills, or NYC benefits...',
    askBeniTitle: 'Ask Beni',
    askBeniSub: 'AI health-benefits assistant with visible document sources',
    sourcesLabel: 'Sources:',
    langWelcome:
      'Beni is here to help you understand benefits and resolve questions about your medical bills.',
    langGreeting: 'Hi there,',
    selectLanguage: 'Choose your language',
    demoPersonaTitle: 'Demo Personas:',
    switchPersona: 'Switch member',
    medicareNotSure: "I'm not sure. Call 1-800-MEDICARE.",
    medicaidNotSure:
      "I'm not sure. Contact HarborCare Member Services at 1-855-355-5777.",
    myAccount: 'My Account',
    alerts: 'Alerts',
    doctorFinderTitle: 'Find In-Network Doctors',
    doctorFinderSub: 'Matched to your verified ZIP code and insurance network',
    digitalWalletTitle: 'Digital Benefits Wallet',
    digitalWalletSub: 'Member cards, Rx numbers, and FSA balance at a glance',
    inNetworkNotice: 'In-network for',
    connectApi: 'Connect Health Plan API',
    apiSyncComplete: 'Synced via CMS Interoperability FHIR API',

    loginTagline: 'YOUR BENEFITS. IN PLAIN SIGHT.',
    loginSub: 'Sign in to connect your insurance, audit your medical bills, and find benefit savings.',
    loginDemoProfiles: '1-Click Demo Profiles (Hackathon):',
    loginEmailOrPhone: 'Email or Phone',
    loginPassword: 'Password',
    loginSignInBtn: 'Sign In to beniFIT',
    loginZeroAssumptions: 'Zero assumptions. We never guess your income from your phone.',
    loginDemoPasswordNotice: 'Password for all demo accounts:',
    loginOrEmail: 'Or sign in with email',

    incomeHeaderLabel: 'Income:',
    editIncomeBtn: 'Edit Income',
    step1IncomeTitle: '1. Tell Beni What You Earn (Never Assumed)',
    step1RequiredBadge: 'Required',
    step1IncomePrompt: 'Beni never assumes your income based on your phone number or ZIP. Enter your household earnings so we calculate your exact New York benefits:',
    monthSuffix: '/ month',
    householdSizeLabel: 'Household Size',
    nyZipLabel: 'New York ZIP',
    personSingle: 'Person',
    peoplePlural: 'People',
    step2ConnectTitle: '2. Connect Insurance & Documents:',
    cmsInteroperabilityTitle: 'CMS Interoperability API',
    cmsInteroperabilitySub: 'Synced via Patient Access API',
    syncApiBtn: 'Sync API',
    claimsCountLabel: 'claims',
    auditedFlaggedLabel: 'Flagged',
    verifyAndContinueBtn: 'Verify Income & View Savings →',

    filterAll: 'All',
    plannerPlaceholder: 'E.g. MRI follow-up scan, check insulin...',

    tabDiscrepancies: 'Discrepancy Audit (1)',
    tabWallet: 'Digital Benefits Wallet',
    nyBalanceLawTitle: 'New York Balance Billing Protection',
    nyBalanceLawDesc: 'Under NY Public Health Law § 2807-k, network hospitals and providers cannot bill patients for denied duplicate service lines.',

    verifiedNetworkBadge: 'Verified Network',
    specialtyLabel: 'Medical Specialty',
    zipInputLabel: 'Your Profile ZIP Code',
    searchBtn: 'Search',
    planNetworkLabel: 'Plan:',
    inNetworkOnlyBtn: 'In-Network Only',
    searchingDoctorsTitle: 'Searching New York Provider Directory...',
    searchingDoctorsSub: 'Querying NPI registry and matching to',
    foundDoctorsNear: 'Found in-network doctors near',
    withinMiles: 'Within 5 miles',
    inNetworkBadge: 'In-Network',
    callDoctorBtn: 'Call',
    directionsBtn: 'Directions',
    doctorDisclaimerTitle: 'Beni Reminder:',
    doctorDisclaimerText: 'Provider directories change frequently. When calling reception to book your appointment, verify they are participating with your specific plan name:',

    specPrimaryCare: 'Primary Care / Family Doctor',
    specCardiologist: 'Cardiologist (Heart)',
    specObGyn: "OB/GYN (Women's Health)",
    specPediatrician: 'Pediatrician (Child Care)',
    specEndocrinologist: 'Endocrinologist (Diabetes/Thyroid)',
    specOrthopedics: 'Orthopedics / Sports Medicine',
    specMentalHealth: 'Mental Health / Therapy',

    digitalIdBadge: 'beniFIT Digital ID',
    memberNameLabel: 'Member Name',
    memberIdLabel: 'Member ID',
    rxBinLabel: 'Rx BIN',
    rxPcnLabel: 'Rx PCN',
    groupNumLabel: 'Group #',
    pcpCopayLabel: 'PCP Copay',
    specialistCopayLabel: 'Specialist',
    genericRxCopayLabel: 'Generic Rx',
    erCopayLabel: 'Emergency',
    deductibleLabel: 'In-Network Deductible:',
    deductibleMetLabel: 'Met',
    showClinicCode: 'Show Clinic Check-In Code',
    hideClinicCode: 'Hide Clinic Check-In Code',
    tapToScan: 'Tap to scan at desk',
    receptionScannerCode: 'Reception Scanner Code',
    fsaCardTitle: 'Flexible Spending Account (FSA)',
    fsaAvailableBalance: 'Available unspent balance',
    fsaExpiresLabel: 'Expires',
    fsaWhatCanIBuy: 'What can I buy?',
    fsaHideItems: 'Hide eligible items',
    fsaEligibleTitle: 'Eligible with your balance:',
    fsaItem1: 'Prescription eyeglasses',
    fsaItem2: 'Sunscreen SPF 30+',
    fsaItem3: 'First aid kits & bandages',
    fsaItem4: 'Over-the-counter pain meds',
    fsaItem5: 'Dental cleanings & copays',
    fsaItem6: 'Blood pressure monitors',

    accountCoverageProfile: 'Coverage & Eligibility Profile',
    activeMemberBadge: 'Active Member',
    verifiedHouseholdIncomeTitle: 'Verified Household Income',
    incomeNoGuessNotice: 'Explicitly verified by you. Beni never guesses your earnings from phone numbers.',
    lastAutoSyncLabel: 'Last automatic claim sync:',
    manageApiConnectionBtn: 'Manage Insurance API Connection',
    alertPrefsLabel: 'Alert Notifications',
    alertsActiveStatus: 'Active (Discrepancies & FSA)',
    alertsPausedStatus: 'Paused',
    configureBtn: 'Configure',
    switchJudgePersona: 'Switch Demo Persona (Presentation):',
    logOutBtn: 'Log Out',
    doneBtn: 'Done',

    alertsModalTitle: 'Proactive Alert System',
    alertsModalSub: 'Automatic Savings & Discrepancy Monitoring',
    alertsIntroDesc: 'Beni continuously audits incoming claims, hospital bills, and NY state benefit deadlines to protect your wallet before charges go to collections or deadlines expire.',
    enableAlertsMaster: 'Enable Proactive Alerts',
    enableAlertsMasterSub: 'Master push & SMS alert delivery switch',
    alertTypeDuplicate: '🚨 Duplicate & Coding Discrepancies',
    alertTypeDuplicateSub: 'Alerts when hospital bill exceeds contract rate',
    alertTypeFsa: '⏳ Expiring FSA & Benefit Deadlines',
    alertTypeFsaSub: 'Warns 30 days before "use-it-or-lose-it" forfeit',
    alertTypeRenewal: '📋 Annual Recertification Reminders',
    alertTypeRenewalSub: 'Medicaid / Essential Plan annual renewal alerts',
    alertTypeSms: '💬 SMS Text Push Alerts',
    alertTypeSmsSub: 'Send high-priority notifications to your mobile phone',
    smsPhoneInputLabel: 'Mobile Phone for Text Alerts',
    smsPhoneInputSub: 'Real SMS alerts sent to your phone via Twilio Gateway',
    smsSendTestBtn: 'Send Real Text Alert Now',
    smsSendingBtn: 'Sending SMS...',
    smsSuccessNotice: '✓ Test SMS alert successfully dispatched to your phone!',
    quietHoursTitle: 'NYC Quiet Hours Active:',
    quietHoursSub: '10:00 PM – 8:00 AM. Non-emergency notifications held until morning.',
    liveDemoTriggerTitle: 'Live Demonstration Trigger',
    liveDemoTriggerSub: 'Test the proactive alert engine right now. It simulates an incoming discrepancy detection event.',
    simulateLiveAlertBtn: 'Simulate Live Alert Now',
    savePreferencesBtn: 'Save Preferences',

    smsIncomingHeader: 'beniFIT Alert • +1 (800) 236-4348',
    smsMessagesNow: 'MESSAGES • now',
    smsTapToReview: 'Tap to review dispute letter',

    disputeModalHeader: 'Charge Details',
    providerBilledLabel: 'Provider Billed:',
    insuranceShareLabel: 'Insurance Contract Share:',
    duplicateDiscrepancyLabel: 'Duplicate Discrepancy:',
    findingsLabel: 'Findings:',
    sourceDocumentsLabel: 'Source Documents:',
    draftedDisputeLetterLabel: 'Drafted Dispute Letter:',
    closeBtn: 'Close',

    updateIncomeTitle: 'Update Your Verified Income',
    monthlyIncomeBeforeTaxes: 'Monthly Household Income (Before Taxes)',
    cancelBtn: 'Cancel',
    recalculateSavingsBtn: 'Recalculate Savings',

    apiConnectHeader: 'Insurance API Connect',
    cmsProtocolSub: 'CMS-9115-F Interoperability Protocol',
    fhirProtocolTitle: 'HL7® FHIR® R4 Direct Patient Access',
    fhirProtocolDesc: 'Federal law mandates health insurers to provide automated FHIR API access to your claims, formulary, and Explanation of Benefits (EOB).',
    selectHealthPlanPrompt: 'Select Your Health Plan / Gateway:',
    liveInteroperabilityStatus: 'Live Interoperability Status',
    tokenActiveBadge: 'Token Active',
    authSmartFhir: 'Authenticating SMART-on-FHIR OAuth token...',
    queryingBundlesStatus: 'Querying ExplanationOfBenefit & Coverage bundles...',
    resyncApiLiveBtn: 'Re-sync API Live',

    readingDocsText: 'Beni is consulting your connected documents and NYC benefits...',
    chipMriBill: 'Is my MRI bill right?',
    chipWhatMissing: 'What am I missing?',
    chipFoodHelp: 'Food assistance?',
    chipSafetyTest: '🛡️ Medical refusal test',
  },
  es: {
    appName: 'beniFIT',
    tagline: 'Tus beneficios. A simple vista.',
    subTagline: 'Pequeños hallazgos. Gran alivio.',
    navHome: 'Inicio',
    navPlanner: 'Planificador',
    navBills: 'Facturas',
    navChat: 'Pregúntale a Beni',
    navConnect: 'Conectar',
    navDoctors: 'Buscar médico',
    navWallet: 'Billetera digital',
    navLanguage: 'Idioma',
    demoDataLabel: 'Datos de demostración',
    infoNotAdvice: 'Información, no asesoramiento legal o médico.',
    mayQualify: 'Podrías calificar',
    confirmed: 'Confirmado',
    totalPotential: 'ahorro y beneficios potenciales totales',
    notConfirmed: 'sin confirmar',
    fromDocuments: 'de tus documentos',
    whatsBeniFound: 'Esto es lo que Beni encontró:',
    getStarted: 'Comenzar →',
    viewDetails: 'Ver detalles',
    call: 'Llamar',
    openApp: 'Abrir app',
    claimIt: 'Reclamar',
    apply: 'Solicitar',
    learnMore: 'Más información',
    draftMessage: 'Redactar reclamo',
    copyLetter: 'Copiar carta',
    copied: '¡Copiado!',
    emailBilling: 'Enviar correo a facturación',
    callBilling: 'Llamar a facturación',
    connectTitle: '¡Hola!',
    connectSub:
      'Conecta tu seguro, beneficios de empleo y facturas médicas para que Beni encuentre ahorros y responda tus dudas.',
    healthInsurance: 'Seguro médico',
    employerBenefits: 'Beneficios de empleo',
    medicalBills: 'Facturas médicas',
    connectedNotice: 'Conectado: HarborCare Medicaid (3 reclamos)',
    plannerTitle: 'Tu plan de ahorros',
    plannerSub: 'Esto es lo que puedes hacer a continuación.',
    whatsComingUp: '¿Qué cita médica tienes programada?',
    add: 'Añadir',
    billCheckTitle: 'Revisión de facturas',
    billCheckSub: 'Encontramos un posible error en tu factura médica.',
    mriChargeTitle: 'Cargo de resonancia (MRI)',
    duplicateNotice:
      'Este cargo parece ser un cobro duplicado de un servicio ya pagado por tu seguro médico.',
    billSourceLabel: 'Fuente: Factura del hospital + reclamo del seguro',
    chatPlaceholder: 'Pregúntale a Beni sobre coberturas, facturas o ayudas...',
    askBeniTitle: 'Pregúntale a Beni',
    askBeniSub: 'Asistente de beneficios con fuentes documentales visibles',
    sourcesLabel: 'Fuentes:',
    langWelcome:
      'Beni está aquí para ayudarte a entender tus beneficios y resolver dudas sobre tus facturas médicas.',
    langGreeting: 'Hola,',
    selectLanguage: 'Elige tu idioma',
    demoPersonaTitle: 'Personas de demostración:',
    switchPersona: 'Cambiar miembro',
    medicareNotSure: 'No estoy seguro. Llama al 1-800-MEDICARE.',
    medicaidNotSure:
      'No estoy seguro. Contacta a Servicios al Miembro de HarborCare al 1-855-355-5777.',
    myAccount: 'Mi cuenta',
    alerts: 'Alertas',
    doctorFinderTitle: 'Buscar médicos en tu red',
    doctorFinderSub: 'Basado en tu código postal y plan médico verificado',
    digitalWalletTitle: 'Billetera digital de beneficios',
    digitalWalletSub: 'Tarjetas de miembro, datos Rx y saldo FSA en un solo lugar',
    inNetworkNotice: 'En red para',
    connectApi: 'Conectar API de plan médico',
    apiSyncComplete: 'Sincronizado vía API CMS Interoperability FHIR',

    loginTagline: 'TUS BENEFICIOS. A SIMPLE VISTA.',
    loginSub: 'Inicia sesión para conectar tu seguro, auditar facturas médicas y encontrar ahorros.',
    loginDemoProfiles: 'Perfiles de demostración (Hackathon):',
    loginEmailOrPhone: 'Correo o teléfono',
    loginPassword: 'Contraseña',
    loginSignInBtn: 'Ingresar a beniFIT',
    loginZeroAssumptions: 'Cero suposiciones. Nunca deducimos tus ingresos por tu teléfono.',
    loginDemoPasswordNotice: 'Contraseña para cuentas demo:',
    loginOrEmail: 'O inicia sesión con correo',

    incomeHeaderLabel: 'Ingreso:',
    editIncomeBtn: 'Editar ingreso',
    step1IncomeTitle: '1. Dinos cuánto ganas (Nunca asumido)',
    step1RequiredBadge: 'Requerido',
    step1IncomePrompt: 'Beni nunca asume tus ingresos por tu número o código postal. Ingresa las ganancias de tu hogar para calcular tus beneficios exactos en Nueva York:',
    monthSuffix: '/ mes',
    householdSizeLabel: 'Personas en el hogar',
    nyZipLabel: 'Código postal de NY',
    personSingle: 'Persona',
    peoplePlural: 'Personas',
    step2ConnectTitle: '2. Conecta seguro y documentos:',
    cmsInteroperabilityTitle: 'API CMS Interoperabilidad',
    cmsInteroperabilitySub: 'Sincronizado mediante Patient Access API',
    syncApiBtn: 'Sincronizar API',
    claimsCountLabel: 'reclamos',
    auditedFlaggedLabel: 'Detectado',
    verifyAndContinueBtn: 'Verificar ingreso y ver ahorros →',

    filterAll: 'Todos',
    plannerPlaceholder: 'Ej. Resonancia de seguimiento, control de insulina...',

    tabDiscrepancies: 'Auditoría de errores (1)',
    tabWallet: 'Billetera digital de salud',
    nyBalanceLawTitle: 'Protección contra facturación sorpresa de Nueva York',
    nyBalanceLawDesc: 'Bajo la Ley de Salud Pública de NY § 2807-k, los hospitales y proveedores de la red no pueden cobrar a los pacientes servicios duplicados denegados.',

    verifiedNetworkBadge: 'Red verificada',
    specialtyLabel: 'Especialidad médica',
    zipInputLabel: 'Tu código postal verificado',
    searchBtn: 'Buscar',
    planNetworkLabel: 'Plan:',
    inNetworkOnlyBtn: 'Solo dentro de la red',
    searchingDoctorsTitle: 'Buscando en el directorio de proveedores de NY...',
    searchingDoctorsSub: 'Consultando registro NPI y comparando con',
    foundDoctorsNear: 'Médicos en la red encontrados cerca de',
    withinMiles: 'En un radio de 5 millas',
    inNetworkBadge: 'En la red',
    callDoctorBtn: 'Llamar',
    directionsBtn: 'Cómo llegar',
    doctorDisclaimerTitle: 'Recordatorio de Beni:',
    doctorDisclaimerText: 'Los directorios médicos cambian con frecuencia. Al llamar a la recepción para agendar, confirma que acepten tu plan específico:',

    specPrimaryCare: 'Atención primaria / Médico familiar',
    specCardiologist: 'Cardiología (Corazón)',
    specObGyn: 'Ginecología y obstetricia (Mujer)',
    specPediatrician: 'Pediatría (Salud infantil)',
    specEndocrinologist: 'Endocrinología (Diabetes/Tiroides)',
    specOrthopedics: 'Ortopedia / Medicina deportiva',
    specMentalHealth: 'Salud mental / Terapia',

    digitalIdBadge: 'Identificación Digital beniFIT',
    memberNameLabel: 'Nombre del miembro',
    memberIdLabel: 'Nº de miembro',
    rxBinLabel: 'Rx BIN',
    rxPcnLabel: 'Rx PCN',
    groupNumLabel: 'Nº de grupo',
    pcpCopayLabel: 'Copago médico',
    specialistCopayLabel: 'Especialista',
    genericRxCopayLabel: 'Medicamentos genéricos',
    erCopayLabel: 'Emergencias',
    deductibleLabel: 'Deducible en la red:',
    deductibleMetLabel: 'Cumplido',
    showClinicCode: 'Mostrar código de recepción',
    hideClinicCode: 'Ocultar código de recepción',
    tapToScan: 'Toca para escanear en recepción',
    receptionScannerCode: 'Código de escaneo en clínica',
    fsaCardTitle: 'Cuenta de gastos flexibles (FSA)',
    fsaAvailableBalance: 'Saldo disponible no gastado',
    fsaExpiresLabel: 'Vence',
    fsaWhatCanIBuy: '¿Qué puedo comprar?',
    fsaHideItems: 'Ocultar artículos elegibles',
    fsaEligibleTitle: 'Elegible con tu saldo:',
    fsaItem1: 'Lentes recetados',
    fsaItem2: 'Protector solar SPF 30+',
    fsaItem3: 'Botiquín de primeros auxilios y vendas',
    fsaItem4: 'Medicamentos sin receta (dolor)',
    fsaItem5: 'Limpiezas dentales y copagos',
    fsaItem6: 'Monitores de presión arterial',

    accountCoverageProfile: 'Perfil de cobertura y elegibilidad',
    activeMemberBadge: 'Miembro activo',
    verifiedHouseholdIncomeTitle: 'Ingreso familiar verificado',
    incomeNoGuessNotice: 'Verificado directamente por ti. Beni nunca adivina tus ingresos a partir de números de teléfono.',
    lastAutoSyncLabel: 'Última sincronización automática:',
    manageApiConnectionBtn: 'Gestionar conexión API de seguro',
    alertPrefsLabel: 'Notificaciones y alertas',
    alertsActiveStatus: 'Activo (Errores y FSA)',
    alertsPausedStatus: 'Pausado',
    configureBtn: 'Configurar',
    switchJudgePersona: 'Cambiar perfil demo (Presentación):',
    logOutBtn: 'Cerrar sesión',
    doneBtn: 'Listo',

    alertsModalTitle: 'Sistema de alertas proactivas',
    alertsModalSub: 'Monitoreo automático de facturas y beneficios',
    alertsIntroDesc: 'Beni audita constantemente reclamos entrantes, facturas hospitalarias y fechas límite de Nueva York para proteger tu dinero antes de que venza o pase a cobranzas.',
    enableAlertsMaster: 'Activar alertas proactivas',
    enableAlertsMasterSub: 'Interruptor general de notificaciones eSMS',
    alertTypeDuplicate: '🚨 Cobros duplicados y errores de código',
    alertTypeDuplicateSub: 'Alerta cuando la factura excede la tarifa acordada',
    alertTypeFsa: '⏳ Vencimiento de fondos FSA',
    alertTypeFsaSub: 'Avisa 30 días antes de perder el dinero no usado',
    alertTypeRenewal: '📋 Recordatorios de recertificación anual',
    alertTypeRenewalSub: 'Alertas de renovación para Medicaid y Plan Esencial',
    alertTypeSms: '💬 Alertas de texto por SMS',
    alertTypeSmsSub: 'Envía alertas de alta prioridad directamente a tu teléfono móvil',
    smsPhoneInputLabel: 'Teléfono móvil para alertas SMS',
    smsPhoneInputSub: 'Alertas SMS reales enviadas a tu teléfono vía Twilio Gateway',
    smsSendTestBtn: 'Enviar alerta SMS real ahora',
    smsSendingBtn: 'Enviando SMS...',
    smsSuccessNotice: '✓ ¡Alerta de prueba enviada con éxito a tu teléfono!',
    quietHoursTitle: 'Horas de descanso de NYC activas:',
    quietHoursSub: '10:00 PM – 8:00 AM. Avisos no urgentes se envían en la mañana.',
    liveDemoTriggerTitle: 'Demostración en vivo',
    liveDemoTriggerSub: 'Prueba el motor de alertas proactivas ahora mismo simulando una detección.',
    simulateLiveAlertBtn: 'Simular alerta en vivo ahora',
    savePreferencesBtn: 'Guardar preferencias',

    smsIncomingHeader: 'Alerta beniFIT • +1 (800) 236-4348',
    smsMessagesNow: 'MENSAJES • ahora',
    smsTapToReview: 'Toca para revisar la carta de reclamo',

    disputeModalHeader: 'Detalles del cargo',
    providerBilledLabel: 'Facturado por el hospital:',
    insuranceShareLabel: 'Responsabilidad según seguro:',
    duplicateDiscrepancyLabel: 'Discrepancia por cobro duplicado:',
    findingsLabel: 'Hallazgos:',
    sourceDocumentsLabel: 'Documentos fuente:',
    draftedDisputeLetterLabel: 'Carta de reclamo redactada:',
    closeBtn: 'Cerrar',

    updateIncomeTitle: 'Actualiza tu ingreso verificado',
    monthlyIncomeBeforeTaxes: 'Ingreso familiar mensual (antes de impuestos)',
    cancelBtn: 'Cancelar',
    recalculateSavingsBtn: 'Recalcular ahorros',

    apiConnectHeader: 'Conexión API del seguro',
    cmsProtocolSub: 'Protocolo de interoperabilidad CMS-9115-F',
    fhirProtocolTitle: 'Acceso directo del paciente HL7® FHIR® R4',
    fhirProtocolDesc: 'La ley federal exige a las aseguradoras ofrecer acceso automatizado vía API FHIR a reclamos, formulario de medicamentos y explicaciones de beneficios (EOB).',
    selectHealthPlanPrompt: 'Selecciona tu plan de salud o portal:',
    liveInteroperabilityStatus: 'Estado de interoperabilidad en vivo',
    tokenActiveBadge: 'Token activo',
    authSmartFhir: 'Autenticando token OAuth SMART-on-FHIR...',
    queryingBundlesStatus: 'Consultando paquetes de cobertura y reclamos...',
    resyncApiLiveBtn: 'Re-sincronizar API en vivo',

    readingDocsText: 'Beni está consultando tus documentos y beneficios de NYC...',
    chipMriBill: '¿Es correcta mi factura de resonancia?',
    chipWhatMissing: '¿Qué beneficios me faltan?',
    chipFoodHelp: '¿Ayuda para alimentos?',
    chipSafetyTest: '🛡️ Prueba de rechazo médico',
  },
  fr: {
    appName: 'beniFIT',
    tagline: 'Vos avantages. En toute clarté.',
    subTagline: 'Petites trouvailles. Grand soulagement.',
    navHome: 'Accueil',
    navPlanner: 'Planning',
    navBills: 'Factures',
    navChat: 'Demander à Beni',
    navConnect: 'Connecter',
    navDoctors: 'Médecins',
    navWallet: 'Portefeuille',
    navLanguage: 'Langue',
    demoDataLabel: 'Données de démo',
    infoNotAdvice: 'Information, pas un conseil médical ou juridique.',
    mayQualify: 'Éligibilité possible',
    confirmed: 'Confirmé',
    totalPotential: 'économies et avantages potentiels totaux',
    notConfirmed: 'non confirmé',
    fromDocuments: 'selon vos documents',
    whatsBeniFound: 'Voici ce que Beni a trouvé :',
    getStarted: 'Commencer →',
    viewDetails: 'Voir les détails',
    call: 'Appeler',
    openApp: 'Ouvrir l’app',
    claimIt: 'Réclamer',
    apply: 'Postuler',
    learnMore: 'En savoir plus',
    draftMessage: 'Rédiger réclamation',
    copyLetter: 'Copier la lettre',
    copied: 'Copié !',
    emailBilling: 'Contacter la facturation',
    callBilling: 'Appeler la facturation',
    connectTitle: 'Bonjour !',
    connectSub:
      'Connectez votre assurance santé, vos avantages d’entreprise et vos factures pour que Beni trouve des économies.',
    healthInsurance: 'Assurance santé',
    employerBenefits: 'Avantages employeur',
    medicalBills: 'Factures médicales',
    connectedNotice: 'Connecté : ClearPath PPO (4 réclamations trouvées)',
    plannerTitle: 'Votre plan d’économies',
    plannerSub: 'Voici les prochaines étapes possibles.',
    whatsComingUp: 'Quel rendez-vous avez-vous prévu ?',
    add: 'Ajouter',
    billCheckTitle: 'Vérification de facture',
    billCheckSub: 'Nous avons identifié une anomalie sur votre facture médicale.',
    mriChargeTitle: 'Frais d’IRM',
    duplicateNotice:
      'Ce montant semble être une facturation en double pour un soin déjà réglé par votre assurance.',
    billSourceLabel: 'Source : Facture d’hôpital + dossier d’assurance',
    chatPlaceholder: 'Posez une question sur vos droits, factures ou aides...',
    askBeniTitle: 'Demander à Beni',
    askBeniSub: 'Assistant IA avec citations vérifiables',
    sourcesLabel: 'Sources :',
    langWelcome:
      'Beni est là pour vous aider à comprendre vos droits et éclaircir vos factures médicales.',
    langGreeting: 'Bonjour,',
    selectLanguage: 'Choisissez votre langue',
    demoPersonaTitle: 'Profils de démonstration :',
    switchPersona: 'Changer de profil',
    medicareNotSure: 'Je ne suis pas certain. Appelez le 1-800-MEDICARE.',
    medicaidNotSure:
      'Je ne suis pas certain. Contactez le service membre HarborCare au 1-855-355-5777.',
    myAccount: 'Mon compte',
    alerts: 'Alertes',
    doctorFinderTitle: 'Trouver un médecin conventionné',
    doctorFinderSub: 'Selon votre code postal et votre réseau d’assurance',
    digitalWalletTitle: 'Portefeuille de droits santé',
    digitalWalletSub: 'Carte d’assuré, numéros Rx et solde FSA simplifiés',
    inNetworkNotice: 'Dans le réseau pour',
    connectApi: 'Connecter API mutuelle/assurance',
    apiSyncComplete: 'Synchronisé via l’API CMS Interoperability FHIR',

    loginTagline: 'VOS AVANTAGES. EN TOUTE CLARTÉ.',
    loginSub: 'Connectez-vous pour auditer vos factures médicales et débloquer des aides.',
    loginDemoProfiles: 'Profils de démonstration (Hackathon) :',
    loginEmailOrPhone: 'Courriel ou téléphone',
    loginPassword: 'Mot de passe',
    loginSignInBtn: 'Se connecter à beniFIT',
    loginZeroAssumptions: 'Zéro supposition. Nous ne devinons jamais vos revenus d’après votre numéro.',
    loginDemoPasswordNotice: 'Mot de passe pour les comptes de démo :',
    loginOrEmail: 'Ou connectez-vous par courriel',

    incomeHeaderLabel: 'Revenu :',
    editIncomeBtn: 'Modifier',
    step1IncomeTitle: '1. Renseignez vos revenus réels (Jamais supposés)',
    step1RequiredBadge: 'Requis',
    step1IncomePrompt: 'Beni ne devine jamais vos revenus d’après votre numéro ou code postal. Entrez les gains de votre foyer pour calculer vos droits exacts à New York :',
    monthSuffix: '/ mois',
    householdSizeLabel: 'Taille du foyer',
    nyZipLabel: 'Code postal NY',
    personSingle: 'Personne',
    peoplePlural: 'Personnes',
    step2ConnectTitle: '2. Connectez assurance et documents :',
    cmsInteroperabilityTitle: 'API CMS Interopérabilité',
    cmsInteroperabilitySub: 'Synchronisé via Patient Access API',
    syncApiBtn: 'Synchroniser API',
    claimsCountLabel: 'dossiers',
    auditedFlaggedLabel: 'Anomalie',
    verifyAndContinueBtn: 'Vérifier revenus et voir les économies →',

    filterAll: 'Tous',
    plannerPlaceholder: 'Ex. Contrôle IRM, renouvellement insuline...',

    tabDiscrepancies: 'Audit des anomalies (1)',
    tabWallet: 'Portefeuille de droits santé',
    nyBalanceLawTitle: 'Protection légale contre la facturation abusive de New York',
    nyBalanceLawDesc: 'Selon l’article § 2807-k de la loi de santé publique de NY, les hôpitaux du réseau ne peuvent pas facturer des lignes de soins doublons déjà traitées.',

    verifiedNetworkBadge: 'Réseau vérifié',
    specialtyLabel: 'Spécialité médicale',
    zipInputLabel: 'Votre code postal de référence',
    searchBtn: 'Rechercher',
    planNetworkLabel: 'Réseau :',
    inNetworkOnlyBtn: 'Conventionné uniquement',
    searchingDoctorsTitle: 'Recherche dans l’annuaire des praticiens de NY...',
    searchingDoctorsSub: 'Interrogation du registre NPI et correspondance avec',
    foundDoctorsNear: 'Médecins conventionnés trouvés près de',
    withinMiles: 'Dans un rayon de 5 miles',
    inNetworkBadge: 'Conventionné',
    callDoctorBtn: 'Appeler',
    directionsBtn: 'Itinéraire',
    doctorDisclaimerTitle: 'Rappel de Beni :',
    doctorDisclaimerText: 'Les annuaires médicaux changent fréquemment. Lors de votre prise de rendez-vous téléphonique, confirmez l’adhésion à votre contrat spécifique :',

    specPrimaryCare: 'Médecine générale / Médecin de famille',
    specCardiologist: 'Cardiologie (Cœur)',
    specObGyn: 'Gynécologie et obstétrique',
    specPediatrician: 'Pédiatrie (Enfance)',
    specEndocrinologist: 'Endocrinologie (Diabète/Thyroïde)',
    specOrthopedics: 'Orthopédie / Médecine du sport',
    specMentalHealth: 'Santé mentale / Psychothérapie',

    digitalIdBadge: 'Identifiant Numérique beniFIT',
    memberNameLabel: 'Nom de l’assuré',
    memberIdLabel: 'N° d’assuré',
    rxBinLabel: 'Rx BIN',
    rxPcnLabel: 'Rx PCN',
    groupNumLabel: 'N° de groupe',
    pcpCopayLabel: 'Ticket modérateur généraliste',
    specialistCopayLabel: 'Spécialiste',
    genericRxCopayLabel: 'Médicaments génériques',
    erCopayLabel: 'Urgences',
    deductibleLabel: 'Franchise annuelle :',
    deductibleMetLabel: 'Atteint',
    showClinicCode: 'Afficher code d’enregistrement',
    hideClinicCode: 'Masquer code d’enregistrement',
    tapToScan: 'Toucher pour scanner à l’accueil',
    receptionScannerCode: 'Code scanner d’accueil médical',
    fsaCardTitle: 'Compte de dépenses santé (FSA)',
    fsaAvailableBalance: 'Solde disponible non utilisé',
    fsaExpiresLabel: 'Expire le',
    fsaWhatCanIBuy: 'Quels achats sont éligibles ?',
    fsaHideItems: 'Masquer la liste',
    fsaEligibleTitle: 'Éligible avec votre solde :',
    fsaItem1: 'Lunettes de vue avec correction',
    fsaItem2: 'Crème solaire FPS 30+',
    fsaItem3: 'Trousses de premiers secours et pansements',
    fsaItem4: 'Antidouleurs en vente libre',
    fsaItem5: 'Soins et détartrages dentaires',
    fsaItem6: 'Tensiomètres et glucomètres',

    accountCoverageProfile: 'Profil de couverture et d’éligibilité',
    activeMemberBadge: 'Assuré actif',
    verifiedHouseholdIncomeTitle: 'Revenu du foyer vérifié',
    incomeNoGuessNotice: 'Explicitement vérifié par vos soins. Beni ne déduit jamais vos revenus de votre numéro de téléphone.',
    lastAutoSyncLabel: 'Dernière synchronisation automatique :',
    manageApiConnectionBtn: 'Gérer la connexion API assurance',
    alertPrefsLabel: 'Préférences d’alertes',
    alertsActiveStatus: 'Actif (Anomalies et FSA)',
    alertsPausedStatus: 'En pause',
    configureBtn: 'Configurer',
    switchJudgePersona: 'Changer de profil démo (Jury) :',
    logOutBtn: 'Déconnexion',
    doneBtn: 'Terminé',

    alertsModalTitle: 'Système d’alertes proactives',
    alertsModalSub: 'Surveillance automatique des factures et aides',
    alertsIntroDesc: 'Beni vérifie en temps réel les réclamations, factures hospitalières et délais de renouvellement à New York pour protéger votre budget.',
    enableAlertsMaster: 'Activer les alertes proactives',
    enableAlertsMasterSub: 'Interrupteur principal des notifications et SMS',
    alertTypeDuplicate: '🚨 Doublons et anomalies de codage',
    alertTypeDuplicateSub: 'Alerte si la facture dépasse le tarif conventionné',
    alertTypeFsa: '⏳ Expiration des fonds FSA',
    alertTypeFsaSub: 'Avertit 30 jours avant la perte définitive du solde',
    alertTypeRenewal: '📋 Renouvellement annuel des droits',
    alertTypeRenewalSub: 'Rappels de renouvellement pour Medicaid et Essential Plan',
    alertTypeSms: '💬 Alertes par SMS',
    alertTypeSmsSub: 'Envoie les notifications urgentes directement sur votre portable',
    smsPhoneInputLabel: 'Numéro de portable pour alertes SMS',
    smsPhoneInputSub: 'SMS réels envoyés sur votre téléphone via Twilio Gateway',
    smsSendTestBtn: 'Envoyer une vraie alerte SMS maintenant',
    smsSendingBtn: 'Envoi du SMS en cours...',
    smsSuccessNotice: '✓ Alerte SMS de test envoyée avec succès sur votre téléphone !',
    quietHoursTitle: 'Heures silencieuses de NYC actives :',
    quietHoursSub: '22h00 – 8h00. Les alertes non urgentes sont transmises le matin.',
    liveDemoTriggerTitle: 'Démonstration en direct',
    liveDemoTriggerSub: 'Testez le moteur d’alerte dès maintenant en simulant une détection d’anomalie.',
    simulateLiveAlertBtn: 'Simuler une alerte en direct',
    savePreferencesBtn: 'Enregistrer mes préférences',

    smsIncomingHeader: 'Alerte beniFIT • +1 (800) 236-4348',
    smsMessagesNow: 'MESSAGES • maintenant',
    smsTapToReview: 'Toucher pour ouvrir la lettre de réclamation',

    disputeModalHeader: 'Détails de la facturation',
    providerBilledLabel: 'Facturé par l’établissement :',
    insuranceShareLabel: 'Prise en charge conventionnée :',
    duplicateDiscrepancyLabel: 'Montant en double contesté :',
    findingsLabel: 'Constat :',
    sourceDocumentsLabel: 'Pièces justificatives :',
    draftedDisputeLetterLabel: 'Lettre de réclamation générée :',
    closeBtn: 'Fermer',

    updateIncomeTitle: 'Mettre à jour vos revenus vérifiés',
    monthlyIncomeBeforeTaxes: 'Revenu mensuel du foyer (avant impôts)',
    cancelBtn: 'Annuler',
    recalculateSavingsBtn: 'Recalculer les économies',

    apiConnectHeader: 'Connexion API de l’assurance',
    cmsProtocolSub: 'Protocole d’interopérabilité CMS-9115-F',
    fhirProtocolTitle: 'Accès patient direct HL7® FHIR® R4',
    fhirProtocolDesc: 'La réglementation fédérale oblige les assureurs à fournir un accès API automatisé à vos réclamations et remboursements.',
    selectHealthPlanPrompt: 'Sélectionnez votre organisme de santé :',
    liveInteroperabilityStatus: 'État de la liaison en direct',
    tokenActiveBadge: 'Jeton actif',
    authSmartFhir: 'Authentification du jeton OAuth SMART-on-FHIR...',
    queryingBundlesStatus: 'Lecture des flux de couverture et réclamations...',
    resyncApiLiveBtn: 'Resynchroniser l’API en direct',

    readingDocsText: 'Beni consulte vos documents et les droits de santé de NYC...',
    chipMriBill: 'Ma facture d’IRM est-elle exacte ?',
    chipWhatMissing: 'Quelles aides me manquent ?',
    chipFoodHelp: 'Aide alimentaire ?',
    chipSafetyTest: '🛡️ Test de refus médical',
  },
  uk: {
    appName: 'beniFIT',
    tagline: 'Ваші пільги. Як на долоні.',
    subTagline: 'Маленькі знахідки. Велике полегшення.',
    navHome: 'Головна',
    navPlanner: 'Планер',
    navBills: 'Рахунки',
    navChat: 'Запитати Бені',
    navConnect: 'Підключити',
    navDoctors: 'Лікарі',
    navWallet: 'Гаманець',
    navLanguage: 'Мова',
    demoDataLabel: 'Демо-дані',
    infoNotAdvice: 'Інформація, а не юридична чи медична порада.',
    mayQualify: 'Можливе право',
    confirmed: 'Підтверджено',
    totalPotential: 'загальна потенційна економія та пільги',
    notConfirmed: 'не підтверджено',
    fromDocuments: 'згідно з вашими документами',
    whatsBeniFound: 'Ось що знайшов Бені:',
    getStarted: 'Почати →',
    viewDetails: 'Детальніше',
    call: 'Зателефонувати',
    openApp: 'Відкрити додаток',
    claimIt: 'Отримати',
    apply: 'Подати заявку',
    learnMore: 'Дізнатися більше',
    draftMessage: 'Скласти лист',
    copyLetter: 'Скопіювати',
    copied: 'Скопійовано!',
    emailBilling: 'Написати у бухгалтерію',
    callBilling: 'Зателефонувати у відділ',
    connectTitle: 'Привіт!',
    connectSub:
      'Підключіть медичну страховку, пільги від роботодавця та рахунки, щоб Бені міг знайти заощадження.',
    healthInsurance: 'Медичне страхування',
    employerBenefits: 'Пільги від роботодавця',
    medicalBills: 'Медичні рахунки',
    connectedNotice: 'Підключено: SilverPath Medicare (3 рахунки)',
    plannerTitle: 'Ваш план заощаджень',
    plannerSub: 'Ось що можна зробити далі.',
    whatsComingUp: 'Що заплановано у вашому календарі?',
    add: 'Додати',
    billCheckTitle: 'Перевірка рахунку',
    billCheckSub: 'Ми знайшли можливу помилку у вашому медичному рахунку.',
    mriChargeTitle: 'Оплата за МРТ',
    duplicateNotice:
      'Цей платіж є повторним нарахуванням за послугу, яку вже покрила ваша страховка.',
    billSourceLabel: 'Джерело: Рахунок лікарні + страхова виписка',
    chatPlaceholder: 'Запитайте Бені про страховку, рахунки або програми NY...',
    askBeniTitle: 'Запитати Бені',
    askBeniSub: 'ШІ-помічник із посиланнями на офіційні документи',
    sourcesLabel: 'Джерела:',
    langWelcome:
      'Бені допоможе розібратися з пільгами та перевірити медичні рахунки.',
    langGreeting: 'Вітаємо,',
    selectLanguage: 'Оберіть мову',
    demoPersonaTitle: 'Демо-профілі:',
    switchPersona: 'Змінити профіль',
    medicareNotSure: 'Я не впевнений. Зателефонуйте 1-800-MEDICARE.',
    medicaidNotSure:
      'Я не впевнений. Зверніться до служби підтримки HarborCare за номером 1-855-355-5777.',
    myAccount: 'Мій профіль',
    alerts: 'Сповіщення',
    doctorFinderTitle: 'Знайти лікаря у мережі',
    doctorFinderSub: 'За вашим поштовим індексом та планом страхування',
    digitalWalletTitle: 'Цифровий гаманець пільг',
    digitalWalletSub: 'Картка застрахованого, Rx-номери та баланс FSA',
    inNetworkNotice: 'У мережі для',
    connectApi: 'Підключити API страхової',
    apiSyncComplete: 'Синхронізовано через CMS Interoperability FHIR API',

    loginTagline: 'ВАШІ ПІЛЬГИ. ЯК НА ДОЛОНІ.',
    loginSub: 'Увійдіть, щоб перевірити медичні рахунки та знайти державні виплати.',
    loginDemoProfiles: 'Демо-профілі (Хакатон):',
    loginEmailOrPhone: 'Email або номер телефону',
    loginPassword: 'Пароль',
    loginSignInBtn: 'Увійти в beniFIT',
    loginZeroAssumptions: 'Жодних припущень. Ми ніколи не оцінюємо ваш дохід за номером телефону.',
    loginDemoPasswordNotice: 'Пароль для всіх демо-акаунтів:',
    loginOrEmail: 'Або увійдіть за допомогою email',

    incomeHeaderLabel: 'Дохід:',
    editIncomeBtn: 'Змінити',
    step1IncomeTitle: '1. Вкажіть ваш реальний дохід (Без припущень)',
    step1RequiredBadge: 'Обов’язково',
    step1IncomePrompt: 'Бені ніколи не вгадує ваш дохід за телефоном чи індексом. Введіть місячний дохід сім’ї для точного розрахунку програм Нью-Йорка:',
    monthSuffix: '/ місяць',
    householdSizeLabel: 'Кількість осіб у сім’ї',
    nyZipLabel: 'Поштовий індекс NY',
    personSingle: 'Особа',
    peoplePlural: 'Осіб',
    step2ConnectTitle: '2. Підключіть страховку та документи:',
    cmsInteroperabilityTitle: 'API CMS Interoperability',
    cmsInteroperabilitySub: 'Синхронізовано через Patient Access API',
    syncApiBtn: 'Синхронізувати API',
    claimsCountLabel: 'виписок',
    auditedFlaggedLabel: 'Помилка',
    verifyAndContinueBtn: 'Підтвердити дохід і переглянути економію →',

    filterAll: 'Всі',
    plannerPlaceholder: 'Наприклад: контрольне МРТ, перевірити інсулін...',

    tabDiscrepancies: 'Перевірка помилок (1)',
    tabWallet: 'Цифровий гаманець здоров’я',
    nyBalanceLawTitle: 'Захист штату Нью-Йорк від несподіваних медичних рахунків',
    nyBalanceLawDesc: 'Згідно зі статтею § 2807-k Закону про охорону здоров’я штату Нью-Йорк, медичні заклади мережі не мають права стягувати з пацієнтів кошти за повторні або непідтверджені послуги.',

    verifiedNetworkBadge: 'Перевірена мережа',
    specialtyLabel: 'Медична спеціальність',
    zipInputLabel: 'Ваш поштовий індекс',
    searchBtn: 'Пошук',
    planNetworkLabel: 'План:',
    inNetworkOnlyBtn: 'Тільки у мережі плану',
    searchingDoctorsTitle: 'Пошук у реєстрі лікарів Нью-Йорка...',
    searchingDoctorsSub: 'Запит до бази NPI та звірка з планом',
    foundDoctorsNear: 'Знайдено лікарів у мережі поблизу',
    withinMiles: 'У радіусі 5 миль',
    inNetworkBadge: 'У мережі',
    callDoctorBtn: 'Дзвінок',
    directionsBtn: 'Маршрут',
    doctorDisclaimerTitle: 'Нагадування від Бені:',
    doctorDisclaimerText: 'Мережі лікарів оновлюються. Під час телефонного запису обов’язково підтвердіть, що клініка приймає саме ваш план:',

    specPrimaryCare: 'Сімейний лікар / Терапевт',
    specCardiologist: 'Кардіолог (Серце)',
    specObGyn: 'Акушер-гінеколог (Жіноче здоров’я)',
    specPediatrician: 'Педіатр (Здоров’я дитини)',
    specEndocrinologist: 'Ендокринолог (Діабет/Щитоподібна)',
    specOrthopedics: 'Ортопедія / Спортивна медицина',
    specMentalHealth: 'Психотерапія / Ментальне здоров’я',

    digitalIdBadge: 'Цифровий ID beniFIT',
    memberNameLabel: 'ПІБ застрахованого',
    memberIdLabel: 'Номер ID',
    rxBinLabel: 'Rx BIN',
    rxPcnLabel: 'Rx PCN',
    groupNumLabel: 'Група №',
    pcpCopayLabel: 'Доплата за терапевта',
    specialistCopayLabel: 'Спеціаліст',
    genericRxCopayLabel: 'Генерики ліків',
    erCopayLabel: 'Невідкладна допомога',
    deductibleLabel: 'Річна франшиза в мережі:',
    deductibleMetLabel: 'Покрито',
    showClinicCode: 'Показати код для реєстратури',
    hideClinicCode: 'Сховати код реєстратури',
    tapToScan: 'Торкніться для сканування в клініці',
    receptionScannerCode: 'Код реєстратури для сканера',
    fsaCardTitle: 'Рахунок гнучких витрат (FSA)',
    fsaAvailableBalance: 'Доступний залишок коштів',
    fsaExpiresLabel: 'Діє до',
    fsaWhatCanIBuy: 'Що можна придбати?',
    fsaHideItems: 'Сховати перелік',
    fsaEligibleTitle: 'Дозволено придбати за цей залишок:',
    fsaItem1: 'Окуляри за рецептом',
    fsaItem2: 'Сонцезахисний крем SPF 30+',
    fsaItem3: 'Аптечки першої допомоги та бинти',
    fsaItem4: 'Знеболювальні препарати без рецепта',
    fsaItem5: 'Чистка зубів та стоматологічні доплати',
    fsaItem6: 'Тонометри для вимірювання тиску',

    accountCoverageProfile: 'Профіль страхування та пільг',
    activeMemberBadge: 'Активний учасник',
    verifiedHouseholdIncomeTitle: 'Підтверджений дохід сім’ї',
    incomeNoGuessNotice: 'Підтверджено особисто вами. Бені ніколи не вгадує дохід за номерами телефонів.',
    lastAutoSyncLabel: 'Остання автосинхронізація:',
    manageApiConnectionBtn: 'Керувати API підключенням страхової',
    alertPrefsLabel: 'Налаштування сповіщень',
    alertsActiveStatus: 'Активні (Помилки та FSA)',
    alertsPausedStatus: 'Призупинено',
    configureBtn: 'Налаштувати',
    switchJudgePersona: 'Змінити профіль (Демо для журі):',
    logOutBtn: 'Вийти',
    doneBtn: 'Готово',

    alertsModalTitle: 'Система проактивних сповіщень',
    alertsModalSub: 'Автоматичний моніторинг рахунків та пільг',
    alertsIntroDesc: 'Бені щодня перевіряє страхові рахунки, госпітальні нарахування та дедлайни державних програм Нью-Йорка, щоб захистити ваші гроші.',
    enableAlertsMaster: 'Увімкнути проактивні сповіщення',
    enableAlertsMasterSub: 'Головний перемикач пуш- та SMS-повідомлень',
    alertTypeDuplicate: '🚨 Подвійні нарахування та помилки кодів',
    alertTypeDuplicateSub: 'Повідомляє, якщо рахунок вищий за контрактний тариф',
    alertTypeFsa: '⏳ Завершення терміну коштів FSA',
    alertTypeFsaSub: 'Попереджає за 30 днів до згоряння невикористаних грошей',
    alertTypeRenewal: '📋 Щорічне підтвердження пільг',
    alertTypeRenewalSub: 'Нагадування про продовження Medicaid та Essential Plan',
    alertTypeSms: '💬 Текстові SMS-сповіщення',
    alertTypeSmsSub: 'Надсилання пріоритетних сповіщень на мобільний телефон',
    smsPhoneInputLabel: 'Мобільний телефон для SMS',
    smsPhoneInputSub: 'Реальні SMS на ваш телефон через шлюз Twilio',
    smsSendTestBtn: 'Надіслати реальне SMS-сповіщення зараз',
    smsSendingBtn: 'Надсилаємо SMS...',
    smsSuccessNotice: '✓ Тестове SMS успішно відправлено на ваш мобільний!',
    quietHoursTitle: 'Години тиші в NYC активні:',
    quietHoursSub: '22:00 – 8:00. Нетермінові сповіщення надходять вранці.',
    liveDemoTriggerTitle: 'Демонстрація в реальному часі',
    liveDemoTriggerSub: 'Перевірте роботу алгоритму сповіщень просто зараз, зімітувавши знайдену помилку.',
    simulateLiveAlertBtn: 'Зімітувати сповіщення зараз',
    savePreferencesBtn: 'Зберегти налаштування',

    smsIncomingHeader: 'beniFIT Сповіщення • +1 (800) 236-4348',
    smsMessagesNow: 'ПОВІДОМЛЕННЯ • зараз',
    smsTapToReview: 'Торкніться, щоб переглянути лист оскарження',

    disputeModalHeader: 'Деталі рахунку',
    providerBilledLabel: 'Нараховано лікарнею:',
    insuranceShareLabel: 'Частка за договором страхування:',
    duplicateDiscrepancyLabel: 'Помилкове подвійне нарахування:',
    findingsLabel: 'Висновки:',
    sourceDocumentsLabel: 'Офіційні документи:',
    draftedDisputeLetterLabel: 'Складений лист оскарження:',
    closeBtn: 'Закрити',

    updateIncomeTitle: 'Оновити підтверджений дохід',
    monthlyIncomeBeforeTaxes: 'Місячний дохід сім’ї (до податків)',
    cancelBtn: 'Скасувати',
    recalculateSavingsBtn: 'Перерахувати заощадження',

    apiConnectHeader: 'Підключення API страхової',
    cmsProtocolSub: 'Протокол інтероперабельності CMS-9115-F',
    fhirProtocolTitle: 'Прямий доступ пацієнта HL7® FHIR® R4',
    fhirProtocolDesc: 'Федеральний закон зобов’язує страховиків надавати автоматизований FHIR API доступ до медичних рахунків та формулярів.',
    selectHealthPlanPrompt: 'Оберіть вашу страхову компанію чи портал:',
    liveInteroperabilityStatus: 'Статус інтероперабельності наживо',
    tokenActiveBadge: 'Токен активний',
    authSmartFhir: 'Автентифікація токена SMART-on-FHIR OAuth...',
    queryingBundlesStatus: 'Запит пакетів покриття та виписок...',
    resyncApiLiveBtn: 'Пересинхронізувати API наживо',

    readingDocsText: 'Бені аналізує ваші документи та пільги штату Нью-Йорк...',
    chipMriBill: 'Чи правильний мій рахунок за МРТ?',
    chipWhatMissing: 'Які пільги я ще не отримую?',
    chipFoodHelp: 'Допомога на харчування?',
    chipSafetyTest: '🛡️ Перевірка медичної безпеки',
  },
};
