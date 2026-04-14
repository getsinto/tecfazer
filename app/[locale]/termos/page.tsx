import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Termos de Serviço | Tec Fazer',
    titleEn: 'Terms of Service | Tec Fazer',
    descPt: 'Leia os nossos termos e condições de utilização dos serviços.',
    descEn: 'Read our terms and conditions for using our services.',
    path: '/termos',
  })
}

export default async function TermsPage({ params }: { params: { locale: string } }) {
  const isPt = params.locale === 'pt'

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-5xl font-bold mb-8">
          {isPt ? 'Termos de Serviço' : 'Terms of Service'}
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
              {isPt ? '1. Aceitação dos Termos' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Ao aceder e utilizar os serviços da Tec Fazer, você concorda em ficar vinculado a estes Termos de Serviço. Se não concordar com qualquer parte destes termos, não deve utilizar os nossos serviços.'
                : 'By accessing and using Tec Fazer services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our services.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '2. Descrição dos Serviços' : '2. Service Description'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'A Tec Fazer fornece serviços de desenvolvimento de software, incluindo mas não limitado a:'
                : 'Tec Fazer provides software development services, including but not limited to:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Desenvolvimento de websites e aplicações web' : 'Website and web application development'}</li>
              <li>{isPt ? 'Desenvolvimento de aplicações móveis' : 'Mobile application development'}</li>
              <li>{isPt ? 'Desenvolvimento de e-commerce' : 'E-commerce development'}</li>
              <li>{isPt ? 'Software personalizado' : 'Custom software'}</li>
              <li>{isPt ? 'Design UI/UX' : 'UI/UX design'}</li>
              <li>{isPt ? 'Consultoria tecnológica' : 'Technology consulting'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '3. Obrigações do Cliente' : '3. Client Obligations'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt ? 'Como cliente, você concorda em:' : 'As a client, you agree to:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Fornecer informações precisas e completas' : 'Provide accurate and complete information'}</li>
              <li>{isPt ? 'Responder prontamente às solicitações de informação' : 'Respond promptly to information requests'}</li>
              <li>{isPt ? 'Fornecer acesso necessário a sistemas e recursos' : 'Provide necessary access to systems and resources'}</li>
              <li>{isPt ? 'Efetuar pagamentos conforme acordado' : 'Make payments as agreed'}</li>
              <li>{isPt ? 'Respeitar os direitos de propriedade intelectual' : 'Respect intellectual property rights'}</li>
              <li>{isPt ? 'Não utilizar os serviços para fins ilegais' : 'Not use services for illegal purposes'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '4. Pagamentos e Faturação' : '4. Payments and Billing'}
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '4.1 Preços' : '4.1 Pricing'}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Os preços são apresentados em Euros (EUR) e podem estar sujeitos a IVA conforme aplicável. Reservamo-nos o direito de alterar os preços com aviso prévio de 30 dias.'
                : 'Prices are displayed in Euros (EUR) and may be subject to VAT as applicable. We reserve the right to change prices with 30 days notice.'}
            </p>

            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '4.2 Métodos de Pagamento' : '4.2 Payment Methods'}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Aceitamos pagamentos através de cartão de crédito/débito processados pelo Stripe. Todos os pagamentos são seguros e encriptados.'
                : 'We accept payments via credit/debit card processed by Stripe. All payments are secure and encrypted.'}
            </p>

            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '4.3 Subscrições' : '4.3 Subscriptions'}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'As subscrições são renovadas automaticamente. Pode cancelar a qualquer momento através do portal do cliente. Os reembolsos são processados de acordo com a nossa política de reembolso.'
                : 'Subscriptions are automatically renewed. You can cancel at any time through the customer portal. Refunds are processed according to our refund policy.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '5. Propriedade Intelectual' : '5. Intellectual Property'}
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '5.1 Trabalho Desenvolvido' : '5.1 Developed Work'}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Após o pagamento integral, o cliente recebe os direitos de propriedade sobre o trabalho desenvolvido especificamente para o seu projeto, exceto componentes de terceiros e ferramentas proprietárias da Tec Fazer.'
                : 'Upon full payment, the client receives ownership rights over work developed specifically for their project, except third-party components and Tec Fazer proprietary tools.'}
            </p>

            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '5.2 Materiais Pré-Existentes' : '5.2 Pre-Existing Materials'}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'A Tec Fazer retém todos os direitos sobre ferramentas, frameworks e componentes pré-existentes utilizados no desenvolvimento.'
                : 'Tec Fazer retains all rights to pre-existing tools, frameworks and components used in development.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '6. Garantias e Suporte' : '6. Warranties and Support'}
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '6.1 Garantia de Qualidade' : '6.1 Quality Warranty'}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Garantimos que o trabalho será realizado de forma profissional e de acordo com os padrões da indústria. Oferecemos um período de garantia de 90 dias para correção de bugs após a entrega.'
                : 'We guarantee that work will be performed professionally and according to industry standards. We offer a 90-day warranty period for bug fixes after delivery.'}
            </p>

            <h3 className="text-xl font-semibold mb-3">
              {isPt ? '6.2 Suporte Técnico' : '6.2 Technical Support'}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'O suporte técnico está disponível de acordo com o plano contratado. Os tempos de resposta variam conforme a prioridade do ticket.'
                : 'Technical support is available according to the contracted plan. Response times vary according to ticket priority.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '7. Limitação de Responsabilidade' : '7. Limitation of Liability'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Na máxima extensão permitida por lei, a Tec Fazer não será responsável por:'
                : 'To the maximum extent permitted by law, Tec Fazer shall not be liable for:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'Danos indiretos, incidentais ou consequenciais' : 'Indirect, incidental or consequential damages'}</li>
              <li>{isPt ? 'Perda de lucros ou receitas' : 'Loss of profits or revenue'}</li>
              <li>{isPt ? 'Perda de dados (exceto por negligência grave)' : 'Loss of data (except for gross negligence)'}</li>
              <li>{isPt ? 'Interrupções de serviço de terceiros' : 'Third-party service interruptions'}</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              {isPt 
                ? 'A nossa responsabilidade total não excederá o valor pago pelos serviços nos últimos 12 meses.'
                : 'Our total liability shall not exceed the amount paid for services in the last 12 months.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '8. Confidencialidade' : '8. Confidentiality'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Ambas as partes concordam em manter confidenciais todas as informações proprietárias e sensíveis partilhadas durante o projeto. Esta obrigação permanece em vigor após o término do contrato.'
                : 'Both parties agree to keep confidential all proprietary and sensitive information shared during the project. This obligation remains in effect after contract termination.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '9. Rescisão' : '9. Termination'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Qualquer parte pode rescindir o contrato com aviso prévio de 30 dias. Em caso de rescisão:'
                : 'Either party may terminate the contract with 30 days notice. In case of termination:'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>{isPt ? 'O cliente deve pagar por todo o trabalho concluído' : 'Client must pay for all completed work'}</li>
              <li>{isPt ? 'Materiais desenvolvidos até à data serão entregues' : 'Materials developed to date will be delivered'}</li>
              <li>{isPt ? 'Obrigações de confidencialidade permanecem em vigor' : 'Confidentiality obligations remain in effect'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '10. Força Maior' : '10. Force Majeure'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Nenhuma parte será responsável por atrasos ou falhas no cumprimento devido a circunstâncias fora do seu controlo razoável, incluindo desastres naturais, guerras, pandemias ou falhas de infraestrutura.'
                : 'Neither party shall be liable for delays or failures in performance due to circumstances beyond their reasonable control, including natural disasters, wars, pandemics or infrastructure failures.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '11. Lei Aplicável' : '11. Governing Law'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Estes termos são regidos pelas leis de Portugal. Qualquer disputa será resolvida nos tribunais de Lisboa, Portugal.'
                : 'These terms are governed by the laws of Portugal. Any disputes will be resolved in the courts of Lisbon, Portugal.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '12. Alterações aos Termos' : '12. Changes to Terms'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isPt 
                ? 'Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor após publicação no website. O uso continuado dos serviços constitui aceitação dos termos modificados.'
                : 'We reserve the right to modify these terms at any time. Changes will take effect after publication on the website. Continued use of services constitutes acceptance of modified terms.'}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4">
              {isPt ? '13. Contacto' : '13. Contact'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {isPt 
                ? 'Para questões sobre estes termos, contacte-nos:'
                : 'For questions about these terms, contact us:'}
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-2">Tec Fazer</p>
              <p className="text-gray-700">Email: legal@tecfazer.pt</p>
              <p className="text-gray-700">Telefone: +351 261 123 456</p>
              <p className="text-gray-700">Morada: Mafra, Lisboa, Portugal</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
