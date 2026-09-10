import { useState } from 'react'

function App() {
  const products = []

  return (
    <div className="app-wrapper">
      <header>
        <h1>Product Dashboard</h1>
        <p>Manage your products inventory</p>
      </header>

      <div className="container">
        <div className="card">
          <div className="toolbar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-box"
                placeholder="Search products..."
                readOnly
              />
            </div>
            <button className="btn btn-primary">
              + Add Product
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      <div className="empty-state-icon">📦</div>
                      <h3>No products found</h3>
                      <p>Add your first product to get started</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-success btn-sm">Edit</button>
                          <button className="btn btn-danger btn-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
