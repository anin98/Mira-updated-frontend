import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import { message, Input } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../api/axios'
import { ENDPOINTS } from '../../api/config'

const phoneRegex = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/

export default function Auth() {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const validatePhone = (value) => {
    const cleaned = value.replace(/\s/g, '')
    return phoneRegex.test(cleaned)
  }

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePhone(phone)) {
      setError('Please enter a valid Bangladesh phone number (01XXXXXXXXX)')
      return
    }

    setLoading(true)
    try {
      await apiClient.post(ENDPOINTS.AUTH.REQUEST_OTP, {
        phone_number: phone.startsWith('+88') ? phone : `+88${phone}`,
      })
      message.success('OTP sent to your phone!')
      setStep(2)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP')
      return
    }

    setLoading(true)
    try {
      // 1. Verify OTP to get Tokens & ID
      const authResponse = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, {
        phone_number: phone.startsWith('+88') ? phone : `+88${phone}`,
        otp,
      })

      const { access, refresh, id } = authResponse.data
      const formattedPhone = phone.startsWith('+88') ? phone : `+88${phone}`

      // 2. Fetch User Profile to check for existing data
      // We manually pass the header here because localStorage might not be set yet
      let userData = {}
      let isProfileComplete = false

      try {
        const profileResponse = await apiClient.get(ENDPOINTS.CUSTOMERS.GET(id), {
          headers: { Authorization: `Bearer ${access}` }
        })
        
        const customer = profileResponse.data
        const nestedUser = customer.user || {}
        
        userData = {
          firstName: nestedUser.first_name || '',
          lastName: nestedUser.last_name || '',
          email: customer.email || nestedUser.email || '',
          displayName: customer.display_name || customer.name || '',
        }

        // Check completeness logic (matches your other file)
        if (userData.firstName && userData.lastName && userData.email) {
          isProfileComplete = true
        }

      } catch (profileErr) {
        // If 404, it's a new user, we proceed with empty profile data
        console.log('New user or profile fetch failed, proceeding to registration.')
      }

      // 3. Update Auth Context
      login(
        {
          id: id,
          phone: formattedPhone,
          ...userData
        },
        { access, refresh }
      )

      message.success('Login successful!')

      // 4. Conditional Navigation
      // If profile is full, go to Dashboard. If missing name/email, go to Auth/Completion.
      if (isProfileComplete) {
        navigate('/customer-dashboard')
      } else {
        navigate('/customer-auth')
      }

    } catch (err) {
      console.error("Login Error:", err)
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
                       <img src="/mira-ai.png" alt="MIRA AI" className="h-6 w-auto" />

          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Auth Card */}
        <div className="card">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-white' : 'bg-muted'
              }`}>
                {step > 1 ? <CheckCircle size={16} /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Phone</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-white' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="text-sm font-medium hidden sm:inline">Verify</span>
            </div>
          </div>

          {step === 1 ? (
            /* Step 1: Phone Number */
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <div className="relative">
                 
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="input pl-8"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Enter your Bangladesh phone number
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 gap-2"
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                  <Shield size={32} className="text-primary" />
                </div>
                <p className="text-muted-foreground">
                  We've sent a 4-digit code to <span className="font-medium text-foreground">{phone}</span>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center">
                  <Input.OTP
                    value={otp}
                    onChange={setOtp}
                    length={4}
                    size="large"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 gap-2"
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  Change number
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={loading}
                  className="text-primary hover:text-primary/80"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Are you a business?{' '}
          <Link to="/company-auth" className="text-primary hover:underline font-medium">
            Register your company
          </Link>
        </p>
      </div>
    </div>
  )
}