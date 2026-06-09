import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';
import { BUSINESS_FAMILY_MAP } from '../../config/businesses';

export const USE_CASE_FAMILY_MAP = BUSINESS_FAMILY_MAP;

const DEFAULT_CARDS = [
  {
    key: 'file-station',
    title: 'Data Processing',
    icon: CloudUploadOutlinedIcon,
    description: 'Click on below button to go to Data Ingestion',
    buttonText: 'Data Ingestion',
  },
  {
    key: 'analytics',
    title: 'Insights',
    icon: QueryStatsOutlinedIcon,
    description: 'Click on below button to view insights for processed cases.',
    buttonText: 'View Insights',
  },
  {
    key: 'report',
    title: 'Report',
    icon: DescriptionOutlinedIcon,
    description: 'Click on below button to view report for processed cases.',
    buttonText: 'View Report',
  },
  
];

const CARD_SETS = {
  'vo-group': DEFAULT_CARDS,
  'simple-group': DEFAULT_CARDS,
};

const CARD_ACTIONS = {
  report: { type: 'navigate', value: '/report' },
  analytics: { type: 'navigate', value: '/analytics' },
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
