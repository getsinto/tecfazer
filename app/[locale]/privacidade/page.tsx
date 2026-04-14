import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Política de Privacidade | Tec Fazer',
    titleEn: 'Privacy Policy | Tec Fazer',
    descPt: 'Saiba como protegemos e tratamos os seus dados pessoais.',
    descEn: 'Learn how we protect and process your personal data.',
    path: '/privacidade',
  })
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  const isPt = params.locale === 'pt'

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-5xl font-bold mb-8">
          {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {isPt ? 'Última atualização: ' : 'Last updated: '}
          {new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '1. Introdução' : '1. Introduction'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'A Tec Fazer ("nós", "nosso" ou "empresa") está comprometida em proteger a privacidade dos nossos clientes e visitantes do website. Esta Política de Privacidade explica como recolhemos, usamos, divulgamos e protegemos as suas informações pessoais.'
                : 'Tec Fazer ("we", "our" or "company") is committed to protecting the privacy of our customers and website visitors. This Privacy Policy explains how we collect, use, disclose and protect your personal information.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '2. Informações que Recolhemos' : '2. Information We Collect'}
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '2.1 Informações Fornecidas por Si' : '2.1 Information You Provide'}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Nome e informações de contacto (email, telefone)' : 'Name and contact information (email, phone)'}</li>
              <li>{isPt ? 'Informações da empresa' : 'Company information'}</li>
              <li>{isPt ? 'Detalhes do projeto e requisitos' : 'Project details and requirements'}</li>
              <li>{isPt ? 'Informações de pagamento (processadas através do Stripe)' : 'Payment information (processed through Stripe)'}</li>
              <li>{isPt ? 'Comunicações connosco' : 'Communications with us'}</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">
              {isPt ? '2.2 Informações Recolhidas Automaticamente' : '2.2 Automatically Collected Information'}
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Endereço IP e localização geográfica' : 'IP address and geographic location'}</li>
              <li>{isPt ? 'Tipo de navegador e dispositivo' : 'Browser type and device'}</li>
              <li>{isPt ? 'Páginas visitadas e tempo de permanência' : 'Pages visited and time spent'}</li>
              <li>{isPt ? 'Origem do tráfego (referrer)' : 'Traffic source (referrer)'}</li>
              <li>{isPt ? 'Cookies e tecnologias similares' : 'Cookies and similar technologies'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '3. Como Usamos as Suas Informações' : '3. How We Use Your Information'}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Fornecer e melhorar os nossos serviços' : 'Provide and improve our services'}</li>
              <li>{isPt ? 'Processar pagamentos e gerir subscrições' : 'Process payments and manage subscriptions'}</li>
              <li>{isPt ? 'Comunicar sobre projetos e serviços' : 'Communicate about projects and services'}</li>
              <li>{isPt ? 'Enviar newsletters e atualizações (com o seu consentimento)' : 'Send newsletters and updates (with your consent)'}</li>
              <li>{isPt ? 'Analisar e melhorar o desempenho do website' : 'Analyze and improve website performance'}</li>
              <li>{isPt ? 'Cumprir obrigações legais' : 'Comply with legal obligations'}</li>
              <li>{isPt ? 'Prevenir fraudes e garantir segurança' : 'Prevent fraud and ensure security'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '4. Partilha de Informações' : '4. Information Sharing'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Não vendemos as suas informações pessoais. Podemos partilhar as suas informações com:'
                : 'We do not sell your personal information. We may share your information with:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Prestadores de serviços (Stripe, Resend, Uploadthing, OpenAI)' : 'Service providers (Stripe, Resend, Uploadthing, OpenAI)'}</li>
              <li>{isPt ? 'Parceiros de negócio (com o seu consentimento)' : 'Business partners (with your consent)'}</li>
              <li>{isPt ? 'Autoridades legais (quando exigido por lei)' : 'Legal authorities (when required by law)'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '5. Cookies e Tecnologias de Rastreamento' : '5. Cookies and Tracking Technologies'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Utilizamos cookies e tecnologias similares para:'
                : 'We use cookies and similar technologies to:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Manter a sua sessão ativa' : 'Keep your session active'}</li>
              <li>{isPt ? 'Lembrar as suas preferências' : 'Remember your preferences'}</li>
              <li>{isPt ? 'Analisar o tráfego do website' : 'Analyze website traffic'}</li>
              <li>{isPt ? 'Melhorar a experiência do utilizador' : 'Improve user experience'}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {isPt 
                ? 'Pode gerir as suas preferências de cookies nas configurações do seu navegador.'
                : 'You can manage your cookie preferences in your browser settings.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '6. Segurança dos Dados' : '6. Data Security'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger as suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isto inclui encriptação SSL/TLS, armazenamento seguro de dados e controlos de acesso rigorosos.'
                : 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure or destruction. This includes SSL/TLS encryption, secure data storage and strict access controls.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '7. Os Seus Direitos (RGPD)' : '7. Your Rights (GDPR)'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'De acordo com o Regulamento Geral de Proteção de Dados (RGPD), tem os seguintes direitos:'
                : 'Under the General Data Protection Regulation (GDPR), you have the following rights:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Direito de acesso aos seus dados' : 'Right to access your data'}</li>
              <li>{isPt ? 'Direito de retificação de dados incorretos' : 'Right to rectify incorrect data'}</li>
              <li>{isPt ? 'Direito ao apagamento ("direito a ser esquecido")' : 'Right to erasure ("right to be forgotten")'}</li>
              <li>{isPt ? 'Direito à limitação do tratamento' : 'Right to restriction of processing'}</li>
              <li>{isPt ? 'Direito à portabilidade dos dados' : 'Right to data portability'}</li>
              <li>{isPt ? 'Direito de oposição ao tratamento' : 'Right to object to processing'}</li>
              <li>{isPt ? 'Direito de retirar o consentimento' : 'Right to withdraw consent'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '8. Retenção de Dados' : '8. Data Retention'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Retemos as suas informações pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.'
                : 'We retain your personal information only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '9. Transferências Internacionais' : '9. International Transfers'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Os seus dados podem ser transferidos e processados em países fora da União Europeia. Garantimos que essas transferências são realizadas de acordo com o RGPD e com salvaguardas apropriadas.'
                : 'Your data may be transferred and processed in countries outside the European Union. We ensure that these transfers are carried out in accordance with GDPR and with appropriate safeguards.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '10. Alterações a Esta Política' : '10. Changes to This Policy'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através do nosso website ou por email.'
                : 'We may update this Privacy Policy periodically. We will notify you of significant changes through our website or by email.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '11. Contacto' : '11. Contact'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Para exercer os seus direitos ou para questões sobre esta política, contacte-nos:'
                : 'To exercise your rights or for questions about this policy, contact us:'}
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-2">Tec Fazer</p>
              <p className="text-gray-700">Email: privacy@tecfazer.pt</p>
              <p className="text-gray-700">Telefone: +351 261 123 456</p>
              <p className="text-gray-700">Morada: Mafra, Lisboa, Portugal</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
