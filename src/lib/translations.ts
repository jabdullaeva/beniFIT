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
  navDoctors: string;
  navWallet: string;
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
    chatPlaceholder: 'Ask Beni about your coverage or bills...',
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
    navDoctors: 'Find Doctor',
    navWallet: 'Digital Wallet',
    myAccount: 'My Account',
    alerts: 'Alerts',
    doctorFinderTitle: 'Find In-Network Doctors',
    doctorFinderSub: 'Matched to your verified ZIP code and insurance network',
    digitalWalletTitle: 'Digital Benefits Wallet',
    digitalWalletSub: 'Member cards, Rx numbers, and FSA balance at a glance',
    inNetworkNotice: 'In-network for',
    connectApi: 'Connect Health Plan API',
    apiSyncComplete: 'Synced via CMS Interoperability FHIR API',
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
    chatPlaceholder: 'Pregúntale a Beni sobre tus facturas o ayudas...',
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
    navDoctors: 'Buscar médico',
    navWallet: 'Billetera digital',
    myAccount: 'Mi cuenta',
    alerts: 'Alertas',
    doctorFinderTitle: 'Buscar médicos en tu red',
    doctorFinderSub: 'Basado en tu código postal y plan médico verificado',
    digitalWalletTitle: 'Billetera digital de beneficios',
    digitalWalletSub: 'Tarjetas de miembro, datos Rx y saldo FSA en un solo lugar',
    inNetworkNotice: 'En red para',
    connectApi: 'Conectar API de plan médico',
    apiSyncComplete: 'Sincronizado vía API CMS Interoperability FHIR',
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
    chatPlaceholder: 'Posez une question sur votre couverture...',
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
    navDoctors: 'Médecins',
    navWallet: 'Portefeuille',
    myAccount: 'Mon compte',
    alerts: 'Alertes',
    doctorFinderTitle: 'Trouver un médecin conventionné',
    doctorFinderSub: 'Selon votre code postal et votre réseau d’assurance',
    digitalWalletTitle: 'Portefeuille de droits santé',
    digitalWalletSub: 'Carte d’assuré, numéros Rx et solde FSA simplifiés',
    inNetworkNotice: 'Dans le réseau pour',
    connectApi: 'Connecter API mutuelle/assurance',
    apiSyncComplete: 'Synchronisé via l’API CMS Interoperability FHIR',
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
    chatPlaceholder: 'Запитайте Бені про страховку чи рахунки...',
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
    navDoctors: 'Лікарі',
    navWallet: 'Гаманець',
    myAccount: 'Мій профіль',
    alerts: 'Сповіщення',
    doctorFinderTitle: 'Знайти лікаря у мережі',
    doctorFinderSub: 'За вашим поштовим індексом та планом страхування',
    digitalWalletTitle: 'Цифровий гаманець пільг',
    digitalWalletSub: 'Картка застрахованого, Rx-номери та баланс FSA',
    inNetworkNotice: 'У мережі для',
    connectApi: 'Підключити API страхової',
    apiSyncComplete: 'Синхронізовано через CMS Interoperability FHIR API',
  },
};
