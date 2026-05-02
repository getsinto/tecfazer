import Link from 'next/link'
import { CheckCircle2, ArrowRight, Mail, Phone, Calendar } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  return buildMetadata({
    locale,
    titlePt: 'Pedido Confirmado | Tec Fazer',
    titleEn: 'Order Confirmed | Tec Fazer',
    descPt: 'O seu pedido foi confirmado. A equipa Tec Fazer entrara em contacto em breve.',
    descEn: 'Your order has been confirmed. The Tec Fazer team will contact you shortly.',
    path: `/${locale}/servicos/sucesso`,
  })
}

export default async function ServiceSuccessPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { service?: string; session_id?: string }
}) {
  const isPt = locale === 'pt'
  const serviceName = searchParams.service ? decodeURIComponent(searchParams.service) : ''

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center px-4 py-20">
      <div className="mx-auto w-full max-w-lg">

        {/* Success card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">

          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623]" />

          <div className="p-8 sm:p-10 text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>

            {/* Title */}
            <h1 className="mb-3 text-3xl font-black text-slate-900">
              {isPt ? 'Pagamento Confirmado!' : 'Payment Confirmed!'}
            </h1>

            {/* Service name */}
            {serviceName && (
              <div className="mb-4 inline-block rounded-full bg-[#1B7A8A]/10 px-4 py-1.5 text-sm font-bold text-[#1B7A8A]">
                {serviceName}
              </div>
            )}

            <p className="mb-8 text-slate-500 leading-relaxed">
              {isPt
                ? 'O seu pagamento foi processado com sucesso. A nossa equipa entrara em contacto nas proximas 24 horas para iniciar o seu projeto.'
                : 'Your payment was processed successfully. Our team will contact you within the next 24 hours to start your project.'}
            </p>

            {/* What happens next */}
            <div className="mb-8 rounded-2xl bg-slate-50 p-6 text-left space-y-4">
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                {isPt ? 'Proximos Passos' : 'Next Steps'}
              </h2>
              {[
                {
                  icon: Mail,
                  color: 'text-[#1B7A8A]',
                  bg: 'bg-[#1B7A8A]/10',
                  title: isPt ? 'Email de confirmacao' : 'Confirmation email',
                  desc: isPt ? 'Recebera um email com os detalhes do pedido.' : 'You will receive an email with order details.',
                },
                {
                  icon: Phone,
                  color: 'text-[#F5A623]',
                  bg: 'bg-[#F5A623]/10',
                  title: isPt ? 'Contacto em 24h' : 'Contact within 24h',
                  desc: isPt ? 'A nossa equipa ligara para discutir os detalhes.' : 'Our team will call to discuss the details.',
                },
                {
                  icon: Calendar,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                  title: isPt ? 'Reuniao de arranque' : 'Kickoff meeting',
                  desc: isPt ? 'Agendaremos uma reuniao para iniciar o projeto.' : 'We will schedule a meeting to start the project.',
                },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact info */}
            <div className="mb-8 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900 mb-2">
                {isPt ? 'Precisa de ajuda imediata?' : 'Need immediate help?'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:+351963101123"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                  <Phone className="h-4 w-4" />
                  +351 963 101 123
                </a>
                <a href="mailto:info@tecfazer.pt"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                  <Mail className="h-4 w-4" />
                  info@tecfazer.pt
                </a>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/${locale}/portal`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                {isPt ? 'Aceder ao Portal' : 'Access Portal'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/${locale}`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                {isPt ? 'Voltar ao Inicio' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </div>

        {/* Reference */}
        {searchParams.session_id && (
          <p className="mt-4 text-center text-xs text-slate-400">
            {isPt ? 'Referencia' : 'Reference'}: {searchParams.session_id.slice(-12).toUpperCase()}
          </p>
        )}
      </div>
    </div>
  )
}
