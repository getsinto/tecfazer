import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const systemPrompts: Record<string, string> = {
  pt: `Você é um assistente virtual da Tec Fazer, uma empresa de tecnologia portuguesa baseada em Mafra, Lisboa.

INFORMAÇÕES DA EMPRESA:
- Nome: Tec Fazer
- Tagline: "Building The Future"
- Localização: Mafra, Lisboa, Portugal
- Especialidades: Desenvolvimento web, aplicações mobile, soluções cloud, marketing digital
- Anos de experiência: 5 anos
- Projetos concluídos: 300+
- Clientes satisfeitos: 106+

SERVIÇOS PRINCIPAIS:
1. Desenvolvimento Web (React, Next.js, Node.js)
2. Aplicações Mobile (Flutter, React Native)
3. Soluções Cloud (AWS, Azure, Google Cloud)
4. Marketing Digital (SEO, SEM, Social Media)
5. E-commerce (Shopify, WooCommerce, custom)
6. Consultoria Tecnológica
7. UI/UX Design
8. DevOps e Infraestrutura

PLANOS DE PREÇOS:
- Starter: €499/mês - Ideal para pequenas empresas
- Business: €999/mês - Para empresas em crescimento
- Enterprise: €2499/mês - Soluções empresariais completas
- Custom: Preço personalizado - Projetos específicos

CONTACTO:
- Email: info@tecfazer.pt
- Telefone: +351 261 123 456
- Morada: Mafra, Lisboa, Portugal
- Horário: Segunda a Sexta, 9h-18h

INSTRUÇÕES:
- Seja profissional, amigável e prestável
- Responda em Português de Portugal
- Forneça informações precisas sobre serviços e preços
- Sugira agendar uma reunião para projetos específicos
- Se não souber algo, seja honesto e ofereça contactar a equipa
- Use emojis ocasionalmente para tornar a conversa mais amigável
- Mantenha respostas concisas (2-3 parágrafos no máximo)`,

  en: `You are a virtual assistant for Tec Fazer, a Portuguese technology company based in Mafra, Lisbon.

COMPANY INFORMATION:
- Name: Tec Fazer
- Tagline: "Building The Future"
- Location: Mafra, Lisbon, Portugal
- Specialties: Web development, mobile apps, cloud solutions, digital marketing
- Years of experience: 5 years
- Completed projects: 300+
- Happy clients: 106+

MAIN SERVICES:
1. Web Development (React, Next.js, Node.js)
2. Mobile Applications (Flutter, React Native)
3. Cloud Solutions (AWS, Azure, Google Cloud)
4. Digital Marketing (SEO, SEM, Social Media)
5. E-commerce (Shopify, WooCommerce, custom)
6. Technology Consulting
7. UI/UX Design
8. DevOps and Infrastructure

PRICING PLANS:
- Starter: €499/month - Ideal for small businesses
- Business: €999/month - For growing companies
- Enterprise: €2499/month - Complete enterprise solutions
- Custom: Custom pricing - Specific projects

CONTACT:
- Email: info@tecfazer.pt
- Phone: +351 261 123 456
- Address: Mafra, Lisbon, Portugal
- Hours: Monday to Friday, 9am-6pm

INSTRUCTIONS:
- Be professional, friendly, and helpful
- Respond in English
- Provide accurate information about services and pricing
- Suggest scheduling a meeting for specific projects
- If you don't know something, be honest and offer to contact the team
- Use emojis occasionally to make the conversation more friendly
- Keep responses concise (2-3 paragraphs maximum)`,
}

// Simple rule-based fallback when OpenAI key is not set
function getFallbackResponse(message: string, locale: string): string {
  const msg = message.toLowerCase()
  const isPt = locale === 'pt'

  if (msg.includes('serviço') || msg.includes('service') || msg.includes('what do you')) {
    return isPt
      ? 'Oferecemos desenvolvimento web, aplicações mobile, soluções cloud, marketing digital, e-commerce e consultoria tecnológica. 🚀 Quer saber mais sobre algum serviço específico?'
      : 'We offer web development, mobile apps, cloud solutions, digital marketing, e-commerce and technology consulting. 🚀 Would you like to know more about a specific service?'
  }
  if (msg.includes('preço') || msg.includes('custo') || msg.includes('price') || msg.includes('cost') || msg.includes('quanto')) {
    return isPt
      ? 'Os nossos planos começam em €499/mês (Starter), €999/mês (Business) e €2499/mês (Enterprise). Para projetos personalizados, fazemos orçamentos à medida. 💰 Quer usar a nossa calculadora de orçamento?'
      : 'Our plans start at €499/month (Starter), €999/month (Business) and €2499/month (Enterprise). For custom projects, we provide tailored quotes. 💰 Would you like to use our budget calculator?'
  }
  if (msg.includes('tempo') || msg.includes('prazo') || msg.includes('time') || msg.includes('long') || msg.includes('demora')) {
    return isPt
      ? 'O tempo de desenvolvimento varia conforme o projeto: websites simples (2-4 semanas), aplicações web (1-3 meses), apps mobile (2-4 meses). ⏱️ Quer agendar uma reunião para discutir o seu projeto?'
      : 'Development time varies by project: simple websites (2-4 weeks), web apps (1-3 months), mobile apps (2-4 months). ⏱️ Would you like to schedule a meeting to discuss your project?'
  }
  if (msg.includes('contacto') || msg.includes('contact') || msg.includes('falar') || msg.includes('talk') || msg.includes('começar') || msg.includes('start')) {
    return isPt
      ? 'Pode contactar-nos por email em info@tecfazer.pt, por telefone +351 261 123 456, ou preencher o formulário de contacto no nosso site. 📞 Estamos disponíveis de Segunda a Sexta, 9h-18h!'
      : 'You can reach us by email at info@tecfazer.pt, by phone +351 261 123 456, or fill out the contact form on our website. 📞 We\'re available Monday to Friday, 9am-6pm!'
  }
  if (msg.includes('portfolio') || msg.includes('projeto') || msg.includes('project') || msg.includes('trabalho') || msg.includes('work')) {
    return isPt
      ? 'Já concluímos mais de 300 projetos para clientes em Portugal e no mundo! 🌍 Pode ver o nosso portfólio completo na secção Portfolio do site.'
      : 'We\'ve completed over 300 projects for clients in Portugal and worldwide! 🌍 You can see our full portfolio in the Portfolio section of the website.'
  }

  return isPt
    ? 'Olá! Sou o assistente virtual da Tec Fazer. Posso ajudá-lo com informações sobre os nossos serviços, preços e projetos. Como posso ajudar? 😊'
    : 'Hello! I\'m the Tec Fazer virtual assistant. I can help you with information about our services, pricing and projects. How can I help? 😊'
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
