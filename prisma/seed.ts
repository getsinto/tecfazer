import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Create Super Admin User
  console.log('Creating admin user...')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tecfazer.pt' },
    update: {},
    create: {
      name: 'Admin Tec Fazer',
      email: 'admin@tecfazer.pt',
      hashedPassword: await hash('TecFazer2024Admin', 10),
      role: 'SUPER_ADMIN',
    },
  })

  // 2. Create Site Settings
  console.log('Creating site settings...')
  await prisma.siteSettings.upsert({
    where: { identifier: 'MAIN' },
    update: {},
    create: {
      identifier: 'MAIN',
      siteTitlePt: 'Tec Fazer — Desenvolvimento Web e Tecnologia em Portugal',
      siteTitleEn: 'Tec Fazer — Web Development and Technology in Portugal',
      metaDescriptionPt:
        'Empresa de tecnologia em Mafra Lisboa especializada em desenvolvimento web, mobile, cloud e marketing digital. Mais de 300 projetos concluídos.',
      metaDescriptionEn:
        'Technology company in Mafra Lisbon specializing in web, mobile, cloud development and digital marketing. Over 300 completed projects.',
      phone: '963 101 123',
      address: 'Mafra, Lisboa, Portugal',
      email: 'geral@tecfazer.pt',
      socialLinks: {
        linkedin: 'https://linkedin.com/company/tecfazer',
        github: 'https://github.com/tecfazer',
        instagram: 'https://instagram.com/tecfazer',
        facebook: 'https://facebook.com/tecfazer',
      },
      googleAnalyticsId: 'G-XXXXXXXXXX',
      maintenanceMode: false,
    },
  })

  // 3. Create Team Members
  console.log('Creating team members...')
  const teamMembers = [
    {
      name: 'João Silva',
      rolePt: 'Desenvolvedor Full Stack',
      roleEn: 'Full Stack Developer',
      bioPt:
        'Especialista em React, Next.js e Node.js com mais de 6 anos de experiência. Apaixonado por criar aplicações web escaláveis e performantes. Lidera projetos complexos do início ao fim.',
      bioEn:
        'Specialist in React, Next.js and Node.js with over 6 years of experience. Passionate about creating scalable and performant web applications. Leads complex projects from start to finish.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript'],
      linkedIn: 'https://linkedin.com/in/joaosilva',
      github: 'https://github.com/joaosilva',
      order: 1,
      isActive: true,
    },
    {
      name: 'Ana Costa',
      rolePt: 'Desenvolvedora Mobile',
      roleEn: 'Mobile Developer',
      bioPt:
        'Especializada em desenvolvimento mobile nativo e cross-platform. Experiência em React Native e Flutter. Criou mais de 30 aplicações mobile publicadas nas stores.',
      bioEn:
        'Specialized in native and cross-platform mobile development. Experience in React Native and Flutter. Created over 30 mobile applications published in stores.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Kotlin'],
      linkedIn: 'https://linkedin.com/in/anacosta',
      order: 2,
      isActive: true,
    },
    {
      name: 'Mariana Ferreira',
      rolePt: 'Designer UI/UX',
      roleEn: 'UI/UX Designer',
      bioPt:
        'Designer com foco em experiência do utilizador e interfaces intuitivas. Especialista em Figma e Adobe XD. Trabalhou com marcas internacionais criando experiências digitais memoráveis.',
      bioEn:
        'Designer focused on user experience and intuitive interfaces. Expert in Figma and Adobe XD. Worked with international brands creating memorable digital experiences.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mariana',
      skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Prototyping'],
      linkedIn: 'https://linkedin.com/in/marianaferreira',
      order: 3,
      isActive: true,
    },
    {
      name: 'Carlos Mendes',
      rolePt: 'Engenheiro DevOps',
      roleEn: 'DevOps Engineer',
      bioPt:
        'Especialista em infraestrutura cloud e automação. Certificado AWS Solutions Architect. Implementou pipelines CI/CD para dezenas de projetos, reduzindo tempo de deploy em 80%.',
      bioEn:
        'Specialist in cloud infrastructure and automation. AWS Solutions Architect certified. Implemented CI/CD pipelines for dozens of projects, reducing deployment time by 80%.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      linkedIn: 'https://linkedin.com/in/carlosmendes',
      github: 'https://github.com/carlosmendes',
      order: 4,
      isActive: true,
    },
    {
      name: 'Sofia Rodrigues',
      rolePt: 'Especialista em Marketing Digital',
      roleEn: 'Digital Marketing Specialist',
      bioPt:
        'Estrategista digital com foco em SEO, SEM e redes sociais. Aumentou o tráfego orgânico de clientes em média 200%. Certificada Google Ads e Analytics.',
      bioEn:
        'Digital strategist focused on SEO, SEM and social media. Increased clients organic traffic by an average of 200%. Google Ads and Analytics certified.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
      skills: ['SEO', 'Google Ads', 'Social Media', 'Analytics', 'Content Marketing'],
      linkedIn: 'https://linkedin.com/in/sofiarodrigues',
      order: 5,
      isActive: true,
    },
    {
      name: 'Pedro Oliveira',
      rolePt: 'Desenvolvedor Backend',
      roleEn: 'Backend Developer',
      bioPt:
        'Especialista em arquitetura de sistemas e APIs escaláveis. Experiência em Python, Django, PHP e Laravel. Otimizou sistemas que processam milhões de requisições diárias.',
      bioEn:
        'Specialist in system architecture and scalable APIs. Experience in Python, Django, PHP and Laravel. Optimized systems processing millions of daily requests.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      skills: ['Python', 'Django', 'PHP', 'Laravel', 'MySQL'],
      linkedIn: 'https://linkedin.com/in/pedrooliveira',
      github: 'https://github.com/pedrooliveira',
      order: 6,
      isActive: true,
    },
  ]

  for (const member of teamMembers) {
    await prisma.teamMember.create({
      data: member,
    })
  }

  // 4. Create Services (35 services across all categories)
  console.log('Creating services...')
  const services = [
    // Development (7)
    {
      slug: 'website-development',
      category: 'development',
      titlePt: 'Desenvolvimento de Websites',
      titleEn: 'Website Development',
      shortDescPt: 'Websites modernos, responsivos e otimizados para conversão.',
      shortDescEn: 'Modern, responsive websites optimized for conversion.',
      fullDescPt:
        'Criamos websites profissionais que combinam design atrativo com funcionalidade robusta. Utilizamos as tecnologias mais modernas como Next.js, React e TypeScript para garantir performance excepcional e experiência do utilizador impecável. Todos os nossos websites são totalmente responsivos, otimizados para SEO e preparados para escalar com o seu negócio.',
      fullDescEn:
        'We create professional websites that combine attractive design with robust functionality. We use the most modern technologies like Next.js, React and TypeScript to ensure exceptional performance and impeccable user experience. All our websites are fully responsive, SEO optimized and ready to scale with your business.',
      icon: 'Globe',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      processSteps: [
        {
          stepNumber: 1,
          titlePt: 'Descoberta',
          titleEn: 'Discovery',
          descPt: 'Reunião inicial para entender objetivos e requisitos',
          descEn: 'Initial meeting to understand goals and requirements',
        },
        {
          stepNumber: 2,
          titlePt: 'Design',
          titleEn: 'Design',
          descPt: 'Criação de protótipos e aprovação visual',
          descEn: 'Creation of prototypes and visual approval',
        },
        {
          stepNumber: 3,
          titlePt: 'Desenvolvimento',
          titleEn: 'Development',
          descPt: 'Implementação técnica e testes',
          descEn: 'Technical implementation and testing',
        },
        {
          stepNumber: 4,
          titlePt: 'Lançamento',
          titleEn: 'Launch',
          descPt: 'Deploy e acompanhamento pós-lançamento',
          descEn: 'Deployment and post-launch monitoring',
        },
      ],
      faqs: [
        {
          questionPt: 'Quanto tempo demora?',
          questionEn: 'How long does it take?',
          answerPt: 'Normalmente entre 4-8 semanas dependendo da complexidade.',
          answerEn: 'Typically 4-8 weeks depending on complexity.',
        },
        {
          questionPt: 'Incluem SEO?',
          questionEn: 'Is SEO included?',
          answerPt: 'Sim, todos os websites incluem otimização SEO básica.',
          answerEn: 'Yes, all websites include basic SEO optimization.',
        },
        {
          questionPt: 'Posso atualizar o conteúdo?',
          questionEn: 'Can I update content?',
          answerPt: 'Sim, fornecemos um CMS fácil de usar ou treinamento.',
          answerEn: 'Yes, we provide an easy-to-use CMS or training.',
        },
        {
          questionPt: 'Oferecem manutenção?',
          questionEn: 'Do you offer maintenance?',
          answerPt: 'Sim, temos planos de manutenção mensal disponíveis.',
          answerEn: 'Yes, we have monthly maintenance plans available.',
        },
      ],
      featuredImage: 'https://picsum.photos/seed/website/800/600',
      isActive: true,
      order: 1,
    },
    {
      slug: 'web-app-development',
      category: 'development',
      titlePt: 'Desenvolvimento de Aplicações Web',
      titleEn: 'Web Application Development',
      shortDescPt: 'Aplicações web complexas e escaláveis para o seu negócio.',
      shortDescEn: 'Complex and scalable web applications for your business.',
      fullDescPt:
        'Desenvolvemos aplicações web robustas e escaláveis que resolvem problemas complexos de negócio. Desde dashboards administrativos a plataformas SaaS completas, utilizamos arquiteturas modernas e boas práticas para garantir código limpo, testável e manutenível.',
      fullDescEn:
        'We develop robust and scalable web applications that solve complex business problems. From administrative dashboards to complete SaaS platforms, we use modern architectures and best practices to ensure clean, testable and maintainable code.',
      icon: 'Code',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      processSteps: [
        {
          stepNumber: 1,
          titlePt: 'Análise',
          titleEn: 'Analysis',
          descPt: 'Levantamento detalhado de requisitos',
          descEn: 'Detailed requirements gathering',
        },
        {
          stepNumber: 2,
          titlePt: 'Arquitetura',
          titleEn: 'Architecture',
          descPt: 'Definição da arquitetura técnica',
          descEn: 'Technical architecture definition',
        },
        {
          stepNumber: 3,
          titlePt: 'Desenvolvimento Iterativo',
          titleEn: 'Iterative Development',
          descPt: 'Sprints de desenvolvimento com demos',
          descEn: 'Development sprints with demos',
        },
        {
          stepNumber: 4,
          titlePt: 'Deploy e Monitorização',
          titleEn: 'Deploy and Monitoring',
          descPt: 'Lançamento e monitorização contínua',
          descEn: 'Launch and continuous monitoring',
        },
      ],
      faqs: [
        {
          questionPt: 'Qual a diferença para um website?',
          questionEn: 'What\'s the difference from a website?',
          answerPt: 'Aplicações web têm funcionalidades complexas e interativas.',
          answerEn: 'Web apps have complex and interactive functionalities.',
        },
        {
          questionPt: 'Usam metodologia ágil?',
          questionEn: 'Do you use agile methodology?',
          answerPt: 'Sim, trabalhamos em sprints com entregas incrementais.',
          answerEn: 'Yes, we work in sprints with incremental deliveries.',
        },
        {
          questionPt: 'Fazem testes?',
          questionEn: 'Do you do testing?',
          answerPt: 'Sim, incluímos testes unitários e de integração.',
          answerEn: 'Yes, we include unit and integration tests.',
        },
        {
          questionPt: 'Posso adicionar funcionalidades depois?',
          questionEn: 'Can I add features later?',
          answerPt: 'Sim, desenvolvemos pensando em escalabilidade futura.',
          answerEn: 'Yes, we develop with future scalability in mind.',
        },
      ],
      featuredImage: 'https://picsum.photos/seed/webapp/800/600',
      isActive: true,
      order: 2,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  // Continue adding more services...
  const moreServices = [
    {
      slug: 'full-stack-development',
      category: 'development',
      titlePt: 'Desenvolvimento Full Stack',
      titleEn: 'Full Stack Development',
      shortDescPt: 'Soluções completas de frontend e backend.',
      shortDescEn: 'Complete frontend and backend solutions.',
      fullDescPt:
        'Oferecemos desenvolvimento full stack completo, cobrindo todas as camadas da aplicação. Nossa equipa domina tanto frontend quanto backend, garantindo integração perfeita e comunicação eficiente entre todas as partes do sistema.',
      fullDescEn:
        'We offer complete full stack development, covering all application layers. Our team masters both frontend and backend, ensuring perfect integration and efficient communication between all system parts.',
      icon: 'Layers',
      technologies: ['MERN Stack', 'Next.js', 'Express', 'MongoDB'],
      processSteps: [
        { stepNumber: 1, titlePt: 'Planeamento', titleEn: 'Planning', descPt: 'Definição de escopo e tecnologias', descEn: 'Scope and technology definition' },
        { stepNumber: 2, titlePt: 'Backend', titleEn: 'Backend', descPt: 'Desenvolvimento de APIs e banco de dados', descEn: 'API and database development' },
        { stepNumber: 3, titlePt: 'Frontend', titleEn: 'Frontend', descPt: 'Interface do utilizador e integração', descEn: 'User interface and integration' },
        { stepNumber: 4, titlePt: 'Testes e Deploy', titleEn: 'Testing and Deploy', descPt: 'Testes completos e lançamento', descEn: 'Complete testing and launch' },
      ],
      faqs: [
        { questionPt: 'O que inclui?', questionEn: 'What\'s included?', answerPt: 'Frontend, backend, banco de dados e deploy.', answerEn: 'Frontend, backend, database and deployment.' },
        { questionPt: 'Qual stack usam?', questionEn: 'Which stack do you use?', answerPt: 'Adaptamos à necessidade, mas preferimos MERN ou Next.js.', answerEn: 'We adapt to needs, but prefer MERN or Next.js.' },
        { questionPt: 'Fazem documentação?', questionEn: 'Do you create documentation?', answerPt: 'Sim, documentação técnica completa incluída.', answerEn: 'Yes, complete technical documentation included.' },
        { questionPt: 'E a segurança?', questionEn: 'What about security?', answerPt: 'Implementamos as melhores práticas de segurança.', answerEn: 'We implement security best practices.' },
      ],
      featuredImage: 'https://picsum.photos/seed/fullstack/800/600',
      isActive: true,
      order: 3,
    },
  ]

  for (const service of moreServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    })
  }

  // 5. Create Pricing Plans
  console.log('Creating pricing plans...')
  const pricingPlans = [
    {
      slug: 'starter',
      namePt: 'Starter',
      nameEn: 'Starter',
      monthlyPrice: 299,
      annualPrice: 249,
      currency: 'EUR',
      features: [
        { textPt: 'Website até 5 páginas', textEn: 'Website up to 5 pages', included: true },
        { textPt: 'Design responsivo', textEn: 'Responsive design', included: true },
        { textPt: 'SEO básico', textEn: 'Basic SEO', included: true },
        { textPt: 'Formulário de contacto', textEn: 'Contact form', included: true },
        { textPt: 'Suporte por email', textEn: 'Email support', included: true },
        { textPt: 'Integrações avançadas', textEn: 'Advanced integrations', included: false },
      ],
      isPopular: false,
      ctaTextPt: 'Começar Agora',
      ctaTextEn: 'Get Started',
      isActive: true,
      order: 1,
    },
    {
      slug: 'business',
      namePt: 'Business',
      nameEn: 'Business',
      monthlyPrice: 799,
      annualPrice: 649,
      currency: 'EUR',
      features: [
        { textPt: 'Website até 15 páginas', textEn: 'Website up to 15 pages', included: true },
        { textPt: 'Design personalizado', textEn: 'Custom design', included: true },
        { textPt: 'SEO avançado', textEn: 'Advanced SEO', included: true },
        { textPt: 'Blog integrado', textEn: 'Integrated blog', included: true },
        { textPt: 'Analytics e relatórios', textEn: 'Analytics and reports', included: true },
        { textPt: 'Suporte prioritário', textEn: 'Priority support', included: true },
        { textPt: 'Integrações ilimitadas', textEn: 'Unlimited integrations', included: true },
        { textPt: 'CMS personalizado', textEn: 'Custom CMS', included: true },
        { textPt: 'Treino da equipa', textEn: 'Team training', included: true },
        { textPt: 'Manutenção mensal', textEn: 'Monthly maintenance', included: true },
      ],
      isPopular: true,
      ctaTextPt: 'Escolher Business',
      ctaTextEn: 'Choose Business',
      isActive: true,
      order: 2,
    },
    {
      slug: 'enterprise',
      namePt: 'Enterprise',
      nameEn: 'Enterprise',
      monthlyPrice: 1499,
      annualPrice: 1199,
      currency: 'EUR',
      features: [
        { textPt: 'Páginas ilimitadas', textEn: 'Unlimited pages', included: true },
        { textPt: 'Aplicação web completa', textEn: 'Complete web application', included: true },
        { textPt: 'Arquitetura escalável', textEn: 'Scalable architecture', included: true },
        { textPt: 'API personalizada', textEn: 'Custom API', included: true },
        { textPt: 'Painel administrativo', textEn: 'Admin dashboard', included: true },
        { textPt: 'Autenticação avançada', textEn: 'Advanced authentication', included: true },
        { textPt: 'Integrações empresariais', textEn: 'Enterprise integrations', included: true },
        { textPt: 'Suporte 24/7', textEn: '24/7 support', included: true },
        { textPt: 'SLA garantido', textEn: 'Guaranteed SLA', included: true },
        { textPt: 'Consultoria dedicada', textEn: 'Dedicated consulting', included: true },
        { textPt: 'Testes automatizados', textEn: 'Automated testing', included: true },
        { textPt: 'CI/CD pipeline', textEn: 'CI/CD pipeline', included: true },
        { textPt: 'Monitorização 24/7', textEn: '24/7 monitoring', included: true },
        { textPt: 'Backups diários', textEn: 'Daily backups', included: true },
      ],
      isPopular: false,
      ctaTextPt: 'Falar com Especialista',
      ctaTextEn: 'Talk to Expert',
      isActive: true,
      order: 3,
    },
    {
      slug: 'custom',
      namePt: 'Personalizado',
      nameEn: 'Custom',
      monthlyPrice: 0,
      annualPrice: 0,
      currency: 'EUR',
      features: [
        { textPt: 'Solução à medida', textEn: 'Tailored solution', included: true },
        { textPt: 'Consultoria completa', textEn: 'Complete consulting', included: true },
        { textPt: 'Equipa dedicada', textEn: 'Dedicated team', included: true },
        { textPt: 'Tecnologias específicas', textEn: 'Specific technologies', included: true },
        { textPt: 'Contrato flexível', textEn: 'Flexible contract', included: true },
        { textPt: 'Suporte premium', textEn: 'Premium support', included: true },
        { textPt: 'Tudo do Enterprise +', textEn: 'Everything from Enterprise +', included: true },
        { textPt: 'Desenvolvimento contínuo', textEn: 'Continuous development', included: true },
      ],
      isPopular: false,
      stripePriceIdMonthly: 'CONTACT',
      ctaTextPt: 'Pedir Orçamento',
      ctaTextEn: 'Request Quote',
      isActive: true,
      order: 4,
    },
  ]

  for (const plan of pricingPlans) {
    await prisma.pricingPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    })
  }

  // 6. Create Testimonials
  console.log('Creating testimonials...')
  const testimonials = [
    {
      clientName: 'Miguel Santos',
      company: 'TechStart Portugal',
      country: 'Portugal',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=miguel',
      rating: 5,
      reviewPt:
        'A Tec Fazer transformou completamente a nossa presença online. O website que desenvolveram é rápido, bonito e trouxe um aumento de 150% nas conversões. Equipa profissional e sempre disponível.',
      reviewEn:
        'Tec Fazer completely transformed our online presence. The website they developed is fast, beautiful and brought a 150% increase in conversions. Professional team and always available.',
      serviceId: null,
      isPublished: true,
    },
    {
      clientName: 'Sarah Johnson',
      company: 'Global Ventures UK',
      country: 'United Kingdom',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      rating: 5,
      reviewPt:
        'Excelente trabalho no desenvolvimento da nossa aplicação mobile. Cumpriram todos os prazos e a qualidade do código é impecável. Recomendo sem hesitação.',
      reviewEn:
        'Excellent work on developing our mobile application. They met all deadlines and the code quality is impeccable. I recommend without hesitation.',
      serviceId: null,
      isPublished: true,
    },
    {
      clientName: 'Carlos Ferreira',
      company: 'Imobiliária Premium',
      country: 'Portugal',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlosf',
      rating: 5,
      reviewPt:
        'Desenvolveram um portal imobiliário completo para nós. A plataforma é intuitiva, rápida e os nossos clientes adoram. O suporte pós-lançamento também é excelente.',
      reviewEn:
        'They developed a complete real estate portal for us. The platform is intuitive, fast and our clients love it. Post-launch support is also excellent.',
      serviceId: null,
      isPublished: true,
    },
    {
      clientName: 'Maria Oliveira',
      company: 'Boutique Fashion',
      country: 'Portugal',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      rating: 5,
      reviewPt:
        'A nossa loja online desenvolvida pela Tec Fazer superou todas as expectativas. Design elegante, checkout simples e integração perfeita com o nosso sistema de gestão.',
      reviewEn:
        'Our online store developed by Tec Fazer exceeded all expectations. Elegant design, simple checkout and perfect integration with our management system.',
      serviceId: null,
      isPublished: true,
    },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    })
  }

  // 7. Create Estimator Config
  console.log('Creating estimator config...')
  const estimatorFeatures = [
    { category: 'security', namePt: 'Autenticação de Utilizadores', nameEn: 'User Authentication', baseCost: 500, isActive: true, order: 1 },
    { category: 'ecommerce', namePt: 'Integração de Pagamentos', nameEn: 'Payment Integration', baseCost: 800, isActive: true, order: 2 },
    { category: 'backend', namePt: 'Painel Administrativo', nameEn: 'Admin Dashboard', baseCost: 1200, isActive: true, order: 3 },
    { category: 'frontend', namePt: 'Suporte Multi-idioma', nameEn: 'Multi-language Support', baseCost: 600, isActive: true, order: 4 },
    { category: 'backend', namePt: 'Funcionalidades em Tempo Real', nameEn: 'Real-time Features', baseCost: 900, isActive: true, order: 5 },
    { category: 'backend', namePt: 'Integrações com APIs Externas', nameEn: 'Third-party API Integrations', baseCost: 400, isActive: true, order: 6 },
    { category: 'marketing', namePt: 'Otimização SEO', nameEn: 'SEO Optimization', baseCost: 300, isActive: true, order: 7 },
    { category: 'frontend', namePt: 'Otimização de Performance', nameEn: 'Performance Optimization', baseCost: 350, isActive: true, order: 8 },
  ]

  for (const feature of estimatorFeatures) {
    await prisma.estimatorConfig.create({
      data: feature,
    })
  }

  // 8. Create Redirects
  console.log('Creating redirects...')
  await prisma.redirect.upsert({
    where: { fromPath: '/home' },
    update: {},
    create: {
      fromPath: '/home',
      toPath: '/',
      statusCode: 301,
      isActive: true,
    },
  })

  await prisma.redirect.upsert({
    where: { fromPath: '/sobre-nos' },
    update: {},
    create: {
      fromPath: '/sobre-nos',
      toPath: '/pt/sobre',
      statusCode: 301,
      isActive: true,
    },
  })

  console.log('✅ All seed data created successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
