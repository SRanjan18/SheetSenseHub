import SimpleTable from '../../../components/ui/SimpleTable';

export default function OutputTable({
  organization,
  requestId,
  productsCount,
  selectedBusiness,
  selectedFile,
  columns,
  data,
}) {
  return (
    <div className="dashboard-output-shell dashboard-output-shell--full">
      <div className="dashboard-output-card dashboard-output-card--full">
        <div className="dashboard-output-header">
          <h3>Results</h3>
          <p>Processing completed successfully.</p>
        </div>

        <div className="dashboard-output-summary dashboard-output-summary--beautified">
          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label"> Organization</span>
            <span className="dashboard-output-summary__value">{organization || 'N/A'}</span>
          </div>

          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Request ID</span>
            <span className="dashboard-output-summary__value">{requestId || 'N/A'}</span>
          </div>

          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Products Added</span>
            <span className="dashboard-output-summary__value">{productsCount || 0}</span>
          </div>

          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Business</span>
            <span className="dashboard-output-summary__value">{selectedBusiness || 'N/A'}</span>
          </div>

          <div className="dashboard-output-summary__item dashboard-output-summary__item--full">
            <span className="dashboard-output-summary__label">File</span>
            <span className="dashboard-output-summary__value">
              {selectedFile?.name || 'N/A'}
            </span>
          </div>
        </div>

        <div className="dashboard-output-table-card">
          <div className="dashboard-output-table-card__header"> Business Processed Details</div>
          <div className="dashboard-output-table-card__body">
            <SimpleTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}