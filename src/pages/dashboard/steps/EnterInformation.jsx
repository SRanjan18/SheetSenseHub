import LoadingPage from '../../../reusable/LoadingPage/LoadingPage';
import ProductDetailsBox from './ProductDetailsBox';

export default function EnterInformation({
  useCaseFamily,
  groupName,
  setGroupName,
  opportunityId,
  setOpportunityId,
  census,
  setCensus,
  tier,
  setTier,
  caChecked,
  setCaChecked,
  isLtd,
  setIsLtd,
  fieldErrors,
  setVoAddError,
  setVoAddSuccess,
  clearFieldError,
  handleAddVoProduct,
  isVoAddEnabled,
  isCaEnabled,
  usedCensus,
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
            <label className="dashboard-field-label">
              Group Name <span>*</span>
            </label>
            <input
              className="dashboard-input"
              type="text"
              placeholder="Search"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setVoAddError('');
              }}
            />

            <label className="dashboard-field-label">
              Opportunity ID <span className="dashboard-help-dot">?</span>
            </label>
            <input
              className={`dashboard-input ${
                fieldErrors.opportunityId ? 'dashboard-input--error' : ''
              }`}
              type="text"
              value={opportunityId}
              onChange={(e) => {
                setOpportunityId(e.target.value);
                clearFieldError('opportunityId');
                setVoAddError('');
                setVoAddSuccess('');
              }}
            />
            {opportunityId.trim().length > 0 && fieldErrors.opportunityId && (
              <p className="dashboard-vo-msg dashboard-vo-msg--error">
                {fieldErrors.opportunityId}
              </p>
            )}

            <div className="dashboard-row-two">
              <div>
                <label className="dashboard-field-label">
                  Category <span>*</span>
                </label>
                <select
                  className={`dashboard-select ${
                    fieldErrors.census ? 'dashboard-select--error' : ''
                  }`}
                  value={census}
                  onChange={(e) => {
                    setCensus(e.target.value);
                    clearFieldError('census');
                    setVoAddError('');
                    setVoAddSuccess('');
                  }}
                >
                  <option value="">Select</option>
                  <option value="DEN:BASIC" disabled={usedCensus.has('DEN:BASIC')}>
                    DEN:BASIC
                  </option>
                  <option value="DEN:CORE" disabled={usedCensus.has('DEN:CORE')}>
                    DEN:CORE
                  </option>
                  <option value="DEN:PREMIER" disabled={usedCensus.has('DEN:PREMIER')}>
                    DEN:PREMIER
                  </option>
                  <option value="VIS:BASIC" disabled={usedCensus.has('VIS:BASIC')}>
                    VIS:BASIC
                  </option>
                   <option value="VIS:STANDARD" disabled={usedCensus.has('VIS:STANDARD')}>
                    VIS:STANDARD
                  </option>
                   <option value="VIS:ESSENTIAL" disabled={usedCensus.has('VIS:ESSENTIAL')}>
                   VIS:ESSENTIAL
                  </option>
                   <option value="VIS:PLUS" disabled={usedCensus.has('VIS:PLUS')}>
                    VIS:PLUS
                  </option>
                </select>
                {fieldErrors.census && (
                  <p className="dashboard-vo-msg dashboard-vo-msg--error">
                    {fieldErrors.census}
                  </p>
                )}
              </div>

              <div>
                <label className="dashboard-field-label">
                  Validation Profile <span>*</span>
                </label>
                <select
                  className={`dashboard-select ${
                    fieldErrors.tier ? 'dashboard-select--error' : ''
                  }`}
                  value={tier}
                  onChange={(e) => {
                    setTier(e.target.value);
                    clearFieldError('tier');
                    setVoAddError('');
                    setVoAddSuccess('');
                  }}
                >
                  <option value="">Select</option>
                  <option value="STANDARD">STANDARD</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="STRICT">STRICT</option>
                </select>
                {fieldErrors.tier && (
                  <p className="dashboard-vo-msg dashboard-vo-msg--error">{fieldErrors.tier}</p>
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

            <label
              className={`dashboard-toggle-pill ${
                isCaEnabled
                  ? 'dashboard-toggle-pill--enabled'
                  : 'dashboard-toggle-pill--disabled'
              }`}
            >
              <input
                type="checkbox"
                checked={caChecked}
                disabled={!isCaEnabled}
                onChange={(e) => setCaChecked(e.target.checked)}
              />
              <span>Orthodontic Coverage</span>
            </label>
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