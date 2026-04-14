import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import ReviewForm from '@/components/forms/ReviewForm'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Deixar Avaliação | Tec Fazer',
    titleEn: 'Leave a Review | Tec Fazer',
    descPt: 'Partilhe a sua experiência connosco. A sua opinião é importante!',
    descEn: 'Share your experience with us. Your opinion matters!',
    path: '/deixar-avaliacao',
  })
}

export default async function ReviewPage({ 
  params,
  searchParams,
}: { 
  params: { locale: string }
  searchParams: { token?: string }
}) {
  const isPt = params.locale === 'pt'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-brand-orange/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-teal to-brand-orange bg-clip-text text-transparent">
              {isPt ? 'Deixe a Sua Avaliação' : 'Leave Your Review'}
            </h1>
            <p className="text-xl text-gray-600">
              {isPt 
                ? 'A sua opinião ajuda-nos a melhorar e ajuda outros clientes a tomar decisões informadas'
                : 'Your opinion helps us improve and helps other clients make informed decisions'}
            </p>
          </div>
        </div>
      </section>

      {/* Review Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ReviewForm locale={params.locale} token={searchParams.token} />
        </div>
      </section>

      {/* Why Review Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isPt ? 'Porquê deixar uma avaliação?' : 'Why leave a review?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">
                {isPt ? 'Partilhe a Sua Experiência' : 'Share Your Experience'}
              </h3>
              <p className="text-gray-600">
                {isPt 
                  ? 'Conte-nos como foi trabalhar connosco'
                  : 'Tell us about working with us'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">
                {isPt ? 'Ajude-nos a Melhorar' : 'Help Us Improve'}
              </h3>
              <p className="text-gray-600">
                {isPt 
                  ? 'O seu feedback é essencial para o nosso crescimento'
                  : 'Your feedback is essential for our growth'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">
                {isPt ? 'Ajude Outros Clientes' : 'Help Other Clients'}
              </h3>
              <p className="text-gray-600">
                {isPt 
                  ? 'A sua avaliação ajuda outros a escolher'
                  : 'Your review helps others choose'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
