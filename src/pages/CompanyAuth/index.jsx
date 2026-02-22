import { useState, useEffect } from 'react' // Added useEffect
import { useNavigate, Link } from 'react-router-dom'
import {
  Building2,
  Briefcase,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import { message, Select, Switch } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../api/axios'
import { ENDPOINTS } from '../../api/config'

const industries = [
  'E-commerce',
  'Retail',
  'Food & Beverage',
  'Fashion',
  'Electronics',
  'Health & Beauty',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Other',
]

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
]

const deliveryZones = [
  'Inside Dhaka',
  'Outside Dhaka',
  'Chattogram',
  'Sylhet',
  'Khulna',
  'Rajshahi',
  'Nationwide',
]

const steps = [
  { title: 'Company Info', icon: Building2 },
  { title: 'Business Details', icon: Briefcase },
  { title: 'Delivery & Payment', icon: Truck },
]

export default function CompanyAuth() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingCompany, setCheckingCompany] = useState(true)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    whatsappNumber: '',
    website: '',
    industry: '',
    companySize: '',
    description: '',
    cashOnDelivery: true,
    homeDelivery: true,
    deliveryZones: ['Inside Dhaka'],
    deliveryCharges: '',
  })

  const navigate = useNavigate()
  const { loginCompany } = useAuth()

  // Check for existing company on mount - show loading until done
  useEffect(() => {
    const checkExistingCompany = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.COMPANIES.BASE)

        if (Array.isArray(response.data) && response.data.length > 0) {
          const existingCompany = response.data[0]
          const token = localStorage.getItem('access_token')
          loginCompany(existingCompany, token)
          message.success('Welcome back! Redirecting to dashboard...')
          navigate('/dashboard')
          return
        }
      } catch (err) {
        console.log('No existing company found, showing registration.')
      }
      setCheckingCompany(false)
    }

    checkExistingCompany()
  }, [loginCompany, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!formData.whatsappNumber.trim()) {
        newErrors.whatsappNumber = 'WhatsApp number is required'
      }
    }

    if (step === 2) {
      if (!formData.industry) newErrors.industry = 'Please select an industry'
      if (!formData.companySize) newErrors.companySize = 'Please select company size'
    }

    if (step === 3) {
      if (formData.deliveryZones.length === 0) {
        newErrors.deliveryZones = 'Please select at least one delivery zone'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (currentStep !== 3) return  // guard against premature submission
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      const deliveryScope = formData.deliveryZones.length === 1 && formData.deliveryZones[0] === 'Inside Dhaka'
        ? 'inside_dhaka'
        : 'nationwide'

      const username = localStorage.getItem('verifiedPhone') || localStorage.getItem('email')
      const userEmail = localStorage.getItem('email')
      const firstName = localStorage.getItem('firstName')
      const lastName = localStorage.getItem('lastName')

      const payload = {
        user: {
          username,
          email: userEmail,
          first_name: firstName,
          last_name: lastName,
        },
        name: formData.companyName,
        email: formData.email,
        whatsapp_number: formData.whatsappNumber,
        website: formData.website
          ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`)
          : undefined,
        allow_cash_on_delivery: formData.cashOnDelivery,
        supports_home_delivery: formData.homeDelivery,
        delivery_scope: deliveryScope,
        delivery_charge_inside_dhaka: formData.deliveryCharges ? parseInt(formData.deliveryCharges) : 0,
        delivery_charge_outside_dhaka: formData.deliveryCharges ? parseInt(formData.deliveryCharges) : 0,
      }

      console.log('Submitting company payload:', payload)

      const response = await apiClient.post(ENDPOINTS.COMPANIES.BASE, payload)

      const companyData = response.data
      const token = response.data.token || response.data.access_token

      loginCompany(companyData, token)
      message.success('Company registered successfully!')
      navigate('/dashboard')
    } catch (err) {
      console.error('Company registration error:', err.response?.data)
      // DRF returns errors as nested objects, not a single message string
      const errData = err.response?.data
      if (errData && typeof errData === 'object') {
        const firstError = Object.entries(errData)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : JSON.stringify(msgs)}`)
          .join('\n')
        message.error(firstError || 'Failed to register company')
      } else {
        message.error('Failed to register company')
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.companyName ? 'border-red-500' : ''}`}
                  placeholder="Your Company Name"
                />
              </div>
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Business Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="company@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.whatsappNumber ? 'border-red-500' : ''}`}
                  placeholder="01XXXXXXXXX"
                />
              </div>
              {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Website <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.industry || undefined}
                onChange={(value) => handleSelectChange('industry', value)}
                placeholder="Select your industry"
                className="w-full"
                size="large"
                status={errors.industry ? 'error' : ''}
                options={industries.map((ind) => ({ value: ind, label: ind }))}
              />
              {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company Size <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.companySize || undefined}
                onChange={(value) => handleSelectChange('companySize', value)}
                placeholder="Select company size"
                className="w-full"
                size="large"
                status={errors.companySize ? 'error' : ''}
                options={companySizes}
              />
              {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Business Description <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input pl-10 resize-none"
                  placeholder="Tell us about your business..."
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Accept payment on delivery</p>
                  </div>
                </div>
                <Switch
                  checked={formData.cashOnDelivery}
                  onChange={(checked) => handleSwitchChange('cashOnDelivery', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">Home Delivery</p>
                    <p className="text-sm text-muted-foreground">Offer delivery to customers</p>
                  </div>
                </div>
                <Switch
                  checked={formData.homeDelivery}
                  onChange={(checked) => handleSwitchChange('homeDelivery', checked)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Delivery Zones <span className="text-red-500">*</span>
              </label>
              <Select
                mode="multiple"
                value={formData.deliveryZones}
                onChange={(value) => handleSelectChange('deliveryZones', value)}
                placeholder="Select delivery zones"
                className="w-full"
                size="large"
                status={errors.deliveryZones ? 'error' : ''}
                options={deliveryZones.map((zone) => ({ value: zone, label: zone }))}
              />
              {errors.deliveryZones && <p className="text-red-500 text-xs mt-1">{errors.deliveryZones}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Delivery Charges <span className="text-muted-foreground text-xs">(BDT)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                <input
                  type="number"
                  name="deliveryCharges"
                  value={formData.deliveryCharges}
                  onChange={handleChange}
                  className="input pl-8"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (checkingCompany) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="spinner w-10 h-10 border-primary" />
        <p className="text-muted-foreground">Checking your account...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
                         <img src="/mira-ai.png" alt="MIRA AI" className="h-4 w-auto" />

          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Register Your Business</h1>
          <p className="text-muted-foreground">
            Join MIRA AI and transform your e-commerce experience
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > index + 1 ? (
                    <CheckCircle size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    currentStep >= index + 1 ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 -mt-6 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary flex-1 py-3 gap-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary flex-1 py-3 gap-2"
                >
                  Continue
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 gap-2"
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link to="/auth" className="text-primary hover:underline font-medium">
            Sign in as customer
          </Link>
        </p>
      </div>
    </div>
  )
}