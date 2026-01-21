import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Package, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { Table, Modal, Input, InputNumber, message, Popconfirm } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api'

export default function ProductsView() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    isActive: true,
  })

  // Headers Helper
  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/v1/company-products/`, {
        headers: getHeaders(),
      })

      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      
      // Map API data structure to UI
      const mappedProducts = data.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        isActive: p.is_active,
        image: p.image,
        // Flatten variant data for simple view
        price: p.variants && p.variants.length > 0 ? p.variants[0].price : 0,
        stock: p.variants && p.variants.length > 0 && p.variants[0].in_stock ? 'In Stock' : 'Out of Stock',
        variantId: p.variants && p.variants.length > 0 ? p.variants[0].id : null
      }))

      setProducts(mappedProducts)
    } catch (error) {
      console.error(error)
      message.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: 0, stock: 1, isActive: true })
    setModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock === 'In Stock' ? 1 : 0,
      isActive: product.isActive,
    })
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/v1/products/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      })

      if (!response.ok) throw new Error('Failed to delete')

      message.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      message.error('Failed to delete product')
    }
  }

  const handleSubmit = async () => {
    if (!formData.name) {
      message.error('Product name is required')
      return
    }

    try {
      setSaving(true)
      const payload = {
        name: formData.name,
        description: formData.description,
        is_active: formData.isActive,
        has_variants: false // Simple product for now
      }

      let response
      if (editingProduct) {
        // Update
        response = await fetch(`${API_BASE}/v1/products/${editingProduct.id}/`, {
          method: 'PATCH',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        })
      } else {
        // Create
        response = await fetch(`${API_BASE}/v1/products/`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) throw new Error('Operation failed')

      message.success(`Product ${editingProduct ? 'updated' : 'created'} successfully`)
      setModalOpen(false)
      fetchProducts()
    } catch (error) {
      message.error('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
             {record.image ? <img src={record.image} alt="" className="w-full h-full object-cover rounded-lg"/> : '📦'}
          </div>
          <div>
            <p className="font-medium">{record.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{record.description}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Price (Base)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span className="font-medium">৳{price ? price.toLocaleString() : '0'}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1 ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isActive ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
          {isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <button className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
            <Package size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-sm text-muted-foreground">Manage your product catalog</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={fetchProducts} className="btn-outline px-3 py-2">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''}/>
            </button>
            <button onClick={handleAdd} className="btn-primary px-4 py-2 gap-2">
            <Plus size={18} />
            Add Product
            </button>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 max-w-md">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 focus:outline-none flex-1"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <Table
          dataSource={filteredProducts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={saving ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}
        confirmLoading={saving}
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input.TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

           {/* Note: Price/Stock editing usually requires variant API calls. 
               For now, we update the product base details. */}
          <div className="p-3 bg-blue-50 text-blue-700 rounded text-sm">
             To manage variants, prices, and stock levels, please use the detailed inventory manager.
          </div>
        </div>
      </Modal>
    </div>
  )
}