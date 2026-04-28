'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, Loader2, Download, Mail, X, FileText, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface EstimatorWizardProps { locale: string }

const projectTypes = [
  { id: 'website',    icon: '🌐', namePt: 'Website Corporativo',    nameEn: 'Corporate Website',    descPt: 'Site institucional, landing page ou portfólio',       descEn: 'Institutional site, landing page or portfolio',       fromPt: 'A partir de €450', fromEn: 'From €450' },
  { id: 'ecommerce',  icon: '🛒', namePt: 'Loja Online',            nameEn: 'E-commerce Store',     descPt: 'Loja com produtos, carrinho e pagamentos',            descEn: 'Store with products, cart and payments',              fromPt: 'A partir de €900', fromEn: 'From €900' },
  { id: 'web-app',    icon: '💻', namePt: 'Aplicação Web',          nameEn: 'Web Application',      descPt: 'Dashboard, SaaS ou plataforma com utilizadores',     descEn: 'Dashboard, SaaS or platform with users',             fromPt: 'A partir de €1.400', fromEn: 'From €1,400' },
  { id: 'mobile-app', icon: '��', namePt: 'App Móvel',              nameEn: 'Mobile App',           descPt: 'App iOS e Android nativa ou híbrida',                descEn: 'Native or hybrid iOS and Android app',               fromPt: 'A partir de €1.800', fromEn: 'From €1,800' },
  { id: 'custom',     icon: '⚙️', namePt: 'Software Personalizado', nameEn: 'Custom Software',      descPt: 'Sistema ERP, CRM ou solução à medida',               descEn: 'ERP, CRM or custom-built solution',                  fromPt: 'A partir de €2.200', fromEn: 'From €2,200' },
]

const features = [
  { id: 'user-auth',     namePt: 'Login / Registo de Utilizadores', nameEn: 'User Login / Registration',  costPt: '+€120', costEn: '+€120' },
  { id: 'payment',       namePt: 'Pagamentos Online',               nameEn: 'Online Payments',            costPt: '+€200', costEn: '+€200' },
  { id: 'cms',           namePt: 'Painel de Gestão de Conteúdo',    nameEn: 'Content Management Panel',   costPt: '+€180', costEn: '+€180' },
  { id: 'api',           namePt: 'API REST / Integrações',          nameEn: 'REST API / Integrations',    costPt: '+€150', costEn: '+€150' },
  { id: 'analytics',     namePt: 'Analytics e Relatórios',          nameEn: 'Analytics & Reports',        costPt: '+€80',  costEn: '+€80'  },
  { id: 'notifications', namePt: 'Notificações Push / Email',       nameEn: 'Push / Email Notifications', costPt: '+€100', costEn: '+€100' },
  { id: 'search',        namePt: 'Pesquisa Avançada',               nameEn: 'Advanced Search',            costPt: '+€90',  costEn: '+€90'  },
  { id: 'multilingual',  namePt: 'Multi-idioma (PT + EN)',          nameEn: 'Multi-language (PT + EN)',   costPt: '+€130', costEn: '+€130' },
  { id: 'seo',           namePt: 'Otimização SEO',                  nameEn: 'SEO Optimization',           costPt: '+€100', costEn: '+€100' },
  { id: 'security',      namePt: 'Auditoria de Segurança',          nameEn: 'Security Audit',             costPt: '+€150', costEn: '+€150' },
]

const designComplexities = [
  { value: 'SIMPLE',   labelPt: 'Simples',   labelEn: 'Simple',   descPt: 'Template existente adaptado, sem animações complexas',    descEn: 'Adapted existing template, no complex animations',    tagPt: 'Mais económico', tagEn: 'Most affordable' },
  { value: 'MODERATE', labelPt: 'Moderado',  labelEn: 'Moderate', descPt: 'Design personalizado com animações e identidade visual',  descEn: 'Custom design with animations and visual identity',   tagPt: 'Mais popular',   tagEn: 'Most popular'    },
  { value: 'COMPLEX',  labelPt: 'Complexo',  labelEn: 'Complex',  descPt: 'Design único, micro-interações e experiência premium',    descEn: 'Unique design, micro-interactions and premium UX',   tagPt: 'Premium',        tagEn: 'Premium'         },
]

const timelines = [
  { value: 'URGENT',   labelPt: 'Urgente (< 1 mês)',    labelEn: 'Urgent (< 1 month)',    descPt: 'Equipa dedicada, entrega acelerada (+35%)',  descEn: 'Dedicated team, accelerated delivery (+35%)' },
  { value: 'NORMAL',   labelPt: 'Normal (1–3 meses)',   labelEn: 'Normal (1–3 months)',   descPt: 'Prazo padrão, melhor relação custo-qualidade', descEn: 'Standard timeline, best cost-quality ratio'  },
  { value: 'FLEXIBLE', labelPt: 'Flexível (3+ meses)',  labelEn: 'Flexible (3+ months)',  descPt: 'Desenvolvimento iterativo, poupa até 10%',   descEn: 'Iterative development, saves up to 10%'      },
]

const trafficLevels = [
  { value: 'LOW',       labelPt: 'Baixo (< 10k/mês)',       labelEn: 'Low (< 10k/month)',       descPt: 'Blog, portfólio, site pequeno',          descEn: 'Blog, portfolio, small site'          },
  { value: 'MEDIUM',    labelPt: 'Médio (10k–100k/mês)',    labelEn: 'Medium (10k–100k/month)', descPt: 'PME, loja online, startup',              descEn: 'SME, online store, startup'           },
  { value: 'HIGH',      labelPt: 'Alto (100k–1M/mês)',      labelEn: 'High (100k–1M/month)',    descPt: 'Plataforma estabelecida, marketplace',   descEn: 'Established platform, marketplace'    },
  { value: 'VERY_HIGH', labelPt: 'Muito Alto (> 1M/mês)',   labelEn: 'Very High (> 1M/month)',  descPt: 'Grande escala, infraestrutura dedicada', descEn: 'Large scale, dedicated infrastructure' },
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
  const [emailInput, setEmailInput] = useState('')
  const [estimate, setEstimate] = useState<any>(null)
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
    { id: 5, pt: 'Tráfego',         en: 'Traffic'  },
    { id: 6, pt: 'Resultado',       en: 'Result'   },
  ]

  const toggleFeature = (id: string) =>
    setFormData(p => ({ ...p, features: p.features.includes(id) ? p.features.filter(f => f !== id) : [...p.features, id] }))

  const next = () => {
    if (step === 1 && !formData.projectType)      { toast.error(isPt ? 'Selecione um tipo de projeto' : 'Select a project type'); return }
    if (step === 2 && !formData.features.length)  { toast.error(isPt ? 'Selecione pelo menos uma funcionalidade' : 'Select at least one feature'); return }
    if (step === 3 && !formData.designComplexity) { toast.error(isPt ? 'Selecione a complexidade' : 'Select complexity'); return }
    if (step === 4 && !formData.timeline)         { toast.error(isPt ? 'Selecione um prazo' : 'Select a timeline'); return }
    if (step === 5 && !formData.expectedTraffic)  { toast.error(isPt ? 'Selecione o tráfego' : 'Select traffic level'); return }
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
    const selFeatures = features.filter(f => formData.features.includes(f.id))
    const date = new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const ref = `TF-${Date.now().toString().slice(-6)}`

    const featureRows = selFeatures.map(f =>
      `<tr><td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;">${isPt ? f.namePt : f.nameEn}</td><td style="padding:6px 10px;border-bottom:1px solid #f1f5f9;text-align:right;">${isPt ? f.costPt : f.costEn}</td></tr>`
    ).join('')

    const recItems = estimate.recommendations.map((r: any) =>
      `<li style="margin-bottom:6px;color:#475569;">${isPt ? r.pt : r.en}</li>`
    ).join('')

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${isPt ? 'Orçamento' : 'Estimate'} ${ref}</title>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:32px;color:#1e293b;background:#fff;}
      .header{background:linear-gradient(135deg,#1B7A8A,#F5A623);color:#fff;padding:32px;border-radius:12px;margin-bottom:24px;}
      .price-box{background:#f0fdf4;border:2px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;}
      table{width:100%;border-collapse:collapse;font-size:14px;}
      th{background:#f8fafc;padding:10px;text-align:left;border-bottom:2px solid #e2e8f0;color:#64748b;}
      .total-row{background:#f0fdf4;font-weight:700;}
      .rec-box{background:#f0f9ff;border-left:4px solid #1B7A8A;padding:16px 20px;border-radius:0 8px 8px 0;margin-top:24px;}
      .footer{margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;text-align:center;}
      @media print{body{padding:16px;}}
    </style></head><body>
    <div class="header">
      <div style="font-size:24px;font-weight:800;margin-bottom:8px;">TEC FAZER</div>
      <div style="font-size:20px;font-weight:600;">${isPt ? 'Orçamento do Projeto' : 'Project Estimate'}</div>
      <div style="opacity:0.85;font-size:13px;margin-top:6px;">${isPt ? 'Referência' : 'Reference'}: ${ref} &nbsp;·&nbsp; ${date}</div>
    </div>
    <div class="price-box">
      <div style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">${isPt ? 'Investimento Estimado' : 'Estimated Investment'}</div>
      <div style="font-size:48px;font-weight:800;color:#1B7A8A;">${fmt(estimate.estimate.average, locale)}</div>
      <div style="color:#64748b;font-size:14px;margin-top:4px;">${fmt(estimate.estimate.min, locale)} – ${fmt(estimate.estimate.max, locale)}</div>
      <div style="margin-top:12px;display:inline-block;background:#1B7A8A;color:#fff;border-radius:20px;padding:6px 16px;font-size:13px;">
        ⏱ ${estimate.timeline.weeks} ${isPt ? 'semanas' : 'weeks'} &nbsp;·&nbsp; ~${estimate.breakdown.totalHours}h
      </div>
    </div>
    <h3 style="margin:0 0 12px;font-size:16px;">${isPt ? 'Detalhamento' : 'Breakdown'}</h3>
    <table>
      <thead><tr><th>${isPt ? 'Item' : 'Item'}</th><th style="text-align:right;">${isPt ? 'Custo' : 'Cost'}</th></tr></thead>
      <tbody>
        <tr><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;font-weight:600;">${isPt ? proj?.namePt : proj?.nameEn}</td><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;">${fmt(estimate.breakdown.projectBase.cost, locale)}</td></tr>
        ${featureRows}
        ${estimate.breakdown.trafficCost > 0 ? `<tr><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;">${isPt ? 'Infraestrutura de Tráfego' : 'Traffic Infrastructure'}</td><td style="padding:8px 10px;border-bottom:1px solid #f1f5f9;text-align:right;">${fmt(estimate.breakdown.trafficCost, locale)}</td></tr>` : ''}
        <tr class="total-row"><td style="padding:10px;">${isPt ? 'Total Estimado' : 'Estimated Total'}</td><td style="padding:10px;text-align:right;color:#1B7A8A;font-size:16px;">${fmt(estimate.estimate.average, locale)}</td></tr>
      </tbody>
    </table>
    ${estimate.recommendations.length > 0 ? `<div class="rec-box"><strong style="color:#1B7A8A;">💡 ${isPt ? 'Recomendações' : 'Recommendations'}</strong><ul style="margin:10px 0 0;padding-left:18px;">${recItems}</ul></div>` : ''}
    <div class="footer">Tec Fazer · Mafra, Lisboa, Portugal · info@tecfazer.pt · +351 261 123 456<br>${isPt ? 'Este orçamento é indicativo. O valor final pode variar após análise detalhada.' : 'This estimate is indicative. Final price may vary after detailed analysis.'}</div>
    </body></html>`

    const win = window.open('', '_blank')
    if (win) {
      win.document.write(html)
      win.document.close()
      setTimeout(() => { win.print() }, 500)
    }
  }

  const sendEmail = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      toast.error(isPt ? 'Introduza um email válido' : 'Enter a valid email')
      return
    }
    setEmailLoading(true)
    try {
      const res = await fetch('/api/estimator/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, locale, ...estimate, formData }),
      })
      if (!res.ok) throw new Error()
      toast.success(isPt ? `Orçamento enviado para ${emailInput}` : `Estimate sent to ${emailInput}`)
      setShowEmailModal(false)
      setEmailInput('')
    } catch {
      toast.error(isPt ? 'Erro ao enviar email. Tente novamente.' : 'Error sending email. Please try again.')
    } finally { setEmailLoading(false) }
  }

  const selectedProject = projectTypes.find(p => p.id === formData.projectType)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s.id < step ? 'bg-[#1B7A8A] text-white' : s.id === step ? 'bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                  {s.id < step ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${s.id <= step ? 'text-[#1B7A8A]' : 'text-gray-400'}`}>{isPt ? s.pt : s.en}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${s.id < step ? 'bg-[#1B7A8A]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">{isPt ? 'Que tipo de projeto precisa?' : 'What type of project do you need?'}</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">{isPt ? 'Selecione a opção que melhor descreve o seu projeto' : 'Select the option that best describes your project'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectTypes.map(t => (
                <button key={t.id} onClick={() => setFormData(p => ({ ...p, projectType: t.id }))}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${formData.projectType === t.id ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-gray-200 hover:border-[#1B7A8A]/40 hover:shadow-sm'}`}>
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="font-bold text-base mb-1">{isPt ? t.namePt : t.nameEn}</div>
                  <div className="text-xs text-gray-500 mb-2">{isPt ? t.descPt : t.descEn}</div>
                  <div className="text-xs font-semibold text-[#1B7A8A]">{isPt ? t.fromPt : t.fromEn}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">{isPt ? 'Que funcionalidades precisa?' : 'What features do you need?'}</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">{isPt ? 'Selecione todas as que se aplicam ao seu projeto' : 'Select all that apply to your project'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map(f => (
                <button key={f.id} onClick={() => toggleFeature(f.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${formData.features.includes(f.id) ? 'border-[#1B7A8A] bg-[#1B7A8A]/5' : 'border-gray-200 hover:border-[#1B7A8A]/40'}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${formData.features.includes(f.id) ? 'border-[#1B7A8A] bg-[#1B7A8A]' : 'border-gray-300'}`}>
                    {formData.features.includes(f.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{isPt ? f.namePt : f.nameEn}</div>
                  </div>
                  <div className="text-xs font-semibold text-[#1B7A8A] flex-shrink-0">{isPt ? f.costPt : f.costEn}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">{isPt ? 'Complexidade do Design' : 'Design Complexity'}</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">{isPt ? 'Qual o nível de personalização visual que precisa?' : 'What level of visual customization do you need?'}</p>
            <div className="space-y-3 max-w-xl mx-auto">
              {designComplexities.map(d => (
                <button key={d.value} onClick={() => setFormData(p => ({ ...p, designComplexity: d.value }))}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${formData.designComplexity === d.value ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-gray-200 hover:border-[#1B7A8A]/40'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{isPt ? d.labelPt : d.labelEn}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.value === 'MODERATE' ? 'bg-[#F5A623]/20 text-[#F5A623]' : d.value === 'COMPLEX' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>{isPt ? d.tagPt : d.tagEn}</span>
                  </div>
                  <p className="text-sm text-gray-500">{isPt ? d.descPt : d.descEn}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">{isPt ? 'Qual o prazo desejado?' : 'What is your desired timeline?'}</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">{isPt ? 'O prazo afeta o custo e a alocação da equipa' : 'Timeline affects cost and team allocation'}</p>
            <div className="space-y-3 max-w-xl mx-auto">
              {timelines.map(t => (
                <button key={t.value} onClick={() => setFormData(p => ({ ...p, timeline: t.value }))}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${formData.timeline === t.value ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-gray-200 hover:border-[#1B7A8A]/40'}`}>
                  <div className="font-bold mb-1">{isPt ? t.labelPt : t.labelEn}</div>
                  <p className="text-sm text-gray-500">{isPt ? t.descPt : t.descEn}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-2xl font-bold mb-2 text-center">{isPt ? 'Tráfego Esperado' : 'Expected Traffic'}</h2>
            <p className="text-gray-500 text-center mb-8 text-sm">{isPt ? 'Ajuda a dimensionar a infraestrutura necessária' : 'Helps size the required infrastructure'}</p>
            <div className="space-y-3 max-w-xl mx-auto">
              {trafficLevels.map(t => (
                <button key={t.value} onClick={() => setFormData(p => ({ ...p, expectedTraffic: t.value }))}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${formData.expectedTraffic === t.value ? 'border-[#1B7A8A] bg-[#1B7A8A]/5 shadow-md' : 'border-gray-200 hover:border-[#1B7A8A]/40'}`}>
                  <div className="font-bold mb-1">{isPt ? t.labelPt : t.labelEn}</div>
                  <p className="text-sm text-gray-500">{isPt ? t.descPt : t.descEn}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 6 - Results */}
        {step === 6 && estimate && (
          <motion.div key="s6" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            {/* Reference header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{isPt ? 'Orçamento Indicativo' : 'Indicative Estimate'}</div>
                <div className="font-mono text-sm text-gray-500">TF-{Date.now().toString().slice(-6)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">{new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="text-xs text-gray-400 mt-0.5">{isPt ? 'Válido por 30 dias' : 'Valid for 30 days'}</div>
              </div>
            </div>

            {/* Price hero */}
            <div className="bg-gradient-to-br from-[#1B7A8A]/8 to-[#F5A623]/8 border border-[#1B7A8A]/20 rounded-2xl p-6 mb-6 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{isPt ? 'Investimento Estimado' : 'Estimated Investment'}</p>
              <div className="text-5xl font-extrabold text-[#1B7A8A] mb-1">{fmt(estimate.estimate.average, locale)}</div>
              <p className="text-sm text-gray-500">{isPt ? 'Intervalo' : 'Range'}: {fmt(estimate.estimate.min, locale)} – {fmt(estimate.estimate.max, locale)}</p>
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm">
                  <Clock className="w-4 h-4 text-[#1B7A8A]" />
                  <span className="font-medium">{estimate.timeline.weeks} {isPt ? 'semanas' : 'weeks'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm">
                  <FileText className="w-4 h-4 text-[#F5A623]" />
                  <span className="font-medium">~{estimate.breakdown.totalHours}h {isPt ? 'de trabalho' : 'of work'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm text-sm">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-medium">{isPt ? 'Equipa dedicada' : 'Dedicated team'}</span>
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-700">{isPt ? 'Detalhamento do Orçamento' : 'Cost Breakdown'}</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-gray-500 font-medium">{isPt ? 'Item' : 'Item'}</th>
                    <th className="text-right px-5 py-3 text-gray-500 font-medium">{isPt ? 'Horas' : 'Hours'}</th>
                    <th className="text-right px-5 py-3 text-gray-500 font-medium">{isPt ? 'Custo' : 'Cost'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="px-5 py-3 font-semibold text-gray-800">{isPt ? estimate.breakdown.projectBase.descPt : estimate.breakdown.projectBase.descEn}</td>
                    <td className="px-5 py-3 text-right text-gray-500">{estimate.breakdown.projectBase.hours}h</td>
                    <td className="px-5 py-3 text-right font-semibold">{fmt(estimate.breakdown.projectBase.cost, locale)}</td>
                  </tr>
                  {estimate.breakdown.features.map((f: any, i: number) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-5 py-3 text-gray-600">{isPt ? f.labelPt : f.labelEn}</td>
                      <td className="px-5 py-3 text-right text-gray-400">{f.hours}h</td>
                      <td className="px-5 py-3 text-right text-gray-700">{fmt(f.cost, locale)}</td>
                    </tr>
                  ))}
                  {estimate.breakdown.trafficCost > 0 && (
                    <tr className="border-b border-gray-50">
                      <td className="px-5 py-3 text-gray-600">{isPt ? 'Infraestrutura de Tráfego' : 'Traffic Infrastructure'}</td>
                      <td className="px-5 py-3 text-right text-gray-400">—</td>
                      <td className="px-5 py-3 text-right text-gray-700">{fmt(estimate.breakdown.trafficCost, locale)}</td>
                    </tr>
                  )}
                  {(estimate.breakdown.designMultiplier !== 1 || estimate.breakdown.timelineMultiplier !== 1) && (
                    <tr className="border-b border-gray-50 bg-amber-50/50">
                      <td className="px-5 py-3 text-amber-700 italic text-xs" colSpan={2}>
                        {isPt ? 'Ajuste complexidade/prazo' : 'Complexity/timeline adjustment'} (×{(estimate.breakdown.designMultiplier * estimate.breakdown.timelineMultiplier).toFixed(2)})
                      </td>
                      <td className="px-5 py-3 text-right text-amber-700 text-xs">
                        {fmt(estimate.estimate.average - estimate.breakdown.projectBase.cost - estimate.breakdown.features.reduce((s: number, f: any) => s + f.cost, 0) - estimate.breakdown.trafficCost, locale)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-[#1B7A8A]/5">
                    <td className="px-5 py-4 font-bold text-gray-900" colSpan={2}>{isPt ? 'Total Estimado' : 'Estimated Total'}</td>
                    <td className="px-5 py-4 text-right font-extrabold text-[#1B7A8A] text-lg">{fmt(estimate.estimate.average, locale)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recommendations */}
            {estimate.recommendations.length > 0 && (
              <div className="border-l-4 border-[#1B7A8A] bg-blue-50/50 rounded-r-xl px-5 py-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-[#1B7A8A]" />
                  <span className="font-semibold text-sm text-[#1B7A8A]">{isPt ? 'Recomendações' : 'Recommendations'}</span>
                </div>
                <ul className="space-y-2">
                  {estimate.recommendations.map((r: any, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-[#1B7A8A] mt-0.5">•</span>
                      {isPt ? r.pt : r.en}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-400 text-center mb-6">
              {isPt
                ? '* Este orçamento é indicativo e baseado nas informações fornecidas. O valor final é definido após análise detalhada do projeto.'
                : '* This estimate is indicative and based on the information provided. The final price is set after detailed project analysis.'}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowEmailModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#1B7A8A] to-[#156570] text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm">
                <Mail className="w-4 h-4" />
                {isPt ? 'Enviar por Email' : 'Send by Email'}
              </button>
              <button onClick={downloadPDF}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#1B7A8A] text-[#1B7A8A] rounded-xl font-semibold hover:bg-[#1B7A8A] hover:text-white transition-all text-sm">
                <Download className="w-4 h-4" />
                {isPt ? 'Descarregar PDF' : 'Download PDF'}
              </button>
              <button onClick={() => { setStep(1); setEstimate(null); setFormData({ projectType: '', features: [], designComplexity: '', timeline: '', expectedTraffic: '' }) }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm">
                <TrendingUp className="w-4 h-4" />
                {isPt ? 'Novo Orçamento' : 'New Estimate'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons */}
      {step < 6 && (
        <div className="flex justify-between mt-10">
          <button onClick={() => setStep(s => Math.max(s - 1, 1))} disabled={step === 1}
            className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl font-medium text-sm disabled:opacity-40 hover:border-[#1B7A8A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {isPt ? 'Anterior' : 'Previous'}
          </button>
          <button onClick={next} disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{isPt ? 'Calculando...' : 'Calculating...'}</> : <>{step === 5 ? (isPt ? 'Calcular Orçamento' : 'Calculate Estimate') : (isPt ? 'Próximo' : 'Next')}<ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      )}

      {/* Email modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{isPt ? 'Enviar Orçamento por Email' : 'Send Estimate by Email'}</h3>
              <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{isPt ? 'Introduza o seu email para receber o orçamento detalhado.' : 'Enter your email to receive the detailed estimate.'}</p>
            <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendEmail()}
              placeholder={isPt ? 'o-seu@email.com' : 'your@email.com'}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1B7A8A] focus:outline-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowEmailModal(false)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">{isPt ? 'Cancelar' : 'Cancel'}</button>
              <button onClick={sendEmail} disabled={emailLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                {emailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {isPt ? 'Enviar' : 'Send'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
