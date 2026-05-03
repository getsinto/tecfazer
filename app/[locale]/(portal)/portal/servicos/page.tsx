'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowRight, CheckCircle2, Clock, Plus, Minus, Trash2, CreditCard, Send, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { servicesData } from '@/lib/services-data'

// Category color map
const CATEGORY_COLORS: Record<string, string> = {
  development: 'from-blue-600 to-cyan-500',
  mobile: 'from-purple-600 to-pink-500',
  ecommerce: 'from-emerald-600 to-teal-500',
  cloud: 'from-sky-600 to-blue-500',
  design: 'from-pink-600 to-rose-500',
  marketing: 'from-orange-500 to-amber-500',
  ai: 'from-violet-600 to-purple-500',
  security: 'from-red-600 to-rose-500',
  consulting: 'from-indigo-600 to-blue-500',
  support: 'from-teal-600 to-cyan-500',
}

interface CartItem {
  slug: string
  title: string
  description: string
  price: string
  priceNum: number
  category: string
}

function parsePrice(priceText: string): number {
  const match = priceText.match(/(\d[\d.,]*)/)
  if (!match) return 0
  return parseFloat(match[1].replace(',', '.'))
}

export default function PortalServicesPage({ params }: { params: { locale: string } }) {
  const isPt = params.locale === 'pt'
  const services = servicesData[params.locale as keyof typeof servicesData] || servicesData.en
  const categories = Object.entries(services)

  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showPayLater, setShowPayLater] = useState(false)
  const [payLaterNote, setPayLaterNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0]?.[0] || '')

  const addToCart = (service: CartItem) => {
    if (cart.find(i => i.slug === service.slug)) {
      toast.info(isPt ? 'Servico ja esta no carrinho' : 'Service already in cart')
      return
    }
    setCart(prev => [...prev, service])
    toast.success(isPt ? `${service.title} adicionado ao carrinho` : `${service.title} added to cart`)
  }

  const removeFromCart = (slug: string) => {
    setCart(prev => prev.filter(i => i.slug !== slug))
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.priceNum, 0)

  const handlePayNow = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
      // Create a combined checkout for all cart items
      const firstItem = cart[0]
      const title = cart.length === 1
        ? firstItem.title
        : `${cart.length} ${isPt ? 'Servicos' : 'Services'} — Tec Fazer`
      const description = cart.map(i => i.title).join(', ')

      const res = await fetch('/api/stripe/service-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug: firstItem.slug,
          serviceTitle: title,
          serviceDescription: description,
          priceEur: cartTotal,
          locale: params.locale,
          portalUserId: 'portal',
        }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error)
      }
    } catch {
      toast.error(isPt ? 'Erro ao processar pagamento' : 'Payment processing error')
    } finally {
      setLoading(false)
    }
  }

  const handlePayLater = async () => {
    if (cart.length === 0) return
    setLoading(true)
    try {
      const serviceList = cart.map(i => `- ${i.title} (${i.price})`).join('\n')
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: isPt ? 'Cliente Portal' : 'Portal Client',
          email: 'portal@tecfazer.pt',
          message: `PEDIDO COM PAGAMENTO POSTERIOR\n\nServicos:\n${serviceList}\n\nTotal: ${cartTotal} EUR\n\nNotas: ${payLaterNote || '-'}`,
          locale: params.locale,
        }),
      })
      if (res.ok) {
        toast.success(isPt ? 'Pedido enviado! Entraremos em contacto para confirmar.' : 'Order sent! We will contact you to confirm.')
        setCart([])
        setShowCart(false)
        setShowPayLater(false)
        setPayLaterNote('')
      } else throw new Error()
    } catch {
      toast.error(isPt ? 'Erro ao enviar pedido' : 'Error sending order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{isPt ? 'Comprar Servicos' : 'Buy Services'}</h1>
          <p className="text-slate-500 mt-1">{isPt ? 'Adicione servicos ao carrinho e pague agora ou mais tarde.' : 'Add services to cart and pay now or later.'}</p>
        </div>
        {/* Cart button */}
        <button onClick={() => setShowCart(true)}
          className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">
          <ShoppingCart className="h-4 w-4" />
          {isPt ? 'Carrinho' : 'Cart'}
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(([key, cat]) => (
          <button key={key} onClick={() => setActiveCategory(key)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${activeCategory === key ? 'bg-[#0a0f1e] text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {cat.title}
          </button>
        ))}
      </div>

      {/* Services grid */}
      {categories.filter(([key]) => key === activeCategory).map(([key, category]) => (
        <div key={key} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {category.services.map(service => {
            const inCart = cart.some(i => i.slug === service.slug)
            const priceNum = parsePrice(service.price)
            const gradient = CATEGORY_COLORS[key] || 'from-[#1B7A8A] to-[#F5A623]'

            return (
              <div key={service.slug}
                className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg ${inCart ? 'border-[#1B7A8A] ring-2 ring-[#1B7A8A]/20' : 'border-slate-200'}`}>
                <div className={`h-1 w-full rounded-t-2xl bg-gradient-to-r ${gradient}`} />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{service.title}</h3>
                    <span className="flex-shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">{service.price}</span>
                  </div>
                  <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500">{service.description}</p>

                  {/* Features */}
                  <div className="mb-4 space-y-1.5">
                    {service.features.slice(0, 3).map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-500" />
                        {f}
                      </div>
                    ))}
                  </div>

                  {service.timeline && (
                    <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {service.timeline}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => inCart ? removeFromCart(service.slug) : addToCart({
                        slug: service.slug,
                        title: service.title,
                        description: service.description,
                        price: service.price,
                        priceNum,
                        category: key,
                      })}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${inCart
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                        : `bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg hover:scale-[1.02]`}`}>
                      {inCart ? <><Minus className="h-3.5 w-3.5" />{isPt ? 'Remover' : 'Remove'}</> : <><Plus className="h-3.5 w-3.5" />{isPt ? 'Adicionar' : 'Add'}</>}
                    </button>
                    <Link href={`/${params.locale}/servicos/${service.slug}`}
                      className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                      {isPt ? 'Ver' : 'View'}
                    </Link>
                  </div>
                </div>
                {inCart && (
                  <div className="absolute top-3 right-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1B7A8A]">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}

      {/* ── CART DRAWER ─────────────────────────────────────────── */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowCart(false) }}>
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            {/* Cart header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-[#1B7A8A]" />
                <h2 className="font-black text-slate-900">{isPt ? 'Carrinho' : 'Cart'}</h2>
                <span className="rounded-full bg-[#1B7A8A]/10 px-2 py-0.5 text-xs font-bold text-[#1B7A8A]">{cart.length}</span>
              </div>
              <button onClick={() => setShowCart(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingCart className="h-12 w-12 text-slate-200 mb-4" />
                  <p className="text-slate-500 text-sm">{isPt ? 'O carrinho esta vazio' : 'Cart is empty'}</p>
                  <button onClick={() => setShowCart(false)}
                    className="mt-4 text-sm font-bold text-[#1B7A8A] hover:underline">
                    {isPt ? 'Explorar servicos' : 'Explore services'}
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.slug} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[item.category] || 'from-[#1B7A8A] to-[#F5A623]'} shadow-sm`}>
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.slug)}
                      className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-slate-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{isPt ? 'Total' : 'Total'}</span>
                  <span className="text-2xl font-black text-[#1B7A8A]">{cartTotal} EUR</span>
                </div>

                {/* Pay Later note */}
                {showPayLater && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      {isPt ? 'Notas (opcional)' : 'Notes (optional)'}
                    </label>
                    <textarea value={payLaterNote} onChange={e => setPayLaterNote(e.target.value)}
                      rows={2} placeholder={isPt ? 'Prazo desejado, requisitos...' : 'Desired timeline, requirements...'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none" />
                  </div>
                )}

                {/* Action buttons */}
                <button onClick={handlePayNow} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] py-3.5 text-sm font-black text-white shadow-lg hover:shadow-xl disabled:opacity-60 transition-all">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  {isPt ? 'Pagar Agora' : 'Pay Now'}
                </button>

                {!showPayLater ? (
                  <button onClick={() => setShowPayLater(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 py-3 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                    <Send className="h-4 w-4" />
                    {isPt ? 'Pagar Mais Tarde' : 'Pay Later'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setShowPayLater(false)}
                      className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                      {isPt ? 'Cancelar' : 'Cancel'}
                    </button>
                    <button onClick={handlePayLater} disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition-all">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {isPt ? 'Confirmar Pedido' : 'Confirm Order'}
                    </button>
                  </div>
                )}

                <p className="text-center text-xs text-slate-400">
                  {isPt ? 'Pagamento seguro via Stripe. Resposta em 24h.' : 'Secure payment via Stripe. Response within 24h.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
