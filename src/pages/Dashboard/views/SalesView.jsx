import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  CheckCircle,
  Package,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { Table, Tag, Modal, Select, message, Tooltip } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api/v1'

const STATUS_META = {
  PENDING_PAYMENT: { color: 'orange', label: 'Pending Payment' },
  PAYMENT_PENDING_VERIFICATION: { color: 'gold', label: 'Awaiting Verification' },
  CONFIRMED: { color: 'green', label: 'Confirmed' },
  PROCESSING: { color: 'blue', label: 'Processing' },
  SHIPPED: { color: 'cyan', label: 'Shipped' },
  DELIVERED: { color: 'green', label: 'Delivered' },
  CANCELLED: { color: 'red', label: 'Cancelled' },
}

const ALL_STATUSES = Object.entries(STATUS_META).map(([value, { label }]) => ({ value, label }))

export default function SalesView() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [updatingId, setUpdatingId] = useState(null)
  const [orderModal, setOrderModal] = useState(null)   // order object
  const [statusModal, setStatusModal] = useState(null) // { order }
  const [newStatus, setNewStatus] = useState('')
  const [analytics, setAnalytics] = useState({
    stats: [
      { title: 'Total Orders', value: '0', change: '0%', trend: 'up', icon: ShoppingCart, color: 'bg-blue-500' },
      { title: 'Revenue', value: '৳0', change: '0%', trend: 'up', icon: DollarSign, color: 'bg-green-500' },
      { title: 'Customers', value: '0', change: '0%', trend: 'up', icon: Users, color: 'bg-purple-500' },
      { title: 'Avg. Order Value', value: '৳0', change: '0%', trend: 'up', icon: TrendingUp, color: 'bg-orange-500' },
    ],
  })

  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/orders/`, { headers: getHeaders() })
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()

      const mapped = Array.isArray(data) ? data : (data.results ?? [])
      setOrders(mapped)

      // Derive stats from order list
      const totalRevenue = mapped.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0)
      const uniqueCustomers = new Set(mapped.map(o => o.customer?.id || o.guest_phone).filter(Boolean)).size
      setAnalytics({
        stats: [
          { title: 'Total Orders', value: mapped.length.toString(), change: '', trend: 'up', icon: ShoppingCart, color: 'bg-blue-500' },
          { title: 'Revenue', value: `৳${totalRevenue.toLocaleString()}`, change: '', trend: 'up', icon: DollarSign, color: 'bg-green-500' },
          { title: 'Customers', value: uniqueCustomers.toString(), change: '', trend: 'up', icon: Users, color: 'bg-purple-500' },
          { title: 'Avg. Order Value', value: `৳${mapped.length ? Math.round(totalRevenue / mapped.length).toLocaleString() : 0}`, change: '', trend: 'up', icon: TrendingUp, color: 'bg-orange-500' },
        ],
      })
    } catch (err) {
      console.error(err)
      message.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (order) => {
    try {
      setUpdatingId(order.id)
      const res = await fetch(`${API_BASE}/orders/${order.id}/verify/`, {
        method: 'POST',
        headers: getHeaders(),
      })
      if (!res.ok) throw new Error()
      message.success('Payment verified')
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: 'CONFIRMED' } : o))
    } catch {
      message.error('Failed to verify payment')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleUpdateStatus = async () => {
    if (!statusModal || !newStatus) return
    try {
      setUpdatingId(statusModal.order.id)
      const res = await fetch(`${API_BASE}/orders/${statusModal.order.id}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      message.success('Status updated')
      setOrders(prev => prev.map(o => o.id === statusModal.order.id ? { ...o, status: newStatus } : o))
      setStatusModal(null)
    } catch {
      message.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => { fetchData() }, [])

  const columns = [
    {
      title: 'Order',
      key: 'order',
      render: (_, o) => (
        <div>
          <span className="font-mono text-xs font-semibold">#{o.id}</span>
          {o.customer_provided_trxid && (
            <div className="text-xs text-muted-foreground mt-0.5">TxID: {o.customer_provided_trxid}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, o) => {
        const name = o.guest_name || o.customer?.name || 'Guest'
        const phone = o.guest_phone || o.customer?.phone_number || ''
        const address = o.guest_address || o.customer?.address || ''
        return (
          <div>
            <div className="font-medium text-sm">{name}</div>
            {phone && <div className="text-xs text-muted-foreground">{phone}</div>}
            {address && (
              <Tooltip title={address}>
                <div className="text-xs text-muted-foreground truncate max-w-[160px]">{address}</div>
              </Tooltip>
            )}
          </div>
        )
      },
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, o) => (
        <div>
          <div className="font-semibold">৳{parseFloat(o.total_amount).toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">
            Sub: ৳{o.subtotal} + Del: ৳{o.delivery_charge}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const meta = STATUS_META[status] || { color: 'default', label: status }
        return <Tag color={meta.color}>{meta.label}</Tag>
      },
    },
    {
      title: 'Date',
      key: 'date',
      render: (_, o) => (
        <span className="text-xs text-muted-foreground">
          {new Date(o.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, o) => (
        <div className="flex items-center gap-2">
          {o.status === 'PAYMENT_PENDING_VERIFICATION' && (
            <button
              onClick={() => handleVerify(o)}
              disabled={updatingId === o.id}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium disabled:opacity-50"
            >
              <CheckCircle size={12} />
              Verify
            </button>
          )}
          <button
            onClick={() => { setStatusModal({ order: o }); setNewStatus(o.status) }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
          >
            Update
          </button>
        </div>
      ),
    },
  ]


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sales Overview</h2>
        <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.stats.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                {stat.change && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold">Orders</h3>
          <span className="text-sm text-muted-foreground">{orders.length} orders</span>
        </div>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={loading}
          size="small"
          onRow={(record) => ({ onClick: () => setOrderModal(record), style: { cursor: 'pointer' } })}
          pagination={{ pageSize: 20, showSizeChanger: false }}
        />
      </div>

      {/* Order Detail Modal */}
      <Modal
        open={!!orderModal}
        onCancel={() => setOrderModal(null)}
        footer={null}
        width={600}
        title={
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold">Order #{orderModal?.id}</span>
            {orderModal && (
              <Tag color={STATUS_META[orderModal.status]?.color || 'default'}>
                {STATUS_META[orderModal.status]?.label || orderModal.status}
              </Tag>
            )}
          </div>
        }
      >
        {orderModal && (
          <div className="space-y-5 pt-2">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Customer</p>
              <div className="flex items-center gap-2 text-sm">
                <User size={14} className="text-muted-foreground flex-shrink-0" />
                <span className="font-medium">{orderModal.guest_name || orderModal.customer?.name || 'Guest'}</span>
              </div>
              {(orderModal.guest_phone || orderModal.customer?.phone_number) && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                  <span>{orderModal.guest_phone || orderModal.customer?.phone_number}</span>
                </div>
              )}
              {(orderModal.guest_address || orderModal.customer?.address) && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>{orderModal.guest_address || orderModal.customer?.address}</span>
                </div>
              )}
              {orderModal.customer_provided_trxid && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">TxID:</span>
                  <span className="font-mono font-medium">{orderModal.customer_provided_trxid}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">Items Ordered</p>
              <div className="space-y-2">
                {(orderModal.items || []).map(item => (
                  <div key={item.id} className="flex items-center gap-3 border border-border rounded-xl px-3 py-3">
                    {item.variant?.image ? (
                      <img
                        src={item.variant.image}
                        alt={item.variant.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Package size={22} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.variant?.name || 'Product'}</div>
                      {item.variant?.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.variant.description}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold">৳{item.price_at_purchase * item.quantity}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">৳{item.price_at_purchase} each</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>৳{orderModal.subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>৳{orderModal.delivery_charge}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-1 border-t border-border">
                <span>Total</span>
                <span>৳{orderModal.total_amount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              {orderModal.status === 'PAYMENT_PENDING_VERIFICATION' && (
                <button
                  onClick={() => { handleVerify(orderModal); setOrderModal(null) }}
                  disabled={updatingId === orderModal.id}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium disabled:opacity-50"
                >
                  <CheckCircle size={15} />
                  Verify Payment
                </button>
              )}
              <button
                onClick={() => { setStatusModal({ order: orderModal }); setNewStatus(orderModal.status); setOrderModal(null) }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title={`Update Order #${statusModal?.order?.id} Status`}
        open={!!statusModal}
        onOk={handleUpdateStatus}
        onCancel={() => setStatusModal(null)}
        okText="Update"
        confirmLoading={updatingId === statusModal?.order?.id}
        okButtonProps={{ disabled: !newStatus || newStatus === statusModal?.order?.status }}
      >
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-3">
            Current: <Tag color={STATUS_META[statusModal?.order?.status]?.color || 'default'}>{STATUS_META[statusModal?.order?.status]?.label || statusModal?.order?.status}</Tag>
          </p>
          <Select
            value={newStatus}
            onChange={setNewStatus}
            options={ALL_STATUSES}
            className="w-full"
            size="large"
          />
        </div>
      </Modal>
    </div>
  )
}
