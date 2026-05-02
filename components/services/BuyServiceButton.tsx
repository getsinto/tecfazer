'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Loader2, CreditCard, X, Shield, Lock, CheckCircle2, ArrowRight, Mail, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'

interface BuyServiceButtonProps {
  serviceSlug: string
  serviceTitle: string
  serviceDescription: string
  priceText: string
  locale: string
  variant?: 'primary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function parseMinPrice(priceText: string): number {
  const match = priceText.match(/(\d[\d.,]*)/)
  if (!match) return 0
  return parseFloat(match[1].replace(',', '.'))
}

export default function BuyServiceButton({
  serviceSlug,
  serviceTitle,
  serviceDescription,
  priceText,
  locale,
  variant = 'primary',
  size = 'md',
  className = '',
}: BuyServiceButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState<'payment' | 'contact' | 'success'>('payment')
  const [customPrice, setCustomPrice] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const isPt = locale === 'pt'
  const minPrice = parseMinPrice(priceText)

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2',
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white shadow-lg hover:shadow-xl hover:scale-[1.02]',
    outline: 'border-2 border-[#1B7A8A] text-[#1B7A8A] hover:bg-[#1B7A8A] hover:text-white',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    white: 'bg-white text-slate-900 font-black shadow-lg hover:shadow-xl hover:scale-[1.02]',
  }

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setStep('payment')
    setCustomPrice(minPrice > 0 ? String(minPrice) : '')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setStep('payment')
    setEmail('')
    setName('')
    setPhone('')
    setNotes('')
  }

  // Try Stripe first, fall back to contact form
  const handleStripeCheckout = async () => {
    const price = parseFloat(customPrice) || minPrice
    if (!price || price < 1) {
      toast.error(isPt ? 'Introduza um valor valido' : 'Enter a valid amount')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/service-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug,
          serviceTitle,
          serviceDescription,
          priceEur: price,
          locale,
          customerEmail: email || undefined,
        }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      // Stripe not configured or error — fall back to contact form
      setStep('contact')
    } catch {
      // Fall back to contact form
      setStep('contact')
    } finally {
      setLoading(false)
    }
  }

  // Submit order via contact API (fallback when Stripe not configured)
  const handleContactOrder = async () => {
    if (!name.trim() || !email.trim() || !email.includes('@')) {
      toast.error(isPt ? 'Preencha o nome e email' : 'Fill in name and email')
      return
    }
    setOrderLoading(true)
    try {
      const price = parseFloat(customPrice) || minPrice
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: `PEDIDO DE SERVICO\n\nServico: ${serviceTitle}\nValor acordado: ${price} EUR\n\nNotas: ${notes || '-'}`,
          service: serviceTitle,
          budget: `${price} EUR`,
          locale,
        }),
      })
      if (res.ok) {
        setStep('success')
      } else {
        throw new Error()
      }
    } catch {
      toast.error(isPt ? 'Erro ao enviar pedido. Tente novamente.' : 'Error sending order. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {loading
          ? <Loader2 className={`animate-spin ${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          : <ShoppingCart className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        }
        {isPt ? 'Comprar' : 'Buy Now'}
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl max-h-[95vh] overflow-y-auto">

            {/* ── STEP 1: Payment options ── */}
            {step === 'payment' && (
              <>
                <div className="bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">
                        {isPt ? 'Comprar Servico' : 'Purchase Service'}
                      </p>
                      <h3 className="text-xl font-black text-white leading-tight">{serviceTitle}</h3>
                    </div>
                    <button onClick={closeModal} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 ml-3">
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between bg-white/15 rounded-xl px-4 py-3">
                    <span className="text-white/80 text-sm">{isPt ? 'Preco base' : 'Base price'}</span>
                    <span className="text-white font-black text-lg">{priceText}</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      {isPt ? 'Valor a pagar (EUR) *' : 'Amount to pay (EUR) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">EUR</span>
                      <input
                        type="number"
                        min={minPrice || 1}
                        step="1"
                        value={customPrice}
                        onChange={e => setCustomPrice(e.target.value)}
                        placeholder={minPrice > 0 ? String(minPrice) : '150'}
                        className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-lg font-bold transition-all"
                      />
                    </div>
                    {minPrice > 0 && (
                      <p className="mt-1 text-xs text-slate-400">{isPt ? `Minimo: ${minPrice} EUR` : `Minimum: ${minPrice} EUR`}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      {isPt ? 'Email (opcional)' : 'Email (optional)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={isPt ? 'o-seu-email@exemplo.com' : 'your-email@example.com'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all"
                    />
                  </div>

                  {/* Trust */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Lock, text: isPt ? 'Pagamento seguro' : 'Secure payment' },
                      { icon: Shield, text: isPt ? 'Dados protegidos' : 'Data protected' },
                      { icon: CheckCircle2, text: isPt ? 'Garantia 30 dias' : '30-day guarantee' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex flex-col items-center gap-1 text-center">
                        <Icon className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] text-slate-500 leading-tight">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Payment methods */}
                  <div className="flex items-center gap-2 justify-center flex-wrap">
                    <span className="text-xs text-slate-400">{isPt ? 'Aceita:' : 'Accepts:'}</span>
                    {['VISA', 'MC', 'AMEX', 'PayPal', 'MB Way'].map(m => (
                      <span key={m} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">{m}</span>
                    ))}
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] py-4 text-base font-black text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] disabled:opacity-60 transition-all"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                    {loading
                      ? (isPt ? 'A processar...' : 'Processing...')
                      : (isPt ? 'Pagar com Cartao / PayPal' : 'Pay with Card / PayPal')}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs text-slate-400 font-medium">{isPt ? 'ou' : 'or'}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  {/* Contact order fallback */}
                  <button
                    onClick={() => setStep('contact')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-3.5 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <Send className="h-4 w-4" />
                    {isPt ? 'Encomendar por Formulario' : 'Order via Form'}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    {isPt ? 'Pagamento 100% seguro via Stripe. Resposta em 24h.' : '100% secure payment via Stripe. Response within 24h.'}
                  </p>
                </div>
              </>
            )}

            {/* ── STEP 2: Contact order form ── */}
            {step === 'contact' && (
              <>
                <div className="bg-[#0a0f1e] p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/50 text-[11px] font-bold uppercase tracking-widest mb-1">
                        {isPt ? 'Encomendar Servico' : 'Order Service'}
                      </p>
                      <h3 className="text-xl font-black text-white leading-tight">{serviceTitle}</h3>
                    </div>
                    <button onClick={closeModal} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0 ml-3">
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-white/60 text-sm">{isPt ? 'Valor' : 'Amount'}</span>
                    <span className="text-white font-black text-lg">{parseFloat(customPrice) || minPrice} EUR</span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-4">
                  <p className="text-sm text-slate-500">
                    {isPt
                      ? 'Preencha os seus dados e a nossa equipa entrara em contacto em menos de 24h para confirmar o pedido e processar o pagamento.'
                      : 'Fill in your details and our team will contact you within 24h to confirm the order and process payment.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{isPt ? 'Nome *' : 'Name *'}</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder={isPt ? 'O seu nome' : 'Your name'}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email *</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="email@exemplo.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{isPt ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="+351 9XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{isPt ? 'Notas (opcional)' : 'Notes (optional)'}</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                      placeholder={isPt ? 'Requisitos especificos, prazo desejado...' : 'Specific requirements, desired timeline...'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm resize-none transition-all" />
                  </div>

                  {/* Trust */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: CheckCircle2, text: isPt ? 'Sem compromisso' : 'No commitment' },
                      { icon: Mail, text: isPt ? 'Resposta em 24h' : 'Reply in 24h' },
                      { icon: Shield, text: isPt ? 'Dados seguros' : 'Secure data' },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex flex-col items-center gap-1 text-center">
                        <Icon className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] text-slate-500 leading-tight">{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('payment')}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                      {isPt ? 'Voltar' : 'Back'}
                    </button>
                    <button onClick={handleContactOrder} disabled={orderLoading}
                      className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-sm font-black text-white shadow-lg hover:shadow-xl disabled:opacity-60 transition-all">
                      {orderLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {isPt ? 'Confirmar Pedido' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 3: Success ── */}
            {step === 'success' && (
              <div className="p-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {isPt ? 'Pedido Enviado!' : 'Order Sent!'}
                </h3>
                <p className="text-slate-500 mb-2 text-sm">
                  {isPt ? `Recebemos o seu pedido para "${serviceTitle}".` : `We received your order for "${serviceTitle}".`}
                </p>
                <p className="text-slate-500 mb-6 text-sm">
                  {isPt ? 'A nossa equipa entrara em contacto em menos de 24 horas.' : 'Our team will contact you within 24 hours.'}
                </p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
                  {[
                    { icon: Mail, text: isPt ? 'Email de confirmacao enviado' : 'Confirmation email sent' },
                    { icon: Phone, text: isPt ? 'Equipa notificada' : 'Team notified' },
                    { icon: CheckCircle2, text: isPt ? 'Resposta em menos de 24h' : 'Response within 24h' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={closeModal}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                    {isPt ? 'Fechar' : 'Close'}
                  </button>
                  <a href={`/${locale}/portal`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1B7A8A] text-white text-sm font-bold hover:bg-[#156570] transition-all">
                    {isPt ? 'Portal' : 'Portal'}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
