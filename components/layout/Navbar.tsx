'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const locale = pathname.split('/')[1]

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/servicos`, label: t('services') },
    { href: `/${locale}/portfolio`, label: t('portfolio') },
    { href: `/${locale}/sobre`, label: t('about') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/precos`, label: t('pricing') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm'
          : 'bg-background'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
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
              <span className="text-[10px] text-muted-foreground">
                Building The Future
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-teal',
                  isActive(link.href)
                    ? 'text-brand-teal'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 lg:flex">
            <LanguageSwitcher />
            <Button asChild variant="accent" size="sm">
              <Link href={`/${locale}/orcamento`}>{t('estimate')}</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden"
            aria-label={isOpen ? t('closeMenu') : t('openMenu')}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t lg:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block py-2 text-sm font-medium transition-colors',
                        isActive(link.href)
                          ? 'text-brand-teal'
                          : 'text-muted-foreground hover:text-brand-teal'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex items-center gap-4 pt-4">
                  <LanguageSwitcher />
                  <Button asChild variant="accent" size="sm" className="flex-1">
                    <Link href={`/${locale}/orcamento`}>{t('estimate')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
