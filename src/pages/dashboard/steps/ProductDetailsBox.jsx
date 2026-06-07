export default function ProductDetailsBox({
  titleCount,
  businessFamily,
  selectedBusiness,
  products,
  formatCategoryLabel,
  formatProfileLabel,
  onDeleteProduct,
}) {
  return (
    <div className="dashboard-form-right">
      <div className="dashboard-product-box">
        <div className="dashboard-product-box__title">
          Business Processes &nbsp;: &nbsp;{titleCount}
        </div>

        <div className="dashboard-product-box__panel">
          {businessFamily === 'vo-group' && products.length > 0 ? (
            <div className="dashboard-product-list">
              {products.map((product) => (
                <div key={product.id} className="dashboard-product-row">
                  <div className="dashboard-product-chip">
                    {formatCategoryLabel(product.category)}
                  </div>

                  <div className="dashboard-tier-chip">
                    {formatProfileLabel(product.profile)}
                  </div>

                  <button
                    type="button"
                    className="dashboard-delete-row-btn"
                    onClick={() => onDeleteProduct(product.id)}
                    aria-label={`Delete ${formatCategoryLabel(product.category)} ${formatProfileLabel(
                      product.profile
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
              {selectedBusiness || 'No business selected'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
