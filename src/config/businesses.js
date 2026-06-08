export const BUSINESS_DETAILS = [
  {
    name: 'BillingHub (BH)',
    shortName: 'BH',
    family: 'sb',
    dashboardType: 'Operations + OCC',
    cardCount: 4,
    story:
      'BillingHub supports billing-focused document processing where operational accuracy depends on both ingestion and OCC maintenance. It gets an extra OCC card because billing exceptions often need a managed reference library before downstream reporting is reliable.',
    whyDifferent:
      'Different because it has an additional operational control step: OCC add/edit.',
  },
  {
    name: 'UnderwritePro (UP)',
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
    name: 'AccountSphere (AS)',
    shortName: 'AS',
    family: 'vo-group',
    dashboardType: 'Product-based ingestion',
    cardCount: 3,
    story:
      'AccountSphere is account-oriented processing. It shares the same product-driven dashboard shape as UnderwritePro, but the business context is account servicing and account-level documents rather than underwriting intake.',
    whyDifferent:
      'Different because the same processing engine is used for account-servicing files and account-level analytics.',
  },
  {
    name: 'MediUnderwrite(MU)',
    shortName: 'MU',
    family: 'simple-group',
    dashboardType: 'Simple ingestion',
    cardCount: 3,
    story:
      'MediUnderwrite is a lighter medical underwriting flow. It keeps the dashboard simple: capture organization details, upload the source file, then review analytics and reports after processing.',
    whyDifferent:
      'Different because it does not need multi-product entry or OCC maintenance.',
  },
  {
    name: 'QuoteVision (QV)',
    shortName: 'QV',
    family: 'search-group',
    dashboardType: 'Search-first workflow',
    cardCount: 3,
    story:
      'QuoteVision is built around finding processed quote records instead of starting with a new ingestion every time. Its dashboard begins with Search, then keeps Insights and Report for analysis of previously processed quote activity.',
    whyDifferent:
      'Different because the primary action is search, not source-file ingestion.',
  },
];

export const ACTIVE_BUSINESSES = BUSINESS_DETAILS.map((business) => business.name);

export const BUSINESS_FAMILY_MAP = BUSINESS_DETAILS.reduce((acc, business) => {
  acc[business.name] = business.family;
  return acc;
}, {});
