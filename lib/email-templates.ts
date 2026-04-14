const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecfazer.pt'
const LOGO_URL = `${SITE_URL}/images/logo.png`
const BRAND_TEAL = '#1B7A8A'
const BRAND_ORANGE = '#F5A623'

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background: linear-gradient(135deg, ${BRAND_TEAL} 0%, ${BRAND_ORANGE} 100%); padding: 40px 20px; text-align: center; }
  .logo { max-width: 180px; height: auto; }
  .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
  .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${BRAND_TEAL} 0%, ${BRAND_ORANGE} 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
  .footer { background-color: #f8f8f8; padding: 30px; text-align: center; color: #666666; font-size: 14px; }
  .tagline { color: #ffffff; margin-top: 10px; font-size: 14px; }
  h1 { color: #1a1a1a; font-size: 28px; margin-bottom: 20px; }
  h2 { color: #1a1a1a; font-size: 22px; margin-top: 30px; margin-bottom: 15px; }
  .info-box { background-color: #f8f9fa; border-left: 4px solid ${BRAND_TEAL}; padding: 15px; margin: 20px 0; }
  .metric { display: inline-block; margin: 10px 20px; text-align: center; }
  .metric-value { font-size: 32px; font-weight: bold; color: ${BRAND_TEAL}; }
  .metric-label { font-size: 14px; color: #666666; }
`

export function leadConfirmation(name: string, serviceInterest: string, locale: string): string {
  const isPortuguese = locale === 'pt'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>${isPortuguese ? 'Obrigado pelo Seu Contacto!' : 'Thank You for Contacting Us!'}</h1>
      <p>${isPortuguese ? 'Olá' : 'Hello'} ${name},</p>
      <p>
        ${isPortuguese 
          ? 'Recebemos o seu pedido de contacto e agradecemos o interesse nos nossos serviços.'
          : 'We have received your contact request and appreciate your interest in our services.'}
      </p>
      <div class="info-box">
        <strong>${isPortuguese ? 'Serviço de Interesse:' : 'Service of Interest:'}</strong> ${serviceInterest || (isPortuguese ? 'Não especificado' : 'Not specified')}
      </div>
      <p>
        ${isPortuguese
          ? 'A nossa equipa irá analisar o seu pedido e entrar em contacto consigo nas próximas 24 horas úteis.'
          : 'Our team will review your request and contact you within the next 24 business hours.'}
      </p>
      <p>
        ${isPortuguese
          ? 'Enquanto isso, convidamo-lo a conhecer melhor os nossos serviços e projetos:'
          : 'In the meantime, we invite you to learn more about our services and projects:'}
      </p>
      <a href="${SITE_URL}/${locale}/servicos" class="button">
        ${isPortuguese ? 'Ver Serviços' : 'View Services'}
      </a>
      <p>
        ${isPortuguese ? 'Atenciosamente,' : 'Best regards,'}<br>
        <strong>Equipa Tec Fazer</strong>
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Mafra, Lisboa, Portugal</p>
      <p>📞 963 101 123 | ✉️ geral@tecfazer.pt</p>
      <p style="font-size: 12px; color: #999999; margin-top: 20px;">
        ${isPortuguese 
          ? 'Este email foi enviado porque contactou a Tec Fazer através do nosso website.'
          : 'This email was sent because you contacted Tec Fazer through our website.'}
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export function orderConfirmation(customerName: string, planName: string, amount: number, locale: string): string {
  const isPortuguese = locale === 'pt'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>${isPortuguese ? 'Pagamento Confirmado!' : 'Payment Confirmed!'}</h1>
      <p>${isPortuguese ? 'Olá' : 'Hello'} ${customerName},</p>
      <p>
        ${isPortuguese
          ? 'O seu pagamento foi processado com sucesso. Obrigado por escolher a Tec Fazer!'
          : 'Your payment has been processed successfully. Thank you for choosing Tec Fazer!'}
      </p>
      <div class="info-box">
        <strong>${isPortuguese ? 'Plano:' : 'Plan:'}</strong> ${planName}<br>
        <strong>${isPortuguese ? 'Valor:' : 'Amount:'}</strong> €${amount.toFixed(2)}
      </div>
      <h2>${isPortuguese ? 'Próximos Passos' : 'Next Steps'}</h2>
      <p>
        ${isPortuguese
          ? '1. Receberá um email de boas-vindas com as suas credenciais de acesso ao portal do cliente.<br>2. A nossa equipa entrará em contacto para agendar a primeira reunião.<br>3. Poderá acompanhar o progresso do seu projeto através do portal.'
          : '1. You will receive a welcome email with your client portal credentials.<br>2. Our team will contact you to schedule the first meeting.<br>3. You can track your project progress through the portal.'}
      </p>
      <a href="${SITE_URL}/${locale}/portal" class="button">
        ${isPortuguese ? 'Aceder ao Portal' : 'Access Portal'}
      </a>
      <p>
        ${isPortuguese ? 'Atenciosamente,' : 'Best regards,'}<br>
        <strong>Equipa Tec Fazer</strong>
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Mafra, Lisboa, Portugal</p>
      <p>📞 963 101 123 | ✉️ geral@tecfazer.pt</p>
    </div>
  </div>
</body>
</html>
  `
}

export function reviewRequest(clientName: string, reviewUrl: string, locale: string): string {
  const isPortuguese = locale === 'pt'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>${isPortuguese ? 'A Sua Opinião é Importante!' : 'Your Opinion Matters!'}</h1>
      <p>${isPortuguese ? 'Olá' : 'Hello'} ${clientName},</p>
      <p>
        ${isPortuguese
          ? 'Esperamos que esteja satisfeito com o trabalho que desenvolvemos para si. A sua opinião é muito importante para nós e ajuda-nos a melhorar continuamente os nossos serviços.'
          : 'We hope you are satisfied with the work we developed for you. Your opinion is very important to us and helps us continuously improve our services.'}
      </p>
      <p>
        ${isPortuguese
          ? 'Poderia dedicar 2 minutos para partilhar a sua experiência?'
          : 'Could you take 2 minutes to share your experience?'}
      </p>
      <a href="${reviewUrl}" class="button">
        ${isPortuguese ? 'Deixar Avaliação' : 'Leave Review'}
      </a>
      <p style="font-size: 14px; color: #666666;">
        ${isPortuguese
          ? 'A sua avaliação será publicada no nosso website (após aprovação) e ajudará outros clientes a conhecer melhor o nosso trabalho.'
          : 'Your review will be published on our website (after approval) and will help other clients learn more about our work.'}
      </p>
      <p>
        ${isPortuguese ? 'Muito obrigado!' : 'Thank you very much!'}<br>
        <strong>Equipa Tec Fazer</strong>
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Mafra, Lisboa, Portugal</p>
      <p>📞 963 101 123 | ✉️ geral@tecfazer.pt</p>
    </div>
  </div>
</body>
</html>
  `
}

export function newsletterConfirm(confirmationUrl: string, locale: string): string {
  const isPortuguese = locale === 'pt'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>${isPortuguese ? 'Confirme a Sua Subscrição' : 'Confirm Your Subscription'}</h1>
      <p>
        ${isPortuguese
          ? 'Obrigado por subscrever a newsletter da Tec Fazer!'
          : 'Thank you for subscribing to Tec Fazer newsletter!'}
      </p>
      <p>
        ${isPortuguese
          ? 'Para confirmar a sua subscrição e começar a receber as nossas novidades, artigos e dicas sobre tecnologia, por favor clique no botão abaixo:'
          : 'To confirm your subscription and start receiving our news, articles and technology tips, please click the button below:'}
      </p>
      <a href="${confirmationUrl}" class="button">
        ${isPortuguese ? 'Confirmar Subscrição' : 'Confirm Subscription'}
      </a>
      <p style="font-size: 14px; color: #666666;">
        ${isPortuguese
          ? 'Se não solicitou esta subscrição, pode ignorar este email.'
          : 'If you did not request this subscription, you can ignore this email.'}
      </p>
      <h2>${isPortuguese ? 'O Que Vai Receber' : 'What You Will Receive'}</h2>
      <p>
        ${isPortuguese
          ? '• Artigos sobre desenvolvimento web e mobile<br>• Dicas de tecnologia e boas práticas<br>• Novidades sobre os nossos serviços<br>• Ofertas exclusivas para subscritores'
          : '• Articles about web and mobile development<br>• Technology tips and best practices<br>• News about our services<br>• Exclusive offers for subscribers'}
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Mafra, Lisboa, Portugal</p>
      <p>📞 963 101 123 | ✉️ geral@tecfazer.pt</p>
    </div>
  </div>
</body>
</html>
  `
}

export function weeklyDigest(metrics: {
  newLeads: number
  revenue: number
  topService: string
  openTickets: number
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>📊 Resumo Semanal</h1>
      <p>Olá Admin,</p>
      <p>Aqui está o resumo da atividade da última semana:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div class="metric">
          <div class="metric-value">${metrics.newLeads}</div>
          <div class="metric-label">Novos Leads</div>
        </div>
        <div class="metric">
          <div class="metric-value">€${metrics.revenue.toFixed(0)}</div>
          <div class="metric-label">Receita</div>
        </div>
        <div class="metric">
          <div class="metric-value">${metrics.openTickets}</div>
          <div class="metric-label">Tickets Abertos</div>
        </div>
      </div>

      <div class="info-box">
        <strong>Serviço Mais Procurado:</strong> ${metrics.topService}
      </div>

      <a href="${SITE_URL}/admin/dashboard" class="button">
        Ver Dashboard Completo
      </a>

      <p style="font-size: 14px; color: #666666; margin-top: 30px;">
        Este é um email automático enviado todas as segundas-feiras às 8h.
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Sistema de Notificações Automáticas</p>
    </div>
  </div>
</body>
</html>
  `
}

export function portalWelcome(name: string, email: string, portalUrl: string, locale: string): string {
  const isPortuguese = locale === 'pt'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>${isPortuguese ? 'Bem-vindo ao Portal do Cliente!' : 'Welcome to the Client Portal!'}</h1>
      <p>${isPortuguese ? 'Olá' : 'Hello'} ${name},</p>
      <p>
        ${isPortuguese
          ? 'A sua conta no Portal do Cliente Tec Fazer foi criada com sucesso!'
          : 'Your Tec Fazer Client Portal account has been created successfully!'}
      </p>
      <div class="info-box">
        <strong>${isPortuguese ? 'Email de Acesso:' : 'Login Email:'}</strong> ${email}
      </div>
      <h2>${isPortuguese ? 'O Que Pode Fazer no Portal' : 'What You Can Do in the Portal'}</h2>
      <p>
        ${isPortuguese
          ? '• Acompanhar o progresso dos seus projetos<br>• Aceder a documentos e entregas<br>• Abrir tickets de suporte<br>• Gerir a sua faturação<br>• Comunicar com a equipa'
          : '• Track your project progress<br>• Access documents and deliverables<br>• Open support tickets<br>• Manage your billing<br>• Communicate with the team'}
      </p>
      <a href="${portalUrl}" class="button">
        ${isPortuguese ? 'Aceder ao Portal' : 'Access Portal'}
      </a>
      <p style="font-size: 14px; color: #666666;">
        ${isPortuguese
          ? 'Na primeira vez que aceder, será solicitado que defina uma password.'
          : 'The first time you access, you will be asked to set a password.'}
      </p>
      <p>
        ${isPortuguese ? 'Atenciosamente,' : 'Best regards,'}<br>
        <strong>Equipa Tec Fazer</strong>
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Mafra, Lisboa, Portugal</p>
      <p>📞 963 101 123 | ✉️ geral@tecfazer.pt</p>
    </div>
  </div>
</body>
</html>
  `
}

export function ticketReply(ticketSubject: string, message: string, ticketUrl: string, locale: string): string {
  const isPortuguese = locale === 'pt'
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${LOGO_URL}" alt="Tec Fazer" class="logo">
      <div class="tagline">Building The Future</div>
    </div>
    <div class="content">
      <h1>${isPortuguese ? 'Nova Resposta ao Seu Ticket' : 'New Reply to Your Ticket'}</h1>
      <p>
        ${isPortuguese
          ? 'Recebeu uma nova resposta ao seu ticket de suporte:'
          : 'You have received a new reply to your support ticket:'}
      </p>
      <div class="info-box">
        <strong>${isPortuguese ? 'Assunto:' : 'Subject:'}</strong> ${ticketSubject}
      </div>
      <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
        ${message}
      </div>
      <a href="${ticketUrl}" class="button">
        ${isPortuguese ? 'Ver Ticket Completo' : 'View Full Ticket'}
      </a>
      <p style="font-size: 14px; color: #666666;">
        ${isPortuguese
          ? 'Pode responder diretamente através do portal do cliente.'
          : 'You can reply directly through the client portal.'}
      </p>
    </div>
    <div class="footer">
      <p><strong>Tec Fazer</strong> - Building The Future</p>
      <p>Mafra, Lisboa, Portugal</p>
      <p>📞 963 101 123 | ✉️ geral@tecfazer.pt</p>
    </div>
  </div>
</body>
</html>
  `
}
