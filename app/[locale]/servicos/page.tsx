import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SectionReveal from '@/components/ui/SectionReveal'
import { 
  ArrowRight, Sparkles, Zap, CheckCircle2, Award, Clock, Euro, Eye
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { servicesData } from '@/lib/services-data'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return buildMetadata({
    locale,
    titlePt: 'Serviços de Tecnologia | Desenvolvimento Web, Mobile & Cloud | Tec Fazer',
    titleEn: 'Technology Services | Web, Mobile & Cloud Development | Tec Fazer',
    descPt: 'Serviços completos de tecnologia: desenvolvimento web, aplicações mobile, soluções cloud, e-commerce, marketing digital e consultoria. Preços desde €450. ISO 9001 certificado.',
    descEn: 'Complete technology services: web development, mobile apps, cloud solutions, e-commerce, digital marketing and consulting. Prices from €450. ISO 9001 certified.',
    path: `/${locale}/servicos`,
  })
}

// Comprehensive services data structure
const servicesData = {
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
          slug: 'websites-corporativos'
        },
        {
          title: 'Aplicações Web',
          description: 'Aplicações web complexas com funcionalidades avançadas',
          price: 'Desde €1.400',
          features: ['SPA/PWA', 'API Integration', 'Real-time Updates', 'User Management'],
          technologies: ['React', 'Vue.js', 'Node.js', 'PostgreSQL'],
          slug: 'aplicacoes-web'
        },
        {
          title: 'Progressive Web Apps',
          description: 'Apps web que funcionam como aplicações nativas',
          price: 'Desde €800',
          features: ['Offline Support', 'Push Notifications', 'App-like Experience', 'Fast Loading'],
          technologies: ['PWA', 'Service Workers', 'Web App Manifest'],
          slug: 'progressive-web-apps'
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
          title: 'Apps Nativas',
          description: 'Aplicações nativas para iOS e Android com performance máxima',
          price: 'Desde €1.800',
          features: ['Performance Nativa', 'UI/UX Otimizada', 'App Store Ready', 'Push Notifications'],
          technologies: ['Swift', 'Kotlin', 'iOS SDK', 'Android SDK'],
          slug: 'apps-nativas'
        },
        {
          title: 'Apps Híbridas',
          description: 'Desenvolvimento cross-platform com código partilhado',
          price: 'Desde €1.200',
          features: ['Cross-platform', 'Código Partilhado', 'Rapid Development', 'Native Performance'],
          technologies: ['Flutter', 'React Native', 'Dart', 'JavaScript'],
          slug: 'apps-hibridas'
        },
        {
          title: 'Publicação nas Lojas',
          description: 'Gestão completa da publicação na App Store e Google Play',
          price: 'Desde €200',
          features: ['App Store Optimization', 'Compliance Check', 'Review Management', 'Updates'],
          technologies: ['App Store Connect', 'Google Play Console'],
          slug: 'publicacao-lojas'
        }
      ]
    },
    ecommerce: {
      title: 'E-commerce',
      description: 'Lojas online completas e sistemas de pagamento',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
      services: [
        {
          title: 'Lojas Online Completas',
          description: 'E-commerce completo com gestão de produtos e pagamentos',
          price: 'Desde €900',
          features: ['Catálogo de Produtos', 'Carrinho de Compras', 'Pagamentos Seguros', 'Gestão de Stock'],
          technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal'],
          slug: 'lojas-online'
        },
        {
          title: 'Marketplaces',
          description: 'Plataformas multi-vendor com gestão avançada',
          price: 'Desde €2.500',
          features: ['Multi-vendor', 'Commission System', 'Vendor Dashboard', 'Advanced Analytics'],
          technologies: ['Custom Platform', 'Microservices', 'API Gateway'],
          slug: 'marketplaces'
        },
        {
          title: 'Integrações de Pagamento',
          description: 'Sistemas de pagamento seguros e conformes',
          price: 'Desde €300',
          features: ['Multiple Gateways', 'MB Way', 'Multibanco', 'Security Compliance'],
          technologies: ['Stripe', 'PayPal', 'MB Way', 'SIBS'],
          slug: 'integracoes-pagamento'
        }
      ]
    },
    cloud: {
      title: 'Soluções Cloud',
      description: 'Infraestrutura cloud e DevOps profissional',
      icon: Cloud,
      color: 'from-sky-500 to-blue-500',
      services: [
        {
          title: 'Migração para Cloud',
          description: 'Migração segura e otimizada para a cloud',
          price: 'Desde €1.000',
          features: ['Assessment', 'Migration Strategy', 'Zero Downtime', 'Cost Optimization'],
          technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker'],
          slug: 'migracao-cloud'
        },
        {
          title: 'DevOps & CI/CD',
          description: 'Automação de deployment e infraestrutura',
          price: 'Desde €800',
          features: ['Automated Deployment', 'Infrastructure as Code', 'Monitoring', 'Scaling'],
          technologies: ['Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
          slug: 'devops-cicd'
        },
        {
          title: 'Monitorização & Backup',
          description: 'Sistemas de monitorização e backup automático',
          price: 'Desde €400',
          features: ['24/7 Monitoring', 'Automated Backups', 'Disaster Recovery', 'Performance Metrics'],
          technologies: ['Prometheus', 'Grafana', 'ELK Stack', 'AWS Backup'],
          slug: 'monitorizacao-backup'
        }
      ]
    },
    marketing: {
      title: 'Marketing Digital',
      description: 'Estratégias digitais para crescimento do negócio',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      services: [
        {
          title: 'SEO & Otimização',
          description: 'Otimização para motores de busca e performance',
          price: 'Desde €300/mês',
          features: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Performance Optimization'],
          technologies: ['Google Analytics', 'Search Console', 'SEMrush', 'PageSpeed'],
          slug: 'seo-otimizacao'
        },
        {
          title: 'Google Ads & Facebook Ads',
          description: 'Campanhas publicitárias otimizadas para conversão',
          price: 'Desde €500/mês',
          features: ['Campaign Setup', 'A/B Testing', 'Conversion Tracking', 'ROI Optimization'],
          technologies: ['Google Ads', 'Facebook Business', 'Google Tag Manager'],
          slug: 'google-facebook-ads'
        },
        {
          title: 'Social Media Management',
          description: 'Gestão profissional de redes sociais',
          price: 'Desde €400/mês',
          features: ['Content Creation', 'Posting Schedule', 'Community Management', 'Analytics'],
          technologies: ['Hootsuite', 'Buffer', 'Canva', 'Analytics Tools'],
          slug: 'social-media'
        }
      ]
    },
    consulting: {
      title: 'Consultoria Tecnológica',
      description: 'Consultoria especializada em transformação digital',
      icon: Briefcase,
      color: 'from-violet-500 to-purple-500',
      services: [
        {
          title: 'Auditoria de Sistemas',
          description: 'Análise completa da infraestrutura tecnológica',
          price: 'Desde €1.500',
          features: ['Security Assessment', 'Performance Analysis', 'Architecture Review', 'Recommendations'],
          technologies: ['Security Tools', 'Performance Monitoring', 'Code Analysis'],
          slug: 'auditoria-sistemas'
        },
        {
          title: 'Transformação Digital',
          description: 'Estratégia completa de digitalização empresarial',
          price: 'Desde €2.000',
          features: ['Digital Strategy', 'Process Automation', 'Technology Roadmap', 'Change Management'],
          technologies: ['Business Analysis', 'Process Mapping', 'Technology Assessment'],
          slug: 'transformacao-digital'
        },
        {
          title: 'Formação de Equipas',
          description: 'Formação técnica especializada para equipas',
          price: 'Desde €200/dia',
          features: ['Custom Training', 'Hands-on Workshops', 'Best Practices', 'Certification Prep'],
          technologies: ['Various Technologies', 'Training Materials', 'Practical Exercises'],
          slug: 'formacao-equipas'
        }
      ]
    }
  },
  en: {
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
          slug: 'corporate-websites'
        },
        {
          title: 'Web Applications',
          description: 'Complex web applications with advanced functionalities',
          price: 'From €1,400',
          features: ['SPA/PWA', 'API Integration', 'Real-time Updates', 'User Management'],
          technologies: ['React', 'Vue.js', 'Node.js', 'PostgreSQL'],
          slug: 'web-applications'
        },
        {
          title: 'Progressive Web Apps',
          description: 'Web apps that work like native applications',
          price: 'From €800',
          features: ['Offline Support', 'Push Notifications', 'App-like Experience', 'Fast Loading'],
          technologies: ['PWA', 'Service Workers', 'Web App Manifest'],
          slug: 'progressive-web-apps'
        }
      ]
    },
    mobile: {
      title: 'Mobile Applications',
      description: 'High-quality iOS and Android apps',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      services: [
        {
          title: 'Native Apps',
          description: 'Native iOS and Android applications with maximum performance',
          price: 'From €1,800',
          features: ['Native Performance', 'Optimized UI/UX', 'App Store Ready', 'Push Notifications'],
          technologies: ['Swift', 'Kotlin', 'iOS SDK', 'Android SDK'],
          slug: 'native-apps'
        },
        {
          title: 'Hybrid Apps',
          description: 'Cross-platform development with shared codebase',
          price: 'From €1,200',
          features: ['Cross-platform', 'Shared Codebase', 'Rapid Development', 'Native Performance'],
          technologies: ['Flutter', 'React Native', 'Dart', 'JavaScript'],
          slug: 'hybrid-apps'
        },
        {
          title: 'App Store Publishing',
          description: 'Complete management of App Store and Google Play publishing',
          price: 'From €200',
          features: ['App Store Optimization', 'Compliance Check', 'Review Management', 'Updates'],
          technologies: ['App Store Connect', 'Google Play Console'],
          slug: 'app-store-publishing'
        }
      ]
    },
    ecommerce: {
      title: 'E-commerce',
      description: 'Complete online stores and payment systems',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
      services: [
        {
          title: 'Complete Online Stores',
          description: 'Full e-commerce with product management and payments',
          price: 'From €900',
          features: ['Product Catalog', 'Shopping Cart', 'Secure Payments', 'Inventory Management'],
          technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal'],
          slug: 'online-stores'
        },
        {
          title: 'Marketplaces',
          description: 'Multi-vendor platforms with advanced management',
          price: 'From €2,500',
          features: ['Multi-vendor', 'Commission System', 'Vendor Dashboard', 'Advanced Analytics'],
          technologies: ['Custom Platform', 'Microservices', 'API Gateway'],
          slug: 'marketplaces'
        },
        {
          title: 'Payment Integrations',
          description: 'Secure and compliant payment systems',
          price: 'From €300',
          features: ['Multiple Gateways', 'MB Way', 'Multibanco', 'Security Compliance'],
          technologies: ['Stripe', 'PayPal', 'MB Way', 'SIBS'],
          slug: 'payment-integrations'
        }
      ]
    },
    cloud: {
      title: 'Cloud Solutions',
      description: 'Professional cloud infrastructure and DevOps',
      icon: Cloud,
      color: 'from-sky-500 to-blue-500',
      services: [
        {
          title: 'Cloud Migration',
          description: 'Safe and optimized cloud migration',
          price: 'From €1,000',
          features: ['Assessment', 'Migration Strategy', 'Zero Downtime', 'Cost Optimization'],
          technologies: ['AWS', 'Azure', 'Google Cloud', 'Docker'],
          slug: 'cloud-migration'
        },
        {
          title: 'DevOps & CI/CD',
          description: 'Deployment automation and infrastructure',
          price: 'From €800',
          features: ['Automated Deployment', 'Infrastructure as Code', 'Monitoring', 'Scaling'],
          technologies: ['Kubernetes', 'Docker', 'Terraform', 'Jenkins'],
          slug: 'devops-cicd'
        },
        {
          title: 'Monitoring & Backup',
          description: 'Monitoring systems and automatic backup',
          price: 'From €400',
          features: ['24/7 Monitoring', 'Automated Backups', 'Disaster Recovery', 'Performance Metrics'],
          technologies: ['Prometheus', 'Grafana', 'ELK Stack', 'AWS Backup'],
          slug: 'monitoring-backup'
        }
      ]
    },
    marketing: {
      title: 'Digital Marketing',
      description: 'Digital strategies for business growth',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      services: [
        {
          title: 'SEO & Optimization',
          description: 'Search engine optimization and performance',
          price: 'From €300/month',
          features: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Performance Optimization'],
          technologies: ['Google Analytics', 'Search Console', 'SEMrush', 'PageSpeed'],
          slug: 'seo-optimization'
        },
        {
          title: 'Google Ads & Facebook Ads',
          description: 'Advertising campaigns optimized for conversion',
          price: 'From €500/month',
          features: ['Campaign Setup', 'A/B Testing', 'Conversion Tracking', 'ROI Optimization'],
          technologies: ['Google Ads', 'Facebook Business', 'Google Tag Manager'],
          slug: 'google-facebook-ads'
        },
        {
          title: 'Social Media Management',
          description: 'Professional social media management',
          price: 'From €400/month',
          features: ['Content Creation', 'Posting Schedule', 'Community Management', 'Analytics'],
          technologies: ['Hootsuite', 'Buffer', 'Canva', 'Analytics Tools'],
          slug: 'social-media'
        }
      ]
    },
    consulting: {
      title: 'Technology Consulting',
      description: 'Specialized consulting in digital transformation',
      icon: Briefcase,
      color: 'from-violet-500 to-purple-500',
      services: [
        {
          title: 'Systems Audit',
          description: 'Complete analysis of technological infrastructure',
          price: 'From €1,500',
          features: ['Security Assessment', 'Performance Analysis', 'Architecture Review', 'Recommendations'],
          technologies: ['Security Tools', 'Performance Monitoring', 'Code Analysis'],
          slug: 'systems-audit'
        },
        {
          title: 'Digital Transformation',
          description: 'Complete business digitalization strategy',
          price: 'From €2,000',
          features: ['Digital Strategy', 'Process Automation', 'Technology Roadmap', 'Change Management'],
          technologies: ['Business Analysis', 'Process Mapping', 'Technology Assessment'],
          slug: 'digital-transformation'
        },
        {
          title: 'Team Training',
          description: 'Specialized technical training for teams',
          price: 'From €200/day',
          features: ['Custom Training', 'Hands-on Workshops', 'Best Practices', 'Certification Prep'],
          technologies: ['Various Technologies', 'Training Materials', 'Practical Exercises'],
          slug: 'team-training'
        }
      ]
    }
  }
}

export default async function ServicesPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('services')
  const services = servicesData[locale as keyof typeof servicesData] || servicesData.en

  return (
    <div className="flex flex-col">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal to-brand-orange py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {locale === 'pt' ? 'Soluções Completas' : 'Complete Solutions'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {locale === 'pt' ? 'Serviços de Tecnologia' : 'Technology Services'}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl mb-8">
                {locale === 'pt' 
                  ? 'Soluções tecnológicas completas para impulsionar o seu negócio. Desde desenvolvimento web até consultoria especializada.'
                  : 'Complete technology solutions to boost your business. From web development to specialized consulting.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>ISO 9001 {locale === 'pt' ? 'Certificado' : 'Certified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>300+ {locale === 'pt' ? 'Projetos' : 'Projects'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 {locale === 'pt' ? 'Anos de Experiência' : 'Years Experience'}</span>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          {Object.entries(services).map(([categoryKey, category], categoryIndex) => (
            <div key={categoryKey} className="mb-32 last:mb-0">
              <SectionReveal delay={categoryIndex * 0.1}>
                <div className="mb-16 text-center">
                  <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${category.color} shadow-2xl`}>
                    <category.icon className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 md:text-5xl">
                    {category.title}
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>
              </SectionReveal>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service: any, index: number) => (
                  <SectionReveal key={service.slug} delay={categoryIndex * 0.1 + index * 0.05}>
                    <Card className="group h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white">
                      <div className={`h-1 bg-gradient-to-r ${category.color}`} />
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-xl line-clamp-2 group-hover:text-brand-teal transition-colors flex-1">
                            {service.title}
                          </CardTitle>
                          <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-brand-teal/10 to-brand-orange/10 text-brand-teal border-brand-teal/20">
                            {service.price}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-3 text-base leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Features */}
                        <div>
                          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            {locale === 'pt' ? 'Funcionalidades' : 'Features'}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {service.features.map((feature: string) => (
                              <div key={feature} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            {locale === 'pt' ? 'Tecnologias' : 'Technologies'}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {service.technologies.slice(0, 3).map((tech: string) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="text-xs bg-slate-50 hover:bg-slate-100 transition-colors"
                              >
                                {tech}
                              </Badge>
                            ))}
                            {service.technologies.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-slate-50">
                                +{service.technologies.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white shadow-lg"
                        >
                          <Link href={`/${locale}/contacto?service=${service.slug}`}>
                            {locale === 'pt' ? 'Solicitar Orçamento' : 'Request Quote'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </SectionReveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 md:text-5xl">
                {locale === 'pt' ? 'Planos Mensais' : 'Monthly Plans'}
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                {locale === 'pt' 
                  ? 'Planos flexíveis para diferentes necessidades empresariais'
                  : 'Flexible plans for different business needs'}
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '€499',
                description: locale === 'pt' ? 'Perfeito para pequenas empresas' : 'Perfect for small businesses',
                features: [
                  locale === 'pt' ? 'Website + Hosting' : 'Website + Hosting',
                  locale === 'pt' ? 'Manutenção Mensal' : 'Monthly Maintenance',
                  locale === 'pt' ? 'Suporte por Email' : 'Email Support',
                  locale === 'pt' ? 'Analytics Básico' : 'Basic Analytics'
                ],
                popular: false
              },
              {
                name: 'Business',
                price: '€999',
                description: locale === 'pt' ? 'Ideal para empresas em crescimento' : 'Ideal for growing businesses',
                features: [
                  locale === 'pt' ? 'Loja Online Completa' : 'Complete Online Store',
                  locale === 'pt' ? 'Marketing Digital' : 'Digital Marketing',
                  locale === 'pt' ? 'Suporte Prioritário' : 'Priority Support',
                  locale === 'pt' ? 'Analytics Avançado' : 'Advanced Analytics'
                ],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '€2.499',
                description: locale === 'pt' ? 'Soluções completas para grandes empresas' : 'Complete solutions for large companies',
                features: [
                  locale === 'pt' ? 'Soluções Personalizadas' : 'Custom Solutions',
                  locale === 'pt' ? 'Equipa Dedicada' : 'Dedicated Team',
                  locale === 'pt' ? 'Consultoria Incluída' : 'Consulting Included',
                  locale === 'pt' ? 'Suporte 24/7' : '24/7 Support'
                ],
                popular: false
              }
            ].map((plan, index) => (
              <SectionReveal key={plan.name} delay={index * 0.1}>
                <Card className={`relative h-full ${plan.popular ? 'border-2 border-brand-orange shadow-2xl scale-105' : 'border border-white/20'} bg-white/5 backdrop-blur-sm text-white`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-brand-orange to-brand-teal text-white px-4 py-1">
                        {locale === 'pt' ? 'Mais Popular' : 'Most Popular'}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-white/60">/{locale === 'pt' ? 'mês' : 'month'}</span>
                    </div>
                    <CardDescription className="text-white/80">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <Button 
                      asChild 
                      className={`w-full mt-8 ${plan.popular 
                        ? 'bg-gradient-to-r from-brand-orange to-brand-teal hover:opacity-90' 
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <Link href={`/${locale}/contacto?plan=${plan.name.toLowerCase()}`}>
                        {locale === 'pt' ? 'Começar Agora' : 'Get Started'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                {locale === 'pt' ? 'Porquê Escolher a Tec Fazer?' : 'Why Choose Tec Fazer?'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'Combinamos experiência, tecnologia e dedicação para entregar resultados excepcionais'
                  : 'We combine experience, technology and dedication to deliver exceptional results'}
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                icon: Zap, 
                title: locale === 'pt' ? 'Entrega Rápida' : 'Fast Delivery', 
                desc: locale === 'pt' ? 'Projetos entregues no prazo com metodologia ágil' : 'Projects delivered on time with agile methodology' 
              },
              { 
                icon: Award, 
                title: locale === 'pt' ? 'ISO 9001 Certificado' : 'ISO 9001 Certified', 
                desc: locale === 'pt' ? 'Qualidade garantida e processos certificados' : 'Guaranteed quality and certified processes' 
              },
              { 
                icon: Headphones, 
                title: locale === 'pt' ? 'Suporte Dedicado' : 'Dedicated Support', 
                desc: locale === 'pt' ? 'Suporte técnico especializado 24/7' : 'Specialized technical support 24/7' 
              },
              { 
                icon: Shield, 
                title: locale === 'pt' ? 'Segurança RGPD' : 'GDPR Security', 
                desc: locale === 'pt' ? 'Conformidade total com regulamentações' : 'Full compliance with regulations' 
              },
            ].map((item, index) => (
              <SectionReveal key={index} delay={index * 0.1}>
                <div className="text-center group">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-teal to-brand-orange shadow-xl group-hover:scale-110 transition-transform">
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                {locale === 'pt'
                  ? 'Pronto para Transformar o Seu Negócio?'
                  : 'Ready to Transform Your Business?'}
              </h2>
              <p className="mb-8 text-xl text-white/80">
                {locale === 'pt'
                  ? 'Vamos criar soluções tecnológicas que impulsionam o crescimento da sua empresa'
                  : "Let's create technology solutions that drive your company's growth"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-brand-teal to-brand-orange hover:opacity-90 text-white px-8 py-6 text-lg">
                  <Link href={`/${locale}/contacto`}>
                    {locale === 'pt' ? 'Falar Connosco' : 'Contact Us'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  <Link href={`/${locale}/orcamento`}>
                    {locale === 'pt' ? 'Calcular Orçamento' : 'Calculate Budget'}
                    <Euro className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
                <span>✓ {locale === 'pt' ? 'Consulta gratuita 30min' : 'Free 30min consultation'}</span>
                <span>✓ {locale === 'pt' ? 'Resposta em 24h' : 'Response within 24h'}</span>
                <span>✓ {locale === 'pt' ? 'Orçamento sem compromisso' : 'No-obligation quote'}</span>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  )
}
