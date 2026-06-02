import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUseCase } from '../../context/UsecaseContext';
import './DashboardPage.css';
import { styled } from '@mui/material/styles';
import OutputTable from './steps/OutputTable';
import EnterInformation from './steps/EnterInformation';
import UploadFile from './steps/UploadFile';
import {
  getCardAction,
  getCardsForFamily,
  getUseCaseFamily,
} from './dashboardConfig';
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
const INGESTION_API_URL = '';

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
  const [ingestionLoading, setIngestionLoading] = useState(false);
const [ingestionError, setIngestionError] = useState('');
const [ingestionResponse, setIngestionResponse] = useState(null);

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
    opportunityId.trim().length === 0 || /^Opp-\d{9}$/.test(opportunityId.trim());
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
    if (!isOcEnabled && ocChecked) {
      setOcChecked(false);
    }
  }, [isOcEnabled, ocChecked]);
  useEffect(() => {
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
  setIngestionLoading(false);
  setIngestionError('');
  setIngestionResponse(null);
}, [selectedUseCase]);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

const validateOpportunityId = (value) => {
  const normalizedOpportunityId =
    typeof value === 'string' ? value.trim() : opportunityId.trim();

  if (!normalizedOpportunityId) {
    clearFieldError('opportunityId');
    return true;
  }

  if (!/^Opp-\d{9}$/.test(normalizedOpportunityId)) {
    setFieldErrors((prev) => ({
      ...prev,
      opportunityId: 'Opportunity ID format: Opp-123456789',
    }));
    return false;
  }

  clearFieldError('opportunityId');
  return true;
};
const buildIngestionPayload = () => {
  const normalizedOpportunityId = opportunityId.trim();

  const payload = {
    use_case: selectedUseCase || '',
    group_name: groupName.trim(),
    opportunity_id: normalizedOpportunityId,
    orthodontic_coverage: Boolean(ocChecked),
    file_name: selectedFile?.name || '',
  };

  if (selectedUseCase === 'BillingHub (BH)') {
    payload.is_ltd = Boolean(isLtd);
    return payload;
  }

  payload.products =
    useCaseFamily === 'vo-group'
      ? voProducts.map((product) => ({
          category: product.category,
          profile: product.profile,
        }))
      : category && profile
      ? [
          {
            category,
            profile,
          },
        ]
      : [];

  return payload;
};
const submitIngestion = async () => {
  const payload = buildIngestionPayload();

  console.log('Ingestion payload >>>', JSON.stringify(payload, null, 2));

  setIngestionLoading(true);
  setIngestionError('');
  setIngestionResponse(null);

  try {
    const productsForResponse = Array.isArray(payload.products) ? payload.products : [];

    // MOCK FLOW FOR NOW
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResponse = {
      success: true,
      body: productsForResponse.length
        ? productsForResponse.map((product, index) => ({
            id: index + 1,
            category: product.category,
            profile: product.profile,
            orthodontic_coverage: payload.orthodontic_coverage ? 'Yes' : 'No',
            opportunity_id: payload.opportunity_id || 'N/A',
            group_name: payload.group_name || 'N/A',
            use_case: payload.use_case || 'N/A',
            file_name: payload.file_name || 'N/A',
            is_ltd:
              payload.use_case === 'BillingHub (BH)'
                ? Boolean(payload.is_ltd)
                  ? 'Yes'
                  : 'No'
                : 'N/A',
          }))
        : [
            {
              id: 1,
              category: 'N/A',
              profile: 'N/A',
              orthodontic_coverage: payload.orthodontic_coverage ? 'Yes' : 'No',
              opportunity_id: payload.opportunity_id || 'N/A',
              group_name: payload.group_name || 'N/A',
              use_case: payload.use_case || 'N/A',
              file_name: payload.file_name || 'N/A',
              is_ltd:
                payload.use_case === 'BillingHub (BH)'
                  ? Boolean(payload.is_ltd)
                    ? 'Yes'
                    : 'No'
                  : 'N/A',
            },
          ],
    };

    setIngestionResponse(mockResponse);
    return mockResponse;

    /*
    // FUTURE REAL API FLOW - UNCOMMENT LATER
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('payload', JSON.stringify(payload));

    const response = await fetch('ADD_YOUR_API_URL_HERE', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ingestion failed with status ${response.status}`);
    }

    const result = await response.json();

    const safeResult = {
      ...result,
      body: Array.isArray(result?.body) ? result.body : [],
    };

    setIngestionResponse(safeResult);
    return safeResult;
    */
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Something went wrong during ingestion.';
    setIngestionError(message);
    throw error;
  } finally {
    setIngestionLoading(false);
  }
};
  const handleCardClick = (key) => {
    const action = getCardAction(key);

    if (action.type === 'navigate') {
      navigate(action.value);
      return;
    }

    if (action.type === 'alert') {
      alert(action.value);
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
  setIngestionLoading(false);
  setIngestionError('');
  setIngestionResponse(null);
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

    if (normalizedOpportunityId && !/^Opp-\d{9}$/.test(normalizedOpportunityId)) {
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

const handleNext = async () => {
  if (currentStep === 0) {
    setCurrentStep(1);
    return;
  }

  if (currentStep === 1 && selectedFile) {
    setCurrentStep(2); // show Processing step immediately

    try {
      const result = await submitIngestion();

      if (result?.success !== false) {
        setCurrentStep(3); // move to Output only after API/mock returns
      }
    } catch (error) {
      // stay on processing step and show error there
    }
  }
};

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }

    setIngestionError('');
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
    : true;

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
    <div>
      {ingestionError ? (
        <div
          style={{
            marginBottom: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#ffe8e8',
            border: '1px solid #f3b3b3',
            color: '#b42318',
            fontWeight: 600,
          }}
        >
          {ingestionError}
        </div>
      ) : null}

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
        showOverlay={ingestionLoading}
        loadingMessage="Please wait, your file is being processed"
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
    </div>
  );
}

 return (
  <OutputTable
    groupName={groupName}
    opportunityId={opportunityId}
    productsCount={ingestionResponse?.body?.length || voProducts.length}
    selectedUseCase={selectedUseCase}
    selectedFile={selectedFile}
    columns={[
      { key: 'category', header: 'Category' },
      { key: 'profile', header: 'Profile' },
      { key: 'orthodontic_coverage', header: 'OC' },
      { key: 'opportunity_id', header: 'Opportunity ID' },
      { key: 'group_name', header: 'Group Name' },
      { key: 'use_case', header: 'Use Case' },
      { key: 'file_name', header: 'File Name' },
    ]}
    data={
      ingestionResponse?.body?.length
        ? ingestionResponse.body
        : voProducts.map((product) => ({
            category: formatCategoryLabel(product.category),
            profile: formatProfileLabel(product.profile),
            orthodontic_coverage: ocChecked ? 'Yes' : 'No',
            opportunity_id: product.opportunityId || opportunityId || 'N/A',
            group_name: groupName || 'N/A',
            use_case: selectedUseCase || 'N/A',
            file_name: selectedFile?.name || 'N/A',
          }))
    }
  />
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
