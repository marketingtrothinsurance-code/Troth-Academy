import type { Course } from './types.js';

const lesson = (id:string,title:string,duration:number,type:'video'|'text'|'quiz'|'sop'='video',videoId?:string) => ({id,title,duration,type,videoId});
export const baseCourses: Omit<Course, 'status' | 'version'>[] = [
  { id:'c1', slug:'motor-insurance-fundamentals', title:'Motor Insurance Fundamentals', shortDescription:'Build a confident foundation in motor insurance products, coverage and customer conversations.', description:'A practical, role-ready program covering policy structures, essential terminology, quote comparison and the complete issuance journey.', academy:'Insurance', category:'Motor Insurance', instructor:'Ananya Mehta', difficulty:'Beginner', language:'English', duration:255, rating:4.8, learners:1248, certificate:true, required:true, color:'#215A78', thumbnail:'course-motor-insurance.png', skills:['Coverage selection','IDV & NCB','Quote comparison','Customer advisory'], updatedAt:'2026-09-12', sections:[
    {id:'s1',title:'Introduction',lessons:[lesson('l1','What is Motor Insurance?',10,'video','PE2FhkTpjj8'),lesson('l2','Why Motor Insurance Matters',8)]},
    {id:'s2',title:'Coverage',lessons:[lesson('l3','Third Party Insurance',15),lesson('l4','Comprehensive Insurance',18),lesson('l5','Own Damage Insurance',14)]},
    {id:'s3',title:'Key Concepts',lessons:[lesson('l6','Insured Declared Value (IDV)',16),lesson('l7','No Claim Bonus (NCB)',14),lesson('l8','Deductibles',12),lesson('l9','Essential Add-ons',20)]},
    {id:'s4',title:'Sales & Advisory',lessons:[lesson('l10','Understanding Customer Requirements',22),lesson('l11','Comparing Quotes',20),lesson('l12','Common Customer Objections',18)]},
    {id:'s5',title:'Process & Certification',lessons:[lesson('l13','Documentation',16,'sop'),lesson('l14','Policy Issuance',18,'sop'),lesson('l15','Renewal Process',16,'sop'),lesson('l16','Knowledge Check',18,'quiz')]}
  ]},
  {id:'c2',slug:'sales-fundamentals',title:'Sales Fundamentals',shortDescription:'A structured consultative selling framework for every customer interaction.',description:'Master the Troth sales conversation from connection and discovery through recommendation and close.',academy:'Sales',category:'Sales Excellence',instructor:'Rohan Kapoor',difficulty:'Beginner',language:'English',duration:190,rating:4.7,learners:982,certificate:true,color:'#8C5B2D',thumbnail:'course-sales-fundamentals.png',skills:['Need analysis','Consultative sales','Closing'],updatedAt:'2026-10-30',sections:[
    {id:'s21',title:'Prepare and connect',lessons:[lesson('l21','The consultative sales mindset',14,'video','Z-U88pHa4-c'),lesson('l22','Preparing for a customer conversation',14),lesson('l23','Opening with confidence and credibility',14)]},
    {id:'s22',title:'Discover customer needs',lessons:[lesson('l24','Asking effective discovery questions',18,'video','ksRq8C9GNYQ'),lesson('l25','Active listening and note-taking',14),lesson('l26','Identifying needs, priorities and buying signals',16)]},
    {id:'s23',title:'Recommend and demonstrate value',lessons:[lesson('l27','Matching solutions to customer needs',18),lesson('l28','Explaining features, benefits and value',18,'video','BxazFMjAU-c'),lesson('l29','Presenting options and compliant disclosures',16)]},
    {id:'s24',title:'Handle objections and close',lessons:[lesson('l210','Understanding and responding to objections',16),lesson('l211','The confident close and agreed next steps',16,'video','skS_z6QAD9Q'),lesson('l212','Follow-up, referrals and knowledge check',16,'quiz')]}
  ]},
  {id:'c3',slug:'annual-compliance-essentials',title:'Annual Compliance Essentials',shortDescription:'Mandatory annual conduct, data privacy and customer-protection learning.',description:'Stay current with the standards that protect customers and Troth.',academy:'Compliance',category:'Compliance & Ethics',instructor:'Priya Nair',difficulty:'Intermediate',language:'English',duration:85,rating:4.9,learners:2156,certificate:true,required:true,color:'#475467',thumbnail:'course-compliance-ethics.png',skills:['Ethics','Data protection','Customer care'],updatedAt:'2026-10-30',sections:[
    {id:'s31',title:'Conduct and ethical decisions',lessons:[lesson('l31','Code of conduct and personal accountability',10),lesson('l32','Conflicts of interest, gifts and anti-bribery',10),lesson('l33','Speaking up and non-retaliation',8)]},
    {id:'s32',title:'Customer protection',lessons:[lesson('l34','Suitability, fair dealing and avoiding mis-selling',10),lesson('l35','Disclosures, consent and complaint handling',8)]},
    {id:'s33',title:'Data and information security',lessons:[lesson('l36','Customer privacy and lawful data handling',10),lesson('l37','Phishing, passwords and secure working',8),lesson('l38','Records, retention and incident reporting',8,'sop')]},
    {id:'s34',title:'Annual certification',lessons:[lesson('l39','Compliance scenarios and final assessment',13,'quiz')]}
  ]},
  {id:'c4',slug:'health-insurance-fundamentals',title:'Health Insurance Fundamentals',shortDescription:'Understand health plans, exclusions, claims and responsible recommendations.',description:'An applied introduction to the health insurance landscape.',academy:'Insurance',category:'Health Insurance',instructor:'Ananya Mehta',difficulty:'Beginner',language:'English',duration:220,rating:4.7,learners:764,certificate:true,isNew:true,color:'#287A63',thumbnail:'course-health-insurance.png',skills:['Plan comparison','Claims','Suitability'],updatedAt:'2026-10-30',sections:[
    {id:'s41',title:'Health insurance foundations',lessons:[lesson('l41','How health insurance works',18,'video','AlD5-4qDzrA'),lesson('l42','Individual, family floater and group plans',16),lesson('l43','Key terminology: sum insured, premium and deductible',16)]},
    {id:'s42',title:'Coverage and policy conditions',lessons:[lesson('l44','Hospitalisation, day-care and pre/post-hospitalisation cover',20),lesson('l45','Exclusions and waiting periods',20),lesson('l46','Room rent, co-pay, sub-limits and restoration',18),lesson('l47','Add-ons, top-ups and critical illness cover',16)]},
    {id:'s43',title:'Customer suitability and issuance',lessons:[lesson('l48','Need analysis and choosing the right sum insured',18),lesson('l49','Proposal form, medical disclosure and underwriting',18,'sop'),lesson('l410','Comparing plans, networks and premiums',16)]},
    {id:'s44',title:'Claims and servicing',lessons:[lesson('l411','Cashless and reimbursement claims',18,'sop'),lesson('l412','Claim documents, denials and grievance escalation',16),lesson('l413','Renewal, portability and lifelong renewability',14),lesson('l414','Health insurance knowledge check',12,'quiz')]}
  ]},
  {id:'c5',slug:'crm-basics',title:'CRM Basics for Relationship Managers',shortDescription:'Manage leads, follow-ups and customer context with consistency.',description:'A guided operating system for managing the relationship lifecycle.',academy:'Operations',category:'CRM & Process',instructor:'Vikram Shah',difficulty:'Beginner',language:'English',duration:105,rating:4.6,learners:634,certificate:false,color:'#6941C6',skills:['Lead management','Follow-up','Reporting'],updatedAt:'2026-10-30',sections:[
    {id:'s51',title:'CRM foundations',lessons:[lesson('l51','Your daily workspace and CRM navigation',12),lesson('l52','Customer records, consent and data quality',12),lesson('l53','Lead sources, ownership and stages',12,'sop')]},
    {id:'s52',title:'Managing the pipeline',lessons:[lesson('l54','Creating and qualifying a lead',12,'sop'),lesson('l55','Tasks, reminders and follow-up cadence',12),lesson('l56','Notes, activities and document tracking',10)]},
    {id:'s53',title:'Customer relationships',lessons:[lesson('l57','Segmenting customers and personalising service',10),lesson('l58','Renewals, cross-sell opportunities and referrals',10),lesson('l59','Handoffs, escalation and closing records',8,'sop')]},
    {id:'s54',title:'Reporting and practice',lessons:[lesson('l510','Pipeline dashboards and activity reports',8),lesson('l511','CRM workflow knowledge check',9,'quiz')]}
  ]},
  {id:'c6',slug:'objection-handling',title:'Objection Handling Masterclass',shortDescription:'Turn uncertainty into clarity with empathetic, compliant responses.',description:'Practice objection handling for common financial-services scenarios.',academy:'Sales',category:'Customer Conversations',instructor:'Rohan Kapoor',difficulty:'Intermediate',language:'English',duration:145,rating:4.9,learners:1103,certificate:true,isNew:true,color:'#B54708',thumbnail:'course-objection-handling.png',skills:['Listening','Reframing','Negotiation'],updatedAt:'2026-10-30',sections:[
    {id:'s61',title:'Understand the objection',lessons:[lesson('l61','Why customers object',12),lesson('l62','Listen, acknowledge, clarify and respond',14),lesson('l63','Separating questions, concerns and conditions',12)]},
    {id:'s62',title:'Respond with value and evidence',lessons:[lesson('l64','Reframing around customer outcomes',14),lesson('l65','Using proof, examples and compliant comparisons',12),lesson('l66','Checking understanding without pressure',10)]},
    {id:'s63',title:'Common financial-services objections',lessons:[lesson('l67','Price, premium and fee objections',14),lesson('l68','Trust and credibility objections',12),lesson('l69','Timing and decision-maker objections',12),lesson('l610','Competitor and existing-product objections',12)]},
    {id:'s64',title:'Practice and close',lessons:[lesson('l611','Difficult conversations and de-escalation',12),lesson('l612','Role-play: insurance, loans and investments',12),lesson('l613','Agreeing next steps and following up',10),lesson('l614','Objection handling assessment',9,'quiz')]}
  ]},
  {id:'c9',slug:'customer-onboarding',title:'Customer Onboarding Excellence',shortDescription:'Deliver a clear, compliant and welcoming onboarding experience.',description:'A process-driven guide to excellent customer onboarding.',academy:'Operations',category:'Customer Service',instructor:'Vikram Shah',difficulty:'Intermediate',language:'English',duration:115,rating:4.7,learners:477,certificate:false,color:'#027A48',skills:['KYC','Documentation','Handoffs'],updatedAt:'2026-10-30',sections:[
    {id:'s91',title:'Prepare the onboarding journey',lessons:[lesson('l91','Setting expectations in the first 24 hours',12,'sop'),lesson('l92','Customer consent, communication preferences and ownership',10),lesson('l93','Product-specific onboarding plan',10)]},
    {id:'s92',title:'KYC and documentation',lessons:[lesson('l94','KYC, CKYC and identity verification checklist',12,'sop'),lesson('l95','Collecting and validating supporting documents',12,'sop'),lesson('l96','Data privacy and secure document handling',10)]},
    {id:'s93',title:'Application and activation',lessons:[lesson('l97','Application submission and quality checks',12,'sop'),lesson('l98','Partner handoff and status tracking',10),lesson('l99','Welcome communication and product activation',10)]},
    {id:'s94',title:'Service after onboarding',lessons:[lesson('l910','Resolving pending requirements and escalations',10),lesson('l911','30-day follow-up and customer education',8),lesson('l912','Onboarding quality assessment',9,'quiz')]}
  ]}
];

type InsuranceProductSpec = [slug: string, title: string, category: string];
const insuranceProductSpecs: InsuranceProductSpec[] = [
  ['marine-insurance', 'Marine Insurance', 'Commercial Insurance'],
  ['fire-insurance', 'Fire Insurance', 'Commercial Insurance'],
  ['workmen-compensation-insurance', 'Workmen Compensation Insurance', 'Commercial Insurance'],
  ['surety-bond-insurance', 'Surety Bond Insurance', 'Commercial Insurance'],
  ['package-insurance', 'Package Insurance', 'Commercial Insurance'],
  ['engineering-insurance', 'Engineering Insurance', 'Commercial Insurance'],
  ['liability-insurance', 'Liability Insurance', 'Commercial Insurance'],
  ['group-health-insurance', 'Group Health Insurance', 'Group Insurance'],
  ['employee-insurance', 'Employee Insurance', 'Group Insurance'],
  ['group-travel-insurance', 'Group Travel Insurance', 'Group Insurance'],
  ['trade-credit-insurance', 'Trade Credit Insurance', 'Commercial Insurance'],
  ['mega-risk-insurance', 'Mega Risk Insurance', 'Commercial Insurance'],
  ['car-insurance', 'Car Insurance', 'Motor Insurance'],
  ['two-wheeler-insurance', 'Two-Wheeler Insurance', 'Motor Insurance'],
  ['commercial-vehicle-insurance', 'Commercial Vehicle Insurance', 'Motor Insurance'],
  ['personal-accident-insurance', 'Personal Accident Insurance', 'Health & Accident Insurance'],
  ['property-insurance', 'Property Insurance', 'Commercial Insurance'],
  ['cyber-fraud-insurance', 'Cyber Fraud Insurance', 'Commercial Insurance'],
  ['travel-insurance', 'Travel Insurance', 'Health & Travel Insurance'],
  ['individual-health-insurance', 'Individual Health Insurance', 'Health Insurance'],
  ['top-up-mediclaim', 'Top-Up Mediclaim', 'Health Insurance'],
  ['senior-citizen-mediclaim', 'Senior Citizen Mediclaim', 'Health Insurance'],
  ['global-healthcare-insurance', 'Global Healthcare Insurance', 'Health Insurance'],
  ['family-floater-health-insurance', 'Family Floater Health Insurance', 'Health Insurance'],
  ['critical-illness-mediclaim', 'Critical Illness Mediclaim', 'Health Insurance'],
  ['term-life-insurance', 'Term Life Insurance', 'Life Insurance'],
  ['savings-life-insurance', 'Savings Life Insurance', 'Life Insurance'],
  ['child-life-insurance', 'Child Life Insurance', 'Life Insurance'],
  ['guaranteed-income-plan', 'Guaranteed Income Plan', 'Life Insurance'],
  ['money-back-plan', 'Money-Back Plan', 'Life Insurance'],
  ['unit-linked-insurance-plan', 'Unit Linked Insurance Plan (ULIP)', 'Life Insurance'],
  ['business-insurance', 'Business Insurance', 'Commercial Insurance'],
  ['pension-plan', 'Pension Plan', 'Life Insurance'],
  ['group-term-life-insurance', 'Group Term Life Insurance', 'Group Insurance']
];

const insuranceProductBanners: Record<string, string> = {
  'marine-insurance': 'course-marine-insurance.jpg',
  'fire-insurance': 'course-fire-insurance.png',
  'workmen-compensation-insurance': 'course-workmen-compensation.jpg',
  'surety-bond-insurance': 'course-surety-bond-insurance.png',
  'package-insurance': 'course-package-insurance.png',
  'engineering-insurance': 'course-engineering-insurance.png',
  'liability-insurance': 'course-liability-insurance.jpg',
  'group-health-insurance': 'course-group-health-insurance.webp',
  'employee-insurance': 'course-employee-insurance.png',
  'group-travel-insurance': 'course-group-travel-insurance.jpg',
  'business-insurance': 'course-business-insurance.jpg',
  'property-insurance': 'course-property-insurance.jpg',
  'cyber-fraud-insurance': 'course-cyber-fraud-insurance.jpg',
  'travel-insurance': 'course-travel-insurance.jpg',
  'individual-health-insurance': 'course-individual-health.jpg',
  'top-up-mediclaim': 'course-top-up-mediclaim.png',
  'global-healthcare-insurance': 'course-global-healthcare.jpg',
  'family-floater-health-insurance': 'course-family-floater.jpg',
  'critical-illness-mediclaim': 'course-critical-illness.jpg'
};

const insuranceProductVideos: Record<string, string> = {
  'marine-insurance': 'nvgYdqJPUdw',
  'fire-insurance': 'SpEZ0-R-IMc',
  'workmen-compensation-insurance': 'RtQ5sb81RN8',
  'surety-bond-insurance': 'wXEWLCCLwuM',
  'package-insurance': 'YIBlAktaZD4',
  'engineering-insurance': '0ZvtreLAJ_M',
  'liability-insurance': 'WT3_jIFL5CU',
  'group-health-insurance': 'd8DlJfzTov4',
  'employee-insurance': 'YodIw8h8wZ0',
  'group-travel-insurance': '1nPQ_KamtWU',
  'trade-credit-insurance': 'AGULgbpJeZU',
  'car-insurance': 'Nykiib7seEQ',
  'two-wheeler-insurance': '_ASk5TuTUAs',
  'commercial-vehicle-insurance': 'Nykiib7seEQ',
  'personal-accident-insurance': 'lOcg17nr_T4',
  'property-insurance': 'FGiRHkd4CLs',
  'cyber-fraud-insurance': 'YJoH3Ls6ktY',
  'travel-insurance': 'fxp8A-nzaUg',
  'individual-health-insurance': '0fb7SsSIlqM',
  'senior-citizen-mediclaim': 'jQ2roElDBis'
};

export const insuranceProductCourses: Omit<Course, 'status' | 'version'>[] = insuranceProductSpecs.map(([slug, title, category], index) => {
  const id = `ip${String(index + 1).padStart(2, '0')}`;
  const courseLessons = [
    lesson(`${id}-l1`, `${title}: purpose, customers and use cases`, 12, 'video', insuranceProductVideos[slug]),
    lesson(`${id}-l2`, `${title} policy structure and key terminology`, 14),
    lesson(`${id}-l3`, `Who and what can be insured under ${title}`, 14),
    lesson(`${id}-l4`, `Core covers and benefits in ${title}`, 16),
    lesson(`${id}-l5`, `Optional covers, extensions and add-ons`, 14),
    lesson(`${id}-l6`, `Exclusions, deductibles, limits and waiting periods`, 16),
    lesson(`${id}-l7`, `Risk assessment and customer need analysis`, 16),
    lesson(`${id}-l8`, `Sum insured, premium factors and quote comparison`, 16),
    lesson(`${id}-l9`, `${title} eligibility and suitability checklist`, 14, 'sop'),
    lesson(`${id}-l10`, `Proposal form, KYC and supporting documents`, 16, 'sop'),
    lesson(`${id}-l11`, `Underwriting, policy issuance and endorsements`, 16, 'sop'),
    lesson(`${id}-l12`, `Claims notification and required evidence`, 16, 'sop'),
    lesson(`${id}-l13`, `Claim assessment, settlement and common rejection reasons`, 16),
    lesson(`${id}-l14`, `Renewals, servicing and compliant customer communication`, 14),
    lesson(`${id}-l15`, `${title} case study and recommendation`, 16),
    lesson(`${id}-l16`, `${title} knowledge check`, 12, 'quiz')
  ];
  return {
    id, slug, title,
    shortDescription: `Learn ${title.toLowerCase()} coverage, suitability, documentation, claims and customer advisory.`,
    description: `A practical product-expertise course covering the complete ${title.toLowerCase()} customer journey, from need analysis and quotation through issuance, claims and renewal.`,
    academy: 'Insurance', category, instructor: 'Ananya Mehta', difficulty: 'Beginner', language: 'English',
    duration: courseLessons.reduce((sum, item) => sum + item.duration, 0), rating: 4.7, learners: 0, certificate: true,
    isNew: true, required: false, color: '#215A78', thumbnail: insuranceProductBanners[slug],
    skills: [category, 'Product knowledge', 'Customer advisory', 'Claims'],
    updatedAt: '2026-10-30', sections: [
      { id: `${id}-s1`, title: `${title} foundations`, lessons: courseLessons.slice(0, 3) },
      { id: `${id}-s2`, title: 'Coverage, benefits and policy conditions', lessons: courseLessons.slice(3, 6) },
      { id: `${id}-s3`, title: 'Customer assessment and product recommendation', lessons: courseLessons.slice(6, 9) },
      { id: `${id}-s4`, title: 'Quotation, documentation and policy issuance', lessons: courseLessons.slice(9, 11) },
      { id: `${id}-s5`, title: 'Claims, servicing and application', lessons: courseLessons.slice(11) }
    ]
  };
});

type LessonSpec = [title: string, minutes: number, type?: 'video' | 'text' | 'quiz' | 'sop'];
interface CuratedCourse { id: string; slug: string; title: string; shortDescription: string; description: string; academy: string; category: string;
  instructor: string; difficulty: string; color: string; skills: string[]; learners: number; rating: number }
const curatedCourse = (base: CuratedCourse, sections: [string, LessonSpec[]][], extra: Partial<Course> = {}): Omit<Course, 'status' | 'version'> => {
  const built = sections.map(([sectionTitle, specs], s) => ({ id: `${base.id}-s${s + 1}`, title: sectionTitle,
    lessons: specs.map(([t, d, type], l) => lesson(`${base.id}-s${s + 1}-l${l + 1}`, t, d, type)) }));
  return { ...base, language: 'English', duration: built.flatMap(s => s.lessons).reduce((sum, l) => sum + l.duration, 0), certificate: true,
    isNew: true, updatedAt: '2026-09-25', sections: built, ...extra };
};

const financeBanners: Record<string, string> = {
  'education-loan': 'course-education-loan.png',
  'business-loan': 'course-business-loan.png',
  'balance-transfer-process': 'course-balance-transfer.png',
  'loan-documentation-process': 'course-loan-documentation.png',
  'loan-process': 'course-loan-process.png'
};

const financeVideos: Record<string, string> = {
  'personal-loan-fundamentals': 'FgdVoq9vvRg',
  'education-loan': 'moQA0HAED-Y',
  'business-loan': 'RFwjatTBkvk',
  'balance-transfer-process': 'Rfgi6gdny5k',
  'loan-process': 'OVoMUPw4ukg'
};

const financeCourse = (id: string, slug: string, title: string, category: string, shortDescription: string, description: string, difficulty: string,
  color: string, skills: string[], sections: [string, LessonSpec[]][], extra: Partial<Course> = {}) => {
  const course = curatedCourse({ id, slug, title, shortDescription, description, academy: 'Finance', category, instructor: 'Sameer Gupta', difficulty, color, skills,
    learners: 0, rating: 4.7 }, sections, { required: false, thumbnail: financeBanners[slug], ...extra });
  const firstLesson = course.sections[0]?.lessons[0];
  if (firstLesson && financeVideos[slug]) firstLesson.videoId = financeVideos[slug];
  return course;
};

export const financeCourses: Omit<Course, 'status' | 'version'>[] = [
  financeCourse('c8', 'personal-loan-fundamentals', 'Personal Loan Fundamentals', 'Lending',
    'Learn eligibility, documentation and responsible loan matching.',
    'Product fluency for personal loan conversations: how unsecured loans are priced, how eligibility is calculated, what documents lenders need and how to recommend responsibly.',
    'Beginner', '#175CD3', ['Eligibility', 'FOIR', 'EMI calculation', 'Documentation'], [
      ['Product basics', [['What is a personal loan?', 12], ['Common uses, loan amounts and tenures', 12], ['Salaried vs self-employed borrowers', 14]]],
      ['Eligibility and pricing', [['Credit score and reading a credit report', 18], ['Eligibility and FOIR calculation', 22], ['Interest rate, processing fee and prepayment charges', 16], ['Calculating the EMI', 14]]],
      ['Documentation and process', [['Personal loan document checklist', 14, 'sop'], ['From application to disbursal', 16, 'sop'], ['Pre-approved and digital personal loans', 12]]],
      ['Advising customers', [['Responsible lending and avoiding over-borrowing', 14], ['Handling rejections and next steps', 12], ['Knowledge check', 12, 'quiz']]]
    ], { isNew: false, learners: 521, rating: 4.6, thumbnail: 'course-personal-loan.png' }),
  financeCourse('fp01', 'education-loan', 'Education Loan', 'Education Finance',
    'Fund studies in India and abroad: eligibility, co-applicants, collateral, moratorium and tax benefits.',
    'A practical guide to education loans covering domestic and study-abroad funding, student and co-applicant eligibility, collateral limits, the moratorium period, tax benefits and the documentation-to-disbursal journey.',
    'Beginner', '#0E9384', ['Student eligibility', 'Co-applicant assessment', 'Moratorium & repayment', 'Section 80E'], [
      ['Education loan basics', [['How education loans work', 12], ['Domestic vs study-abroad loans', 14], ['What the loan covers: tuition, living, travel and more', 12]]],
      ['Eligibility and structure', [['Student eligibility and admission requirements', 14], ['Co-applicant income and credit assessment', 16], ['Collateral vs non-collateral loans', 16], ['Moratorium period and repayment', 14]]],
      ['Costs and benefits', [['Interest rates, margin money and fees', 14], ['Tax deduction on interest under Section 80E', 12, 'text'], ['Government schemes and the Vidya Lakshmi portal', 12, 'text']]],
      ['Process', [['Education loan document checklist', 14, 'sop'], ['Application to disbursal, paid directly to the institution', 14, 'sop'], ['Knowledge check', 12, 'quiz']]]
    ]),
  financeCourse('fp02', 'business-loan', 'Business Loan', 'Business Finance',
    'Assess businesses, read financials and match term loans, working capital and MSME schemes.',
    'Learn how business loans work for proprietors, partnerships and companies: loan types, reading financial statements and bank statements, eligibility metrics like DSCR, government MSME schemes and the full loan process.',
    'Intermediate', '#344054', ['Financial analysis', 'DSCR', 'Working capital', 'MSME schemes'], [
      ['Types of business finance', [['Term loans vs working capital', 14], ['Overdraft and cash credit limits', 14], ['Unsecured business loans', 12], ['MSME schemes: Mudra and CGTMSE', 14, 'text']]],
      ['Assessing the business', [['Reading ITR, P&L and balance sheet', 22], ['Banking analysis and GST returns', 18], ['Eligibility metrics: DSCR, turnover and business vintage', 18], ['Credit reports for individuals and companies', 14]]],
      ['Process', [['Documents by entity type: proprietor, partnership, company', 16, 'sop'], ['Application to disbursal', 16, 'sop'], ['Recommending the right product', 14], ['Knowledge check', 12, 'quiz']]]
    ]),
  financeCourse('fp03', 'balance-transfer-process', 'Balance Transfer Process', 'Loan Services',
    'Evaluate whether a balance transfer saves money and run the transfer end to end.',
    'Step-by-step training on loan balance transfers: when a transfer makes sense, how to calculate real savings after charges, top-up loans, and the process of closing the old loan and moving documents to the new lender.',
    'Intermediate', '#B42318', ['Savings calculation', 'Top-up loans', 'Foreclosure', 'Document handover'], [
      ['Balance transfer basics', [['What is a balance transfer?', 12], ['When a transfer makes sense, and when it does not', 14], ['Balance transfer with top-up loan', 12]]],
      ['Evaluating the savings', [['Comparing interest rates and remaining tenure', 14], ['Calculating net savings after fees and charges', 18], ['Foreclosure and prepayment charges', 12, 'text']]],
      ['The transfer process', [['Getting the foreclosure letter and list of documents', 14, 'sop'], ['Sanction from the new lender', 14, 'sop'], ['Paying off the old loan and collecting original documents', 16, 'sop'], ['Closure letter, NOC and credit report update', 12, 'sop']]],
      ['Customer conversations', [['Explaining a balance transfer to customers', 14], ['Knowledge check', 12, 'quiz']]]
    ]),
  financeCourse('fp04', 'loan-documentation-process', 'Loan Documentation Process', 'Loan Operations',
    'Collect, verify and submit complete loan files: KYC, income, banking and property documents.',
    'A hands-on guide to loan documentation: what each document proves, checklists for salaried and self-employed applicants, property and collateral papers, verification, fraud red flags and submitting a clean file the first time.',
    'Beginner', '#475467', ['KYC', 'Income documents', 'Property papers', 'File quality'], [
      ['KYC documents', [['Identity and address proof', 12], ['PAN, Aadhaar e-KYC and CKYC', 14]]],
      ['Income documents', [['Salaried applicants: salary slips, Form 16, bank statements', 16], ['Self-employed applicants: ITR, financials, GST returns', 18], ['Bank statements: what lenders look for', 14]]],
      ['Property and collateral documents', [['Title deed and chain documents', 16], ['Approved plan, encumbrance certificate and tax receipts', 14], ['Legal and technical valuation', 14]]],
      ['File quality', [['Verifying documents and spotting fraud red flags', 16], ['Common discrepancies and how to fix them', 14], ['File submission checklist', 12, 'sop'], ['Knowledge check', 12, 'quiz']]]
    ]),
  financeCourse('fp05', 'loan-process', 'Loan Process', 'Loan Operations',
    'Follow a loan from first enquiry through underwriting, sanction, disbursal and closure.',
    'An end-to-end view of the loan lifecycle: lead and need analysis, application login, credit checks, verification, underwriting, sanction, agreement, disbursal and post-disbursal servicing through to closure.',
    'Beginner', '#1570EF', ['Loan lifecycle', 'Underwriting', 'Sanction & disbursal', 'Customer updates'], [
      ['Lead and need analysis', [['Sourcing and qualifying leads', 12], ['Need analysis and product fit', 14], ['Pre-eligibility check', 12]]],
      ['Application and verification', [['File login and application form', 14, 'sop'], ['Credit bureau check', 12], ['Residence and office verification', 12, 'sop']]],
      ['Underwriting and sanction', [['How credit underwriting works', 18], ['Technical and legal checks for secured loans', 14], ['Reading the sanction letter', 12]]],
      ['Disbursal and servicing', [['Loan agreement and auto-debit mandate', 14, 'sop'], ['Disbursal', 12, 'sop'], ['EMI servicing, part-payment and closure with NOC', 14]]],
      ['Customer experience', [['Turnaround times and keeping customers updated', 12], ['Knowledge check', 12, 'quiz']]]
    ])
];

const wealthVideos: Record<string, string> = {
  'mutual-funds-tutorial': 'JMV4XuuodPE',
  'sip-tutorial': '1DRq8N7SpYc',
  'swp-tutorial': 'bu1C0dd9qds'
};

const wealthCourse = (id: string, slug: string, title: string, shortDescription: string, description: string, difficulty: string,
  color: string, skills: string[], learners: number, rating: number, sections: [string, LessonSpec[]][], extra: Partial<Course> = {}) => {
  const course = curatedCourse({ id, slug, title, shortDescription, description, academy: 'Wealth', category: 'Mutual Funds', instructor: 'Kavita Joshi', difficulty,
    color, skills, learners, rating }, sections, extra);
  const firstLesson = course.sections[0]?.lessons[0];
  if (firstLesson && wealthVideos[slug]) firstLesson.videoId = wealthVideos[slug];
  return course;
};

export const wealthCourses: Omit<Course, 'status' | 'version'>[] = [
  wealthCourse('w1', 'mutual-funds-tutorial', 'Mutual Funds Tutorial',
    'Understand how mutual funds work, the main scheme types and how to match them to customer goals.',
    'A complete beginner-to-practitioner guide to mutual funds: structure, NAV, scheme categories, costs, risk and how to explain funds clearly to customers.',
    'Beginner', '#6941C6', ['Scheme categories', 'NAV & expense ratio', 'Risk-o-meter', 'Goal mapping'], 842, 4.8, [
      ['Mutual fund basics', [['What is a mutual fund?', 12], ['How a fund is structured: sponsor, trustee, AMC, RTA', 14], ['NAV and how units are priced', 15]]],
      ['Scheme categories', [['Equity funds: large, mid, small and flexi cap', 18], ['Debt funds and interest-rate risk', 18], ['Hybrid, index funds and ETFs', 16], ['ELSS and tax saving', 12]]],
      ['Costs, risk and returns', [['Expense ratio, exit load and direct vs regular plans', 15], ['Reading the riskometer and factsheet', 14, 'text'], ['Measuring returns: absolute, CAGR and XIRR', 16]]],
      ['Advising customers', [['Mapping funds to goals and risk profile', 18], ['KYC and investing through the platform', 14, 'sop'], ['Knowledge check', 15, 'quiz']]]
    ], { thumbnail: 'course-mutual-funds-tutorial.png' }),
  wealthCourse('w2', 'sip-tutorial', 'SIP Tutorial: Systematic Investment Plans',
    'Set up, explain and manage SIPs, from rupee-cost averaging to step-ups and mandates.',
    'Learn how SIPs build wealth through disciplined investing, how to show customers the power of compounding and how to register and service SIPs end to end.',
    'Beginner', '#12B76A', ['Rupee-cost averaging', 'Compounding', 'SIP step-up', 'Mandate setup'], 1034, 4.9, [
      ['SIP fundamentals', [['What is a SIP and why it works', 12], ['Rupee-cost averaging explained', 14], ['The power of compounding', 14]]],
      ['Planning with SIPs', [['Calculating the SIP needed for a goal', 18], ['SIP step-up (top-up) for rising income', 12], ['Choosing SIP date, frequency and fund', 14]]],
      ['Operations', [['Registering a SIP and auto-debit mandate (NACH/UPI AutoPay)', 16, 'sop'], ['Pausing, modifying and cancelling SIPs', 12, 'sop'], ['Handling missed instalments and failures', 10, 'sop']]],
      ['Customer conversations', [['Answering "markets are down, should I stop my SIP?"', 15], ['Knowledge check', 12, 'quiz']]]
    ], { thumbnail: 'course-sip-tutorial.png' }),
  wealthCourse('w3', 'swp-tutorial', 'SWP Tutorial: Systematic Withdrawal Plans',
    'Use SWPs to create regular income from a mutual fund corpus, with tax-aware withdrawal planning.',
    'A practical guide to Systematic Withdrawal Plans for retirees and income seekers: how SWPs work, sustainable withdrawal rates, taxation and comparison with dividends and FDs.',
    'Intermediate', '#B54708', ['Withdrawal planning', 'Capital gains tax', 'Retirement income', 'STP'], 516, 4.7, [
      ['SWP fundamentals', [['What is a SWP and who needs it', 12], ['How units are redeemed each month', 14], ['SWP vs IDCW (dividend) vs fixed deposit', 16]]],
      ['Designing a sustainable SWP', [['Choosing the corpus and fund mix', 16], ['Safe withdrawal rate and corpus longevity', 18], ['Using STP to move money from equity to debt', 14]]],
      ['Tax and operations', [['Capital gains tax on SWP withdrawals', 16, 'text'], ['Setting up and modifying a SWP', 12, 'sop']]],
      ['Case studies', [['Building a retirement income plan', 20], ['Knowledge check', 12, 'quiz']]]
    ], { thumbnail: 'course-swp-tutorial.png' }),
  wealthCourse('w4', 'nism-mutual-fund-distributor-exam', 'NISM Series V-A: Mutual Fund Distributors Exam Prep',
    'Chapter-by-chapter preparation for the NISM Series V-A certification required to distribute mutual funds.',
    'Structured preparation for the NISM Series V-A Mutual Fund Distributors certification, covering the full syllabus, regulations, taxation and practice tests, plus the steps to get your ARN after passing.',
    'Intermediate', '#0B4A6F', ['NISM V-A syllabus', 'SEBI regulations', 'Fund taxation', 'Exam strategy'], 1392, 4.8, [
      ['Getting started', [['About the exam: format, marking and passing score', 10, 'text'], ['Study plan and exam-day strategy', 10, 'text']]],
      ['Investment landscape and fund concepts', [['The investment landscape', 18], ['Concept and role of a mutual fund', 18], ['Legal structure of mutual funds in India', 20]]],
      ['Regulation and distribution', [['Legal and regulatory framework (SEBI, AMFI)', 22], ['Scheme-related information: SID, SAI, KIM', 16], ['Fund distribution and channel management', 18], ['Investor services and KYC', 16]]],
      ['Valuation, costs and taxation', [['NAV, total expense ratio and pricing of units', 20], ['Taxation of mutual funds', 18], ['Risk, return and performance of funds', 20]]],
      ['Selection and planning', [['Mutual fund scheme performance and selection', 18], ['Recommending model portfolios and financial planning', 20]]],
      ['Practice and certification', [['Chapter-wise practice questions', 30, 'quiz'], ['Full-length mock test', 60, 'quiz'], ['After passing: applying for your ARN and EUIN', 10, 'sop']]]
    ], { required: false, thumbnail: 'course-nism-mutual-fund-distributor.jpg' })
];

const salesCourse = (id: string, slug: string, title: string, category: string, shortDescription: string, description: string, difficulty: string,
  color: string, skills: string[], sections: [string, LessonSpec[]][]) =>
  curatedCourse({ id, slug, title, shortDescription, description, academy: 'Sales', category, instructor: 'Rohan Kapoor', difficulty, color, skills,
    learners: 0, rating: 4.7 }, sections, { required: false });

export const salesCourses: Omit<Course, 'status' | 'version'>[] = [
  salesCourse('sl01', 'selling-finance-101', 'Selling Finance 101: Building Trust & Value', 'Sales Foundations',
    'Basics of financial products, customer psychology and compliance essentials.',
    'The starting point for anyone selling financial products: how insurance, loans and investments meet customer needs, why people buy, how trust is built and the compliance rules every conversation must follow.',
    'Beginner', '#8C5B2D', ['Product basics', 'Customer psychology', 'Trust building', 'Compliance'], [
      ['The financial products landscape', [['What customers really buy: protection, credit and growth', 14], ['Insurance, loans and investments at a glance', 18], ['Matching products to life stages', 14]]],
      ['Customer psychology', [['Why people buy, and why they delay', 16], ['Building trust in the first five minutes', 14], ['Asking questions that uncover needs', 16]]],
      ['Creating value', [['Explaining benefits, not features', 14], ['Presenting a simple recommendation', 14]]],
      ['Compliance essentials', [['KYC, disclosures and suitability', 14, 'text'], ['What you must never promise', 12, 'text'], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl02', 'protect-and-prosper-insurance-sales', 'Protect & Prosper: Insurance Sales Strategies', 'Insurance Sales',
    'Consultative selling for life, health and general insurance.',
    'Sell insurance the consultative way: uncover protection gaps, calculate the right cover, position life, health and general insurance products and handle the objections customers raise most often.',
    'Intermediate', '#215A78', ['Need analysis', 'Human life value', 'Health cover advisory', 'Objection handling'], [
      ['Consultative insurance selling', [['Why customers under-insure', 12], ['The protection needs conversation', 16], ['Identifying protection gaps', 14]]],
      ['Life insurance', [['Term vs savings plans', 16], ['Calculating cover with human life value', 16], ['Presenting a term plan', 14]]],
      ['Health insurance', [['Individual vs family floater vs top-up', 16], ['Waiting periods, exclusions and honest disclosure', 14], ['Selling health cover to young customers', 12]]],
      ['General insurance', [['Motor, home and travel cross-sell moments', 14], ['Commercial insurance for business owners', 14]]],
      ['Closing and objections', [['"I already have cover through my employer"', 12], ['"Insurance is a waste of money"', 12], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl03', 'smart-investing-mutual-fund-sales', 'Smart Investing: Mutual Fund Sales & Advisory Skills', 'Investment Sales',
    'Explain risk, returns, SIPs and diversification to clients with clarity.',
    'Build confident mutual fund conversations: profiling risk, explaining returns realistically, making the case for SIPs, building diversified portfolios and keeping clients invested through market ups and downs.',
    'Intermediate', '#6941C6', ['Risk profiling', 'SIP selling', 'Diversification', 'Client reviews'], [
      ['The investment conversation', [['Understanding goals and time horizons', 14], ['Risk profiling that customers understand', 16], ['Distributor vs investment adviser: what you can say', 12, 'text']]],
      ['Explaining risk and returns', [['Explaining volatility without scaring clients', 14], ['Setting realistic return expectations', 14], ['Comparing funds with FDs, gold and property', 14]]],
      ['SIPs and portfolios', [['Making the case for SIPs', 14], ['Diversification across asset classes', 16], ['Simple model portfolios by goal', 14]]],
      ['Keeping clients invested', [['Handling "the market is falling" calls', 14], ['Running portfolio review meetings', 14], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl05', 'loan-solutions-banking-nbfc-sales', 'Loan Solutions: Selling Banking & NBFC Products', 'Loan Sales',
    'Needs-based selling of personal, home and business loans.',
    'Sell loans by solving the customer\'s real problem: understand the need, check eligibility early, compare bank and NBFC options and guide the customer through documentation to disbursal.',
    'Intermediate', '#175CD3', ['Needs-based selling', 'Eligibility checks', 'Bank vs NBFC', 'Loan pitching'], [
      ['Needs-based loan selling', [['Finding the need behind the loan', 14], ['Quick eligibility check before you pitch', 14], ['Banks vs NBFCs: when each fits', 14]]],
      ['Selling personal loans', [['Positioning speed, rate and flexibility', 12], ['Avoiding over-borrowing', 12]]],
      ['Selling home loans', [['Home loan eligibility and EMI conversations', 16], ['Balance transfer and top-up opportunities', 14]]],
      ['Selling business loans', [['Talking to business owners about cash flow', 14], ['Working capital vs term loan pitch', 14]]],
      ['From pitch to disbursal', [['Setting expectations on documents and timelines', 12], ['Keeping the customer updated after login', 12], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl06', 'closing-big-deals-advanced-sales', 'Closing Big Deals: Advanced Financial Sales Skills', 'Advanced Sales',
    'Negotiation, high-ticket client handling and relationship management.',
    'For experienced sales professionals: win and grow high-value clients through structured negotiation, multi-product proposals, handling decision makers and managing long-term relationships.',
    'Advanced', '#344054', ['Negotiation', 'High-net-worth clients', 'Proposal building', 'Relationship management'], [
      ['High-ticket clients', [['How high-value clients decide', 16], ['Preparing for a senior client meeting', 14], ['Working with multiple decision makers', 14]]],
      ['Negotiation', [['Negotiation principles for financial sales', 16], ['Handling price and commission pressure', 14], ['Knowing when to walk away', 12]]],
      ['Closing', [['Building a multi-product proposal', 16], ['Closing techniques that respect the client', 14], ['Role play: closing a large corporate policy', 18]]],
      ['Relationship management', [['Account planning for key clients', 14], ['Quarterly reviews and referrals', 12], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl07', 'finance-in-the-digital-age', 'Finance in the Digital Age: Online Sales & Marketing', 'Digital Sales',
    'Generate leads with LinkedIn, Meta Ads and digital campaigns.',
    'Use digital channels to find and convert customers: build a credible LinkedIn presence, run Meta ad campaigns, follow up with WhatsApp and email, and stay within advertising rules for financial products.',
    'Intermediate', '#1570EF', ['LinkedIn selling', 'Meta Ads', 'Lead nurturing', 'Campaign tracking'], [
      ['Digital selling basics', [['How customers research financial products online', 12], ['Building a trustworthy personal brand', 14]]],
      ['LinkedIn', [['Optimising your LinkedIn profile', 14], ['Content that starts conversations', 14], ['Social selling and outreach etiquette', 14]]],
      ['Meta Ads and campaigns', [['Setting up a Meta lead campaign', 18], ['Targeting, creatives and budgets', 16], ['Landing pages and lead forms', 14]]],
      ['Converting leads', [['Speed-to-lead and follow-up', 12], ['WhatsApp and email nurturing', 14], ['Tracking cost per lead and conversion', 14]]],
      ['Staying compliant online', [['Advertising rules for insurance, loans and mutual funds', 14, 'text'], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl08', 'trust-first-ethical-financial-sales', 'Trust First: Ethical & Compliant Financial Sales', 'Compliance in Sales',
    'Regulatory frameworks, transparency and long-term credibility.',
    'Understand the regulators and rules that govern financial sales, what mis-selling looks like and how transparent, suitable advice builds credibility and repeat business.',
    'Beginner', '#475467', ['Regulatory awareness', 'Suitability', 'Disclosure', 'Grievance handling'], [
      ['The regulatory framework', [['Who regulates what: IRDAI, SEBI, AMFI and RBI', 16, 'text'], ['Licences and codes of conduct for sellers', 14, 'text']]],
      ['Selling transparently', [['Suitability: the right product for the right customer', 14], ['Disclosing costs, risks and exclusions', 14], ['Recognising and avoiding mis-selling', 16]]],
      ['Customer rights', [['Free-look periods, cancellations and refunds', 12, 'text'], ['Calling rules, consent and data privacy', 12, 'text'], ['Handling complaints and grievances', 12, 'sop']]],
      ['Long-term credibility', [['Why ethical selling grows your business', 12], ['Case studies: when selling goes wrong', 16], ['Knowledge check', 12, 'quiz']]]
    ]),
  salesCourse('sl09', 'first-sale-to-lifetime-value', 'From First Sale to Lifetime Value', 'Customer Retention',
    'Renewals, upselling and customer success in financial services.',
    'Grow revenue from the customers you already have: onboarding that builds loyalty, renewal routines, review meetings that surface new needs, and ethical upselling and referrals.',
    'Intermediate', '#027A48', ['Renewals', 'Upselling', 'Customer success', 'Referrals'], [
      ['Why retention matters', [['The lifetime value of a customer', 12], ['Onboarding that builds loyalty', 14]]],
      ['Renewals', [['Building a renewal calendar', 12, 'sop'], ['Renewal conversations that prevent lapses', 14], ['Winning back lapsed customers', 12]]],
      ['Upselling and cross-selling', [['Spotting new needs in annual reviews', 14], ['Life events as upsell moments', 12], ['Upselling without pressure', 12]]],
      ['Customer success', [['Service moments that create advocates', 12], ['Asking for referrals and reviews', 12], ['Knowledge check', 12, 'quiz']]]
    ])
];

export const relationshipCourses: Omit<Course, 'status' | 'version'>[] = [
  salesCourse('rb01', 'trust-first-core-of-every-relationship', 'Trust First: The Core of Every Relationship', 'Relationship Building',
    'Honesty, reliability and consistency as the base of strong connections.',
    'Learn what trust is made of, how it is earned through honest and reliable behaviour, how it is lost, and how to rebuild it with customers, colleagues and partners.',
    'Beginner', '#0B4A6F', ['Honesty', 'Reliability', 'Consistency', 'Rebuilding trust'], [
      ['What trust is made of', [['The building blocks of trust', 12], ['Honesty: saying what is true, even when it is hard', 14], ['Reliability: doing what you said you would', 12]]],
      ['Building trust every day', [['Consistency across every interaction', 12], ['Keeping promises and managing expectations', 14], ['Transparency when things go wrong', 12]]],
      ['Repairing trust', [['How trust is lost', 12], ['Apologising and rebuilding credibility', 14], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb02', 'speak-and-listen-communication', 'Speak & Listen: Communication That Connects', 'Relationship Building',
    'Active listening, empathy and clarity in conversations.',
    'Practical communication skills for every relationship: listening actively, responding with empathy, speaking clearly and adapting your message for calls, meetings and written messages.',
    'Beginner', '#1570EF', ['Active listening', 'Empathy', 'Clarity', 'Questioning'], [
      ['Listening', [['Active listening techniques', 14], ['Asking open and follow-up questions', 12], ['Reading tone and body language', 12]]],
      ['Speaking with clarity', [['Structuring what you want to say', 12], ['Plain language over jargon', 12], ['Empathetic responses', 14]]],
      ['Across channels', [['Phone and video conversations', 12], ['Clear WhatsApp and email messages', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb03', 'eq-for-stronger-bonds', 'EQ for Stronger Bonds', 'Relationship Building',
    'Managing emotions, reading others and responding with empathy.',
    'Develop emotional intelligence for work: recognise and manage your own emotions, read how others feel, and respond with empathy in difficult or high-pressure conversations.',
    'Intermediate', '#6941C6', ['Self-awareness', 'Self-regulation', 'Empathy', 'Social awareness'], [
      ['Understanding EQ', [['What emotional intelligence is and why it matters', 12], ['The four areas of EQ', 12]]],
      ['Managing yourself', [['Recognising your emotional triggers', 14], ['Staying calm under pressure', 14], ['Handling rejection and setbacks', 12]]],
      ['Understanding others', [['Reading emotions in customers and colleagues', 14], ['Responding with empathy', 14], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb04', 'from-contacts-to-connections', 'From Contacts to Connections', 'Relationship Building',
    'Turn introductions into meaningful, long-term relationships.',
    'Build a professional network that works: make strong first impressions, follow up with purpose, stay in touch without being pushy and turn contacts into referrals and partnerships.',
    'Beginner', '#12B76A', ['Networking', 'First impressions', 'Follow-up', 'Referrals'], [
      ['Making connections', [['Where to meet the right people', 12], ['Introducing yourself with impact', 12], ['Networking at events and online', 14]]],
      ['Nurturing contacts', [['Following up within 48 hours', 10], ['Staying in touch without being pushy', 12], ['Giving value before asking', 12]]],
      ['From connection to opportunity', [['Asking for introductions and referrals', 12], ['Keeping a simple network tracker', 10, 'sop'], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb05', 'turning-conflict-into-collaboration', 'Turning Conflict into Collaboration', 'Relationship Building',
    'Handle disagreements with diplomacy and problem-solving.',
    'Resolve disagreements with customers, colleagues and partners constructively: understand what drives conflict, stay calm, find shared interests and agree solutions that protect the relationship.',
    'Intermediate', '#B42318', ['Diplomacy', 'De-escalation', 'Problem-solving', 'Negotiation'], [
      ['Understanding conflict', [['Common causes of workplace and customer conflict', 12], ['Conflict styles and when to use each', 14]]],
      ['Resolving conflict', [['De-escalating a heated conversation', 14], ['Separating people from the problem', 12], ['Finding shared interests', 12], ['Agreeing a solution and next steps', 12]]],
      ['Practice', [['Role play: an unhappy customer', 14], ['Role play: a disagreement with a colleague', 14], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb06', 'relationships-that-last', 'Relationships That Last', 'Relationship Building',
    'Nurture consistency, loyalty and mutual growth.',
    'Build long-term professional partnerships: set shared goals, stay consistent over time, review and strengthen the relationship regularly and grow together with customers and business partners.',
    'Intermediate', '#027A48', ['Partnership building', 'Loyalty', 'Shared goals', 'Relationship reviews'], [
      ['Foundations of partnership', [['What makes partnerships last', 12], ['Setting shared goals and expectations', 14]]],
      ['Nurturing the relationship', [['Consistency and regular touchpoints', 12], ['Recognising and rewarding loyalty', 12], ['Handling changes and difficult phases', 12]]],
      ['Growing together', [['Relationship review meetings', 12, 'sop'], ['Finding new opportunities for mutual growth', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb07', 'global-connections-respecting-diversity', 'Global Connections: Respecting Diversity', 'Relationship Building',
    'Adapt to cultural differences in personal and business contexts.',
    'Work confidently across regions, languages and cultures: understand how culture shapes communication and decision-making, avoid common missteps and build inclusive relationships.',
    'Beginner', '#0E9384', ['Cultural awareness', 'Inclusion', 'Adaptability', 'Respectful communication'], [
      ['Understanding culture', [['How culture shapes communication', 12], ['Direct and indirect communication styles', 12], ['Regional diversity within India', 12]]],
      ['Working across cultures', [['Business etiquette across cultures', 14], ['Language, humour and avoiding missteps', 12], ['Building rapport with international clients', 12]]],
      ['Inclusion', [['Unconscious bias and how to counter it', 12], ['Creating inclusive conversations', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb08', 'grow-together-mentorship-coaching', 'Grow Together: Mentorship & Coaching Skills', 'Relationship Building',
    'Build supportive, growth-oriented relationships.',
    'Become an effective mentor and coach: set up mentoring relationships, ask coaching questions, give useful feedback and help team members and new advisors grow in their roles.',
    'Intermediate', '#8C5B2D', ['Mentoring', 'Coaching questions', 'Feedback', 'Development plans'], [
      ['Mentoring basics', [['Mentoring vs coaching vs managing', 12], ['Setting up a mentoring relationship', 12]]],
      ['Coaching skills', [['Powerful coaching questions', 14], ['The GROW coaching model', 14], ['Giving feedback that helps people improve', 14]]],
      ['Supporting growth', [['Creating a simple development plan', 12, 'sop'], ['Being a good mentee', 10], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb09', 'clients-for-life-crm-strategies', 'Clients for Life: CRM Strategies', 'Relationship Building',
    'Create loyalty and trust in business relationships.',
    'Use customer relationship management to keep clients for life: segment customers, plan touchpoints, record every interaction, personalise service and measure loyalty.',
    'Intermediate', '#344054', ['Customer segmentation', 'Touchpoint planning', 'CRM discipline', 'Loyalty measurement'], [
      ['CRM strategy', [['What CRM means beyond software', 12], ['Segmenting your customers', 14], ['Planning the customer journey and touchpoints', 14]]],
      ['CRM in practice', [['Recording every interaction', 12, 'sop'], ['Personalising follow-ups and reminders', 12], ['Using CRM data to spot needs', 12]]],
      ['Measuring loyalty', [['Customer feedback and NPS', 12], ['Acting on feedback', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('rb10', 'your-brand-your-bond', 'Your Brand, Your Bond', 'Relationship Building',
    'Use authenticity and reputation to strengthen connections.',
    'Build a personal brand that earns trust: define what you stand for, present yourself consistently online and offline, manage your reputation and let your brand open doors to new relationships.',
    'Beginner', '#B54708', ['Personal branding', 'Authenticity', 'Reputation', 'Online presence'], [
      ['Defining your brand', [['What a personal brand is', 10], ['Finding your values and strengths', 12], ['Writing your personal brand statement', 12]]],
      ['Showing up consistently', [['Your brand in meetings, calls and messages', 12], ['Building your profile on LinkedIn and WhatsApp Business', 14], ['Sharing useful content', 12]]],
      ['Protecting your reputation', [['Managing reviews and feedback', 12], ['Authenticity vs self-promotion', 10], ['Knowledge check', 10, 'quiz']]]
    ])
];

export const franchiseCourses: Omit<Course, 'status' | 'version'>[] = [
  salesCourse('fr01', 'franchise-101-idea-to-model', 'Franchise 101: From Idea to Model', 'Franchise Growth',
    'Basics of franchising, legal structures and franchise agreements.',
    'An introduction to franchising: how franchise models work, the roles of franchisor and franchisee, fee structures, legal structures and what goes into a franchise agreement.',
    'Beginner', '#0B2240', ['Franchise models', 'Fee structures', 'Legal structures', 'Franchise agreements'], [
      ['Franchising basics', [['What franchising is and how it works', 12], ['Franchisor and franchisee roles', 12], ['Types of franchise models', 14]]],
      ['Building the model', [['Is the business ready to franchise?', 14], ['Franchise fees, royalties and revenue share', 14], ['Legal structures for franchising', 12, 'text']]],
      ['The franchise agreement', [['Key clauses in a franchise agreement', 14, 'text'], ['Territory, term and renewal', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr02', 'marketing-for-franchise-growth', 'Marketing for Franchise Growth', 'Franchise Growth',
    'Digital marketing, local promotions and lead funnels for franchise expansion.',
    'Grow a franchise network with marketing that works at both brand and outlet level: digital campaigns, local promotions, lead funnels and shared marketing funds.',
    'Intermediate', '#1570EF', ['Local marketing', 'Digital campaigns', 'Lead funnels', 'Brand guidelines'], [
      ['Franchise marketing basics', [['Brand-level vs local marketing', 12], ['Brand guidelines for franchisees', 12, 'sop'], ['Managing the marketing fund', 12]]],
      ['Digital marketing', [['Google Business Profile for every outlet', 12], ['Social media and Meta ads for local reach', 14], ['Building a lead funnel', 14]]],
      ['Local promotions', [['Community events and tie-ups', 12], ['Launch campaigns for new outlets', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr03', 'scaling-with-systems-franchise-operations', 'Scaling with Systems: Franchise Operations Mastery', 'Franchise Growth',
    'SOPs, training manuals and consistency across branches.',
    'Create the systems that make a franchise scalable: standard operating procedures, operations and training manuals, quality audits and support structures that keep every branch consistent.',
    'Intermediate', '#475467', ['SOPs', 'Operations manuals', 'Quality audits', 'Franchisee training'], [
      ['Standardisation', [['Why consistency is the franchise promise', 12], ['Writing effective SOPs', 14, 'sop'], ['Building the operations manual', 14, 'sop']]],
      ['Training franchisees', [['Designing a franchisee training programme', 14], ['Training staff at each outlet', 12]]],
      ['Maintaining quality', [['Audits and quality checklists', 12, 'sop'], ['Field support and escalation', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr04', 'money-matters-franchise-finance', 'Money Matters: Finance for Franchise Success', 'Franchise Growth',
    'Budgeting, ROI analysis and franchisee profitability models.',
    'Understand the money side of franchising: investment and setup budgets, unit economics, break-even and ROI analysis, cash flow and making the model profitable for both franchisor and franchisee.',
    'Intermediate', '#175CD3', ['Budgeting', 'Unit economics', 'ROI & break-even', 'Cash flow'], [
      ['Investment and budgeting', [['Setup costs and investment budget', 14], ['Operating budgets for an outlet', 12]]],
      ['Profitability', [['Unit economics of a franchise outlet', 16], ['Break-even and payback period', 14], ['ROI analysis for franchisees', 14]]],
      ['Financial health', [['Managing cash flow', 12], ['Funding options for franchisees', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr05', 'sell-the-franchise-recruitment-onboarding', 'Sell the Franchise: Recruitment & Onboarding', 'Franchise Growth',
    'Pitch to potential franchisees, negotiate and onboard effectively.',
    'Recruit the right franchise partners: profile the ideal franchisee, generate and qualify leads, pitch the opportunity honestly, negotiate terms and onboard new partners to a fast, confident start.',
    'Intermediate', '#8C5B2D', ['Franchisee profiling', 'Franchise pitching', 'Negotiation', 'Onboarding'], [
      ['Finding franchisees', [['Profiling the ideal franchisee', 12], ['Generating and qualifying franchise leads', 14]]],
      ['Selling the opportunity', [['Pitching the franchise with honest numbers', 14], ['Answering investor questions', 12], ['Negotiating terms', 12]]],
      ['Onboarding', [['The onboarding checklist', 12, 'sop'], ['The first 90 days of a new franchisee', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr06', 'delight-and-retain-customer-centric-franchise', 'Delight & Retain: Customer-Centric Franchise Growth', 'Franchise Growth',
    'Loyalty programmes, feedback systems and repeat business.',
    'Grow every outlet through great customer experience: consistent service standards, loyalty programmes, feedback systems and turning first-time customers into repeat customers and referrers.',
    'Beginner', '#027A48', ['Service standards', 'Loyalty programmes', 'Feedback systems', 'Repeat business'], [
      ['Customer experience', [['Mapping the customer journey at an outlet', 12], ['Service standards across the network', 12, 'sop']]],
      ['Retention', [['Designing a loyalty programme', 14], ['Collecting and using customer feedback', 12], ['Handling complaints at outlet level', 12, 'sop']]],
      ['Growing repeat business', [['Reminders, renewals and repeat visits', 12], ['Referral programmes', 10], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr07', 'franchise-law-simplified', 'Franchise Law Simplified', 'Franchise Growth',
    'Contracts, compliance and protecting brand reputation.',
    'A plain-language guide to franchise law: key contract terms, disclosure, intellectual property and trademarks, regulatory compliance, and handling disputes and terminations while protecting the brand.',
    'Intermediate', '#7A271A', ['Franchise contracts', 'Trademark protection', 'Compliance', 'Dispute handling'], [
      ['Contracts', [['Key franchise agreement terms explained', 14, 'text'], ['Non-compete and confidentiality clauses', 12, 'text']]],
      ['Protecting the brand', [['Trademarks and intellectual property', 12, 'text'], ['Brand usage rules for franchisees', 12, 'sop']]],
      ['Compliance and disputes', [['Licences, taxes and regulatory compliance', 14, 'text'], ['Handling disputes and termination', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr08', 'managing-multiple-outlets', 'Managing Multiple Outlets: Leadership & Control', 'Franchise Growth',
    'Strategies for supervising multiple franchise locations.',
    'Lead several outlets at once: set up reporting and KPIs, run outlet reviews, build strong outlet managers and keep control without micromanaging.',
    'Advanced', '#344054', ['Multi-unit leadership', 'KPIs & dashboards', 'Outlet reviews', 'Delegation'], [
      ['Leading at scale', [['From one outlet to many: what changes', 12], ['Building strong outlet managers', 14]]],
      ['Control systems', [['KPIs every outlet should track', 14], ['Daily and weekly reporting', 12, 'sop'], ['Running outlet review meetings', 12]]],
      ['Performance', [['Fixing underperforming outlets', 14], ['Sharing best practices across outlets', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr09', 'digital-tools-for-franchise-success', 'Digital Tools for Franchise Success', 'Franchise Growth',
    'CRM, ERP, POS systems and automation for efficiency.',
    'Choose and use the technology that runs a modern franchise: CRM for leads and customers, ERP for inventory and accounts, POS for billing, and automation that saves time across the network.',
    'Intermediate', '#0E9384', ['CRM', 'ERP', 'POS systems', 'Automation'], [
      ['The franchise tech stack', [['Technology every franchise needs', 12], ['Choosing tools for the network', 12]]],
      ['Core systems', [['CRM for leads and customers', 14], ['ERP for inventory, purchasing and accounts', 14], ['POS and billing systems', 12]]],
      ['Automation and data', [['Automating reminders, reports and follow-ups', 12], ['Dashboards for network performance', 12], ['Knowledge check', 10, 'quiz']]]
    ]),
  salesCourse('fr10', 'local-to-global-franchise-expansion', 'From Local to Global: Franchise Expansion Roadmap', 'Franchise Growth',
    'Tier 2–3 city targeting, international franchising and scaling models.',
    'Plan the next stage of growth: choosing Tier 2 and Tier 3 cities, master and area franchise models, going international and pacing expansion so quality keeps up with growth.',
    'Advanced', '#0B4A6F', ['Market selection', 'Tier 2–3 expansion', 'Master franchising', 'International growth'], [
      ['Planning expansion', [['When to expand, and when to wait', 12], ['Market research and city selection', 14]]],
      ['Expanding in India', [['Winning in Tier 2 and Tier 3 cities', 14], ['Area developer and master franchise models', 14]]],
      ['Going global', [['International franchising basics', 14], ['Adapting the model for new markets', 12], ['Pacing growth without losing quality', 12], ['Knowledge check', 10, 'quiz']]]
    ])
];
