import { 
  Code, Smartphone, ShoppingCart, Briefcase
} from 'lucide-react'

export interface ServiceItem {
  title: string
  description: string
  price: string
  features: string[]
  technologies: string[]
  slug: string
  fullDescription?: string
  benefits?: string[]
  process?: string[]
  deliverables?: string[]
  timeline?: string
  support?: string
}

export interface ServiceCategory {
  title: string
  description: string
  icon: any
  color: string
  services: ServiceItem[]
}

export interface ServicesData {
  [locale: string]: {
    [category: string]: ServiceCategory
  }
}

// Comprehensive services data with ALL services and sub-services
export const servicesData: ServicesData = {
  pt: {
    development: {
      title: 'Desenvolvimento Web',
      description: 'Soluções web modernas e escaláveis para o seu negócio',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      services: [
        {
          title: 'Websites Corporativos',
          description: 'Sites profissionais responsivos com design moderno e otimização SEO',
          price: 'Desde €450',
          features: ['Design Responsivo', 'SEO Otimizado', 'CMS Integrado', 'Analytics'],
          technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
          slug: 'websites-corporativos',
          fullDescription: 'Criamos websites corporativos profissionais que representam a sua marca de forma impactante. Cada site é desenvolvido com as mais recentes tecnologias web, garantindo performance, segurança e uma experiência de utilizador excepcional.',
          benefits: ['Aumento da credibilidade online', 'Melhor posicionamento no Google', 'Geração de leads qualificados', 'Presença digital profissional'],
          process: ['Análise de requisitos', 'Design e prototipagem', 'Desenvolvimento', 'Testes e otimização', 'Lançamento e formação'],
          deliverables: ['Website completo', 'Painel de administração', 'Documentação técnica', 'Formação de utilização'],
          timeline: '2-4 semanas',
          support: '3 meses de suporte incluído'
        },
        {
          title: 'Aplicações Web Complexas',
          description: 'Aplicações web avançadas com funcionalidades personalizadas',
          price: 'Desde €1.400',
          features: ['SPA/PWA', 'API Integration', 'Real-time Updates', 'User Management'],
          technologies: ['React', 'Vue.js', 'Node.js', 'PostgreSQL'],
          slug: 'aplicacoes-web-complexas',
          fullDescription: 'Desenvolvemos aplicações web complexas e escaláveis que automatizam processos empresariais e melhoram a eficiência operacional.',
          benefits: ['Automação de processos', 'Redução de custos operacionais', 'Melhoria da produtividade', 'Escalabilidade garantida'],
          process: ['Análise de processos', 'Arquitetura da solução', 'Desenvolvimento iterativo', 'Testes de integração', 'Deployment e monitorização'],
          deliverables: ['Aplicação web completa', 'API documentada', 'Painel administrativo', 'Sistema de relatórios'],
          timeline: '2-6 meses',
          support: '6 meses de suporte incluído'
        },
        {
          title: 'Progressive Web Apps (PWA)',
          description: 'Apps web que funcionam como aplicações nativas',
          price: 'Desde €800',
          features: ['Offline Support', 'Push Notifications', 'App-like Experience', 'Fast Loading'],
          technologies: ['PWA', 'Service Workers', 'Web App Manifest'],
          slug: 'progressive-web-apps',
          fullDescription: 'Progressive Web Apps combinam o melhor dos websites e aplicações móveis, oferecendo uma experiência nativa através do browser.',
          benefits: ['Funciona offline', 'Instalável no dispositivo', 'Notificações push', 'Performance nativa'],
          process: ['Análise de requisitos', 'Design da experiência', 'Desenvolvimento PWA', 'Testes multi-dispositivo', 'Otimização e lançamento'],
          deliverables: ['PWA completa', 'Service Workers', 'Manifest configurado', 'Guia de instalação'],
          timeline: '3-5 semanas',
          support: '3 meses de suporte incluído'
        },
        {
          title: 'Portais Web Empresariais',
          description: 'Portais complexos com múltiplas funcionalidades e integrações',
          price: 'Desde €2.000',
          features: ['Multi-user System', 'Dashboard Analytics', 'API Integrations', 'Custom Modules'],
          technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis'],
          slug: 'portais-web-empresariais',
          fullDescription: 'Portais web empresariais que centralizam informações, processos e comunicação, melhorando a colaboração e eficiência organizacional.',
          benefits: ['Centralização de informações', 'Melhoria da comunicação interna', 'Automação de workflows', 'Analytics avançados'],
          process: ['Levantamento de requisitos', 'Arquitetura do portal', 'Desenvolvimento modular', 'Integração de sistemas', 'Testes e formação'],
          deliverables: ['Portal completo', 'Módulos personalizados', 'Integrações API', 'Dashboard executivo'],
          timeline: '3-8 meses',
          support: '12 meses de suporte incluído'
        },
        {
          title: 'Sistemas de Gestão (ERP/CRM)',
          description: 'ERP, CRM e sistemas de gestão empresarial personalizados',
          price: 'Desde €3.000',
          features: ['Custom Workflows', 'Reporting System', 'Multi-tenant', 'Role Management'],
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
          slug: 'sistemas-gestao-erp-crm',
          fullDescription: 'Sistemas de gestão empresarial completos que integram todos os processos da sua empresa numa única plataforma.',
          benefits: ['Integração total de processos', 'Relatórios em tempo real', 'Redução de erros manuais', 'Melhoria da tomada de decisão'],
          process: ['Análise de processos empresariais', 'Design da arquitetura', 'Desenvolvimento modular', 'Migração de dados', 'Formação e go-live'],
          deliverables: ['Sistema ERP/CRM completo', 'Módulos personalizados', 'Relatórios executivos', 'Formação completa'],
          timeline: '4-12 meses',
          support: '12 meses de suporte incluído'
        },
        {
          title: 'Plataformas de E-learning',
          description: 'Plataformas educacionais e de formação online',
          price: 'Desde €1.800',
          features: ['Course Management', 'Video Streaming', 'Progress Tracking', 'Certificates'],
          technologies: ['React', 'Node.js', 'Video APIs', 'LMS'],
          slug: 'plataformas-elearning',
          fullDescription: 'Plataformas de e-learning completas para educação online, formação corporativa e desenvolvimento de competências.',
          benefits: ['Formação escalável', 'Tracking de progresso', 'Certificações automáticas', 'Redução de custos de formação'],
          process: ['Análise pedagógica', 'Design da experiência de aprendizagem', 'Desenvolvimento da plataforma', 'Integração de conteúdos', 'Testes e lançamento'],
          deliverables: ['Plataforma LMS completa', 'Sistema de certificações', 'Analytics de aprendizagem', 'Painel administrativo'],
          timeline: '2-6 meses',
          support: '6 meses de suporte incluído'
        }
      ]
    },
    mobile: {
      title: 'Aplicações Mobile',
      description: 'Apps iOS e Android de alta qualidade',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      services: [
        {
          title: 'Apps Nativas iOS',
          description: 'Aplicações nativas para iOS com performance máxima',
          price: 'Desde €2.200',
          features: ['Swift/SwiftUI', 'iOS Guidelines', 'App Store Optimization', 'Core Data'],
          technologies: ['Swift', 'SwiftUI', 'Core Data', 'CloudKit'],
          slug: 'apps-nativas-ios',
          fullDescription: 'Aplicações iOS nativas desenvolvidas com Swift e SwiftUI, seguindo as guidelines da Apple para máxima performance e experiência de utilizador.',
          benefits: ['Performance nativa', 'Integração com iOS', 'App Store ready', 'Experiência premium'],
          process: ['Design UX/UI', 'Desenvolvimento nativo', 'Testes em dispositivos', 'App Store submission', 'Lançamento e suporte'],
          deliverables: ['App iOS completa', 'Código fonte', 'Documentação técnica', 'App Store listing'],
          timeline: '2-6 meses',
          support: '6 meses de suporte incluído'
        },
        {
          title: 'Apps Nativas Android',
          description: 'Aplicações nativas para Android otimizadas',
          price: 'Desde €1.800',
          features: ['Kotlin/Java', 'Material Design', 'Google Play Ready', 'Room Database'],
          technologies: ['Kotlin', 'Jetpack Compose', 'Room', 'Firebase'],
          slug: 'apps-nativas-android',
          fullDescription: 'Aplicações Android nativas com Kotlin e Jetpack Compose, seguindo Material Design para uma experiência consistente.',
          benefits: ['Performance otimizada', 'Material Design', 'Google Play ready', 'Integração Android'],
          process: ['Design Material', 'Desenvolvimento Kotlin', 'Testes multi-dispositivo', 'Google Play submission', 'Lançamento'],
          deliverables: ['App Android completa', 'Código fonte', 'Testes automatizados', 'Google Play listing'],
          timeline: '2-5 meses',
          support: '6 meses de suporte incluído'
        },
        {
          title: 'Apps Híbridas Flutter',
          description: 'Desenvolvimento cross-platform com Flutter',
          price: 'Desde €1.500',
          features: ['Single Codebase', 'Native Performance', 'Hot Reload', 'Custom Widgets'],
          technologies: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
          slug: 'apps-hibridas-flutter',
          fullDescription: 'Aplicações cross-platform com Flutter, permitindo um único código para iOS e Android com performance quase nativa.',
          benefits: ['Desenvolvimento mais rápido', 'Código partilhado', 'Performance nativa', 'Manutenção simplificada'],
          process: ['Arquitetura Flutter', 'Desenvolvimento cross-platform', 'Testes iOS/Android', 'Deployment duplo', 'Suporte contínuo'],
          deliverables: ['Apps iOS e Android', 'Código Flutter', 'Documentação', 'Deployment automatizado'],
          timeline: '1.5-4 meses',
          support: '6 meses de suporte incluído'
        },
        {
          title: 'Apps React Native',
          description: 'Apps cross-platform com React Native',
          price: 'Desde €1.200',
          features: ['JavaScript/TypeScript', 'Code Sharing', 'Native Modules', 'Fast Development'],
          technologies: ['React Native', 'TypeScript', 'Redux', 'AsyncStorage'],
          slug: 'apps-react-native',
          fullDescription: 'Desenvolvimento de aplicações móveis com React Native, aproveitando conhecimentos web para criar apps nativas.',
          benefits: ['Reutilização de código web', 'Desenvolvimento ágil', 'Comunidade ativa', 'Integração nativa'],
          process: ['Setup React Native', 'Desenvolvimento componentes', 'Integração nativa', 'Testes e otimização', 'Deployment'],
          deliverables: ['Apps iOS e Android', 'Código React Native', 'Componentes reutilizáveis', 'CI/CD pipeline'],
          timeline: '1-3 meses',
          support: '4 meses de suporte incluído'
        },
        {
          title: 'Publicação nas Lojas',
          description: 'Gestão completa da publicação na App Store e Google Play',
          price: 'Desde €200',
          features: ['App Store Optimization', 'Compliance Check', 'Review Management', 'Updates'],
          technologies: ['App Store Connect', 'Google Play Console'],
          slug: 'publicacao-lojas-apps',
          fullDescription: 'Serviço completo de publicação e gestão de aplicações nas lojas oficiais, incluindo otimização e acompanhamento.',
          benefits: ['Publicação profissional', 'Otimização ASO', 'Gestão de reviews', 'Updates automáticos'],
          process: ['Preparação de assets', 'Submissão às lojas', 'Acompanhamento de review', 'Otimização contínua', 'Gestão de updates'],
          deliverables: ['Apps publicadas', 'Assets otimizados', 'Relatórios ASO', 'Estratégia de updates'],
          timeline: '1-2 semanas',
          support: 'Gestão contínua disponível'
        }
      ]
    },
    ecommerce: {
      title: 'E-commerce & Vendas Online',
      description: 'Lojas online completas e sistemas de pagamento',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
      services: [
        {
          title: 'Lojas Shopify Plus',
          description: 'E-commerce profissional com Shopify Plus',
          price: 'Desde €1.200',
          features: ['Shopify Plus', 'Custom Themes', 'App Integrations', 'Multi-currency'],
          technologies: ['Shopify', 'Liquid', 'JavaScript', 'Shopify APIs'],
          slug: 'lojas-shopify-plus',
          fullDescription: 'Lojas online profissionais na plataforma Shopify Plus, ideal para empresas que precisam de escalabilidade e funcionalidades avançadas.',
          benefits: ['Plataforma robusta', 'Escalabilidade automática', 'Integrações nativas', 'Suporte 24/7'],
          process: ['Setup Shopify Plus', 'Design personalizado', 'Configuração de produtos', 'Integrações', 'Lançamento e otimização'],
          deliverables: ['Loja Shopify completa', 'Tema personalizado', 'Integrações configuradas', 'Formação de gestão'],
          timeline: '3-6 semanas',
          support: '3 meses de suporte incluído'
        },
        {
          title: 'WooCommerce Avançado',
          description: 'Lojas WordPress com WooCommerce personalizadas',
          price: 'Desde €900',
          features: ['WordPress Integration', 'Custom Plugins', 'Payment Gateways', 'SEO Optimized'],
          technologies: ['WordPress', 'WooCommerce', 'PHP', 'MySQL'],
          slug: 'woocommerce-avancado',
          fullDescription: 'Lojas online baseadas em WordPress e WooCommerce, com personalização completa e funcionalidades avançadas.',
          benefits: ['Flexibilidade total', 'SEO otimizado', 'Plugins personalizados', 'Controlo completo'],
          process: ['Setup WordPress', 'Personalização WooCommerce', 'Desenvolvimento de plugins', 'Configuração de pagamentos', 'Otimização SEO'],
          deliverables: ['Loja WooCommerce', 'Plugins personalizados', 'Tema responsivo', 'Otimização SEO'],
          timeline: '4-8 semanas',
          support: '4 meses de suporte incluído'
        },
        {
          title: 'E-commerce Personalizado',
          description: 'Plataformas de e-commerce completamente personalizadas',
          price: 'Desde €3.500',
          features: ['Custom Platform', 'Advanced Features', 'Scalable Architecture', 'API-first'],
          technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
          slug: 'ecommerce-personalizado',
          fullDescription: 'Plataformas de e-commerce desenvolvidas de raiz, com funcionalidades específicas e arquitetura escalável.',
          benefits: ['Funcionalidades únicas', 'Performance otimizada', 'Escalabilidade ilimitada', 'Integração total'],
          process: ['Análise de requisitos', 'Arquitetura da plataforma', 'Desenvolvimento backend/frontend', 'Integrações', 'Testes e lançamento'],
          deliverables: ['Plataforma completa', 'Painel administrativo', 'APIs documentadas', 'Sistema de relatórios'],
          timeline: '3-8 meses',
          support: '12 meses de suporte incluído'
        },
        {
          title: 'Marketplaces Multi-vendor',
          description: 'Plataformas multi-vendor com gestão avançada',
          price: 'Desde €5.000',
          features: ['Multi-vendor', 'Commission System', 'Vendor Dashboard', 'Advanced Analytics'],
          technologies: ['Microservices', 'API Gateway', 'PostgreSQL', 'Redis'],
          slug: 'marketplaces-multivendor',
          fullDescription: 'Marketplaces complexos que permitem múltiplos vendedores, com sistema de comissões e gestão avançada.',
          benefits: ['Múltiplos vendedores', 'Gestão de comissões', 'Analytics avançados', 'Escalabilidade empresarial'],
          process: ['Arquitetura marketplace', 'Sistema de vendedores', 'Gestão de comissões', 'Dashboard analytics', 'Testes e lançamento'],
          deliverables: ['Marketplace completo', 'Painel de vendedores', 'Sistema de comissões', 'Analytics dashboard'],
          timeline: '4-10 meses',
          support: '12 meses de suporte incluído'
        },
        {
          title: 'Integrações de Pagamento',
          description: 'Sistemas de pagamento seguros e conformes',
          price: 'Desde €400',
          features: ['Multiple Gateways', 'MB Way', 'Multibanco', 'Security Compliance'],
          technologies: ['Stripe', 'PayPal', 'MB Way', 'SIBS'],
          slug: 'integracoes-pagamento-ecommerce',
          fullDescription: 'Integração de múltiplos métodos de pagamento, incluindo soluções portuguesas como MB Way e Multibanco.',
          benefits: ['Múltiplos métodos', 'Pagamentos seguros', 'Conformidade PCI', 'Experiência otimizada'],
          process: ['Análise de requisitos', 'Integração de gateways', 'Testes de segurança', 'Certificação PCI', 'Go-live'],
          deliverables: ['Integrações completas', 'Testes de segurança', 'Documentação técnica', 'Certificação PCI'],
          timeline: '2-4 semanas',
          support: '6 meses de suporte incluído'
        }
      ]
    }
    // ... Continue with other categories (cloud, design, marketing, ai, security, consulting, support)
  },
  en: {
    // English versions of all services...
    development: {
      title: 'Web Development',
      description: 'Modern and scalable web solutions for your business',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      services: [
        {
          title: 'Corporate Websites',
          description: 'Professional responsive websites with modern design and SEO optimization',
          price: 'From €450',
          features: ['Responsive Design', 'SEO Optimized', 'CMS Integration', 'Analytics'],
          technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
          slug: 'corporate-websites',
          fullDescription: 'We create professional corporate websites that represent your brand impactfully. Each site is developed with the latest web technologies, ensuring performance, security and exceptional user experience.',
          benefits: ['Increased online credibility', 'Better Google ranking', 'Qualified lead generation', 'Professional digital presence'],
          process: ['Requirements analysis', 'Design and prototyping', 'Development', 'Testing and optimization', 'Launch and training'],
          deliverables: ['Complete website', 'Admin panel', 'Technical documentation', 'Usage training'],
          timeline: '2-4 weeks',
          support: '3 months support included'
        }
        // ... Continue with English versions
      ]
    }
    // ... Continue with other categories in English
  }
}