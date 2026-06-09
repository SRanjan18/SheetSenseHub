export const BUSINESS_DETAILS = [
  {
    name: 'UnderwritePro',
    shortName: 'UP',
    family: 'vo-group',
    dashboardType: 'Product-based ingestion',
    cardCount: 3,
    story:
      'UnderwritePro represents underwriting workflows where one request can contain multiple product/category combinations. The dashboard focuses on ingestion, insights, and reporting because the main work is collecting product details and processing underwriting files.',
    whyDifferent:
      'Different because it supports multi-product underwriting inputs before upload.',
  },
  {
    name: 'MediUnderwrite',
    shortName: 'MU',
    family: 'simple-group',
    dashboardType: 'Simple ingestion',
    cardCount: 3,
    story:
      'MediUnderwrite is a lighter medical underwriting flow. It keeps the dashboard simple: capture organization details, upload the source file, then review analytics and reports after processing.',
    whyDifferent:
      'Different because it does not need multi-product entry or OCC maintenance.',
  },
];

export const ACTIVE_BUSINESSES = BUSINESS_DETAILS.map((business) => business.name);

export const BUSINESS_FAMILY_MAP = BUSINESS_DETAILS.reduce((acc, business) => {
  acc[business.name] = business.family;
  return acc;
}, {});
