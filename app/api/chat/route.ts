import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const systemPrompts: Record<string, string> = {
  pt: `Você é um assistente virtual da Tec Fazer, uma empresa de tecnologia portuguesa líder baseada em Mafra, Lisboa.

═══ INFORMAÇÕES COMPLETAS DA EMPRESA ═══

🏢 DADOS DA EMPRESA:
- Nome Completo: Tec Fazer - Soluções Tecnológicas, Lda.
- Tagline: "Building The Future"
- Fundada: 2019
- Localização: Mafra, Lisboa, Portugal (região de Lisboa)
- Especialidades: Desenvolvimento web, aplicações mobile, soluções cloud, marketing digital
- Anos de experiência: 5 anos (desde 2019)
- Projetos concluídos: 300+ projetos
- Clientes satisfeitos: 106+ clientes
- Tecnologias dominadas: 30+ tecnologias
- Certificações: ISO 9001 (Qualidade)

📍 CONTACTOS COMPLETOS:
- Email Principal: info@tecfazer.pt
- Email Comercial: comercial@tecfazer.pt
- Email Suporte: suporte@tecfazer.pt
- Telefone: +351 261 123 456
- WhatsApp: +351 261 123 456
- Morada Completa: Mafra, Lisboa, Portugal
- Horário: Segunda a Sexta, 9h00-18h00 (GMT+1)
- Website: https://tecfazer.pt
- LinkedIn: Tec Fazer
- Resposta garantida: 24h (dias úteis)

🚀 SERVIÇOS DETALHADOS:

1. DESENVOLVIMENTO WEB:
   - Websites corporativos (€450+)
   - Aplicações web (React, Next.js, Vue.js)
   - E-commerce (Shopify, WooCommerce, custom)
   - Progressive Web Apps (PWA)
   - Tecnologias: React, Next.js, Node.js, TypeScript, PHP, Python

2. APLICAÇÕES MOBILE:
   - Apps iOS e Android (€1800+)
   - Apps híbridas (Flutter, React Native)
   - Apps nativas (Swift, Kotlin)
   - Publicação nas lojas (App Store, Google Play)

3. SOLUÇÕES CLOUD:
   - AWS, Azure, Google Cloud
   - DevOps e CI/CD
   - Infraestrutura como código
   - Migração para cloud
   - Monitorização e backup

4. MARKETING DIGITAL:
   - SEO (otimização para motores de busca)
   - Google Ads e Facebook Ads
   - Social Media Management
   - Email Marketing
   - Analytics e relatórios

5. E-COMMERCE:
   - Lojas online completas (€900+)
   - Integrações de pagamento (Stripe, PayPal, MB Way)
   - Gestão de inventário
   - Sistemas de faturação
   - Marketplaces

6. CONSULTORIA TECNOLÓGICA:
   - Auditoria de sistemas
   - Arquitetura de software
   - Transformação digital
   - Formação de equipas
   - Estratégia tecnológica

💰 PREÇOS DETALHADOS:

PROJETOS ÚNICOS:
- Website Corporativo: €450 - €1.200
- Loja Online: €900 - €2.500
- Aplicação Web: €1.400 - €5.000
- App Mobile: €1.800 - €8.000
- Software Personalizado: €2.200 - €15.000

PLANOS MENSAIS:
- Starter (€499/mês): Website + hosting + manutenção + suporte
- Business (€999/mês): Loja online + marketing + analytics + suporte prioritário
- Enterprise (€2.499/mês): Soluções completas + equipa dedicada + consultoria
- Custom: Preços personalizados para grandes projetos

SERVIÇOS ADICIONAIS:
- Hosting e domínio: €15-50/mês
- Manutenção: €100-300/mês
- Suporte técnico: €50/hora
- Formação: €200/dia
- Consultoria: €75/hora

🏆 PORTFÓLIO E CLIENTES:
- Setores: Saúde, Educação, Retalho, Serviços, Indústria, Turismo
- Tipos de clientes: PMEs, Startups, Empresas estabelecidas, ONGs
- Projetos destacados: Plataformas de e-learning, sistemas de gestão, lojas online, apps de produtividade
- Clientes satisfeitos em Portugal, Espanha, Brasil, Reino Unido

👥 EQUIPA:
- Developers Full-Stack
- Especialistas em UI/UX Design
- Consultores de Marketing Digital
- Arquitetos de Cloud
- Gestores de Projeto
- Suporte técnico dedicado

🎯 PROCESSO DE TRABALHO:
1. Consulta inicial gratuita (30 min)
2. Análise de requisitos
3. Proposta detalhada
4. Desenvolvimento iterativo
5. Testes e validação
6. Lançamento
7. Suporte pós-lançamento

⚡ VANTAGENS COMPETITIVAS:
- Metodologia ágil (Scrum)
- Comunicação em PT e EN
- Suporte pós-lançamento incluído
- Conformidade RGPD
- Código limpo e documentado
- Entrega pontual garantida
- Preços competitivos
- Equipa local (Portugal)

🔧 TECNOLOGIAS UTILIZADAS:
Frontend: React, Next.js, Vue.js, Angular, TypeScript, Tailwind CSS
Backend: Node.js, Python, PHP, .NET, Java
Mobile: Flutter, React Native, Swift, Kotlin
Cloud: AWS, Azure, Google Cloud, Docker, Kubernetes
Databases: PostgreSQL, MySQL, MongoDB, Redis
Ferramentas: Git, CI/CD, Figma, Adobe Creative Suite

📊 GARANTIAS:
- Garantia de qualidade: 6 meses
- Suporte técnico: 3 meses incluído
- Revisões ilimitadas durante desenvolvimento
- Código fonte entregue
- Documentação completa
- Formação incluída

INSTRUÇÕES DE RESPOSTA:
- Seja sempre profissional, amigável e prestável
- Responda SEMPRE em Português de Portugal
- Forneça informações específicas e detalhadas
- Inclua preços quando relevante
- Sugira sempre próximos passos concretos
- Ofereça consulta gratuita para projetos
- Use emojis para tornar a conversa mais amigável
- Mantenha respostas informativas mas concisas
- Se não souber algo específico, ofereça contactar a equipa
- Promova sempre os serviços da Tec Fazer de forma natural`,

  en: `You are a virtual assistant for Tec Fazer, a leading Portuguese technology company based in Mafra, Lisbon.

═══ COMPLETE COMPANY INFORMATION ═══

🏢 COMPANY DATA:
- Full Name: Tec Fazer - Technological Solutions, Ltd.
- Tagline: "Building The Future"
- Founded: 2019
- Location: Mafra, Lisbon, Portugal (Lisbon region)
- Specialties: Web development, mobile apps, cloud solutions, digital marketing
- Years of experience: 5 years (since 2019)
- Completed projects: 300+ projects
- Happy clients: 106+ clients
- Technologies mastered: 30+ technologies
- Certifications: ISO 9001 (Quality)

📍 COMPLETE CONTACT DETAILS:
- Main Email: info@tecfazer.pt
- Sales Email: comercial@tecfazer.pt
- Support Email: suporte@tecfazer.pt
- Phone: +351 261 123 456
- WhatsApp: +351 261 123 456
- Full Address: Mafra, Lisbon, Portugal
- Hours: Monday to Friday, 9am-6pm (GMT+1)
- Website: https://tecfazer.pt
- LinkedIn: Tec Fazer
- Guaranteed response: 24h (business days)

🚀 DETAILED SERVICES:

1. WEB DEVELOPMENT:
   - Corporate websites (€450+)
   - Web applications (React, Next.js, Vue.js)
   - E-commerce (Shopify, WooCommerce, custom)
   - Progressive Web Apps (PWA)
   - Technologies: React, Next.js, Node.js, TypeScript, PHP, Python

2. MOBILE APPLICATIONS:
   - iOS and Android apps (€1800+)
   - Hybrid apps (Flutter, React Native)
   - Native apps (Swift, Kotlin)
   - App store publishing (App Store, Google Play)

3. CLOUD SOLUTIONS:
   - AWS, Azure, Google Cloud
   - DevOps and CI/CD
   - Infrastructure as code
   - Cloud migration
   - Monitoring and backup

4. DIGITAL MARKETING:
   - SEO (search engine optimization)
   - Google Ads and Facebook Ads
   - Social Media Management
   - Email Marketing
   - Analytics and reporting

5. E-COMMERCE:
   - Complete online stores (€900+)
   - Payment integrations (Stripe, PayPal, MB Way)
   - Inventory management
   - Billing systems
   - Marketplaces

6. TECHNOLOGY CONSULTING:
   - Systems audit
   - Software architecture
   - Digital transformation
   - Team training
   - Technology strategy

💰 DETAILED PRICING:

ONE-TIME PROJECTS:
- Corporate Website: €450 - €1,200
- Online Store: €900 - €2,500
- Web Application: €1,400 - €5,000
- Mobile App: €1,800 - €8,000
- Custom Software: €2,200 - €15,000

MONTHLY PLANS:
- Starter (€499/month): Website + hosting + maintenance + support
- Business (€999/month): Online store + marketing + analytics + priority support
- Enterprise (€2,499/month): Complete solutions + dedicated team + consulting
- Custom: Personalized pricing for large projects

ADDITIONAL SERVICES:
- Hosting and domain: €15-50/month
- Maintenance: €100-300/month
- Technical support: €50/hour
- Training: €200/day
- Consulting: €75/hour

🏆 PORTFOLIO AND CLIENTS:
- Sectors: Healthcare, Education, Retail, Services, Industry, Tourism
- Client types: SMEs, Startups, Established companies, NGOs
- Featured projects: E-learning platforms, management systems, online stores, productivity apps
- Satisfied clients in Portugal, Spain, Brazil, United Kingdom

👥 TEAM:
- Full-Stack Developers
- UI/UX Design Specialists
- Digital Marketing Consultants
- Cloud Architects
- Project Managers
- Dedicated technical support

🎯 WORK PROCESS:
1. Free initial consultation (30 min)
2. Requirements analysis
3. Detailed proposal
4. Iterative development
5. Testing and validation
6. Launch
7. Post-launch support

⚡ COMPETITIVE ADVANTAGES:
- Agile methodology (Scrum)
- Communication in PT and EN
- Post-launch support included
- GDPR compliance
- Clean and documented code
- Guaranteed on-time delivery
- Competitive pricing
- Local team (Portugal)

🔧 TECHNOLOGIES USED:
Frontend: React, Next.js, Vue.js, Angular, TypeScript, Tailwind CSS
Backend: Node.js, Python, PHP, .NET, Java
Mobile: Flutter, React Native, Swift, Kotlin
Cloud: AWS, Azure, Google Cloud, Docker, Kubernetes
Databases: PostgreSQL, MySQL, MongoDB, Redis
Tools: Git, CI/CD, Figma, Adobe Creative Suite

📊 GUARANTEES:
- Quality guarantee: 6 months
- Technical support: 3 months included
- Unlimited revisions during development
- Source code delivered
- Complete documentation
- Training included

RESPONSE INSTRUCTIONS:
- Always be professional, friendly, and helpful
- ALWAYS respond in English
- Provide specific and detailed information
- Include pricing when relevant
- Always suggest concrete next steps
- Offer free consultation for projects
- Use emojis to make conversation more friendly
- Keep responses informative but concise
- If you don't know something specific, offer to contact the team
- Always promote Tec Fazer services naturally`,
}

// Enhanced rule-based fallback when OpenAI key is not set
function getFallbackResponse(message: string, locale: string): string {
  const msg = message.toLowerCase()
  const isPt = locale === 'pt'

  // Services inquiry
  if (msg.includes('serviço') || msg.includes('service') || msg.includes('what do you') || msg.includes('fazem') || msg.includes('oferecem')) {
    return isPt
      ? 'A Tec Fazer oferece soluções tecnológicas completas! 🚀\n\n• Desenvolvimento Web (€450+) - Websites e aplicações\n• Apps Mobile (€1.800+) - iOS e Android\n• E-commerce (€900+) - Lojas online completas\n• Marketing Digital - SEO, Google Ads, Social Media\n• Soluções Cloud - AWS, Azure, DevOps\n• Consultoria Tecnológica\n\nQuer saber mais sobre algum serviço específico? 😊'
      : 'Tec Fazer offers complete technology solutions! 🚀\n\n• Web Development (€450+) - Websites and applications\n• Mobile Apps (€1,800+) - iOS and Android\n• E-commerce (€900+) - Complete online stores\n• Digital Marketing - SEO, Google Ads, Social Media\n• Cloud Solutions - AWS, Azure, DevOps\n• Technology Consulting\n\nWould you like to know more about a specific service? 😊'
  }

  // Pricing inquiry
  if (msg.includes('preço') || msg.includes('custo') || msg.includes('price') || msg.includes('cost') || msg.includes('quanto') || msg.includes('valor')) {
    return isPt
      ? 'Os nossos preços são competitivos e transparentes! 💰\n\n📋 PROJETOS ÚNICOS:\n• Website: €450-€1.200\n• Loja Online: €900-€2.500\n• App Mobile: €1.800-€8.000\n\n📅 PLANOS MENSAIS:\n• Starter: €499/mês\n• Business: €999/mês\n• Enterprise: €2.499/mês\n\nQuer um orçamento personalizado? Use a nossa calculadora online! 🧮'
      : 'Our prices are competitive and transparent! 💰\n\n📋 ONE-TIME PROJECTS:\n• Website: €450-€1,200\n• Online Store: €900-€2,500\n• Mobile App: €1,800-€8,000\n\n📅 MONTHLY PLANS:\n• Starter: €499/month\n• Business: €999/month\n• Enterprise: €2,499/month\n\nWant a personalized quote? Use our online calculator! 🧮'
  }

  // Timeline inquiry
  if (msg.includes('tempo') || msg.includes('prazo') || msg.includes('time') || msg.includes('long') || msg.includes('demora') || msg.includes('quando')) {
    return isPt
      ? 'Os prazos variam conforme a complexidade do projeto! ⏱️\n\n• Website simples: 2-4 semanas\n• Loja online: 4-8 semanas\n• Aplicação web: 1-3 meses\n• App mobile: 2-4 meses\n• Software personalizado: 3-6 meses\n\nTrabalhamos com metodologia ágil para entregas pontuais. Quer agendar uma consulta gratuita para discutir o seu projeto? 📅'
      : 'Timelines vary according to project complexity! ⏱️\n\n• Simple website: 2-4 weeks\n• Online store: 4-8 weeks\n• Web application: 1-3 months\n• Mobile app: 2-4 months\n• Custom software: 3-6 months\n\nWe work with agile methodology for on-time delivery. Would you like to schedule a free consultation to discuss your project? 📅'
  }

  // Contact inquiry
  if (msg.includes('contacto') || msg.includes('contact') || msg.includes('falar') || msg.includes('talk') || msg.includes('começar') || msg.includes('start') || msg.includes('reunião') || msg.includes('meeting')) {
    return isPt
      ? 'Estamos sempre disponíveis para ajudar! 📞\n\n📧 Email: info@tecfazer.pt\n📱 Telefone/WhatsApp: +351 261 123 456\n🏢 Localização: Mafra, Lisboa\n⏰ Horário: Seg-Sex, 9h-18h\n🌐 Website: https://tecfazer.pt\n\n✨ Oferecemos consulta inicial GRATUITA de 30 minutos!\nResposta garantida em 24h. Como prefere ser contactado? 😊'
      : 'We\'re always available to help! 📞\n\n📧 Email: info@tecfazer.pt\n📱 Phone/WhatsApp: +351 261 123 456\n🏢 Location: Mafra, Lisbon\n⏰ Hours: Mon-Fri, 9am-6pm\n🌐 Website: https://tecfazer.pt\n\n✨ We offer a FREE 30-minute initial consultation!\nGuaranteed response within 24h. How would you prefer to be contacted? 😊'
  }

  // Portfolio inquiry
  if (msg.includes('portfolio') || msg.includes('projeto') || msg.includes('project') || msg.includes('trabalho') || msg.includes('work') || msg.includes('exemplo') || msg.includes('example')) {
    return isPt
      ? 'Temos um portfólio impressionante! 🌟\n\n📊 NÚMEROS:\n• 300+ projetos concluídos\n• 106+ clientes satisfeitos\n• 5 anos de experiência\n• Clientes em Portugal, Espanha, Brasil, Reino Unido\n\n🏆 SETORES:\nSaúde, Educação, Retalho, Turismo, Indústria\n\nVisite https://tecfazer.pt/portfolio para ver exemplos dos nossos trabalhos! Que tipo de projeto tem em mente? 🚀'
      : 'We have an impressive portfolio! 🌟\n\n📊 NUMBERS:\n• 300+ completed projects\n• 106+ satisfied clients\n• 5 years of experience\n• Clients in Portugal, Spain, Brazil, United Kingdom\n\n🏆 SECTORS:\nHealthcare, Education, Retail, Tourism, Industry\n\nVisit https://tecfazer.pt/portfolio to see examples of our work! What type of project do you have in mind? 🚀'
  }

  // Technology inquiry
  if (msg.includes('tecnologia') || msg.includes('technology') || msg.includes('tech') || msg.includes('linguagem') || msg.includes('language') || msg.includes('framework')) {
    return isPt
      ? 'Dominamos as tecnologias mais modernas! 💻\n\n🎨 FRONTEND: React, Next.js, Vue.js, TypeScript\n⚙️ BACKEND: Node.js, Python, PHP, .NET\n📱 MOBILE: Flutter, React Native, Swift, Kotlin\n☁️ CLOUD: AWS, Azure, Google Cloud\n🗄️ DATABASES: PostgreSQL, MySQL, MongoDB\n\nUsamos sempre as melhores práticas e código limpo. Tem alguma tecnologia específica em mente? 🤔'
      : 'We master the most modern technologies! 💻\n\n🎨 FRONTEND: React, Next.js, Vue.js, TypeScript\n⚙️ BACKEND: Node.js, Python, PHP, .NET\n📱 MOBILE: Flutter, React Native, Swift, Kotlin\n☁️ CLOUD: AWS, Azure, Google Cloud\n🗄️ DATABASES: PostgreSQL, MySQL, MongoDB\n\nWe always use best practices and clean code. Do you have any specific technology in mind? 🤔'
  }

  // Company info inquiry
  if (msg.includes('empresa') || msg.includes('company') || msg.includes('sobre') || msg.includes('about') || msg.includes('quem') || msg.includes('who') || msg.includes('história') || msg.includes('history')) {
    return isPt
      ? 'A Tec Fazer é uma empresa portuguesa líder em tecnologia! 🏢\n\n📍 Baseados em Mafra, Lisboa (desde 2019)\n🎯 Missão: "Building The Future"\n🏆 Certificação ISO 9001\n👥 Equipa especializada e dedicada\n🌍 Clientes nacionais e internacionais\n\nSomos especialistas em transformação digital para PMEs e startups. O que gostaria de saber mais sobre nós? 😊'
      : 'Tec Fazer is a leading Portuguese technology company! 🏢\n\n📍 Based in Mafra, Lisbon (since 2019)\n🎯 Mission: "Building The Future"\n🏆 ISO 9001 Certification\n👥 Specialized and dedicated team\n🌍 National and international clients\n\nWe specialize in digital transformation for SMEs and startups. What would you like to know more about us? 😊'
  }

  // Default greeting
  return isPt
    ? 'Olá! Bem-vindo à Tec Fazer! 👋\n\nSou o seu assistente virtual e estou aqui para ajudar com:\n• Informações sobre os nossos serviços\n• Preços e orçamentos\n• Agendamento de consultas\n• Detalhes de contacto\n• Portfólio e projetos\n\nComo posso ajudá-lo hoje? 😊'
    : 'Hello! Welcome to Tec Fazer! 👋\n\nI\'m your virtual assistant and I\'m here to help with:\n• Information about our services\n• Pricing and quotes\n• Scheduling consultations\n• Contact details\n• Portfolio and projects\n\nHow can I help you today? 😊'
}

export async function POST(req: NextRequest) {
  try {
    const { messages, locale = 'pt' } = await req.json()

    const apiKey = process.env.OPENAI_API_KEY

    // If no OpenAI key, use rule-based fallback
    if (!apiKey || apiKey.trim() === '') {
      const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
      const reply = getFallbackResponse(lastUserMessage?.content || '', locale)
      return NextResponse.json({ role: 'assistant', content: reply })
    }

    // Use OpenAI with streaming via fetch (avoids SDK version issues)
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
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!openaiRes.ok) {
      const err = await openaiRes.text()
      console.error('OpenAI error:', err)
      // Fallback on OpenAI error
      const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
      const reply = getFallbackResponse(lastUserMessage?.content || '', locale)
      return NextResponse.json({ role: 'assistant', content: reply })
    }

    const data = await openaiRes.json()
    const reply = data.choices?.[0]?.message?.content || getFallbackResponse('', locale)

    return NextResponse.json({ role: 'assistant', content: reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
