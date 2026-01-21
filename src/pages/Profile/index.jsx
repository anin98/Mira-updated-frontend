import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Save, Camera, LogOut } from 'lucide-react'
import { Input, message, Modal } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../api/axios'
import { ENDPOINTS } from '../../api/config'

export default function Profile() {
  const { user, isAuthenticated, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  
  // Start with loading true to prevent "flicker" of empty fields
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phone: '',
    address: '',
  })

  // 1. Fetch real data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }
    
    fetchProfileData()
  }, [isAuthenticated, navigate])

  const fetchProfileData = async () => {
    try {
      // Get ID from local storage or context
      const userId = localStorage.getItem('userId') || user?.id
      if (!userId) return

      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.GET(userId))
      const customer = response.data
      const userData = customer.user || {} // Handle the nested structure

      // Populate form with Backend Data
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        displayName: customer.display_name || userData.username || '',
        email: customer.email || userData.email || '', // Check both locations
        phone: customer.phone_number || '',
        address: customer.address || '',
      })
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      message.error("Could not load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const userId = localStorage.getItem('userId') || user?.id

      // 2. Send real update to Backend
      // Assuming your backend expects snake_case based on previous examples
      await apiClient.put(ENDPOINTS.CUSTOMERS.UPDATE(userId), {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        display_name: formData.displayName,
        address: formData.address,
      })

      // 3. Update Context so the rest of the app knows about the change
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        email: formData.email,
        address: formData.address,
      })

      message.success('Profile updated successfully')
    } catch (err) {
      console.error(err)
      message.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    Modal.confirm({
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Logout',
      okType: 'danger',
      onOk: () => {
        logout()
        navigate('/')
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-8 h-8 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                {formData.firstName?.[0] || formData.displayName?.[0] || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center border border-border hover:bg-muted transition-colors">
                <Camera size={16} className="text-muted-foreground" />
              </button>
            </div>
            <h1 className="text-2xl font-bold">{formData.displayName || 'Your Profile'}</h1>
            <p className="text-muted-foreground">{formData.email}</p>
          </div>

          {/* Profile Form */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    size="large"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    size="large"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="How should we call you?"
                  size="large"
                  prefix={<User size={16} className="text-muted-foreground" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  size="large"
                  prefix={<Mail size={16} className="text-muted-foreground" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  size="large"
                  prefix={<Phone size={16} className="text-muted-foreground" />}
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support to change your phone number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input.TextArea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Your delivery address"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-3 gap-2"
              >
                {saving ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}