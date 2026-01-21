import { useState, useEffect } from 'react'
import { Bot, Save, Sparkles, MessageSquare, Zap, FileText } from 'lucide-react'
import { Input, Select, Switch, Slider, message } from 'antd'

const API_BASE = 'https://api.grayscale-technologies.com/api'

const personalityTraits = [
  'Friendly', 'Professional', 'Casual', 'Formal', 'Enthusiastic', 'Helpful', 'Patient', 'Energetic',
]

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
]

export default function AIPersonaView() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [aiId, setAiId] = useState(null)
  
  const [config, setConfig] = useState({
    assistantName: '',
    personality: [],
    tone: 'friendly',
    greeting: '',
    businessContext: '',
    customRules: '',
    isActive: true,
    responseLength: 50,
  })

  // Headers Helper
  const getHeaders = () => {
    const token = localStorage.getItem('access_token')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  }

  // Load Config
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_BASE}/sales-ai/config/`, {
          headers: getHeaders(),
        })
        
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data) && data.length > 0) {
            const current = data[0]
            setAiId(current.id)
            
            // Parse 'persona' field back into UI components if possible, 
            // or just load into context if it's a unstructured blob.
            // Here we try to extract if we saved it in a structured way, else fallback.
            setConfig({
              assistantName: current.assistant_name || '',
              businessContext: current.persona || '', 
              customRules: current.rules || '',
              isActive: current.is_active,
              // Defaults for fields not explicitly in API schema but UI only
              personality: ['Friendly'], 
              tone: 'friendly',
              greeting: 'Hello! How can I help you?',
              responseLength: 50
            })
          }
        }
      } catch (error) {
        console.error('Error fetching AI config:', error)
      } finally {
        setFetching(false)
      }
    }
    fetchConfig()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Construct the payload matching the API expectation
    // We combine specific UI fields into the text blocks the API expects
    const fullPersona = `Tone: ${config.tone}. \nTraits: ${config.personality.join(', ')}. \nContext: ${config.businessContext} \nGreeting: ${config.greeting}`

    const payload = {
      assistant_name: config.assistantName,
      persona: fullPersona,
      rules: config.customRules,
      is_active: config.isActive
    }

    try {
      const url = aiId 
        ? `${API_BASE}/sales-ai/config/${aiId}/` 
        : `${API_BASE}/sales-ai/config/`
      
      const method = aiId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save configuration')

      const data = await response.json()
      if (!aiId && data.id) setAiId(data.id)

      message.success('AI configuration saved successfully')
    } catch (error) {
      console.error(error)
      message.error('Failed to save AI settings')
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
        {/* Basic Settings */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Assistant Settings</h2>
              <p className="text-sm text-muted-foreground">Customize your AI shopping assistant</p>
            </div>
            <div className="ml-auto">
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch checked={config.isActive} onChange={(c) => setConfig({...config, isActive: c})} />
                 </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Assistant Name</label>
              <Input
                value={config.assistantName}
                onChange={(e) => setConfig({ ...config, assistantName: e.target.value })}
                placeholder="MIRA"
                size="large"
                prefix={<Bot size={16} className="text-muted-foreground" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conversation Tone</label>
              <Select
                value={config.tone}
                onChange={(value) => setConfig({ ...config, tone: value })}
                className="w-full"
                size="large"
                options={toneOptions}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Personality Traits</label>
              <Select
                mode="multiple"
                value={config.personality}
                onChange={(value) => setConfig({ ...config, personality: value })}
                placeholder="Select traits"
                className="w-full"
                size="large"
                options={personalityTraits.map((t) => ({ value: t, label: t }))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Greeting Message</label>
              <Input.TextArea
                value={config.greeting}
                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                placeholder="Enter the initial greeting message..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Business Context */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Business Context & Rules</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Persona & Business Description</label>
              <Input.TextArea
                value={config.businessContext}
                onChange={(e) => setConfig({ ...config, businessContext: e.target.value })}
                placeholder="Describe your business, products, and target audience..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hard Rules (System Prompt)</label>
              <Input.TextArea
                value={config.customRules}
                onChange={(e) => setConfig({ ...config, customRules: e.target.value })}
                placeholder="Strict rules the AI must follow (e.g. 'Never discuss politics', 'Max discount is 10%')..."
                rows={4}
              />
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
                Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}