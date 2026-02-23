import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Table, Tag, message } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api'

const statusColors = {
  PENDING: 'orange',
  PROCESSING: 'blue',
  SHIPPED: 'cyan',
  DELIVERED: 'green',
  CANCELLED: 'red',
  // Fallbacks
  pending: 'orange',
  processing: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

export default function SalesView() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState({
    stats: [
      { title: 'Total Orders', value: '0', change: '0%', trend: 'up', icon: ShoppingCart, color: 'bg-blue-500' },
      { title: 'Revenue', value: '৳0', change: '0%', trend: 'up', icon: DollarSign, color: 'bg-green-500' },
      { title: 'Customers', value: '0', change: '0%', trend: 'up', icon: Users, color: 'bg-purple-500' },
      { title: 'Avg. Order Value', value: '৳0', change: '0%', trend: 'up', icon: TrendingUp, color: 'bg-orange-500' },
    ],
    chartData: [],
    popularProducts: []
  })

  // Helper to get headers
  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)

      // 1. Fetch Orders List
      const ordersRes = await fetch(`${API_BASE}/v1/orders/`, { headers: getHeaders() })
      if (!ordersRes.ok) throw new Error('Failed to fetch orders')
      const ordersData = await ordersRes.json()
      
      // Map API orders to Table format
      // Note: Adjust 'items' count logic if your API provides item details
      const mappedOrders = Array.isArray(ordersData) ? ordersData.map(order => ({
        id: order.id,
        // Fallback to 'Guest' if name is missing, specific to your previous TSX usage
        customer: order.guest_name || order.customer_name || 'Guest Customer', 
        items: order.items ? order.items.length : 1, 
        total: order.total_amount,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString(),
        rawDate: new Date(order.created_at) // For sorting if needed
      })) : []

      setOrders(mappedOrders)

      // 2. Fetch Analytics (Stats, Charts, Popular Products)
      // We attempt to fetch from a dedicated analytics endpoint. 
      // If this endpoint doesn't exist yet, we can calculate some basics from the orders list above.
      try {
        const analyticsRes = await fetch(`${API_BASE}/dashboard/analytics/`, { headers: getHeaders() })
        
        if (analyticsRes.ok) {
          const data = await analyticsRes.json()
          
          setAnalytics({
            stats: [
              { title: 'Total Orders', value: data.total_orders?.toLocaleString() || '0', change: data.orders_growth || '0%', trend: (data.orders_growth || '').includes('-') ? 'down' : 'up', icon: ShoppingCart, color: 'bg-blue-500' },
              { title: 'Revenue', value: `৳${data.total_revenue?.toLocaleString() || '0'}`, change: data.revenue_growth || '0%', trend: (data.revenue_growth || '').includes('-') ? 'down' : 'up', icon: DollarSign, color: 'bg-green-500' },
              { title: 'Customers', value: data.total_customers?.toLocaleString() || '0', change: data.customers_growth || '0%', trend: (data.customers_growth || '').includes('-') ? 'down' : 'up', icon: Users, color: 'bg-purple-500' },
              { title: 'Avg. Order Value', value: `৳${data.avg_order_value?.toLocaleString() || '0'}`, change: '0%', trend: 'up', icon: TrendingUp, color: 'bg-orange-500' },
            ],
            chartData: data.weekly_stats || [],
            popularProducts: data.popular_products || []
          })
        } else {
            // FALLBACK: Calculate basic stats from orders if /analytics endpoint fails or doesn't exist
            const totalRevenue = mappedOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
            setAnalytics(prev => ({
                ...prev,
                stats: [
                    { ...prev.stats[0], value: mappedOrders.length.toString() },
                    { ...prev.stats[1], value: `৳${totalRevenue.toLocaleString()}` },
                    { ...prev.stats[2], value: new Set(mappedOrders.map(o => o.customer)).size.toString() },
                    { ...prev.stats[3], value: `৳${mappedOrders.length ? Math.round(totalRevenue / mappedOrders.length) : 0}` },
                ]
            }))
        }
      } catch (analyticsErr) {
        console.warn('Analytics endpoint unavailable, using calculated stats', analyticsErr)
      }

    } catch (error) {
      console.error(error)
      message.error('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const orderColumns = [
    { 
        title: 'Order ID', 
        dataIndex: 'id', 
        key: 'id',
        render: (id) => <span className="font-mono text-xs">#{id}</span>
    },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Items', dataIndex: 'items', key: 'items', align: 'center' },
    { 
        title: 'Total', 
        dataIndex: 'total', 
        key: 'total',
        render: (total) => <span>৳{parseFloat(total).toLocaleString()}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status] || 'default'}>
            {(status || 'UNKNOWN').replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
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
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
     

      
      </div>

      {/* Bottom Row */}
      <div className="">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <Table
            dataSource={orders.slice(0, 5)} // Show top 5
            columns={orderColumns}
            rowKey="id"
            pagination={false}
            loading={loading}
            size="small"
          />
        </div>

    
      </div>
    </div>
  )
}