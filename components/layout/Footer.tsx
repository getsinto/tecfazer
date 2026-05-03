'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Facebook, Github, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface FooterProps {
  locale: string
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  const companyLinks = [
    { href: `/${locale}/sobre`, label: tNav('about') },
    { href: `/${locale}/portfolio`, label: tNav('portfolio') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/contacto`, label: tNav('contact') },
  ]

  const serviceLinks = [
    { href: `/${locale}/servicos`, label: tNav('services') },
    { href: `/${locale}/precos`, label: tNav('pricing') },
    { href: `/${locale}/orcamento`, label: tNav('estimate') },
    { href: `/${locale}/portal`, label: tNav('portal') },
  ]

  const legalLinks = [
    { href: `/${locale}/privacidade`, label: t('privacy') },
    { href: `/${locale}/termos`, label: t('terms') },
    { href: `/${locale}/reembolso`, label: locale === 'pt' ? 'Reembolso' : 'Refunds' },
  ]

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/company/tecfazer', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/tecfazer', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/tecfazer', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/tecfazer', label: 'Facebook' },
  ]

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange opacity-20 blur" />
                <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange">
                  <span className="text-lg font-bold text-white">TF</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">
                  <span className="text-brand-teal">Tec</span>{' '}
                  <span className="text-brand-orange">Fazer</span>
                </span>
                <span className="text-xs text-muted-foreground">{t('tagline')}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {locale === 'pt'
                ? 'Transformamos ideias em soluções tecnológicas inovadoras.'
                : 'We transform ideas into innovative technology solutions.'}
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Mafra, Lisboa, Portugal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+351963101123" className="hover:text-brand-teal">
                  963 101 123
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:geral@tecfazer.pt" className="hover:text-brand-teal">
                  geral@tecfazer.pt
                </a>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:border-brand-teal hover:text-brand-teal"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('companyCol')}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('servicesCol')}</h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">{t('legalCol')}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand-teal"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tec Fazer. {t('allRights')}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ in Portugal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
