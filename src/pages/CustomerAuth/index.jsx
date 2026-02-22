import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, ArrowRight, Sparkles } from 'lucide-react'
import { message } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../api/axios'
import { ENDPOINTS } from '../../api/config'

export default function CustomerAuth() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [profileComplete, setProfileComplete] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    displayName: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { user, isAuthenticated, updateUser } = useAuth()

  useEffect(() => {
    // Check localStorage directly to avoid race condition with context state
    const accessToken = localStorage.getItem('access_token')
    const userId = localStorage.getItem('userId')

    if (!accessToken || !userId) {
      navigate('/auth')
      return
    }
    checkProfile()
  }, [isAuthenticated, navigate])

  const checkProfile = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        navigate('/auth')
        return
      }

      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.GET(userId))
      const customer = response.data

      if (customer.first_name && customer.last_name && customer.email) {
        setProfileComplete(true)
        updateUser({
          customerId: customer.id,
          firstName: customer.first_name,
          lastName: customer.last_name,
          email: customer.email,
          name: customer.display_name,
        })
        navigate('/customer-dashboard')
      } else {
        setFormData({
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          email: customer.email || '',
          name: customer.display_name || '',
          address: customer.address || '',
        })
      }
    } catch (err) {
      console.error('Error checking profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const userId = localStorage.getItem('userId')
      const verifiedPhone = localStorage.getItem('verifiedPhone')
      await apiClient.put(ENDPOINTS.CUSTOMERS.UPDATE(userId), {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        name: formData.displayName || `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        ...(verifiedPhone && { phone_number: verifiedPhone }),
      })

      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        name: formData.displayName || `${formData.firstName} ${formData.lastName}`,
      })

      message.success('Profile completed successfully!')
      navigate('/customer-dashboard')
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 w-8 h-8 border-primary" />
          <p className="text-muted-foreground">Checking your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-bg mx-auto mb-4 flex items-center justify-center">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Just a few more details to get started with MIRA AI
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                Display Name <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="input"
                placeholder="How should we call you?"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Address <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="input pl-10 resize-none"
                  placeholder="Your delivery address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 gap-2"
            >
              {submitting ? (
                <>
                  <span className="spinner" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Profile
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Skip Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/chat" className="text-primary hover:underline">
            Skip for now and start chatting
          </Link>
        </p>
      </div>
    </div>
  )
}
