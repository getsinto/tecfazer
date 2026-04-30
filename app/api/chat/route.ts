import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── CORRECT COMPANY INFO ────────────────────────────────────────────────────
const COMPANY = {
  name: 'Tec Fazer',
  fullName: 'Tec Fazer - Soluções Tecnológicas, Lda.',
  tagline: 'Building The Future',
  founded: '2019',
  location: 'Mafra, Lisboa, Portugal',
  phone: '+351 963 101 123',
  whatsapp: '+351 963 101 123',
  emails: {
    main: 'info@tecfazer.pt',
    general: 'geral@tecfazer.pt',
  },
  hours: 'Segunda a Sexta, 9h00 - 18h00',
  hoursEn: 'Monday to Friday, 9am - 6pm',
  website: 'https://tecfazer.pt',
  projects: '300+',
  clients: '106+',
  years: '5+',
  certification: 'ISO 9001',
}

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────
const systemPrompts: Record<string, string> = {
  pt: `És um assistente da Tec Fazer. Responde de forma natural, direta e humana — como um colaborador real da empresa, não como um bot.

REGRAS IMPORTANTES:
- Responde SEMPRE em Português de Portugal
- Sê direto e conciso — não uses introduções longas nem listas desnecessárias
- Quando alguém pergunta algo específico (ex: telefone, email), responde DIRETAMENTE com essa informação
- Não repitas a pergunta do utilizador
- Não uses frases genéricas como "Estou aqui para ajudar com..."
- Usa um tom amigável mas profissional
- Usa emojis com moderação (1-2 por resposta, não em cada linha)

INFORMAÇÕES DA EMPRESA:
Nome: Tec Fazer - Soluções Tecnológicas, Lda.
Fundada: 2019 | Localização: Mafra, Lisboa, Portugal
Certificação: ISO 9001 | Projetos: 300+ | Clientes: 106+

CONTACTOS (CORRETOS E ATUALIZADOS):
- Telefone / WhatsApp: +351 963 101 123
- Email principal: info@tecfazer.pt
- Email geral: geral@tecfazer.pt
- Horário: Segunda a Sexta, 9h00 - 18h00
- Website: https://tecfazer.pt

SERVIÇOS E PREÇOS:
- Websites / WordPress: a partir de 120-150 EUR
- Landing Pages: a partir de 80 EUR
- Aplicações Web: a partir de 500 EUR
- Apps Mobile (iOS/Android): a partir de 400-800 EUR
- E-commerce (Shopify/WooCommerce): a partir de 250-300 EUR
- Design Gráfico / Logo: a partir de 50-80 EUR
- SEO: a partir de 150 EUR/mês
- Google Ads / Facebook Ads: a partir de 150-200 EUR/mês
- Gestão Redes Sociais: a partir de 150 EUR/mês
- Cloud (AWS/Azure/GCP): a partir de 350 EUR
- Cibersegurança: a partir de 200 EUR
- Consultoria IT: a partir de 80 EUR/hora
- Suporte/Manutenção: a partir de 50 EUR/mês

PLANOS MENSAIS:
- Starter: 499 EUR/mês (website + hosting + manutenção + suporte)
- Business: 999 EUR/mês (loja online + marketing + analytics + suporte prioritário)
- Enterprise: 2.499 EUR/mês (soluções completas + equipa dedicada + consultoria)

PROCESSO:
1. Consulta gratuita de 30 minutos
2. Análise de requisitos e proposta
3. Desenvolvimento iterativo
4. Testes e lançamento
5. Suporte pós-lançamento

TECNOLOGIAS: React, Next.js, Vue.js, Node.js, Python, PHP, Flutter, React Native, Swift, Kotlin, AWS, Azure, Google Cloud, WordPress, Shopify, WooCommerce`,

  en: `You are an assistant at Tec Fazer. Respond naturally, directly and in a human way — like a real team member, not a bot.

IMPORTANT RULES:
- ALWAYS respond in English
- Be direct and concise — no long introductions or unnecessary lists
- When someone asks something specific (e.g. phone, email), answer DIRECTLY with that information
- Don't repeat the user's question
- Don't use generic phrases like "I'm here to help with..."
- Use a friendly but professional tone
- Use emojis sparingly (1-2 per response, not on every line)

COMPANY INFORMATION:
Name: Tec Fazer - Technological Solutions, Ltd.
Founded: 2019 | Location: Mafra, Lisbon, Portugal
Certification: ISO 9001 | Projects: 300+ | Clients: 106+

CONTACTS (CORRECT AND UP TO DATE):
- Phone / WhatsApp: +351 963 101 123
- Main email: info@tecfazer.pt
- General email: geral@tecfazer.pt
- Hours: Monday to Friday, 9am - 6pm
- Website: https://tecfazer.pt

SERVICES AND PRICES:
- Websites / WordPress: from 120-150 EUR
- Landing Pages: from 80 EUR
- Web Applications: from 500 EUR
- Mobile Apps (iOS/Android): from 400-800 EUR
- E-commerce (Shopify/WooCommerce): from 250-300 EUR
- Graphic Design / Logo: from 50-80 EUR
- SEO: from 150 EUR/month
- Google Ads / Facebook Ads: from 150-200 EUR/month
- Social Media Management: from 150 EUR/month
- Cloud (AWS/Azure/GCP): from 350 EUR
- Cybersecurity: from 200 EUR
- IT Consulting: from 80 EUR/hour
- Support/Maintenance: from 50 EUR/month

MONTHLY PLANS:
- Starter: 499 EUR/month (website + hosting + maintenance + support)
- Business: 999 EUR/month (online store + marketing + analytics + priority support)
- Enterprise: 2,499 EUR/month (complete solutions + dedicated team + consulting)

PROCESS:
1. Free 30-minute consultation
2. Requirements analysis and proposal
3. Iterative development
4. Testing and launch
5. Post-launch support

TECHNOLOGIES: React, Next.js, Vue.js, Node.js, Python, PHP, Flutter, React Native, Swift, Kotlin, AWS, Azure, Google Cloud, WordPress, Shopify, WooCommerce`,
}

// ─── SMART FALLBACK ───────────────────────────────────────────────────────────
function getFallbackResponse(message: string, locale: string): string {
  const msg = message.toLowerCase().trim()
  const isPt = locale === 'pt'

  // ── contact / phone / email ──────────────────────────────────────────────
  const isContactQ = msg.includes('telefon') || msg.includes('phone') || msg.includes('numero') || msg.includes('number') ||
    msg.includes('email') || msg.includes('mail') || msg.includes('contacto') || msg.includes('contact') ||
    msg.includes('whatsapp') || msg.includes('chamar') || msg.includes('call') || msg.includes('falar') ||
    msg.includes('reach') || msg.includes('get in touch') || msg.includes('como entrar')

  if (isContactQ) {
    return isPt
      ? `Claro! Aqui estão os nossos contactos:\n\n📱 Telefone / WhatsApp: ${COMPANY.phone}\n📧 Email: ${COMPANY.emails.main} | ${COMPANY.emails.general}\n⏰ Horário: ${COMPANY.hours}\n🌐 ${COMPANY.website}\n\nPode ligar, enviar WhatsApp ou email — respondemos sempre em menos de 24h.`
      : `Sure! Here are our contact details:\n\n📱 Phone / WhatsApp: ${COMPANY.phone}\n📧 Email: ${COMPANY.emails.main} | ${COMPANY.emails.general}\n⏰ Hours: ${COMPANY.hoursEn}\n🌐 ${COMPANY.website}\n\nFeel free to call, WhatsApp or email us — we always reply within 24h.`
  }

  // ── phone only ───────────────────────────────────────────────────────────
  const isPhoneOnly = (msg.includes('telefon') || msg.includes('phone') || msg.includes('numero') || msg.includes('number') || msg.includes('ligar') || msg.includes('call') || msg.includes('whatsapp')) &&
    !msg.includes('email') && !msg.includes('mail')

  if (isPhoneOnly) {
    return isPt
      ? `O nosso número é **${COMPANY.phone}** (também disponível por WhatsApp). Estamos disponíveis de ${COMPANY.hours}.`
      : `Our number is **${COMPANY.phone}** (also available on WhatsApp). We're available ${COMPANY.hoursEn}.`
  }

  // ── email only ───────────────────────────────────────────────────────────
  const isEmailOnly = (msg.includes('email') || msg.includes('mail') || msg.includes('correio')) &&
    !msg.includes('telefon') && !msg.includes('phone')

  if (isEmailOnly) {
    return isPt
      ? `Os nossos emails são:\n• ${COMPANY.emails.main} (principal)\n• ${COMPANY.emails.general} (geral)\n\nRespondemos sempre em menos de 24 horas.`
      : `Our emails are:\n• ${COMPANY.emails.main} (main)\n• ${COMPANY.emails.general} (general)\n\nWe always reply within 24 hours.`
  }

  // ── location / address ───────────────────────────────────────────────────
  if (msg.includes('morada') || msg.includes('address') || msg.includes('localiza') || msg.includes('location') ||
    msg.includes('onde') || msg.includes('where') || msg.includes('mafra') || msg.includes('lisboa')) {
    return isPt
      ? `Estamos localizados em **Mafra, Lisboa, Portugal**. 📍\n\nTrabalhamos com clientes presencialmente e remotamente em todo o mundo. Quer agendar uma reunião?`
      : `We're located in **Mafra, Lisbon, Portugal**. 📍\n\nWe work with clients in person and remotely worldwide. Would you like to schedule a meeting?`
  }

  // ── hours ────────────────────────────────────────────────────────────────
  if (msg.includes('horário') || msg.includes('hours') || msg.includes('horario') || msg.includes('aberto') || msg.includes('open')) {
    return isPt
      ? `Estamos disponíveis de **${COMPANY.hours}** (GMT+1).\n\nFora deste horário pode sempre enviar email para ${COMPANY.emails.main} e respondemos no próximo dia útil.`
      : `We're available **${COMPANY.hoursEn}** (GMT+1).\n\nOutside these hours you can always email ${COMPANY.emails.main} and we'll reply on the next business day.`
  }

  // ── pricing ──────────────────────────────────────────────────────────────
  if (msg.includes('preço') || msg.includes('preco') || msg.includes('price') || msg.includes('cost') || msg.includes('custo') ||
    msg.includes('quanto') || msg.includes('how much') || msg.includes('valor') || msg.includes('orcamento') || msg.includes('quote')) {
    return isPt
      ? `Os nossos preços dependem do projeto, mas aqui vai uma ideia geral:\n\n• Website / WordPress: a partir de 120 EUR\n• Landing page: a partir de 80 EUR\n• Loja online: a partir de 250 EUR\n• App mobile: a partir de 400 EUR\n• Logo / Design: a partir de 50 EUR\n• SEO: a partir de 150 EUR/mês\n• Redes sociais: a partir de 150 EUR/mês\n\nPara um orçamento exato, pode usar a nossa calculadora em tecfazer.pt/orcamento ou falar connosco diretamente pelo ${COMPANY.phone}.`
      : `Our prices depend on the project, but here's a general idea:\n\n• Website / WordPress: from 120 EUR\n• Landing page: from 80 EUR\n• Online store: from 250 EUR\n• Mobile app: from 400 EUR\n• Logo / Design: from 50 EUR\n• SEO: from 150 EUR/month\n• Social media: from 150 EUR/month\n\nFor an exact quote, use our calculator at tecfazer.pt/orcamento or contact us directly at ${COMPANY.phone}.`
  }

  // ── services ─────────────────────────────────────────────────────────────
  if (msg.includes('serviço') || msg.includes('servico') || msg.includes('service') || msg.includes('fazem') ||
    msg.includes('oferecem') || msg.includes('what do you') || msg.includes('o que') || msg.includes('trabalho')) {
    return isPt
      ? `Trabalhamos em várias áreas de tecnologia:\n\n• **Web** — websites, WordPress, aplicações web, PWA\n• **Mobile** — apps iOS, Android, Flutter, React Native\n• **E-commerce** — Shopify, WooCommerce, lojas personalizadas\n• **Design** — logo, branding, design gráfico, UI/UX\n• **Marketing** — SEO, Google Ads, redes sociais, email marketing\n• **Cloud** — AWS, Azure, Google Cloud, DevOps\n• **IA** — chatbots, machine learning, automação\n• **Segurança** — auditorias, RGPD, backup\n• **Consultoria** — estratégia IT, arquitetura de software\n\nTem algum projeto em mente? Posso dar mais detalhes sobre qualquer área.`
      : `We work across several technology areas:\n\n• **Web** — websites, WordPress, web applications, PWA\n• **Mobile** — iOS, Android, Flutter, React Native apps\n• **E-commerce** — Shopify, WooCommerce, custom stores\n• **Design** — logo, branding, graphic design, UI/UX\n• **Marketing** — SEO, Google Ads, social media, email marketing\n• **Cloud** — AWS, Azure, Google Cloud, DevOps\n• **AI** — chatbots, machine learning, automation\n• **Security** — audits, GDPR, backup\n• **Consulting** — IT strategy, software architecture\n\nDo you have a project in mind? I can give more details on any area.`
  }

  // ── website specific ─────────────────────────────────────────────────────
  if (msg.includes('website') || msg.includes('site') || msg.includes('wordpress') || msg.includes('landing')) {
    return isPt
      ? `Desenvolvemos websites profissionais a partir de **120 EUR**:\n\n• Landing pages simples: 80-150 EUR\n• Website corporativo: 150-500 EUR\n• WordPress personalizado: 120-400 EUR\n• Aplicação web complexa: 500+ EUR\n\nTodos incluem design responsivo, SEO básico e painel de administração. Quer saber mais ou pedir um orçamento?`
      : `We build professional websites from **120 EUR**:\n\n• Simple landing pages: 80-150 EUR\n• Corporate website: 150-500 EUR\n• Custom WordPress: 120-400 EUR\n• Complex web application: 500+ EUR\n\nAll include responsive design, basic SEO and admin panel. Want to know more or get a quote?`
  }

  // ── mobile app ───────────────────────────────────────────────────────────
  if (msg.includes('app') || msg.includes('mobile') || msg.includes('ios') || msg.includes('android') || msg.includes('flutter')) {
    return isPt
      ? `Desenvolvemos apps mobile para iOS e Android:\n\n• App Flutter (iOS + Android): a partir de 500 EUR\n• App React Native: a partir de 400 EUR\n• App nativa iOS (Swift): a partir de 800 EUR\n• App nativa Android (Kotlin): a partir de 600 EUR\n\nO prazo médio é de 4-12 semanas dependendo da complexidade. Quer discutir o seu projeto?`
      : `We develop mobile apps for iOS and Android:\n\n• Flutter app (iOS + Android): from 500 EUR\n• React Native app: from 400 EUR\n• Native iOS app (Swift): from 800 EUR\n• Native Android app (Kotlin): from 600 EUR\n\nAverage timeline is 4-12 weeks depending on complexity. Want to discuss your project?`
  }

  // ── ecommerce ────────────────────────────────────────────────────────────
  if (msg.includes('loja') || msg.includes('store') || msg.includes('ecommerce') || msg.includes('e-commerce') ||
    msg.includes('shopify') || msg.includes('woocommerce') || msg.includes('vender') || msg.includes('sell')) {
    return isPt
      ? `Criamos lojas online completas:\n\n• WooCommerce (WordPress): a partir de 250 EUR\n• Shopify: a partir de 300 EUR\n• E-commerce personalizado: a partir de 1.500 EUR\n\nTodas incluem pagamentos (MB Way, Multibanco, Stripe, PayPal), gestão de produtos e painel administrativo. Quer um orçamento?`
      : `We build complete online stores:\n\n• WooCommerce (WordPress): from 250 EUR\n• Shopify: from 300 EUR\n• Custom e-commerce: from 1,500 EUR\n\nAll include payments (MB Way, Multibanco, Stripe, PayPal), product management and admin panel. Want a quote?`
  }

  // ── design ───────────────────────────────────────────────────────────────
  if (msg.includes('design') || msg.includes('logo') || msg.includes('branding') || msg.includes('grafico') || msg.includes('graphic')) {
    return isPt
      ? `Oferecemos serviços de design completos:\n\n• Logo: a partir de 80 EUR\n• Branding completo: a partir de 250 EUR\n• Design gráfico (flyers, posts, etc.): a partir de 50 EUR\n• UI/UX para apps/websites: a partir de 200 EUR\n• Design para redes sociais: a partir de 80 EUR/mês\n\nTem algum projeto de design em mente?`
      : `We offer complete design services:\n\n• Logo: from 80 EUR\n• Full branding: from 250 EUR\n• Graphic design (flyers, posts, etc.): from 50 EUR\n• UI/UX for apps/websites: from 200 EUR\n• Social media design: from 80 EUR/month\n\nDo you have a design project in mind?`
  }

  // ── marketing / seo ──────────────────────────────────────────────────────
  if (msg.includes('marketing') || msg.includes('seo') || msg.includes('google ads') || msg.includes('facebook') ||
    msg.includes('instagram') || msg.includes('redes sociais') || msg.includes('social media')) {
    return isPt
      ? `Trabalhamos em marketing digital:\n\n• SEO (posicionamento Google): a partir de 150 EUR/mês\n• Google Ads: a partir de 200 EUR/mês\n• Facebook/Instagram Ads: a partir de 150 EUR/mês\n• Gestão de redes sociais: a partir de 150 EUR/mês\n• Email marketing: a partir de 100 EUR/mês\n\nResultados visíveis em 2-4 semanas para ads, 3-6 meses para SEO. Quer saber mais?`
      : `We work in digital marketing:\n\n• SEO (Google ranking): from 150 EUR/month\n• Google Ads: from 200 EUR/month\n• Facebook/Instagram Ads: from 150 EUR/month\n• Social media management: from 150 EUR/month\n• Email marketing: from 100 EUR/month\n\nVisible results in 2-4 weeks for ads, 3-6 months for SEO. Want to know more?`
  }

  // ── timeline / deadline ──────────────────────────────────────────────────
  if (msg.includes('tempo') || msg.includes('prazo') || msg.includes('time') || msg.includes('demora') ||
    msg.includes('quando') || msg.includes('how long') || msg.includes('deadline') || msg.includes('semana') || msg.includes('week')) {
    return isPt
      ? `Os prazos dependem do projeto:\n\n• Landing page: 3-7 dias\n• Website / WordPress: 1-3 semanas\n• Loja online: 2-5 semanas\n• App mobile: 4-12 semanas\n• Aplicação web complexa: 4-16 semanas\n\nTrabalhamos com metodologia ágil e entregamos sempre no prazo acordado. Tem algum prazo específico em mente?`
      : `Timelines depend on the project:\n\n• Landing page: 3-7 days\n• Website / WordPress: 1-3 weeks\n• Online store: 2-5 weeks\n• Mobile app: 4-12 weeks\n• Complex web application: 4-16 weeks\n\nWe use agile methodology and always deliver on the agreed deadline. Do you have a specific deadline in mind?`
  }

  // ── about company ────────────────────────────────────────────────────────
  if (msg.includes('empresa') || msg.includes('company') || msg.includes('sobre') || msg.includes('about') ||
    msg.includes('quem') || msg.includes('who') || msg.includes('tec fazer') || msg.includes('historia') || msg.includes('history')) {
    return isPt
      ? `A Tec Fazer é uma empresa portuguesa de tecnologia fundada em 2019, em Mafra, Lisboa.\n\nEm 5 anos entregámos mais de 300 projetos para 106+ clientes em Portugal, Espanha, Brasil e Reino Unido. Somos certificados ISO 9001 e trabalhamos com empresas de todos os tamanhos — desde startups a grandes empresas.\n\nO que nos distingue é a combinação de qualidade técnica, preços competitivos e suporte dedicado. Quer saber mais sobre algum serviço específico?`
      : `Tec Fazer is a Portuguese technology company founded in 2019 in Mafra, Lisbon.\n\nIn 5 years we've delivered over 300 projects for 106+ clients in Portugal, Spain, Brazil and the UK. We're ISO 9001 certified and work with companies of all sizes — from startups to large enterprises.\n\nWhat sets us apart is the combination of technical quality, competitive pricing and dedicated support. Want to know more about a specific service?`
  }

  // ── consultation / meeting ───────────────────────────────────────────────
  if (msg.includes('reunião') || msg.includes('reuniao') || msg.includes('meeting') || msg.includes('consulta') ||
    msg.includes('consultation') || msg.includes('agendar') || msg.includes('schedule') || msg.includes('marcar')) {
    return isPt
      ? `Oferecemos uma consulta inicial gratuita de 30 minutos! 🎯\n\nPode agendar através de:\n• WhatsApp: ${COMPANY.whatsapp}\n• Email: ${COMPANY.emails.main}\n\nEstamos disponíveis de ${COMPANY.hours}. Qual é o melhor horário para si?`
      : `We offer a free 30-minute initial consultation! 🎯\n\nYou can schedule via:\n• WhatsApp: ${COMPANY.whatsapp}\n• Email: ${COMPANY.emails.main}\n\nWe're available ${COMPANY.hoursEn}. What's the best time for you?`
  }

  // ── technologies ─────────────────────────────────────────────────────────
  if (msg.includes('tecnologia') || msg.includes('technology') || msg.includes('tech stack') || msg.includes('framework') ||
    msg.includes('react') || msg.includes('node') || msg.includes('python') || msg.includes('php')) {
    return isPt
      ? `Trabalhamos com as tecnologias mais modernas:\n\n• **Frontend**: React, Next.js, Vue.js, TypeScript\n• **Backend**: Node.js, Python, PHP, .NET\n• **Mobile**: Flutter, React Native, Swift, Kotlin\n• **Cloud**: AWS, Azure, Google Cloud\n• **CMS**: WordPress, Shopify\n• **Bases de dados**: PostgreSQL, MySQL, MongoDB\n\nEscolhemos sempre a tecnologia mais adequada para cada projeto. Tem alguma preferência?`
      : `We work with the most modern technologies:\n\n• **Frontend**: React, Next.js, Vue.js, TypeScript\n• **Backend**: Node.js, Python, PHP, .NET\n• **Mobile**: Flutter, React Native, Swift, Kotlin\n• **Cloud**: AWS, Azure, Google Cloud\n• **CMS**: WordPress, Shopify\n• **Databases**: PostgreSQL, MySQL, MongoDB\n\nWe always choose the most suitable technology for each project. Do you have any preference?`
  }

  // ── portfolio ────────────────────────────────────────────────────────────
  if (msg.includes('portfolio') || msg.includes('portfólio') || msg.includes('trabalhos') || msg.includes('projetos') ||
    msg.includes('projects') || msg.includes('examples') || msg.includes('exemplos')) {
    return isPt
      ? `Já entregámos mais de 300 projetos em setores como saúde, educação, retalho, turismo e indústria.\n\nPode ver alguns exemplos em **tecfazer.pt/portfolio**. Que tipo de projeto tem em mente? Posso mostrar-lhe trabalhos semelhantes.`
      : `We've delivered over 300 projects in sectors like healthcare, education, retail, tourism and industry.\n\nYou can see some examples at **tecfazer.pt/portfolio**. What type of project do you have in mind? I can show you similar work.`
  }

  // ── greeting ─────────────────────────────────────────────────────────────
  const isGreeting = msg.length < 20 && (
    msg.includes('olá') || msg.includes('ola') || msg.includes('hello') || msg.includes('hi') ||
    msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('good morning') ||
    msg.includes('hey') || msg.includes('oi')
  )

  if (isGreeting) {
    return isPt
      ? `Olá! 👋 Bem-vindo à Tec Fazer.\n\nSou o assistente virtual da empresa. Posso ajudá-lo com informações sobre os nossos serviços, preços, prazos ou contactos. O que precisa?`
      : `Hi! 👋 Welcome to Tec Fazer.\n\nI'm the company's virtual assistant. I can help you with information about our services, pricing, timelines or contacts. What do you need?`
  }

  // ── default ──────────────────────────────────────────────────────────────
  return isPt
    ? `Posso ajudá-lo com informações sobre os nossos serviços, preços, prazos ou contactos.\n\nSe preferir falar diretamente com a equipa:\n📱 ${COMPANY.phone} (WhatsApp disponível)\n📧 ${COMPANY.emails.main}`
    : `I can help you with information about our services, pricing, timelines or contacts.\n\nIf you prefer to speak directly with the team:\n📱 ${COMPANY.phone} (WhatsApp available)\n📧 ${COMPANY.emails.main}`
}

// ─── ROUTE HANDLER ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, locale = 'pt' } = await req.json()
    const apiKey = process.env.OPENAI_API_KEY

    // No API key — use smart fallback
    if (!apiKey || apiKey.trim() === '') {
      const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
      const reply = getFallbackResponse(lastUserMessage?.content || '', locale)
      return NextResponse.json({ role: 'assistant', content: reply })
    }

    // OpenAI
    const systemPrompt = systemPrompts[locale] || systemPrompts.pt
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    })

    if (!openaiRes.ok) {
      const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
      const reply = getFallbackResponse(lastUserMessage?.content || '', locale)
      return NextResponse.json({ role: 'assistant', content: reply })
    }

    const data = await openaiRes.json()
    const reply = data.choices?.[0]?.message?.content || getFallbackResponse('', locale)
    return NextResponse.json({ role: 'assistant', content: reply })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}
