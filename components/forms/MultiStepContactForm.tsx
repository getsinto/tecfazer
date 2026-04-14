'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const services = [
  { id: 'web-development', icon: '🌐', namePt: 'Desenvolvimento Web', nameEn: 'Web Development' },
  { id: 'mobile-apps', icon: '📱', namePt: 'Aplicações Móveis', nameEn: 'Mobile Apps' },
  { id: 'ecommerce', icon: '🛒', namePt: 'E-commerce', nameEn: 'E-commerce' },
  { id: 'custom-software', icon: '⚙️', namePt: 'Software Personalizado', nameEn: 'Custom Software' },
  { id: 'ui-ux-design', icon: '🎨', namePt: 'Design UI/UX', nameEn: 'UI/UX Design' },
  { id: 'consulting', icon: '💡', namePt: 'Consultoria', nameEn: 'Consulting' },
]

const budgetRanges = [
  { value: '< 5k', labelPt: 'Menos de 5.000€', labelEn: 'Less than €5,000' },
  { value: '5k-10k', labelPt: '5.000€ - 10.000€', labelEn: '€5,000 - €10,000' },
  { value: '10k-25k', labelPt: '10.000€ - 25.000€', labelEn: '€10,000 - €25,000' },
  { value: '25k-50k', labelPt: '25.000€ - 50.000€', labelEn: '€25,000 - €50,000' },
  { value: '> 50k', labelPt: 'Mais de 50.000€', labelEn: 'More than €50,000' },
]

const timelines = [
  { value: 'urgent', labelPt: 'Urgente (< 1 mês)', labelEn: 'Urgent (< 1 month)' },
  { value: '1-3-months', labelPt: '1-3 meses', labelEn: '1-3 months' },
  { value: '3-6-months', labelPt: '3-6 meses', labelEn: '3-6 months' },
  { value: 'flexible', labelPt: 'Flexível', labelEn: 'Flexible' },
]

const formSchema = z.object({
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budgetRange: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  gdprConsent: z.boolean().refine((val) => val === true, 'You must accept the privacy policy'),
})

type FormData = z.infer<typeof formSchema>

interface MultiStepContactFormProps {
  locale: string
}

export default function MultiStepContactForm({ locale }: MultiStepContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      gdprConsent: false,
    },
  })

  const steps = [
    { id: 1, titlePt: 'Serviços', titleEn: 'Services' },
    { id: 2, titlePt: 'Informações', titleEn: 'Information' },
    { id: 3, titlePt: 'Detalhes', titleEn: 'Details' },
  ]

  const toggleService = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((s) => s !== serviceId)
      : [...selectedServices, serviceId]
    
    setSelectedServices(newServices)
    setValue('services', newServices, { shouldValidate: true })
  }

  const nextStep = () => {
    if (currentStep === 1 && selectedServices.length === 0) {
      toast.error(locale === 'pt' ? 'Selecione pelo menos um serviço' : 'Select at least one service')
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          serviceInterest: data.services.join(', '),
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      toast.success(
        locale === 'pt' 
          ? 'Mensagem enviada com sucesso! Entraremos em contacto em breve.' 
          : 'Message sent successfully! We will contact you soon.'
      )

      // Reset form
      setCurrentStep(1)
      setSelectedServices([])
    } catch (error) {
      toast.error(
        locale === 'pt' 
          ? 'Erro ao enviar mensagem. Tente novamente.' 
          : 'Error sending message. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
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
              <div className="text-sm font-medium">
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

      {/* Form Steps */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                {locale === 'pt' 
                  ? 'Que serviços precisa?' 
                  : 'What services do you need?'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedServices.includes(service.id)
                        ? 'border-brand-teal bg-brand-teal/5 shadow-lg'
                        : 'border-gray-200 hover:border-brand-teal/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <div className="font-bold text-lg">
                      {locale === 'pt' ? service.namePt : service.nameEn}
                    </div>
                  </button>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-2">{errors.services.message}</p>
              )}
            </motion.div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">
                {locale === 'pt' 
                  ? 'Informações de Contacto' 
                  : 'Contact Information'}
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'pt' ? 'Nome *' : 'Name *'}
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                  placeholder={locale === 'pt' ? 'O seu nome' : 'Your name'}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'pt' ? 'Email *' : 'Email *'}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                  placeholder={locale === 'pt' ? 'seu@email.com' : 'your@email.com'}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'pt' ? 'Telefone' : 'Phone'}
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                    placeholder="+351 ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {locale === 'pt' ? 'Empresa' : 'Company'}
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                    placeholder={locale === 'pt' ? 'Nome da empresa' : 'Company name'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'pt' ? 'Orçamento *' : 'Budget *'}
                </label>
                <select
                  {...register('budgetRange')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                >
                  <option value="">
                    {locale === 'pt' ? 'Selecione...' : 'Select...'}
                  </option>
                  {budgetRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {locale === 'pt' ? range.labelPt : range.labelEn}
                    </option>
                  ))}
                </select>
                {errors.budgetRange && (
                  <p className="text-red-500 text-sm mt-1">{errors.budgetRange.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'pt' ? 'Prazo *' : 'Timeline *'}
                </label>
                <select
                  {...register('timeline')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                >
                  <option value="">
                    {locale === 'pt' ? 'Selecione...' : 'Select...'}
                  </option>
                  {timelines.map((timeline) => (
                    <option key={timeline.value} value={timeline.value}>
                      {locale === 'pt' ? timeline.labelPt : timeline.labelEn}
                    </option>
                  ))}
                </select>
                {errors.timeline && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Project Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold mb-6">
                {locale === 'pt' 
                  ? 'Detalhes do Projeto' 
                  : 'Project Details'}
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {locale === 'pt' ? 'Mensagem *' : 'Message *'}
                </label>
                <textarea
                  {...register('message')}
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none resize-none"
                  placeholder={
                    locale === 'pt'
                      ? 'Descreva o seu projeto, objetivos e requisitos...'
                      : 'Describe your project, goals and requirements...'
                  }
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  {...register('gdprConsent')}
                  type="checkbox"
                  id="gdprConsent"
                  className="mt-1"
                />
                <label htmlFor="gdprConsent" className="text-sm text-gray-600">
                  {locale === 'pt' ? (
                    <>
                      Concordo com a{' '}
                      <a href="/pt/privacidade" className="text-brand-teal hover:underline">
                        Política de Privacidade
                      </a>{' '}
                      e autorizo o tratamento dos meus dados pessoais. *
                    </>
                  ) : (
                    <>
                      I agree to the{' '}
                      <a href="/en/privacidade" className="text-brand-teal hover:underline">
                        Privacy Policy
                      </a>{' '}
                      and authorize the processing of my personal data. *
                    </>
                  )}
                </label>
              </div>
              {errors.gdprConsent && (
                <p className="text-red-500 text-sm">{errors.gdprConsent.message}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-brand-teal transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            {locale === 'pt' ? 'Anterior' : 'Previous'}
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              {locale === 'pt' ? 'Próximo' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-brand-teal to-brand-orange text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {locale === 'pt' ? 'Enviando...' : 'Sending...'}
                </>
              ) : (
                <>
                  {locale === 'pt' ? 'Enviar' : 'Submit'}
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
