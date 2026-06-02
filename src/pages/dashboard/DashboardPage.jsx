import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUseCase } from '../../context/UseCaseContext';
import './DashboardPage.css';
import { styled } from '@mui/material/styles';
import ProductDetailsBox from './steps/ProductDetailsBox';
import OutputTable from './steps/OutputTable';
import EnterInformation from './steps/EnterInformation';
import UploadFile from './steps/UploadFile';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Step,
  StepLabel,
  Stepper,
} from '@mui/material';

const STEP_TITLES = ['Enter Information', 'Upload File', 'Processing', 'Output'];

const USE_CASE_FAMILY_MAP = {
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
    title: 'File Station',
    image: '📁',
    description: 'Click on below button to go to upload zone',
    buttonText: 'Upload Zone',
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
    title: 'Analytics',
    image: '📊',
    description: 'Click on below button to view analytics for processed cases.',
    buttonText: 'View Analytics',
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

function getUseCaseFamily(selectedUseCase) {
  return selectedUseCase ? USE_CASE_FAMILY_MAP[selectedUseCase] ?? null : null;
}

function getCardsForFamily(useCaseFamily) {
  if (!useCaseFamily) return [];
  return CARD_SETS[useCaseFamily] ?? DEFAULT_CARDS;
}

function formatCategoryLabel(value) {
  const map = {
    'DEN:BASIC': 'DEN:BASIC',
    'DEN:CORE': 'DEN:CORE',
    'DEN:PREMIER': 'DEN:PREMIER',
    'VIS:BASIC': 'VIS:BASIC',
    'VIS:STANDARD': 'VIS:STANDARD',
    'VIS:ESSENTIAL': 'VIS:ESSENTIAL',
    'VIS:PLUS': 'VIS:PLUS',
  };

  return map[value] ?? value;
}

function formatProfileLabel(value) {
  const map = {
    STANDARD: 'STANDARD',
    ADVANCED: 'ADVANCED',
    STRICT: 'STRICT',
  };

  return map[value] ?? value;
}

const StyledStepper = styled(Stepper)(() => ({
  padding: '8px 10px 18px',
  '& .MuiStepConnector-line': {
    borderColor: '#d9d9d9',
    borderTopWidth: 3,
    borderRadius: 999,
  },
  '& .Mui-completed .MuiStepConnector-line': {
    borderColor: '#1f69d2',
  },
  '& .MuiStepLabel-label': {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 600,
    color: '#666',
  },
  '& .MuiStepLabel-label.Mui-active': {
    color: '#0a3189',
    fontWeight: 700,
  },
  '& .MuiStepLabel-label.Mui-completed': {
    color: '#1f69d2',
    fontWeight: 700,
  },
  '& .MuiStepIcon-root': {
    color: '#d7dbe6',
  },
  '& .MuiStepIcon-root.Mui-active': {
    color: '#1f69d2',
  },
  '& .MuiStepIcon-root.Mui-completed': {
    color: '#1f69d2',
  },
  '& .MuiStepIcon-text': {
    fill: '#fff',
    fontSize: 12,
    fontWeight: 700,
  },
}));

export default function DashboardPage() {
  const navigate = useNavigate();
  const { selectedUseCase } = useUseCase();
  const hasUseCase = Boolean(selectedUseCase);
  const useCaseFamily = getUseCaseFamily(selectedUseCase);

  const [groupName, setGroupName] = useState('');
  const [opportunityId, setOpportunityId] = useState('');
  const [category, setCategory] = useState('');
  const [profile, setProfile] = useState('');
  const [ocChecked, setOcChecked] = useState(false);
  const [isLtd, setIsLtd] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [voProducts, setVoProducts] = useState([]);
  const [voAddError, setVoAddError] = useState('');
  const [voAddSuccess, setVoAddSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const cards = getCardsForFamily(useCaseFamily);
  const showStepper = useCaseFamily !== 'search-group';
  const sectionTitle = useCaseFamily === 'search-group' ? '' : 'File Station';

  const isOcEnabled =
    useCaseFamily === 'vo-group' &&
    ((category.startsWith('DEN:') && category !== 'DEN:BASIC') ||
      voProducts.some(
        (product) => product.category.startsWith('DEN:') && product.category !== 'DEN:BASIC'
      ));

  const isOppIdValid =
    opportunityId.trim().length === 0 || /^Opp-\d{9}$/i.test(opportunityId.trim());
  const usedCategories = useMemo(
    () => new Set(voProducts.map((product) => product.category)),
    [voProducts]
  );
  const isVoAddEnabled = Boolean(category) && Boolean(profile);

  // CHANGED: keep product count aligned with the active use case family
  const productCount = useMemo(() => {
    if (useCaseFamily === 'vo-group') return String(voProducts.length);
    if (useCaseFamily === 'sb' || useCaseFamily === 'simple-group') return '1';
    return '0';
  }, [useCaseFamily, voProducts.length]);

  useEffect(() => {
    if (currentStep !== 2) return undefined;

    const timerId = setTimeout(() => {
      setCurrentStep(3);
    }, 1600);

    return () => clearTimeout(timerId);
  }, [currentStep]);

  useEffect(() => {
    if (!isOcEnabled && ocChecked) {
      setOcChecked(false);
    }
  }, [isOcEnabled, ocChecked]);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateOpportunityId = () => {
    const normalizedOpportunityId = opportunityId.trim();

    if (!normalizedOpportunityId) {
      clearFieldError('opportunityId');
      return true;
    }

    if (!/^Opp-\d{9}$/i.test(normalizedOpportunityId)) {
      setFieldErrors((prev) => ({
        ...prev,
        opportunityId: 'Opportunity ID format: Opp-123456789',
      }));
      return false;
    }

    clearFieldError('opportunityId');
    return true;
  };

  const handleCardClick = (key) => {
    if (key === 'report') {
      navigate('/report');
      return;
    }

    if (key === 'analytics') {
      navigate('/analytics');
      return;
    }

    if (key === 'occ') {
      alert('OCC page will be added next.');
      return;
    }

    if (key === 'search') {
      alert('Search page will be added next.');
      return;
    }

    setCurrentStep(0);
  };

  const handleCancel = () => {
    setGroupName('');
    setOpportunityId('');
    setCategory('');
    setProfile('');
    setOcChecked(false);
    setIsLtd(false);
    setSelectedFile(null);
    setCurrentStep(0);
    setVoProducts([]);
    setVoAddError('');
    setVoAddSuccess('');
    setFieldErrors({});
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    clearFieldError('category');
    setVoAddError('');
    setVoAddSuccess('');
  };

  const validateVoFields = () => {
    const nextErrors = {};
    const normalizedOpportunityId = opportunityId.trim();

    if (!category) {
      nextErrors.category = 'Category is required.';
    }

    if (!profile) {
      nextErrors.profile = 'Profile is required.';
    }

    if (normalizedOpportunityId && !/^Opp-\d{9}$/i.test(normalizedOpportunityId)) {
      nextErrors.opportunityId = 'Opportunity ID format: Opp-123456789';
    }

    setFieldErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      normalizedOpportunityId,
    };
  };

  const handleAddVoProduct = () => {
    if (useCaseFamily !== 'vo-group') return;

    const { isValid, normalizedOpportunityId } = validateVoFields();

    if (!isValid) {
      setVoAddError('Please fix the highlighted fields before adding product details.');
      return;
    }

    const normalizedCategory = category;

    const isDuplicate = voProducts.some(
      (product) =>
        product.opportunityId === normalizedOpportunityId &&
        product.categoryKey === normalizedCategory &&
        product.profile === profile
    );

    if (isDuplicate) {
      setVoAddError('This product combination already exists.');
      return;
    }

    setVoProducts((prev) => [
      ...prev,
      {
        id: `${normalizedOpportunityId || 'no-opp'}-${normalizedCategory}-${profile}-${Date.now()}`,
        opportunityId: normalizedOpportunityId,
        category,
        categoryKey: normalizedCategory,
        profile,
        ocChecked,
      },
    ]);

    setVoAddError('');

    setOpportunityId('');
    setCategory('');
    setProfile('');
    setFieldErrors((prev) => ({
      ...prev,
      opportunityId: '',
      category: '',
      profile: '',
    }));
  };

  const handleDeleteVoProduct = (productId) => {
    setVoProducts((prev) => prev.filter((product) => product.id !== productId));
    setVoAddError('');
    setVoAddSuccess('Product removed.');
  };

  const isStepOneValid = () => {
    if (useCaseFamily === 'sb') {
      return groupName.trim().length > 0;
    }

    if (useCaseFamily === 'vo-group') {
      return groupName.trim().length > 0 && voProducts.length > 0;
    }

    if (useCaseFamily === 'simple-group') {
      return groupName.trim().length > 0;
    }

    return false;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentStep === 1 && selectedFile) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const isNextDisabled =
    currentStep === 0
      ? !isStepOneValid() || !isOppIdValid
      : currentStep === 1
      ? !selectedFile
      : currentStep >= 2;

  const renderStepContent = () => {
        // CHANGED: for VAQ/SHAQ show only the hero cards, not the lower empty search area
    if (useCaseFamily === 'search-group') {
      return null;
    }

    if (currentStep === 0) {
      return (
        <EnterInformation
          useCaseFamily={useCaseFamily}
          groupName={groupName}
          setGroupName={setGroupName}
          opportunityId={opportunityId}
          setOpportunityId={setOpportunityId}
          category={category}
          setCategory={setCategory}
          profile={profile}
          setProfile={setProfile}
          ocChecked={ocChecked}
          setOcChecked={setOcChecked}
          isLtd={isLtd}
          setIsLtd={setIsLtd}
          fieldErrors={fieldErrors}
          setVoAddError={setVoAddError}
          setVoAddSuccess={setVoAddSuccess}
          clearFieldError={clearFieldError}
          validateOpportunityId={validateOpportunityId}
          handleAddVoProduct={handleAddVoProduct}
          isVoAddEnabled={isVoAddEnabled}
          isOcEnabled={isOcEnabled}
          usedCategories={usedCategories}
          productBoxProps={{
            titleCount: productCount,
            useCaseFamily,
            selectedUseCase,
            products: voProducts,
            formatCategoryLabel,
            formatProfileLabel,
            onDeleteProduct: handleDeleteVoProduct,
          }}
        />
      );
    }

    if (currentStep === 1) {
      return <UploadFile selectedFile={selectedFile} onFileChange={handleFileChange} />;
    }

    if (currentStep === 2) {
      return (
        <EnterInformation
          useCaseFamily={useCaseFamily}
          groupName={groupName}
          setGroupName={setGroupName}
          opportunityId={opportunityId}
          setOpportunityId={setOpportunityId}
          category={category}
          setCategory={setCategory}
          profile={profile}
          setProfile={setProfile}
          ocChecked={ocChecked}
          setOcChecked={setOcChecked}
          isLtd={isLtd}
          setIsLtd={setIsLtd}
          fieldErrors={fieldErrors}
          setVoAddError={setVoAddError}
          setVoAddSuccess={setVoAddSuccess}
          clearFieldError={clearFieldError}
          validateOpportunityId={validateOpportunityId}
          handleAddVoProduct={handleAddVoProduct}
          isVoAddEnabled={isVoAddEnabled}
          isOcEnabled={isOcEnabled}
          usedCategories={usedCategories}
          mode="processing"
          formatCategoryLabel={formatCategoryLabel}
          formatProfileLabel={formatProfileLabel}
          showOverlay
          productBoxProps={{
            titleCount: productCount,
            useCaseFamily,
            selectedUseCase,
            products: voProducts,
            formatCategoryLabel,
            formatProfileLabel,
            onDeleteProduct: handleDeleteVoProduct,
          }}
        />
      );
    }

    return (
      <OutputTable
        groupName={groupName}
        opportunityId={opportunityId}
        productsCount={voProducts.length}
        selectedUseCase={selectedUseCase}
        selectedFile={selectedFile}
        columns={[
          { key: 'category', header: 'Category' },
          { key: 'profile', header: 'Profile' },
          { key: 'oc', header: 'OC' },
          { key: 'opportunityId', header: 'Opportunity ID' },
        ]}
        data={voProducts.map((product) => ({
          category: formatCategoryLabel(product.category),
          profile: formatProfileLabel(product.profile),
          oc: product.ocChecked ? 'Yes' : 'No',
          opportunityId: product.opportunityId || 'N/A',
        }))}
      >
      </OutputTable>
    );
  };

  return (
  <div
  className={`dashboard-page ${
    useCaseFamily === 'sb' || useCaseFamily === 'simple-group'
      ? 'dashboard-page--sb'
      : ''
  } ${!hasUseCase ? 'dashboard-page--preselect' : ''}`}
>
      <section className="dashboard-hero">
        {hasUseCase && (
          <Box
            className={`dashboard-card-row ${
              cards.length === 3 ? 'dashboard-card-row--three' : ''
            }`}
          >
            {cards.map((card) => (
              <Card key={card.key} className="dashboard-mui-card" elevation={6}>
                <CardContent className="dashboard-mui-card__content">
                  <Typography component="h3" className="dashboard-mui-card__title">
                    {card.title}
                  </Typography>

                  <Box className="dashboard-mui-card__image">{card.image}</Box>

                  <Typography className="dashboard-mui-card__desc">
                    {card.description}
                  </Typography>

                  <Button
                    variant="contained"
                    className="dashboard-mui-card__button"
                    onClick={() => handleCardClick(card.key)}
                  >
                    {card.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </section>

          {/* CHANGED: hide the lower dashboard content completely for search use cases */}
      {hasUseCase && useCaseFamily !== 'search-group' && (
        <section className="dashboard-content">
          <h2>{sectionTitle}</h2>

          {showStepper && (
            <Box className="dashboard-stepper-mui">
              <StyledStepper activeStep={currentStep} alternativeLabel>
                {STEP_TITLES.map((stepTitle) => (
                  <Step key={stepTitle}>
                    <StepLabel>{stepTitle}</StepLabel>
                  </Step>
                ))}
              </StyledStepper>
            </Box>
          )}

          {renderStepContent()}

          {showStepper && (
            <div className="dashboard-actions">
              {currentStep > 0 && (
                <button className="dashboard-back-btn" onClick={handleBack} type="button">
                  ← Back
                </button>
              )}

              {currentStep < 2 && (
                <button
                  className="dashboard-next-btn"
                  disabled={isNextDisabled}
                  type="button"
                  onClick={handleNext}
                >
                  Next →
                </button>
              )}

              {currentStep === 3 && (
                <button className="dashboard-next-btn" onClick={handleCancel} type="button">
                  Start Over
                </button>
              )}

              <button className="dashboard-cancel-btn" onClick={handleCancel} type="button">
                ✕ Cancel
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
