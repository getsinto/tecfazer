import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { db } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import SectionReveal from '@/components/ui/SectionReveal'
import { Linkedin, Github, Target, Eye, Heart } from 'lucide-react'
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
    teamMembers = await db.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
  } catch (error) {
    console.error('Database not available:', error)
    // Return empty state - will show "no team members" message
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-brand-teal/5 py-20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {t('heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                {t('heroSubtitle')}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <SectionReveal>
              <h2 className="mb-6 text-3xl font-bold">{t('storyTitle')}</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('storyText')}
              </p>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <SectionReveal delay={0.1}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{t('missionTitle')}</h3>
                  <p className="text-muted-foreground">{t('missionText')}</p>
                </CardContent>
              </Card>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{t('visionTitle')}</h3>
                  <p className="text-muted-foreground">{t('visionText')}</p>
                </CardContent>
              </Card>
            </SectionReveal>

            <SectionReveal delay={0.3}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{t('valuesTitle')}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• {locale === 'pt' ? 'Excelência' : 'Excellence'}</li>
                    <li>• {locale === 'pt' ? 'Inovação' : 'Innovation'}</li>
                    <li>• {locale === 'pt' ? 'Transparência' : 'Transparency'}</li>
                    <li>• {locale === 'pt' ? 'Compromisso' : 'Commitment'}</li>
                  </ul>
                </CardContent>
              </Card>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('teamTitle')}</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {t('teamSubtitle')}
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <SectionReveal key={member.id} delay={index * 0.1}>
                <Card className="group overflow-hidden transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full">
                        <Image
                          src={member.photo || '/images/placeholder-avatar.png'}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'pt' ? member.rolePt : member.roleEn}
                        </p>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                      {locale === 'pt' ? member.bioPt : member.bioEn}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {member.skills.slice(0, 3).map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-full bg-brand-teal/10 px-2 py-1 text-xs font-medium text-brand-teal"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {member.linkedIn && (
                        <a
                          href={member.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:border-brand-teal hover:text-brand-teal"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:border-brand-teal hover:text-brand-teal"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {locale === 'pt' ? 'A Nossa Jornada' : 'Our Journey'}
              </h2>
            </div>
          </SectionReveal>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              {t.raw('milestones').map((milestone: any, index: number) => (
                <SectionReveal key={milestone.year} delay={index * 0.1}>
                  <div className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal text-white font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      {index < t.raw('milestones').length - 1 && (
                        <div className="mt-2 h-full w-0.5 bg-brand-teal/20" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="text-sm font-medium text-brand-teal">
                        {milestone.year}
                      </div>
                      <h3 className="mb-2 text-lg font-bold">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.desc}</p>
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
