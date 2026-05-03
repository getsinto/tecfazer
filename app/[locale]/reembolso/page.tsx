import { buildMetadata } from '@/lib/seo'
import { Metadata } from 'next'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return buildMetadata({
    locale: params.locale,
    titlePt: 'Politica de Reembolso | Tec Fazer',
    titleEn: 'Refund Policy | Tec Fazer',
    descPt: 'Saiba como funciona a nossa politica de reembolso e cancelamento de servicos.',
    descEn: 'Learn how our refund and service cancellation policy works.',
    path: '/reembolso',
  })
}

export default async function RefundPage({ params }: { params: { locale: string } }) {
  const isPt = params.locale === 'pt'

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <h1 className="text-4xl font-black text-slate-900 mb-4">
          {isPt ? 'Politica de Reembolso' : 'Refund Policy'}
        </h1>
        <p className="text-slate-500 mb-10">
          {isPt ? 'Ultima atualizacao: ' : 'Last updated: '}
          {new Date().toLocaleDateString(isPt ? 'pt-PT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-10 text-slate-700">

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '1. Garantia de 30 Dias' : '1. 30-Day Guarantee'}
            </h2>
            <p className="leading-relaxed">
              {isPt
                ? 'A Tec Fazer oferece uma garantia de satisfacao de 30 dias em todos os servicos. Se nao estiver satisfeito com o trabalho entregue, pode solicitar um reembolso total dentro de 30 dias apos a entrega do projeto.'
                : 'Tec Fazer offers a 30-day satisfaction guarantee on all services. If you are not satisfied with the delivered work, you may request a full refund within 30 days of project delivery.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '2. Condicoes de Reembolso' : '2. Refund Conditions'}
            </h2>
            <p className="leading-relaxed mb-4">
              {isPt ? 'Os reembolsos sao processados nas seguintes situacoes:' : 'Refunds are processed in the following situations:'}
            </p>
            <div className="space-y-3">
              {[
                {
                  title: isPt ? 'Reembolso Total (100%)' : 'Full Refund (100%)',
                  items: isPt
                    ? ['Cancelamento antes do inicio do trabalho', 'Nao entrega do servico acordado', 'Falha tecnica grave nao resolvida em 14 dias']
                    : ['Cancellation before work begins', 'Non-delivery of agreed service', 'Serious technical failure not resolved within 14 days'],
                  color: 'bg-emerald-50 border-emerald-200',
                },
                {
                  title: isPt ? 'Reembolso Parcial (50%)' : 'Partial Refund (50%)',
                  items: isPt
                    ? ['Cancelamento apos inicio mas antes de 50% de conclusao', 'Insatisfacao com qualidade documentada e comunicada']
                    : ['Cancellation after start but before 50% completion', 'Documented and communicated quality dissatisfaction'],
                  color: 'bg-amber-50 border-amber-200',
                },
                {
                  title: isPt ? 'Sem Reembolso' : 'No Refund',
                  items: isPt
                    ? ['Projeto concluido e entregue conforme especificacoes', 'Cancelamento apos 50% de conclusao', 'Servicos de manutencao mensal ja prestados', 'Alteracoes de requisitos pelo cliente apos inicio']
                    : ['Project completed and delivered per specifications', 'Cancellation after 50% completion', 'Monthly maintenance services already rendered', 'Client requirement changes after start'],
                  color: 'bg-red-50 border-red-200',
                },
              ].map(section => (
                <div key={section.title} className={`rounded-xl border p-5 ${section.color}`}>
                  <h3 className="font-bold text-slate-900 mb-2">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '3. Planos Mensais e Subscricoes' : '3. Monthly Plans and Subscriptions'}
            </h2>
            <p className="leading-relaxed mb-3">
              {isPt
                ? 'Para planos de subscricao mensal:'
                : 'For monthly subscription plans:'}
            </p>
            <ul className="space-y-2">
              {(isPt ? [
                'Pode cancelar a qualquer momento sem penalizacao',
                'O acesso continua ate ao fim do periodo ja pago',
                'Nao sao emitidos reembolsos por periodos parciais',
                'O cancelamento e efetivo no proximo ciclo de faturacao',
              ] : [
                'You can cancel at any time without penalty',
                'Access continues until the end of the already paid period',
                'No refunds are issued for partial periods',
                'Cancellation is effective on the next billing cycle',
              ]).map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#1B7A8A] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '4. Como Solicitar um Reembolso' : '4. How to Request a Refund'}
            </h2>
            <p className="leading-relaxed mb-4">
              {isPt
                ? 'Para solicitar um reembolso, siga estes passos:'
                : 'To request a refund, follow these steps:'}
            </p>
            <div className="space-y-3">
              {(isPt ? [
                'Envie um email para info@tecfazer.pt com o assunto "Pedido de Reembolso"',
                'Inclua o numero de referencia do pedido ou fatura',
                'Descreva o motivo do pedido de reembolso',
                'Aguarde a nossa resposta em ate 2 dias uteis',
                'O reembolso sera processado em 5-10 dias uteis apos aprovacao',
              ] : [
                'Send an email to info@tecfazer.pt with subject "Refund Request"',
                'Include the order reference number or invoice',
                'Describe the reason for the refund request',
                'Wait for our response within 2 business days',
                'Refund will be processed within 5-10 business days after approval',
              ]).map((step, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1B7A8A] text-white text-xs font-black">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '5. Metodo de Reembolso' : '5. Refund Method'}
            </h2>
            <p className="leading-relaxed">
              {isPt
                ? 'Os reembolsos sao processados atraves do mesmo metodo de pagamento utilizado na compra original. Para pagamentos com cartao de credito/debito via Stripe, o reembolso aparecera no extrato em 5-10 dias uteis, dependendo do banco emissor.'
                : 'Refunds are processed through the same payment method used in the original purchase. For credit/debit card payments via Stripe, the refund will appear on the statement within 5-10 business days, depending on the issuing bank.'}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '6. Excecoes' : '6. Exceptions'}
            </h2>
            <p className="leading-relaxed mb-3">
              {isPt ? 'Nao sao elegiveis para reembolso:' : 'Not eligible for refund:'}
            </p>
            <ul className="space-y-2">
              {(isPt ? [
                'Servicos de consultoria e formacao ja realizados',
                'Licencas de software de terceiros adquiridas em nome do cliente',
                'Custos de hosting e dominios ja pagos a fornecedores',
                'Trabalho adicional solicitado pelo cliente fora do escopo original',
              ] : [
                'Consulting and training services already performed',
                'Third-party software licenses purchased on behalf of the client',
                'Hosting and domain costs already paid to providers',
                'Additional work requested by the client outside the original scope',
              ]).map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {isPt ? '7. Contacto' : '7. Contact'}
            </h2>
            <p className="leading-relaxed mb-4">
              {isPt
                ? 'Para questoes sobre reembolsos, contacte-nos:'
                : 'For refund questions, contact us:'}
            </p>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 space-y-2">
              <p className="font-bold text-slate-900">Tec Fazer</p>
              <p className="text-sm text-slate-600">📧 info@tecfazer.pt</p>
              <p className="text-sm text-slate-600">📱 +351 963 101 123</p>
              <p className="text-sm text-slate-600">⏰ {isPt ? 'Segunda a Sexta, 9h-18h' : 'Monday to Friday, 9am-6pm'}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href={`/${params.locale}/contacto`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all">
                {isPt ? 'Contactar Suporte' : 'Contact Support'}
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
