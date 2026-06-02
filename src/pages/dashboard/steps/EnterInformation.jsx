import LoadingPage from '../../../reusable/LoadingPage/LoadingPage';
import ProductDetailsBox from './ProductDetailsBox';

export default function EnterInformation({
  useCaseFamily,
  groupName,
  setGroupName,
  opportunityId,
  setOpportunityId,
  category,
  setCategory,
  profile,
  setProfile,
  ocChecked,
  setOcChecked,
  isLtd,
  setIsLtd,
  fieldErrors,
  setVoAddError,
  setVoAddSuccess,
  clearFieldError,
  validateOpportunityId,
  handleAddVoProduct,
  isVoAddEnabled,
  isOcEnabled,
  usedCategories,
  productBoxProps,
  showOverlay = false,
  loadingMessage = 'Please wait, your file is being processed',
}) {
  if (useCaseFamily === 'search-group') {
    return null;
  }

  if (useCaseFamily === 'sb') {
    return (
      <>
        <div className="dashboard-form-shell dashboard-form-shell--vo-layout">
          <div className="dashboard-form-left">
            <div className="dashboard-inner-card dashboard-inner-card--single">
              <label className="dashboard-label">
                Group Name <span>*</span>
              </label>
              <input
                className="dashboard-input"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <label className="dashboard-checkbox-row">
                <input
                  type="checkbox"
                  checked={isLtd}
                  onChange={(e) => setIsLtd(e.target.checked)}
                />
                <span>Is LTD?</span>
              </label>
            </div>
          </div>
          <ProductDetailsBox {...productBoxProps} />
        </div>

        {showOverlay && (
          <div className="dashboard-processing-overlay" aria-hidden="true">
            <LoadingPage message={loadingMessage} transparent />
          </div>
        )}
      </>
    );
  }

  if (useCaseFamily === 'simple-group') {
    return (
      <>
        <div className="dashboard-form-shell dashboard-form-shell--vo-layout">
          <div className="dashboard-form-left">
            <div className="dashboard-inner-card dashboard-inner-card--single">
              <label className="dashboard-label">
                Group Name <span>*</span>
              </label>
              <input
                className="dashboard-input"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>
          <ProductDetailsBox {...productBoxProps} />
        </div>

        {showOverlay && (
          <div className="dashboard-processing-overlay" aria-hidden="true">
            <LoadingPage message={loadingMessage} transparent />
          </div>
        )}
      </>
    );
  }

  if (useCaseFamily !== 'vo-group') {
    return null;
  }

  return (
    <>
      <div className="dashboard-form-shell dashboard-form-shell--vo-layout">
        <div className="dashboard-form-left">
          <div className="dashboard-inner-card dashboard-inner-card--vo">
           <div className="dashboard-vo-top-fields">
  <div className="dashboard-vo-field-block">
    <label className="dashboard-field-label">
      Group Name <span>*</span>
    </label>
    <input
      className="dashboard-input dashboard-input--compact"
      type="text"
      placeholder="Search"
      value={groupName}
      onChange={(e) => {
        setGroupName(e.target.value);
        setVoAddError('');
      }}
    />
  </div>

  <div className="dashboard-vo-field-block">
    <label className="dashboard-field-label">
      Opportunity ID{' '}
      <span
        className="dashboard-help-dot"
        data-tooltip="Format: Opp-123456789"
        aria-label="Opportunity ID format: Opp-123456789"
        tabIndex={0}
      >
        ?
      </span>
    </label>
    <input
      className={`dashboard-input dashboard-input--compact ${
        fieldErrors.opportunityId ? 'dashboard-input--error' : ''
      }`}
      type="text"
      value={opportunityId}
      onChange={(e) => {
        const value = e.target.value;
        setOpportunityId(value);
        setVoAddError('');
        setVoAddSuccess('');

        if (!value.trim()) {
          clearFieldError('opportunityId');
          return;
        }

        validateOpportunityId(value);
      }}
      onBlur={() => validateOpportunityId(opportunityId)}
    />
    {opportunityId.trim().length > 0 && fieldErrors.opportunityId && (
      <p className="dashboard-vo-msg dashboard-vo-msg--error">
        {fieldErrors.opportunityId}
      </p>
    )}
  </div>
</div>

            <div className="dashboard-row-two">
              <div className="dashboard-row-two__category">
                <label className="dashboard-field-label">
                  Category <span>*</span>
                </label>
                <select
                  className={`dashboard-select ${
                    fieldErrors.category ? 'dashboard-select--error' : ''
                  }`}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    clearFieldError('category');
                    setVoAddError('');
                    setVoAddSuccess('');
                  }}
                >
                  <option value="">Select</option>
                  <option value="DEN:BASIC" disabled={usedCategories.has('DEN:BASIC')}>
                    DEN:BASIC
                  </option>
                  <option value="DEN:CORE" disabled={usedCategories.has('DEN:CORE')}>
                    DEN:CORE
                  </option>
                  <option value="DEN:PREMIER" disabled={usedCategories.has('DEN:PREMIER')}>
                    DEN:PREMIER
                  </option>
                  <option value="VIS:BASIC" disabled={usedCategories.has('VIS:BASIC')}>
                    VIS:BASIC
                  </option>
                  <option value="VIS:STANDARD" disabled={usedCategories.has('VIS:STANDARD')}>
                    VIS:STANDARD
                  </option>
                  <option value="VIS:ESSENTIAL" disabled={usedCategories.has('VIS:ESSENTIAL')}>
                    VIS:ESSENTIAL
                  </option>
                  <option value="VIS:PLUS" disabled={usedCategories.has('VIS:PLUS')}>
                    VIS:PLUS
                  </option>
                </select>
                {fieldErrors.category && (
                  <p className="dashboard-vo-msg dashboard-vo-msg--error">
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="dashboard-field-label">
                  Profile <span>*</span>
                </label>
                <select
                  className={`dashboard-select ${
                    fieldErrors.profile ? 'dashboard-select--error' : ''
                  }`}
                  value={profile}
                  onChange={(e) => {
                    setProfile(e.target.value);
                    clearFieldError('profile');
                    setVoAddError('');
                    setVoAddSuccess('');
                  }}
                >
                  <option value="">Select</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="STRICT">STRICT</option>
                </select>
                {fieldErrors.profile && (
                  <p className="dashboard-vo-msg dashboard-vo-msg--error">{fieldErrors.profile}</p>
                )}
              </div>

              <button
                className="dashboard-plus-btn"
                type="button"
                onClick={handleAddVoProduct}
                disabled={!isVoAddEnabled}
                aria-label="Add product detail"
                title="Add product detail"
              >
                +
              </button>
            </div>

            <div className="dashboard-extra-controls">
  <label
    className={`dashboard-toggle-pill ${
      isOcEnabled
        ? 'dashboard-toggle-pill--enabled'
        : 'dashboard-toggle-pill--disabled'
    }`}
  >
    <input
      type="checkbox"
      checked={ocChecked}
      disabled={!isOcEnabled}
      onChange={(e) => setOcChecked(e.target.checked)}
    />
    <span>Orthodontic Coverage</span>
  </label>
</div>
          </div>

          {Boolean(fieldErrors.form) && (
            <p className="dashboard-vo-msg dashboard-vo-msg--error">{fieldErrors.form}</p>
          )}
        </div>

        <ProductDetailsBox {...productBoxProps} />
      </div>

      {showOverlay && (
        <div className="dashboard-processing-overlay" aria-hidden="true">
          <LoadingPage message={loadingMessage} transparent />
        </div>
      )}
    </>
  );
}
