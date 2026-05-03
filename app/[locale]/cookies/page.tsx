import { buildMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Politica de Cookies | Tec Fazer',
    titleEn: 'Cookie Policy | Tec Fazer',
    descPt: 'Saiba como utilizamos cookies e tecnologias similares no nosso website.',
    descEn: 'Learn how we use cookies and similar technologies on our website.',
    path: '/cookies',
  })
}

export default async function CookiesPage({ params }: { params: { locale: string } }) {
  const isPt = params.locale === 'pt'

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 mb-4">
          {isPt ? 'Politica de Cookies' : 'Cookie Policy'}
        </h1>
        <p className="text-slate-500 mb-10">
          {isPt ? 'Ultima atualizacao: ' : 'Last updated: '}
          {new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-10 text-slate-700">

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? 'O que sao Cookies?' : 'What are Cookies?'}
            </h2>
            <p className="leading-relaxed">
              {isPt
                ? 'Cookies sao pequenos ficheiros de texto que sao armazenados no seu dispositivo quando visita o nosso website. Sao amplamente utilizados para fazer os websites funcionarem de forma mais eficiente e para fornecer informacoes aos proprietarios do site.'
                : 'Cookies are small text files that are stored on your device when you visit our website. They are widely used to make websites work more efficiently and to provide information to website owners.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-4">
              {isPt ? 'Tipos de Cookies que Utilizamos' : 'Types of Cookies We Use'}
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: isPt ? 'Cookies Essenciais' : 'Essential Cookies',
                  desc: isPt
                    ? 'Necessarios para o funcionamento basico do website. Incluem cookies de sessao e autenticacao. Nao podem ser desativados.'
                    : 'Necessary for basic website functionality. Include session and authentication cookies. Cannot be disabled.',
                  color: 'bg-blue-50 border-blue-200',
                  badge: isPt ? 'Sempre Ativos' : 'Always Active',
                  badgeColor: 'bg-blue-100 text-blue-700',
                },
                {
                  name: isPt ? 'Cookies Analiticos' : 'Analytics Cookies',
                  desc: isPt
                    ? 'Utilizamos o Google Analytics para compreender como os visitantes interagem com o website. Os dados sao anonimizados.'
                    : 'We use Google Analytics to understand how visitors interact with the website. Data is anonymized.',
                  color: 'bg-green-50 border-green-200',
                  badge: isPt ? 'Opcionais' : 'Optional',
                  badgeColor: 'bg-green-100 text-green-700',
                },
                {
                  name: isPt ? 'Cookies Funcionais' : 'Functional Cookies',
                  desc: isPt
                    ? 'Permitem que o website lembre as suas preferencias, como idioma e regiao, para uma experiencia personalizada.'
                    : 'Allow the website to remember your preferences, such as language and region, for a personalized experience.',
                  color: 'bg-purple-50 border-purple-200',
                  badge: isPt ? 'Opcionais' : 'Optional',
                  badgeColor: 'bg-purple-100 text-purple-700',
                },
                {
                  name: isPt ? 'Cookies de Marketing' : 'Marketing Cookies',
                  desc: isPt
                    ? 'Utilizados para mostrar anuncios relevantes. Podem ser definidos por parceiros de publicidade como Google e Meta.'
                    : 'Used to show relevant advertisements. May be set by advertising partners such as Google and Meta.',
                  color: 'bg-orange-50 border-orange-200',
                  badge: isPt ? 'Opcionais' : 'Optional',
                  badgeColor: 'bg-orange-100 text-orange-700',
                },
              ].map(cookie => (
                <div key={cookie.name} className={`rounded-xl border p-5 ${cookie.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900">{cookie.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${cookie.badgeColor}`}>{cookie.badge}</span>
                  </div>
                  <p className="text-sm text-slate-600">{cookie.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? 'Cookies de Terceiros' : 'Third-Party Cookies'}
            </h2>
            <p className="leading-relaxed mb-4">
              {isPt ? 'Utilizamos os seguintes servicos de terceiros que podem definir cookies:' : 'We use the following third-party services that may set cookies:'}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: 'Google Analytics', purpose: isPt ? 'Analise de trafego' : 'Traffic analysis' },
                { name: 'Google Tag Manager', purpose: isPt ? 'Gestao de tags' : 'Tag management' },
                { name: 'Stripe', purpose: isPt ? 'Processamento de pagamentos' : 'Payment processing' },
                { name: 'NextAuth.js', purpose: isPt ? 'Autenticacao de utilizadores' : 'User authentication' },
              ].map(service => (
                <div key={service.name} className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <div className="h-2 w-2 rounded-full bg-[#1B7A8A] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{service.name}</p>
                    <p className="text-xs text-slate-500">{service.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? 'Como Gerir os Cookies' : 'How to Manage Cookies'}
            </h2>
            <p className="leading-relaxed mb-4">
              {isPt
                ? 'Pode gerir as suas preferencias de cookies de varias formas:'
                : 'You can manage your cookie preferences in several ways:'}
            </p>
            <ul className="space-y-2">
              {(isPt ? [
                'Utilize o banner de cookies que aparece na sua primeira visita ao site',
                'Nas definicoes do seu navegador (Chrome, Firefox, Safari, Edge)',
                'Atraves das ferramentas de opt-out dos servicos de terceiros',
                'Contactando-nos diretamente para remover os seus dados',
              ] : [
                'Use the cookie banner that appears on your first visit to the site',
                'In your browser settings (Chrome, Firefox, Safari, Edge)',
                'Through the opt-out tools of third-party services',
                'By contacting us directly to remove your data',
              ]).map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1B7A8A] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-4">
              {isPt
                ? 'Nota: Desativar certos cookies pode afetar a funcionalidade do website e a sua experiencia de utilizacao.'
                : 'Note: Disabling certain cookies may affect website functionality and your user experience.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? 'Contacto' : 'Contact'}
            </h2>
            <p className="leading-relaxed mb-4">
              {isPt ? 'Para questoes sobre cookies, contacte-nos:' : 'For cookie questions, contact us:'}
            </p>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-2">
              <p className="font-bold text-slate-900">Tec Fazer</p>
              <p className="text-sm text-slate-600">📧 info@tecfazer.pt</p>
              <p className="text-sm text-slate-600">📱 +351 963 101 123</p>
            </div>
            <div className="mt-4 flex gap-3 flex-wrap">
              <Link href={`/${params.locale}/privacidade`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                {isPt ? 'Politica de Privacidade' : 'Privacy Policy'}
              </Link>
              <Link href={`/${params.locale}/termos`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                {isPt ? 'Termos de Servico' : 'Terms of Service'}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
