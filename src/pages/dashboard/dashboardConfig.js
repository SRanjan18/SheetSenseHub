export const USE_CASE_FAMILY_MAP = {
  'BillingHub (BH)': 'sb',
  'OpsFlow (OF)': 'vo-group',
  'UnderwritePro (UP)': 'vo-group',
  'AccountSphere (AS)': 'vo-group',
  'QuoteVision (QV)': 'search-group',
  'HealthQuote+ (HQ+)': 'search-group',
  'ListFlow (LF)': 'simple-group',
  'MediUnderwrite(MU)': 'simple-group',
};

const DEFAULT_CARDS = [
  {
    key: 'file-station',
    title: 'Data Processing',
    image: '📁',
    description: 'Click on below button to go to Data Ingestion',
    buttonText: 'Data Ingestion',
  },
  {
    key: 'report',
    title: 'Report',
    image: '📈',
    description: 'Click on below button to view report for processed cases.',
    buttonText: 'View Report',
  },
  {
    key: 'analytics',
    title: 'Insights',
    image: '📊',
    description: 'Click on below button to view insights for processed cases.',
    buttonText: 'View Insights',
  },
];

const CARD_SETS = {
  'search-group': [
    {
      key: 'search',
      title: 'Search',
      image: '🔎',
      description: 'Click on below button to search processed category file.',
      buttonText: 'Search Record',
    },
    DEFAULT_CARDS[1],
    DEFAULT_CARDS[2],
  ],
  sb: [
    DEFAULT_CARDS[0],
    {
      key: 'occ',
      title: 'OCC',
      image: '🗂️',
      description: 'Click on below button to add/edit OCC Details',
      buttonText: 'Library Add/Edit',
    },
    DEFAULT_CARDS[1],
    DEFAULT_CARDS[2],
  ],
};

const CARD_ACTIONS = {
  report: { type: 'navigate', value: '/report' },
  analytics: { type: 'navigate', value: '/analytics' },
  occ: { type: 'alert', value: 'OCC page will be added next.' },
  search: { type: 'alert', value: 'Search page will be added next.' },
};

export function getBusinessFamily(selectedBusiness) {
  return selectedBusiness ? USE_CASE_FAMILY_MAP[selectedBusiness] ?? null : null;
}

export function getCardsForFamily(businessFamily) {
  if (!businessFamily) return [];
  return CARD_SETS[businessFamily] ?? DEFAULT_CARDS;
}

export function getCardAction(cardKey) {
  return CARD_ACTIONS[cardKey] ?? { type: 'reset-step' };
}
