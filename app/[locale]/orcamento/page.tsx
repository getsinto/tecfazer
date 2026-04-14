import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import EstimatorWizard from '@/components/forms/EstimatorWizard'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Calculadora de Orçamento | Tec Fazer',
    titleEn: 'Budget Calculator | Tec Fazer',
    descPt: 'Calcule o orçamento do seu projeto em minutos. Obtenha uma estimativa personalizada baseada nas suas necessidades.',
    descEn: 'Calculate your project budget in minutes. Get a personalized estimate based on your needs.',
    path: '/orcamento',
  })
}

export default async function EstimatorPage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('estimator')

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-brand-orange/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent">
              {params.locale === 'pt' ? 'Calculadora de Orçamento' : 'Budget Calculator'}
            </h1>
            <p className="text-xl text-gray-600">
              {params.locale === 'pt' 
                ? 'Descubra quanto custará o seu projeto em apenas 6 passos simples'
                : 'Discover how much your project will cost in just 6 simple steps'}
            </p>
          </div>
        </div>
      </section>

      {/* Estimator Wizard */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <EstimatorWizard locale={params.locale} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {params.locale === 'pt' ? 'Porquê usar a nossa calculadora?' : 'Why use our calculator?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">
                {params.locale === 'pt' ? 'Rápido e Fácil' : 'Fast and Easy'}
              </h3>
              <p className="text-gray-600">
                {params.locale === 'pt' 
                  ? 'Obtenha uma estimativa em menos de 5 minutos'
                  : 'Get an estimate in less than 5 minutes'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">
                {params.locale === 'pt' ? 'Preciso' : 'Accurate'}
              </h3>
              <p className="text-gray-600">
                {params.locale === 'pt' 
                  ? 'Baseado em centenas de projetos reais'
                  : 'Based on hundreds of real projects'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2">
                {params.locale === 'pt' ? 'Recomendações' : 'Recommendations'}
              </h3>
              <p className="text-gray-600">
                {params.locale === 'pt' 
                  ? 'Receba sugestões personalizadas'
                  : 'Receive personalized suggestions'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
