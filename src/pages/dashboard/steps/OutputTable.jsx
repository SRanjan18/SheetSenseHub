import SimpleTable from '../../../components/ui/SimpleTable';

export default function OutputTable({
  groupName,
  opportunityId,
  productsCount,
  selectedUseCase,
  selectedFile,
  columns,
  data,
}) {
  return (
    <div className="dashboard-output-shell dashboard-output-shell--full">
      <div className="dashboard-output-card dashboard-output-card--full">
        <div className="dashboard-output-header">
          <h3>Output</h3>
          <p>Processing completed successfully.</p>
        </div>

        <div className="dashboard-output-summary dashboard-output-summary--beautified">
          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Group Name</span>
            <span className="dashboard-output-summary__value">{groupName || 'N/A'}</span>
          </div>

          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Opportunity ID</span>
            <span className="dashboard-output-summary__value">{opportunityId || 'N/A'}</span>
          </div>

          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Products Added</span>
            <span className="dashboard-output-summary__value">{productsCount || 0}</span>
          </div>

          <div className="dashboard-output-summary__item">
            <span className="dashboard-output-summary__label">Use Case</span>
            <span className="dashboard-output-summary__value">{selectedUseCase || 'N/A'}</span>
          </div>

          <div className="dashboard-output-summary__item dashboard-output-summary__item--full">
            <span className="dashboard-output-summary__label">File</span>
            <span className="dashboard-output-summary__value">
              {selectedFile?.name || 'N/A'}
            </span>
          </div>
        </div>

        <div className="dashboard-output-table-card">
          <div className="dashboard-output-table-card__header">Processed Product Details</div>
          <div className="dashboard-output-table-card__body">
            <SimpleTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}