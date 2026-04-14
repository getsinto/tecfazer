'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, Loader2, Download, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface EstimatorWizardProps {
  locale: string
}

const projectTypes = [
  { id: 'website', icon: '🌐', namePt: 'Website Corporativo', nameEn: 'Corporate Website' },
  { id: 'ecommerce', icon: '🛒', namePt: 'Loja Online', nameEn: 'E-commerce Store' },
  { id: 'web-app', icon: '💻', namePt: 'Aplicação Web', nameEn: 'Web Application' },
  { id: 'mobile-app', icon: '📱', namePt: 'App Móvel', nameEn: 'Mobile App' },
  { id: 'custom', icon: '⚙️', namePt: 'Software Personalizado', nameEn: 'Custom Software' },
]

const features = [
  { id: 'user-auth', namePt: 'Autenticação de Utilizadores', nameEn: 'User Authentication' },
  { id: 'payment', namePt: 'Integração de Pagamentos', nameEn: 'Payment Integration' },
  { id: 'cms', namePt: 'Sistema de Gestão de Conteúdo', nameEn: 'Content Management System' },
  { id: 'api', namePt: 'API REST', nameEn: 'REST API' },
  { id: 'analytics', namePt: 'Analytics e Relatórios', nameEn: 'Analytics & Reports' },
  { id: 'notifications', namePt: 'Notificações Push', nameEn: 'Push Notifications' },
  { id: 'search', namePt: 'Pesquisa Avançada', nameEn: 'Advanced Search' },
  { id: 'multilingual', namePt: 'Multi-idioma', nameEn: 'Multi-language' },
  { id: 'seo', namePt: 'Otimização SEO', nameEn: 'SEO Optimization' },
  { id: 'security', namePt: 'Auditoria de Segurança', nameEn: 'Security Audit' },
]

const designComplexities = [
  { value: 'SIMPLE', labelPt: 'Simples', labelEn: 'Simple', descPt: 'Design minimalista e limpo', descEn: 'Minimalist and clean design' },
  { value: 'MODERATE', labelPt: 'Moderado', labelEn: 'Moderate', descPt: 'Design personalizado com animações', descEn: 'Custom design with animations' },
  { value: 'COMPLEX', labelPt: 'Complexo', labelEn: 'Complex', descPt: 'Design único com interações avançadas', descEn: 'Unique design with advanced interactions' },
]

const timelines = [
  { value: 'URGENT', labelPt: 'Urgente (< 1 mês)', labelEn: 'Urgent (< 1 month)' },
  { value: 'NORMAL', labelPt: 'Normal (1-3 meses)', labelEn: 'Normal (1-3 months)' },
  { value: 'FLEXIBLE', labelPt: 'Flexível (3+ meses)', labelEn: 'Flexible (3+ months)' },
]

const trafficLevels = [
  { value: 'LOW', labelPt: 'Baixo (< 10k/mês)', labelEn: 'Low (< 10k/month)' },
  { value: 'MEDIUM', labelPt: 'Médio (10k-100k/mês)', labelEn: 'Medium (10k-100k/month)' },
  { value: 'HIGH', labelPt: 'Alto (100k-1M/mês)', labelEn: 'High (100k-1M/month)' },
  { value: 'VERY_HIGH', labelPt: 'Muito Alto (> 1M/mês)', labelEn: 'Very High (> 1M/month)' },
]

export default function EstimatorWizard({ locale }: EstimatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)
  const [estimate, setEstimate] = useState<any>(null)

  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    designComplexity: '',
    timeline: '',
    expectedTraffic: '',
  })

  const steps = [
    { id: 1, titlePt: 'Tipo', titleEn: 'Type' },
    { id: 2, titlePt: 'Funcionalidades', titleEn: 'Features' },
    { id: 3, titlePt: 'Design', titleEn: 'Design' },
    { id: 4, titlePt: 'Prazo', titleEn: 'Timeline' },
    { id: 5, titlePt: 'Tráfego', titleEn: 'Traffic' },
    { id: 6, titlePt: 'Resultado', titleEn: 'Result' },
  ]

  const nextStep = () => {
    if (currentStep === 1 && !formData.projectType) {
      toast.error(locale === 'pt' ? 'Selecione um tipo de projeto' : 'Select a project type')
      return
    }
    if (currentStep === 2 && formData.features.length === 0) {
      toast.error(locale === 'pt' ? 'Selecione pelo menos uma funcionalidade' : 'Select at least one feature')
      return
    }
    if (currentStep === 3 && !formData.designComplexity) {
      toast.error(locale === 'pt' ? 'Selecione a complexidade do design' : 'Select design complexity')
      return
    }
    if (currentStep === 4 && !formData.timeline) {
      toast.error(locale === 'pt' ? 'Selecione um prazo' : 'Select a timeline')
      return
    }
    if (currentStep === 5 && !formData.expectedTraffic) {
      toast.error(locale === 'pt' ? 'Selecione o nível de tráfego' : 'Select traffic level')
      return
    }

    if (currentStep === 5) {
      calculateEstimate()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId],
    }))
  }

  const calculateEstimate = async () => {
    setIsCalculating(true)

    try {
      const response = await fetch('/api/estimator/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to calculate')

      const data = await response.json()
      setEstimate(data)
      setCurrentStep(6)
    } catch (error) {
      toast.error(
        locale === 'pt' 
          ? 'Erro ao calcular orçamento. Tente novamente.' 
          : 'Error calculating estimate. Please try again.'
      )
    } finally {
      setIsCalculating(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'pt' ? 'pt-PT' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 text-center ${
                step.id <= currentStep ? 'text-brand-teal' : 'text-gray-400'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm ${
                    step.id < currentStep
                      ? 'bg-brand-teal text-white'
                      : step.id === currentStep
                      ? 'bg-gradient-to-r from-brand-teal to-brand-orange text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.id < currentStep ? <Check className="w-5 h-5" /> : step.id}
                </div>
              </div>
              <div className="text-xs md:text-sm font-medium">
                {locale === 'pt' ? step.titlePt : step.titleEn}
              </div>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-teal to-brand-orange"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Steps Content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Project Type */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {locale === 'pt' ? 'Que tipo de projeto precisa?' : 'What type of project do you need?'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, projectType: type.id })}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.projectType === type.id
                      ? 'border-brand-teal bg-brand-teal/5 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="text-5xl mb-4">{type.icon}</div>
                  <div className="font-bold text-lg">
                    {locale === 'pt' ? type.namePt : type.nameEn}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Features */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {locale === 'pt' ? 'Que funcionalidades precisa?' : 'What features do you need?'}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {locale === 'pt' ? 'Selecione todas as que se aplicam' : 'Select all that apply'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.features.includes(feature.id)
                      ? 'border-brand-teal bg-brand-teal/5'
                      : 'border-gray-200 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.features.includes(feature.id)
                          ? 'border-brand-teal bg-brand-teal'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.features.includes(feature.id) && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">
                      {locale === 'pt' ? feature.namePt : feature.nameEn}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Design Complexity */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {locale === 'pt' ? 'Complexidade do Design' : 'Design Complexity'}
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {designComplexities.map((complexity) => (
                <button
                  key={complexity.value}
                  onClick={() => setFormData({ ...formData, designComplexity: complexity.value })}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    formData.designComplexity === complexity.value
                      ? 'border-brand-teal bg-brand-teal/5 shadow-lg'
                      : 'border-gray-200 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="font-bold text-xl mb-2">
                    {locale === 'pt' ? complexity.labelPt : complexity.labelEn}
                  </div>
                  <div className="text-gray-600">
                    {locale === 'pt' ? complexity.descPt : complexity.descEn}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Timeline */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {locale === 'pt' ? 'Qual o prazo desejado?' : 'What is your desired timeline?'}
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {timelines.map((timeline) => (
                <button
                  key={timeline.value}
                  onClick={() => setFormData({ ...formData, timeline: timeline.value })}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    formData.timeline === timeline.value
                      ? 'border-brand-teal bg-brand-teal/5 shadow-lg'
                      : 'border-gray-200 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="font-bold text-xl">
                    {locale === 'pt' ? timeline.labelPt : timeline.labelEn}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 5: Traffic */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">
              {locale === 'pt' ? 'Tráfego Esperado' : 'Expected Traffic'}
            </h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {trafficLevels.map((traffic) => (
                <button
                  key={traffic.value}
                  onClick={() => setFormData({ ...formData, expectedTraffic: traffic.value })}
                  className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                    formData.expectedTraffic === traffic.value
                      ? 'border-brand-teal bg-brand-teal/5 shadow-lg'
                      : 'border-gray-200 hover:border-brand-teal/50'
                  }`}
                >
                  <div className="font-bold text-xl">
                    {locale === 'pt' ? traffic.labelPt : traffic.labelEn}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 6: Results */}
        {currentStep === 6 && estimate && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {locale === 'pt' ? 'Orçamento Estimado' : 'Estimated Budget'}
              </h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent mb-2">
                {formatCurrency(estimate.estimate.average)}
              </div>
              <div className="text-gray-600">
                {formatCurrency(estimate.estimate.min)} - {formatCurrency(estimate.estimate.max)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h3 className="font-bold text-xl mb-4">
                {locale === 'pt' ? 'Prazo Estimado' : 'Estimated Timeline'}
              </h3>
              <div className="text-3xl font-bold text-brand-teal mb-2">
                {estimate.timeline.weeks} {locale === 'pt' ? 'semanas' : 'weeks'}
              </div>
              <p className="text-gray-600">{estimate.timeline.description}</p>
            </div>

            {estimate.recommendations && estimate.recommendations.length > 0 && (
              <div className="bg-brand-teal/5 rounded-xl p-8 mb-8">
                <h3 className="font-bold text-xl mb-4">
                  {locale === 'pt' ? 'Recomendações' : 'Recommendations'}
                </h3>
                <ul className="space-y-2">
                  {estimate.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-orange text-white rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                {locale === 'pt' ? 'Enviar por Email' : 'Send by Email'}
              </button>
              <button className="px-8 py-4 border-2 border-brand-teal text-brand-teal rounded-lg font-bold hover:bg-brand-teal hover:text-white transition-all flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                {locale === 'pt' ? 'Descarregar PDF' : 'Download PDF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {currentStep < 6 && (
        <div className="flex justify-between mt-12">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-teal transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {locale === 'pt' ? 'Anterior' : 'Previous'}
          </button>

          <button
            onClick={nextStep}
            disabled={isCalculating}
            className="px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {locale === 'pt' ? 'Calculando...' : 'Calculating...'}
              </>
            ) : (
              <>
                {currentStep === 5 ? (locale === 'pt' ? 'Calcular' : 'Calculate') : (locale === 'pt' ? 'Próximo' : 'Next')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
