import { useState, useEffect } from 'react'

function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    status: 'active'
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const fetchProducts = async () => {
    try {
      const url = search
        ? `/api/products?search=${encodeURIComponent(search)}`
        : '/api/products'
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
      setApiError('')
    } catch (err) {
      setApiError('Failed to load products. Please try again.')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [search])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validateForm()) return

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products'

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || 'Operation failed')
      }

      setShowModal(false)
      setEditingProduct(null)
      setFormData({ name: '', sku: '', price: '', status: 'active' })
      setErrors({})
      fetchProducts()
    } catch (err) {
      setApiError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete product')
      fetchProducts()
    } catch (err) {
      setApiError('Failed to delete product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      status: product.status
    })
    setShowModal(true)
    setErrors({})
    setApiError('')
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({ name: '', sku: '', price: '', status: 'active' })
    setErrors({})
    setApiError('')
    setShowModal(true)
  }

  return (
    <div className="app-wrapper">
      <header>
        <h1>Product Dashboard</h1>
        <p>Manage your products inventory</p>
      </header>

      <div className="container">
        {apiError && <div className="error-message">⚠️ {apiError}</div>}

        <div className="card">
          <div className="toolbar">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-box"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={openAddModal}>
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
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>
              <span className="icon">{editingProduct ? '✏️' : '➕'}</span>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <div className="error">⚠️ {errors.name}</div>}
              </div>

              <div className="form-group">
                <label>SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  placeholder="Enter SKU e.g. SHIRT-BLK-M"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
                {errors.sku && <div className="error">⚠️ {errors.sku}</div>}
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {errors.price && <div className="error">⚠️ {errors.price}</div>}
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setShowModal(false); setEditingProduct(null); setErrors({}) }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
