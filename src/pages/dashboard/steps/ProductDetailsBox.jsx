export default function ProductDetailsBox({
  titleCount,
  useCaseFamily,
  selectedUseCase,
  products,
  formatCensusLabel,
  formatTierLabel,
  onDeleteProduct,
}) {
  return (
    <div className="dashboard-form-right">
      <div className="dashboard-product-box">
        <div className="dashboard-product-box__title">
          Product Details &nbsp;: &nbsp;{titleCount}
        </div>

        <div className="dashboard-product-box__panel">
          {useCaseFamily === 'vo-group' && products.length > 0 ? (
            <div className="dashboard-product-list">
              {products.map((product) => (
                <div key={product.id} className="dashboard-product-row">
                  <div className="dashboard-product-chip">
                    {formatCensusLabel(product.census)}
                  </div>

                  <div className="dashboard-tier-chip">
                    {formatTierLabel(product.tier)}
                  </div>

                  <button
                    type="button"
                    className="dashboard-delete-row-btn"
                    onClick={() => onDeleteProduct(product.id)}
                    aria-label={`Delete ${formatCensusLabel(product.census)} ${formatTierLabel(
                      product.tier
                    )}`}
                    title="Delete row"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-product-box__empty">
              {selectedUseCase || 'No use case selected'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
