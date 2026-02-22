import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Table, Tag, message } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../api/axios'
import { ENDPOINTS } from '../../api/config'

const statusConfig = {
  pending: { color: 'orange', icon: Clock, text: 'Pending' },
  processing: { color: 'blue', icon: Package, text: 'Processing' },
  shipped: { color: 'cyan', icon: Truck, text: 'Shipped' },
  delivered: { color: 'green', icon: CheckCircle, text: 'Delivered' },
  cancelled: { color: 'red', icon: AlertCircle, text: 'Cancelled' },
  // Uppercase variants from API
  PENDING: { color: 'orange', icon: Clock, text: 'Pending' },
  PROCESSING: { color: 'blue', icon: Package, text: 'Processing' },
  SHIPPED: { color: 'cyan', icon: Truck, text: 'Shipped' },
  DELIVERED: { color: 'green', icon: CheckCircle, text: 'Delivered' },
  CANCELLED: { color: 'red', icon: AlertCircle, text: 'Cancelled' },
}

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.get(ENDPOINTS.ORDERS.LIST)
      const ordersData = Array.isArray(response.data) ? response.data : (response.data.results || [])

      const mapped = ordersData.map(order => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString(),
        items: order.items
          ? order.items.map(item => item.product_name || item.name || 'Item')
          : [],
        total: parseFloat(order.total_amount || 0),
        status: (order.status || 'pending').toLowerCase(),
      }))

      setOrders(mapped)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setError('Failed to load orders')
      message.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    fetchOrders()
  }, [isAuthenticated, navigate])

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <span className="font-medium font-mono text-xs">#{id}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <span className="text-muted-foreground">
          {items.length === 0
            ? '—'
            : items.length > 1
              ? `${items[0]} +${items.length - 1} more`
              : items[0]}
        </span>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span className="font-semibold">৳{total.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = statusConfig[status] || statusConfig.pending
        return (
          <Tag color={config.color} className="flex items-center gap-1 w-fit">
            <config.icon size={12} />
            {config.text}
          </Tag>
        )
      },
    },
  ]

  const totalOrders = orders.length
  const inProgress = orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length
  const delivered = orders.filter(o => o.status === 'delivered').length

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'In Progress', value: inProgress, icon: Truck, color: 'bg-orange-500' },
    { label: 'Delivered', value: delivered, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.displayName || user?.firstName || 'Customer'}!
              </h1>
              <p className="text-white/80">
                Track your orders and manage your account
              </p>
            </div>
            <Link
              to="/chat"
              className="btn bg-white text-primary hover:bg-white/90 px-6 py-3 gap-2 self-start"
            >
              <MessageSquare size={18} />
              Start Shopping
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Orders Table */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <button
                  onClick={fetchOrders}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Refresh orders"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              {error && !loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <AlertCircle size={32} className="mx-auto mb-2 text-red-400" />
                  <p>{error}</p>
                  <button
                    onClick={fetchOrders}
                    className="text-primary text-sm hover:underline mt-2"
                  >
                    Try again
                  </button>
                </div>
              ) : orders.length === 0 && !loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                  <Link to="/chat" className="text-primary text-sm hover:underline mt-2 inline-block">
                    Start shopping with MIRA
                  </Link>
                </div>
              ) : (
                <Table
                  dataSource={orders}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={orders.length > 5 ? { pageSize: 5 } : false}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/chat"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Chat with MIRA</p>
                    <p className="text-sm text-muted-foreground">Get shopping assistance</p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Edit Profile</p>
                    <p className="text-sm text-muted-foreground">Update your information</p>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground" />
                </Link>

             
              </div>
            </div>

            {/* Account Info */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Account Info</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user?.email || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{user?.phone || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
