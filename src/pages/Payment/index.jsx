import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  CreditCard,
  Smartphone,
  MapPin,
  Check,
  ArrowLeft,
  Shield,
  Lock,
} from 'lucide-react'
import { Radio, Input, message } from 'antd'

const paymentMethods = [
  { id: 'bkash', name: 'bKash', icon: '🔴', type: 'mfs' },
  { id: 'nagad', name: 'Nagad', icon: '🟠', type: 'mfs' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, type: 'card' },
]

const deliveryOptions = [
  { id: 'inside', name: 'Inside Dhaka', price: 60 },
  { id: 'outside', name: 'Outside Dhaka', price: 120 },
]

const plans = {
  free: { name: 'Free', price: 0 },
  standard: { name: 'Standard', price: 2999 },
  enterprise: { name: 'Enterprise', price: 9999 },
}

export default function Payment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const planId = searchParams.get('plan') || 'standard'
  const plan = plans[planId] || plans.standard

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    paymentMethod: 'bkash',
    deliveryLocation: 'inside',
  })

  const selectedDelivery = deliveryOptions.find((d) => d.id === formData.deliveryLocation)
  const subtotal = plan.price
  const deliveryCharge = selectedDelivery?.price || 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email) {
      message.error('Please enter your email')
      return
    }

    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStep(2)
    setLoading(false)
  }

  const handleConfirmPayment = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    message.success('Payment successful! Redirecting to dashboard...')
    setTimeout(() => navigate('/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container-custom">
        {/* Back Link */}
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft size={18} />
          Back to Pricing
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card">
              <h1 className="text-2xl font-bold mb-6">Complete Your Purchase</h1>

              {step === 1 ? (
                <form onSubmit={handleSubmit}>
                  {/* Contact Information */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          size="large"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="01XXXXXXXXX"
                          size="large"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                    <Radio.Group
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full"
                    >
                      <div className="grid gap-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.paymentMethod === method.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                          >
                            <Radio value={method.id}>
                              <div className="flex items-center gap-3 ml-2">
                                {typeof method.icon === 'string' ? (
                                  <span className="text-2xl">{method.icon}</span>
                                ) : (
                                  <method.icon size={24} className="text-primary" />
                                )}
                                <span className="font-medium">{method.name}</span>
                              </div>
                            </Radio>
                          </div>
                        ))}
                      </div>
                    </Radio.Group>
                  </div>

                  {/* Delivery Location */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin size={20} />
                      Delivery Location
                    </h2>
                    <Radio.Group
                      value={formData.deliveryLocation}
                      onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                      className="w-full"
                    >
                      <div className="grid sm:grid-cols-2 gap-3">
                        {deliveryOptions.map((option) => (
                          <div
                            key={option.id}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.deliveryLocation === option.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setFormData({ ...formData, deliveryLocation: option.id })}
                          >
                            <Radio value={option.id}>
                              <div className="ml-2">
                                <span className="font-medium">{option.name}</span>
                                <span className="text-muted-foreground ml-2">৳{option.price}</span>
                              </div>
                            </Radio>
                          </div>
                        ))}
                      </div>
                    </Radio.Group>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl mb-6">
                    <Shield className="text-green-600" size={24} />
                    <div>
                      <p className="font-medium text-green-800">Secure Payment</p>
                      <p className="text-sm text-green-600">Your payment information is encrypted and secure</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        Proceed to Payment
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Payment Confirmation */
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                    <Smartphone size={40} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {formData.paymentMethod === 'card'
                      ? 'You will be redirected to complete card payment'
                      : `Please complete the payment of ৳${total.toLocaleString()} using ${
                          paymentMethods.find((m) => m.id === formData.paymentMethod)?.name
                        }`}
                  </p>

                  {formData.paymentMethod !== 'card' && (
                    <div className="bg-muted rounded-2xl p-8 mb-6 max-w-sm mx-auto">
                      <p className="text-sm text-muted-foreground mb-2">Send payment to:</p>
                      <p className="text-2xl font-bold gradient-text">01712-345678</p>
                      <p className="text-sm text-muted-foreground mt-2">Reference: MIRA-{Date.now()}</p>
                    </div>
                  )}

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setStep(1)}
                      className="btn-secondary px-6 py-3"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      className="btn-primary px-6 py-3 gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="spinner" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          I've Completed Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="p-4 bg-muted rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{plan.name} Plan</h3>
                    <p className="text-sm text-muted-foreground">Monthly subscription</p>
                  </div>
                  <span className="font-bold">৳{subtotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>৳{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="gradient-text">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-green-500" />
                  14-day free trial included
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-green-500" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-green-500" />
                  30-day money-back guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
