import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { getDbClient } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'
import { Linkedin, Github, Target, Eye, Heart, Award, Users, Zap, Shield, TrendingUp, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return buildMetadata({
    locale,
    titlePt: 'Sobre Nós',
    titleEn: 'About Us',
    descPt: 'Conheça a história, missão e equipa da Tec Fazer. Transformamos ideias em soluções tecnológicas desde 2019.',
    descEn: 'Learn about Tec Fazer\'s story, mission and team. We\'ve been transforming ideas into technology solutions since 2019.',
    path: `/${locale}/sobre`,
  })
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const t = await getTranslations('about')

  // Fetch team members (with graceful fallback)
  let teamMembers: any[] = []
  try {
    const db = getDbClient()
    teamMembers = await db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database not available:', error)
  }

  return (
    <div className="flex flex-col">
      {/* Premium Hero Section with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal/90 to-brand-orange/80 py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                {locale === 'pt' ? 'Inovação desde 2019' : 'Innovation since 2019'}
              </div>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                {t('heroTitle')}
              </h1>
              <p className="text-xl text-white/90 md:text-2xl">
                {t('heroSubtitle')}
              </p>
              
              {/* Stats Bar */}
              <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">150+</div>
                  <div className="text-sm text-white/80">
                    {locale === 'pt' ? 'Projetos' : 'Projects'}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/80">
                    {locale === 'pt' ? 'Satisfação' : 'Satisfaction'}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">5+</div>
                  <div className="text-sm text-white/80">
                    {locale === 'pt' ? 'Anos' : 'Years'}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/80">
                    {locale === 'pt' ? 'Suporte' : 'Support'}
                  </div>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
            <SectionReveal>
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-brand-teal/20 to-brand-orange/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">🚀</div>
                    <div className="text-2xl font-bold text-brand-teal">Tec Fazer</div>
                  </div>
                </div>
              </div>
            </SectionReveal>
            
            <SectionReveal delay={0.2}>
              <div>
                <div className="mb-4 inline-block rounded-full bg-brand-teal/10 px-4 py-1 text-sm font-semibold text-brand-teal">
                  {locale === 'pt' ? 'A Nossa História' : 'Our Story'}
                </div>
                <h2 className="mb-6 text-4xl font-bold">{t('storyTitle')}</h2>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  {t('storyText')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-brand-teal">
                    <Award className="h-5 w-5" />
                    <span className="font-medium">{locale === 'pt' ? 'Certificados' : 'Certified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-teal">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">{locale === 'pt' ? 'Seguro' : 'Secure'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-teal">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-medium">{locale === 'pt' ? 'Em Crescimento' : 'Growing'}</span>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values - Premium Cards */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                {locale === 'pt' ? 'O Que Nos Move' : 'What Drives Us'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'Os nossos valores fundamentais que guiam cada decisão e projeto'
                  : 'Our core values that guide every decision and project'}
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-3">
            <SectionReveal delay={0.1}>
              <Card className="group relative h-full overflow-hidden border-0 bg-gradient-to-br from-brand-teal to-brand-teal/80 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
                <CardContent className="relative pt-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Target className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{t('missionTitle')}</h3>
                  <p className="leading-relaxed text-white/90">{t('missionText')}</p>
                </CardContent>
              </Card>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <Card className="group relative h-full overflow-hidden border-0 bg-gradient-to-br from-brand-orange to-brand-orange/80 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
                <CardContent className="relative pt-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Eye className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{t('visionTitle')}</h3>
                  <p className="leading-relaxed text-white/90">{t('visionText')}</p>
                </CardContent>
              </Card>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <Card className="group relative h-full overflow-hidden border-0 bg-gradient-to-br from-slate-800 to-slate-700 text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
                <CardContent className="relative pt-8">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{t('valuesTitle')}</h3>
                  <ul className="space-y-3 leading-relaxed text-white/90">
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {locale === 'pt' ? 'Excelência' : 'Excellence'}
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {locale === 'pt' ? 'Inovação' : 'Innovation'}
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {locale === 'pt' ? 'Transparência' : 'Transparency'}
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      {locale === 'pt' ? 'Compromisso' : 'Commitment'}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Team Section - Premium Design */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
                <Users className="h-4 w-4" />
                {locale === 'pt' ? 'Conheça a Equipa' : 'Meet the Team'}
              </div>
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">{t('teamTitle')}</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t('teamSubtitle')}
              </p>
            </div>
          </SectionReveal>

          {teamMembers.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <SectionReveal key={member.id} delay={index * 0.1}>
                  <Card className="group h-full overflow-hidden border-0 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-teal/20 to-brand-orange/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
                          <Image
                            src={member.photo || '/images/placeholder-avatar.png'}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4 text-center">
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-sm font-medium text-brand-teal">
                          {locale === 'pt' ? member.rolePt : member.roleEn}
                        </p>
                      </div>
                      <p className="mb-4 text-center text-sm text-muted-foreground line-clamp-3">
                        {locale === 'pt' ? member.bioPt : member.bioEn}
                      </p>
                      <div className="mb-4 flex flex-wrap justify-center gap-2">
                        {member.skills.slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className="rounded-full bg-brand-teal/10 px-3 py-1 text-xs font-medium text-brand-teal"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            +{member.skills.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-center gap-2">
                        {member.linkedIn && (
                          <a
                            href={member.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal transition-all hover:bg-brand-teal hover:text-white"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.github && (
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-slate-800 hover:text-white"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </SectionReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-12 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-lg text-muted-foreground">
                {locale === 'pt' 
                  ? 'A nossa equipa estará disponível em breve'
                  : 'Our team will be available soon'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Milestones Timeline - Premium Design */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-24 text-white">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                {locale === 'pt' ? 'A Nossa Jornada' : 'Our Journey'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-white/80">
                {locale === 'pt' 
                  ? 'Marcos importantes que definiram o nosso crescimento'
                  : 'Key milestones that defined our growth'}
              </p>
            </div>
          </SectionReveal>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {t.raw('milestones').map((milestone: any, index: number) => (
                <SectionReveal key={milestone.year} delay={index * 0.1}>
                  <div className="flex gap-8">
                    <div className="flex flex-col items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-teal to-brand-orange text-xl font-bold shadow-lg">
                        {milestone.year.slice(-2)}
                      </div>
                      {index < t.raw('milestones').length - 1 && (
                        <div className="mt-4 h-full w-1 bg-gradient-to-b from-brand-teal/50 to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 pb-12">
                      <div className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                        {milestone.year}
                      </div>
                      <h3 className="mb-3 text-2xl font-bold">{milestone.title}</h3>
                      <p className="text-lg leading-relaxed text-white/80">{milestone.desc}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
