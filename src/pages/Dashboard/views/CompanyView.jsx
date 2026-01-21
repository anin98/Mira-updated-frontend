import { useState, useEffect } from 'react'
import { Building2, Mail, Phone, Globe, Save, Truck, CreditCard } from 'lucide-react'
import { Input, Switch, message } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api'

export default function CompanyView() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [companyId, setCompanyId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    cashOnDelivery: true,
    homeDelivery: true,
    deliveryChargeInside: 0,
    deliveryChargeOutside: 0,
    deliveryScope: 'dhaka_only',
  })

  // Headers Helper
  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`${API_BASE}/v1/user-companies/`, {
            headers: getHeaders(),
        })

        if (!response.ok) throw new Error('Failed to fetch company data')

        const data = await response.json()
        
        if (Array.isArray(data) && data.length > 0) {
            const company = data[0]
            setCompanyId(company.id)
            setFormData({
                name: company.name,
                email: company.email || '',
                phone: company.whatsapp_number || '',
                website: company.website || '',
                description: '', // API doesn't seem to have description in the main object
                cashOnDelivery: company.allow_cash_on_delivery,
                homeDelivery: company.supports_home_delivery,
                deliveryChargeInside: company.delivery_charge_inside_dhaka,
                deliveryChargeOutside: company.delivery_charge_outside_dhaka,
                deliveryScope: company.delivery_scope
            })
        }
      } catch (error) {
        console.error(error)
        message.error('Could not load company details')
      } finally {
        setFetching(false)
      }
    }
    fetchCompany()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!companyId) return

    setLoading(true)

    const payload = {
        name: formData.name,
        whatsapp_number: formData.phone,
        email: formData.email,
        website: formData.website,
        allow_cash_on_delivery: formData.cashOnDelivery,
        supports_home_delivery: formData.homeDelivery,
        delivery_scope: formData.deliveryScope,
        delivery_charge_inside_dhaka: formData.deliveryChargeInside,
        delivery_charge_outside_dhaka: formData.deliveryChargeOutside
    }

    try {
      const response = await fetch(`${API_BASE}/v1/companies/${companyId}/`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Failed to update')

      message.success('Company settings updated successfully')
    } catch (error) {
      console.error(error)
      message.error('Failed to update company settings')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
      return <div className="flex justify-center p-12"><span className="spinner"></span></div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Update your company details</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                prefix={<Building2 size={16} className="text-muted-foreground" />}
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business Email</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                prefix={<Mail size={16} className="text-muted-foreground" />}
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                prefix={<Phone size={16} className="text-muted-foreground" />}
                size="large"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                prefix={<Globe size={16} className="text-muted-foreground" />}
                size="large"
              />
            </div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <Truck size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Delivery & Payment</h2>
              <p className="text-sm text-muted-foreground">Configure delivery and payment options</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Accept payment on delivery</p>
                </div>
              </div>
              <Switch
                checked={formData.cashOnDelivery}
                onChange={(checked) => setFormData({ ...formData, cashOnDelivery: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-primary" />
                <div>
                  <p className="font-medium">Home Delivery</p>
                  <p className="text-sm text-muted-foreground">Offer delivery to customers</p>
                </div>
              </div>
              <Switch
                checked={formData.homeDelivery}
                onChange={(checked) => setFormData({ ...formData, homeDelivery: checked })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Delivery Charge (Inside Dhaka)</label>
                    <Input
                        type="number"
                        value={formData.deliveryChargeInside}
                        onChange={(e) => setFormData({ ...formData, deliveryChargeInside: parseInt(e.target.value) || 0 })}
                        prefix={<span className="text-muted-foreground">৳</span>}
                        size="large"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Delivery Charge (Outside Dhaka)</label>
                    <Input
                        type="number"
                        value={formData.deliveryChargeOutside}
                        onChange={(e) => setFormData({ ...formData, deliveryChargeOutside: parseInt(e.target.value) || 0 })}
                        prefix={<span className="text-muted-foreground">৳</span>}
                        size="large"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-3 gap-2"
          >
            {loading ? (
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
        </div>
      </form>
    </div>
  )
}