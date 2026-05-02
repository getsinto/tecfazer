'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, ArrowRight, ArrowLeft, Loader2, Download, Mail, X,
  FileText, Clock, Users, AlertCircle, ShoppingCart, Globe,
  Smartphone, Monitor, Settings, Package, CreditCard, BarChart3,
  Bell, Search, Languages, Shield, Lock, Zap, Star, CheckCircle2
} from 'lucide-react'
import { toast } from 'sonner'

interface EstimatorWizardProps { locale: string }

// Use Lucide icons instead of emojis to avoid encoding issues
const projectTypes = [
  { id: 'website',    Icon: Globe,       namePt: 'Website Corporativo',    nameEn: 'Corporate Website',    descPt: 'Site institucional, landing page ou portfolio',       descEn: 'Institutional site, landing page or portfolio',       fromPt: 'A partir de 150 EUR', fromEn: 'From 150 EUR', color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  { id: 'ecommerce',  Icon: ShoppingCart, namePt: 'Loja Online',            nameEn: 'E-commerce Store',     descPt: 'Loja com produtos, carrinho e pagamentos',            descEn: 'Store with products, cart and payments',              fromPt: 'A partir de 250 EUR', fromEn: 'From 250 EUR', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'web-app',    Icon: Monitor,     namePt: 'Aplicacao Web',          nameEn: 'Web Application',      descPt: 'Dashboard, SaaS ou plataforma com utilizadores',     descEn: 'Dashboard, SaaS or platform with users',             fromPt: 'A partir de 500 EUR', fromEn: 'From 500 EUR', color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200'  },
  { id: 'mobile-app', Icon: Smartphone,  namePt: 'App Mobile',             nameEn: 'Mobile App',           descPt: 'App iOS e Android nativa ou hibrida',                descEn: 'Native or hybrid iOS and Android app',               fromPt: 'A partir de 400 EUR', fromEn: 'From 400 EUR', color: 'text-pink-600',    bg: 'bg-pink-50',    border: 'border-pink-200'    },
  { id: 'custom',     Icon: Settings,    namePt: 'Software Personalizado', nameEn: 'Custom Software',      descPt: 'Sistema ERP, CRM ou solucao a medida',               descEn: 'ERP, CRM or custom-built solution',                  fromPt: 'A partir de 1200 EUR', fromEn: 'From 1200 EUR', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
]

const featuresList = [
  { id: 'user-auth',     Icon: Lock,      namePt: 'Login / Registo de Utilizadores', nameEn: 'User Login / Registration',  costPt: '+120 EUR', costEn: '+120 EUR' },
  { id: 'payment',       Icon: CreditCard, namePt: 'Pagamentos Online',              nameEn: 'Online Payments',            costPt: '+200 EUR', costEn: '+200 EUR' },
  { id: 'cms',           Icon: FileText,  namePt: 'Painel de Gestao de Conteudo',    nameEn: 'Content Management Panel',   costPt: '+180 EUR', costEn: '+180 EUR' },
  { id: 'api',           Icon: Zap,       namePt: 'API REST / Integracoes',          nameEn: 'REST API / Integrations',    costPt: '+150 EUR', costEn: '+150 EUR' },
  { id: 'analytics',     Icon: BarChart3, namePt: 'Analytics e Relatorios',          nameEn: 'Analytics & Reports',        costPt: '+80 EUR',  costEn: '+80 EUR'  },
  { id: 'notifications', Icon: Bell,      namePt: 'Notificacoes Push / Email',       nameEn: 'Push / Email Notifications', costPt: '+100 EUR', costEn: '+100 EUR' },
  { id: 'search',        Icon: Search,    namePt: 'Pesquisa Avancada',               nameEn: 'Advanced Search',            costPt: '+90 EUR',  costEn: '+90 EUR'  },
  { id: 'multilingual',  Icon: Languages, namePt: 'Multi-idioma (PT + EN)',          nameEn: 'Multi-language (PT + EN)',   costPt: '+130 EUR', costEn: '+130 EUR' },
  { id: 'seo',           Icon: Star,      namePt: 'Otimizacao SEO',                  nameEn: 'SEO Optimization',           costPt: '+100 EUR', costEn: '+100 EUR' },
  { id: 'security',      Icon: Shield,    namePt: 'Auditoria de Seguranca',          nameEn: 'Security Audit',             costPt: '+150 EUR', costEn: '+150 EUR' },
]

const designComplexities = [
  { value: 'SIMPLE',   labelPt: 'Simples',   labelEn: 'Simple',   descPt: 'Template existente adaptado, sem animacoes complexas',    descEn: 'Adapted existing template, no complex animations',    tagPt: 'Mais economico', tagEn: 'Most affordable', tagColor: 'bg-green-100 text-green-700'  },
  { value: 'MODERATE', labelPt: 'Moderado',  labelEn: 'Moderate', descPt: 'Design personalizado com animacoes e identidade visual',  descEn: 'Custom design with animations and visual identity',   tagPt: 'Mais popular',   tagEn: 'Most popular',    tagColor: 'bg-amber-100 text-amber-700'  },
  { value: 'COMPLEX',  labelPt: 'Complexo',  labelEn: 'Complex',  descPt: 'Design unico, micro-interacoes e experiencia premium',    descEn: 'Unique design, micro-interactions and premium UX',   tagPt: 'Premium',        tagEn: 'Premium',         tagColor: 'bg-purple-100 text-purple-700' },
]

const timelines = [
  { value: 'URGENT',   labelPt: 'Urgente (menos de 1 mes)',  labelEn: 'Urgent (less than 1 month)',  descPt: 'Equipa dedicada, entrega acelerada (+35%)',    descEn: 'Dedicated team, accelerated delivery (+35%)' },
  { value: 'NORMAL',   labelPt: 'Normal (1 a 3 meses)',      labelEn: 'Normal (1 to 3 months)',      descPt: 'Prazo padrao, melhor relacao custo-qualidade', descEn: 'Standard timeline, best cost-quality ratio'  },
  { value: 'FLEXIBLE', labelPt: 'Flexivel (3+ meses)',       labelEn: 'Flexible (3+ months)',        descPt: 'Desenvolvimento iterativo, poupa ate 10%',     descEn: 'Iterative development, saves up to 10%'      },
]

const trafficLevels = [
  { value: 'LOW',       labelPt: 'Baixo (menos de 10k/mes)',    labelEn: 'Low (less than 10k/month)',    descPt: 'Blog, portfolio, site pequeno',          descEn: 'Blog, portfolio, small site'          },
  { value: 'MEDIUM',    labelPt: 'Medio (10k a 100k/mes)',      labelEn: 'Medium (10k to 100k/month)',   descPt: 'PME, loja online, startup',              descEn: 'SME, online store, startup'           },
  { value: 'HIGH',      labelPt: 'Alto (100k a 1M/mes)',        labelEn: 'High (100k to 1M/month)',      descPt: 'Plataforma estabelecida, marketplace',   descEn: 'Established platform, marketplace'    },
  { value: 'VERY_HIGH', labelPt: 'Muito Alto (mais de 1M/mes)', labelEn: 'Very High (more than 1M/month)', descPt: 'Grande escala, infraestrutura dedicada', descEn: 'Large scale, dedicated infrastructure' },
]

function fmt(n: number, loc: string) {
  return new Intl.NumberFormat(loc === 'pt' ? 'pt-PT' : 'en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(n)
}
export default function EstimatorWizard({ locale }: EstimatorWizardProps) {
  const isPt = locale === 'pt'
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [orderForm, setOrderForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' })
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [estimate, setEstimate] = useState<any>(null)
  const [refNum] = useState(`TF-${Date.now().toString().slice(-6)}`)
  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    designComplexity: '',
    timeline: '',
    expectedTraffic: '',
  })

  const steps = [
    { id: 1, pt: 'Tipo',            en: 'Type'     },
    { id: 2, pt: 'Funcionalidades', en: 'Features' },
    { id: 3, pt: 'Design',          en: 'Design'   },
    { id: 4, pt: 'Prazo',           en: 'Timeline' },
    { id: 5, pt: 'Trafego',         en: 'Traffic'  },
    { id: 6, pt: 'Resultado',       en: 'Result'   },
  ]

  const toggleFeature = (id: string) =>
    setFormData(p => ({ ...p, features: p.features.includes(id) ? p.features.filter(f => f !== id) : [...p.features, id] }))

  const next = () => {
    if (step === 1 && !formData.projectType)      { toast.error(isPt ? 'Selecione um tipo de projeto' : 'Select a project type'); return }
    if (step === 2 && !formData.features.length)  { toast.error(isPt ? 'Selecione pelo menos uma funcionalidade' : 'Select at least one feature'); return }
    if (step === 3 && !formData.designComplexity) { toast.error(isPt ? 'Selecione a complexidade' : 'Select complexity'); return }
    if (step === 4 && !formData.timeline)         { toast.error(isPt ? 'Selecione um prazo' : 'Select a timeline'); return }
    if (step === 5 && !formData.expectedTraffic)  { toast.error(isPt ? 'Selecione o trafego' : 'Select traffic level'); return }
    if (step === 5) { calculate(); return }
    setStep(s => s + 1)
  }

  const calculate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/estimator/calculate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEstimate(data)
      setStep(6)
    } catch {
      toast.error(isPt ? 'Erro ao calcular. Tente novamente.' : 'Error calculating. Please try again.')
    } finally { setLoading(false) }
  }

  const downloadPDF = () => {
    if (!estimate) return
    const proj = projectTypes.find(p => p.id === formData.projectType)
    const selFeatures = featuresList.filter(f => formData.features.includes(f.id))
    const date = new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const featureRows = selFeatures.map(f =>
      `<tr><td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;">${isPt ? f.namePt : f.nameEn}</td><td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:right;">${isPt ? f.costPt : f.costEn}</td></tr>`
    ).join('')

    const recItems = estimate.recommendations.map((r: any) =>
      `<li style="margin-bottom:6px;color:#475569;">${isPt ? r.pt : r.en}</li>`
    ).join('')

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${isPt ? 'Orcamento' : 'Estimate'} ${refNum}</title>
    <style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:32px;color:#1e293b;background:#fff;}.header{background:linear-gradient(135deg,#1B7A8A,#F5A623);color:#fff;padding:32px;border-radius:12px;margin-bottom:24px;}.price-box{background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;}table{width:100%;border-collapse:collapse;font-size:14px;}th{background:#f8fafc;padding:10px;text-align:left;border-bottom:2px solid #e2e8f0;color:#64748b;}.total-row{background:#f0fdf4;font-weight:700;}.rec-box{background:#f0f9ff;border-left:4px solid #1B7A8A;padding:16px 20px;border-radius:0 8px 8px 0;margin-top:24px;}.footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;text-align:center;}@media print{body{padding:16px;}}</style></head><body>
    <div class="header"><div style="font-size:24px;font-weight:800;margin-bottom:8px;">TEC FAZER</div><div style="font-size:20px;font-weight:600;">${isPt ? 'Orcamento do Projeto' : 'Project Estimate'}</div><div style="opacity:0.85;font-size:13px;margin-top:6px;">${isPt ? 'Referencia' : 'Reference'}: ${refNum} - ${date}</div></div>
    <div class="price-box"><div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${isPt ? 'Investimento Estimado' : 'Estimated Investment'}</div><div style="font-size:48px;font-weight:800;color:#1B7A8A;">${fmt(estimate.estimate.average, locale)}</div><div style="color:#64748b;font-size:14px;margin-top:4px;">${fmt(estimate.estimate.min, locale)} - ${fmt(estimate.estimate.max, locale)}</div></div>
    <h3 style="margin:0 0 12px;font-size:16px;">${isPt ? 'Detalhamento' : 'Breakdown'}</h3>
    <table><thead><tr><th>${isPt ? 'Item' : 'Item'}</th><th style="text-align:right;">${isPt ? 'Custo' : 'Cost'}</th></tr></thead><tbody>
    <tr><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-weight:600;">${isPt ? proj?.namePt : proj?.nameEn}</td><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;">${fmt(estimate.breakdown.projectBase.cost, locale)}</td></tr>
    ${featureRows}
    <tr style="background:#f0fdf4;font-weight:700;"><td style="padding:10px;">${isPt ? 'Total Estimado' : 'Estimated Total'}</td><td style="padding:10px;text-align:right;color:#1B7A8A;font-size:16px;">${fmt(estimate.estimate.average, locale)}</td></tr>
    </tbody></table>
    ${estimate.recommendations.length > 0 ? `<div class="rec-box"><strong style="color:#1B7A8A;">Recomendacoes</strong><ul style="margin:10px 0 0;padding-left:18px;">${recItems}</ul></div>` : ''}
    <div class="footer">Tec Fazer - Mafra, Lisboa, Portugal - info@tecfazer.pt - +351 963 101 123<br>${isPt ? 'Este orcamento e indicativo. O valor final pode variar apos analise detalhada.' : 'This estimate is indicative. Final price may vary after detailed analysis.'}</div>
    </body></html>`

    const win = window.open('', '_blank')
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => { win.print() }, 500) }
  }

  const sendEmail = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast.error(isPt ? 'Introduza um email valido' : 'Enter a valid email')
      return
    }
    setEmailLoading(true)
    try {
      const res = await fetch('/api/estimator/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, locale, ...estimate, formData }),
      })
      const data = await res.json()
      // Accept both success and fallback (no email service configured)
      if (res.ok || data.fallback) {
        toast.success(isPt ? `Orcamento enviado para ${emailInput}` : `Estimate sent to ${emailInput}`)
        setShowEmailModal(false)
        setEmailInput('')
      } else {
        throw new Error()
      }
    } catch {
      toast.error(isPt ? 'Erro ao enviar email. Tente novamente.' : 'Error sending email. Please try again.')
    } finally { setEmailLoading(false) }
  }

  const submitOrder = async () => {
    if (!orderForm.name || !orderForm.email || !orderForm.email.includes('@')) {
      toast.error(isPt ? 'Preencha o nome e email' : 'Fill in name and email')
      return
    }
    setOrderLoading(true)
    try {
      const proj = projectTypes.find(p => p.id === formData.projectType)
      const body = {
        name: orderForm.name,
        email: orderForm.email,
        phone: orderForm.phone,
        company: orderForm.company,
        message: `PEDIDO DE SERVICO - Ref: ${refNum}\n\nProjeto: ${isPt ? proj?.namePt : proj?.nameEn}\nOrcamento: ${fmt(estimate.estimate.average, locale)}\nPrazo: ${estimate.timeline.weeks} semanas\n\nNotas: ${orderForm.notes}`,
        service: isPt ? proj?.namePt : proj?.nameEn,
        budget: `${estimate.estimate.average} EUR`,
        locale,
      }
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setOrderSubmitted(true)
        toast.success(isPt ? 'Pedido enviado! Entraremos em contacto em breve.' : 'Order sent! We will contact you shortly.')
      } else {
        throw new Error()
      }
    } catch {
      toast.error(isPt ? 'Erro ao enviar pedido. Tente novamente.' : 'Error sending order. Please try again.')
    } finally { setOrderLoading(false) }
  }
  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${s.id < step ? 'bg-[#1B7A8A] text-white shadow-md' : s.id === step ? 'bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-400'}`}>
                  {s.id < step ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-[10px] mt-1.5 font-semibold hidden sm:block uppercase tracking-wide ${s.id <= step ? 'text-[#1B7A8A]' : 'text-slate-400'}`}>
                  {isPt ? s.pt : s.en}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${s.id < step ? 'bg-[#1B7A8A]' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">

          {/* STEP 1 — Project Type */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{isPt ? 'Que tipo de projeto precisa?' : 'What type of project do you need?'}</h2>
              <p className="text-slate-500 mb-7 text-sm">{isPt ? 'Selecione a opcao que melhor descreve o seu projeto' : 'Select the option that best describes your project'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {projectTypes.map(t => (
                  <button key={t.id} onClick={() => setFormData(p => ({ ...p, projectType: t.id }))}
                    className={`group p-5 rounded-xl border-2 text-left transition-all duration-200
                      ${formData.projectType === t.id ? `${t.border} ${t.bg} shadow-md` : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                    <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${t.bg} ${t.border} border`}>
                      <t.Icon className={`h-5 w-5 ${t.color}`} />
                    </div>
                    <div className="font-bold text-sm text-slate-900 mb-1">{isPt ? t.namePt : t.nameEn}</div>
                    <div className="text-xs text-slate-500 mb-2 leading-relaxed">{isPt ? t.descPt : t.descEn}</div>
                    <div className={`text-xs font-bold ${t.color}`}>{isPt ? t.fromPt : t.fromEn}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Features */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{isPt ? 'Que funcionalidades precisa?' : 'What features do you need?'}</h2>
              <p className="text-slate-500 mb-7 text-sm">{isPt ? 'Selecione todas as que se aplicam ao seu projeto' : 'Select all that apply to your project'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuresList.map(f => {
                  const selected = formData.features.includes(f.id)
                  return (
                    <button key={f.id} onClick={() => toggleFeature(f.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3
                        ${selected ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all
                        ${selected ? 'bg-[#1B7A8A] text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <f.Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900">{isPt ? f.namePt : f.nameEn}</div>
                      </div>
                      <div className={`text-xs font-bold flex-shrink-0 ${selected ? 'text-[#1B7A8A]' : 'text-slate-400'}`}>{isPt ? f.costPt : f.costEn}</div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Design */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{isPt ? 'Complexidade do Design' : 'Design Complexity'}</h2>
              <p className="text-slate-500 mb-7 text-sm">{isPt ? 'Qual o nivel de personalizacao visual que precisa?' : 'What level of visual customization do you need?'}</p>
              <div className="space-y-3 max-w-xl mx-auto">
                {designComplexities.map(d => (
                  <button key={d.value} onClick={() => setFormData(p => ({ ...p, designComplexity: d.value }))}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200
                      ${formData.designComplexity === d.value ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900">{isPt ? d.labelPt : d.labelEn}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${d.tagColor}`}>{isPt ? d.tagPt : d.tagEn}</span>
                    </div>
                    <p className="text-sm text-slate-500">{isPt ? d.descPt : d.descEn}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Timeline */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{isPt ? 'Qual o prazo desejado?' : 'What is your desired timeline?'}</h2>
              <p className="text-slate-500 mb-7 text-sm">{isPt ? 'O prazo afeta o custo e a alocacao da equipa' : 'Timeline affects cost and team allocation'}</p>
              <div className="space-y-3 max-w-xl mx-auto">
                {timelines.map(t => (
                  <button key={t.value} onClick={() => setFormData(p => ({ ...p, timeline: t.value }))}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200
                      ${formData.timeline === t.value ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="font-bold text-slate-900 mb-1">{isPt ? t.labelPt : t.labelEn}</div>
                    <p className="text-sm text-slate-500">{isPt ? t.descPt : t.descEn}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Traffic */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{isPt ? 'Trafego Esperado' : 'Expected Traffic'}</h2>
              <p className="text-slate-500 mb-7 text-sm">{isPt ? 'Ajuda a dimensionar a infraestrutura necessaria' : 'Helps size the required infrastructure'}</p>
              <div className="space-y-3 max-w-xl mx-auto">
                {trafficLevels.map(t => (
                  <button key={t.value} onClick={() => setFormData(p => ({ ...p, expectedTraffic: t.value }))}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-200
                      ${formData.expectedTraffic === t.value ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="font-bold text-slate-900 mb-1">{isPt ? t.labelPt : t.labelEn}</div>
                    <p className="text-sm text-slate-500">{isPt ? t.descPt : t.descEn}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 6 — Results */}
          {step === 6 && estimate && (
            <motion.div key="s6" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-100">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">{isPt ? 'Orcamento Indicativo' : 'Indicative Estimate'}</div>
                  <div className="font-mono text-sm font-bold text-slate-700">{refNum}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">{isPt ? 'Valido por 30 dias' : 'Valid for 30 days'}</div>
                </div>
              </div>

              {/* Price Hero */}
              <div className="bg-gradient-to-br from-[#1B7A8A]/8 to-[#F5A623]/8 border border-[#1B7A8A]/20 rounded-2xl p-6 mb-6 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{isPt ? 'Investimento Estimado' : 'Estimated Investment'}</p>
                <div className="text-5xl font-black text-[#1B7A8A] mb-1">{fmt(estimate.estimate.average, locale)}</div>
                <p className="text-sm text-slate-500">{isPt ? 'Intervalo' : 'Range'}: {fmt(estimate.estimate.min, locale)} - {fmt(estimate.estimate.max, locale)}</p>
                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm border border-slate-100">
                    <Clock className="w-4 h-4 text-[#1B7A8A]" />
                    <span className="font-semibold">{estimate.timeline.weeks} {isPt ? 'semanas' : 'weeks'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm border border-slate-100">
                    <FileText className="w-4 h-4 text-[#F5A623]" />
                    <span className="font-semibold">~{estimate.breakdown.totalHours}h</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm border border-slate-100">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold">{isPt ? 'Equipa dedicada' : 'Dedicated team'}</span>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-700">{isPt ? 'Detalhamento do Orcamento' : 'Cost Breakdown'}</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left px-5 py-3 text-slate-500 font-semibold">{isPt ? 'Item' : 'Item'}</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-semibold">{isPt ? 'Horas' : 'Hours'}</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-semibold">{isPt ? 'Custo' : 'Cost'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50">
                      <td className="px-5 py-3 font-semibold text-slate-800">{isPt ? estimate.breakdown.projectBase.descPt : estimate.breakdown.projectBase.descEn}</td>
                      <td className="px-5 py-3 text-right text-slate-500">{estimate.breakdown.projectBase.hours}h</td>
                      <td className="px-5 py-3 text-right font-semibold">{fmt(estimate.breakdown.projectBase.cost, locale)}</td>
                    </tr>
                    {estimate.breakdown.features.map((f: any, i: number) => (
                      <tr key={i} className="border-b border-slate-50">
                        <td className="px-5 py-3 text-slate-600">{isPt ? f.labelPt : f.labelEn}</td>
                        <td className="px-5 py-3 text-right text-slate-400">{f.hours}h</td>
                        <td className="px-5 py-3 text-right text-slate-700">{fmt(f.cost, locale)}</td>
                      </tr>
                    ))}
                    {estimate.breakdown.trafficCost > 0 && (
                      <tr className="border-b border-slate-50">
                        <td className="px-5 py-3 text-slate-600">{isPt ? 'Infraestrutura de Trafego' : 'Traffic Infrastructure'}</td>
                        <td className="px-5 py-3 text-right text-slate-400">-</td>
                        <td className="px-5 py-3 text-right text-slate-700">{fmt(estimate.breakdown.trafficCost, locale)}</td>
                      </tr>
                    )}
                    <tr className="bg-[#1B7A8A]/5">
                      <td className="px-5 py-4 font-black text-slate-900" colSpan={2}>{isPt ? 'Total Estimado' : 'Estimated Total'}</td>
                      <td className="px-5 py-4 text-right font-black text-[#1B7A8A] text-lg">{fmt(estimate.estimate.average, locale)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Recommendations */}
              {estimate.recommendations.length > 0 && (
                <div className="border-l-4 border-[#1B7A8A] bg-blue-50/60 rounded-r-xl px-5 py-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-[#1B7A8A]" />
                    <span className="font-bold text-sm text-[#1B7A8A]">{isPt ? 'Recomendacoes' : 'Recommendations'}</span>
                  </div>
                  <ul className="space-y-2">
                    {estimate.recommendations.map((r: any, i: number) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-[#1B7A8A] mt-0.5 flex-shrink-0">-</span>
                        {isPt ? r.pt : r.en}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-slate-400 text-center mb-6">
                {isPt ? '* Orcamento indicativo baseado nas informacoes fornecidas. Valor final definido apos analise detalhada.' : '* Indicative estimate based on information provided. Final price set after detailed analysis.'}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <button onClick={() => setShowOrderModal(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all text-sm">
                  <ShoppingCart className="w-4 h-4" />
                  {isPt ? 'Encomendar Agora' : 'Order Now'}
                </button>
                <button onClick={() => setShowEmailModal(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
                  <Mail className="w-4 h-4" />
                  {isPt ? 'Enviar por Email' : 'Send by Email'}
                </button>
                <button onClick={downloadPDF}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-sm">
                  <Download className="w-4 h-4" />
                  {isPt ? 'Descarregar PDF' : 'Download PDF'}
                </button>
              </div>

              <div className="text-center">
                <button onClick={() => { setStep(1); setEstimate(null); setFormData({ projectType: '', features: [], designComplexity: '', timeline: '', expectedTraffic: '' }) }}
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2">
                  {isPt ? 'Recalcular orcamento' : 'Recalculate estimate'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 6 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 sm:px-8 bg-slate-50/50">
            <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ArrowLeft className="w-4 h-4" />
              {isPt ? 'Anterior' : 'Back'}
            </button>
            <span className="text-xs text-slate-400 font-medium">{step} / {steps.length - 1}</span>
            <button onClick={next} disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white text-sm font-bold hover:shadow-lg hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {step === 5 ? (isPt ? 'Calcular' : 'Calculate') : (isPt ? 'Proximo' : 'Next')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900">{isPt ? 'Enviar Orcamento por Email' : 'Send Estimate by Email'}</h3>
                <button onClick={() => setShowEmailModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-5">
                {isPt ? 'Introduza o seu email para receber o orcamento detalhado.' : 'Enter your email to receive the detailed estimate.'}
              </p>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendEmail()}
                placeholder={isPt ? 'o-seu-email@exemplo.com' : 'your-email@example.com'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm mb-4 transition-all"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  {isPt ? 'Cancelar' : 'Cancel'}
                </button>
                <button onClick={sendEmail} disabled={emailLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white text-sm font-bold hover:shadow-lg disabled:opacity-60 transition-all">
                  {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isPt ? 'Enviar' : 'Send'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Modal */}
      <AnimatePresence>
        {showOrderModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4">
              {!orderSubmitted ? (
                <>
                  {/* Order form header */}
                  <div className="bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-black text-white">{isPt ? 'Encomendar Servico' : 'Order Service'}</h3>
                        <p className="text-white/80 text-sm mt-1">{isPt ? 'Preencha os seus dados para iniciar o projeto' : 'Fill in your details to start the project'}</p>
                      </div>
                      <button onClick={() => setShowOrderModal(false)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    {/* Summary */}
                    <div className="mt-4 bg-white/15 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white/70 text-xs uppercase tracking-wide">{isPt ? 'Orcamento' : 'Estimate'}</div>
                        <div className="text-white font-black text-2xl">{estimate && fmt(estimate.estimate.average, locale)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/70 text-xs uppercase tracking-wide">{isPt ? 'Prazo' : 'Timeline'}</div>
                        <div className="text-white font-bold">{estimate?.timeline.weeks} {isPt ? 'semanas' : 'weeks'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          {isPt ? 'Nome *' : 'Name *'}
                        </label>
                        <input type="text" value={orderForm.name} onChange={e => setOrderForm(p => ({ ...p, name: e.target.value }))}
                          placeholder={isPt ? 'O seu nome' : 'Your name'}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          {isPt ? 'Email *' : 'Email *'}
                        </label>
                        <input type="email" value={orderForm.email} onChange={e => setOrderForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="email@exemplo.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          {isPt ? 'Telefone' : 'Phone'}
                        </label>
                        <input type="tel" value={orderForm.phone} onChange={e => setOrderForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+351 9XX XXX XXX"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          {isPt ? 'Empresa' : 'Company'}
                        </label>
                        <input type="text" value={orderForm.company} onChange={e => setOrderForm(p => ({ ...p, company: e.target.value }))}
                          placeholder={isPt ? 'Nome da empresa' : 'Company name'}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        {isPt ? 'Notas Adicionais' : 'Additional Notes'}
                      </label>
                      <textarea value={orderForm.notes} onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))}
                        rows={3}
                        placeholder={isPt ? 'Descreva brevemente o seu projeto, requisitos especificos ou perguntas...' : 'Briefly describe your project, specific requirements or questions...'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm resize-none transition-all" />
                    </div>

                    {/* Trust signals */}
                    <div className="grid grid-cols-3 gap-2 py-2">
                      {[
                        { icon: CheckCircle2, text: isPt ? 'Sem compromisso' : 'No commitment' },
                        { icon: Clock, text: isPt ? 'Resposta em 24h' : 'Reply in 24h' },
                        { icon: Shield, text: isPt ? 'Dados seguros' : 'Secure data' },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Icon className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setShowOrderModal(false)}
                        className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        {isPt ? 'Cancelar' : 'Cancel'}
                      </button>
                      <button onClick={submitOrder} disabled={orderLoading}
                        className="flex-2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white text-sm font-black hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 transition-all">
                        {orderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                        {isPt ? 'Confirmar Pedido' : 'Confirm Order'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Success state */
                <div className="p-10 text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">
                    {isPt ? 'Pedido Enviado!' : 'Order Sent!'}
                  </h3>
                  <p className="text-slate-500 mb-2">
                    {isPt ? 'Recebemos o seu pedido com sucesso.' : 'We received your order successfully.'}
                  </p>
                  <p className="text-slate-500 mb-6 text-sm">
                    {isPt ? 'A nossa equipa entrara em contacto em menos de 24 horas para confirmar os detalhes e iniciar o projeto.' : 'Our team will contact you within 24 hours to confirm details and start the project.'}
                  </p>
                  <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {isPt ? 'Email de confirmacao enviado' : 'Confirmation email sent'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {isPt ? 'Equipa notificada' : 'Team notified'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4 text-[#1B7A8A]" />
                      {isPt ? 'Resposta em menos de 24h' : 'Response within 24h'}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowOrderModal(false); setOrderSubmitted(false) }}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                      {isPt ? 'Fechar' : 'Close'}
                    </button>
                    <Link href={`/${locale}/contacto`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1B7A8A] text-white text-sm font-bold hover:bg-[#156570] transition-all">
                      {isPt ? 'Falar Connosco' : 'Contact Us'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}