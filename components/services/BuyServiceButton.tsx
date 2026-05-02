'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, CreditCard, X, Shield, Lock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface BuyServiceButtonProps {
  serviceSlug: string
  serviceTitle: string
  serviceDescription: string
  priceText: string   // e.g. "A partir de 150 EUR"
  locale: string
  variant?: 'primary' | 'outline' | 'ghost' | 'white'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Parse the minimum price from strings like "A partir de 150 EUR" or "From 150 EUR"
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
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [customPrice, setCustomPrice] = useState('')
  const [email, setEmail] = useState('')
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

  const handleCheckout = async (finalPrice: number, customerEmail?: string) => {
    if (finalPrice < 1) {
      toast.error(isPt ? 'Preco invalido' : 'Invalid price')
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
          priceEur: finalPrice,
          locale,
          customerEmail: customerEmail || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Checkout failed')
      }
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      toast.error(isPt ? 'Erro ao iniciar pagamento. Tente novamente.' : 'Error starting payment. Please try again.')
      setLoading(false)
    }
  }

  const handleQuickBuy = () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && typeof window !== 'undefined') {
      // Stripe not configured — show contact modal instead
      setShowModal(true)
      return
    }
    setShowModal(true)
  }

  return (
    <>
      <button
        onClick={handleQuickBuy}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {loading ? (
          <Loader2 className={`animate-spin ${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
        ) : (
          <ShoppingCart className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        )}
        {isPt ? 'Comprar' : 'Buy Now'}
      </button>

      {/* Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                    {isPt ? 'Comprar Servico' : 'Purchase Service'}
                  </p>
                  <h3 className="text-xl font-black text-white leading-tight">{serviceTitle}</h3>
                </div>
                <button onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0 ml-3">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between bg-white/15 rounded-xl px-4 py-3">
                <span className="text-white/80 text-sm">{isPt ? 'Preco base' : 'Base price'}</span>
                <span className="text-white font-black text-xl">{priceText}</span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Price input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  {isPt ? 'Valor a pagar (EUR) *' : 'Amount to pay (EUR) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">EUR</span>
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
                  <p className="mt-1.5 text-xs text-slate-400">
                    {isPt ? `Minimo: ${minPrice} EUR` : `Minimum: ${minPrice} EUR`}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
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

              {/* Trust signals */}
              <div className="grid grid-cols-3 gap-2 py-1">
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
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs text-slate-400">{isPt ? 'Aceita:' : 'Accepts:'}</span>
                <div className="flex items-center gap-2">
                  {['VISA', 'MC', 'AMEX', 'PayPal'].map(m => (
                    <span key={m} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-600">{m}</span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  const price = parseFloat(customPrice) || minPrice
                  if (!price || price < 1) {
                    toast.error(isPt ? 'Introduza um valor valido' : 'Enter a valid amount')
                    return
                  }
                  setShowModal(false)
                  handleCheckout(price, email || undefined)
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] py-4 text-base font-black text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-60 transition-all"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                {isPt ? 'Pagar com Cartao / PayPal' : 'Pay with Card / PayPal'}
              </button>

              <p className="text-center text-xs text-slate-400">
                {isPt
                  ? 'Sera redirecionado para o Stripe — pagamento 100% seguro.'
                  : 'You will be redirected to Stripe — 100% secure payment.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
