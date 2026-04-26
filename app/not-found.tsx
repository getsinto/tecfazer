'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft, Compass, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function GlobalNotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-brand-teal to-brand-orange">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-brand-orange/20 blur-3xl delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Floating Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <Compass className="h-4 w-4" />
            Página Não Encontrada
          </div>

          {/* 404 Number with Gradient */}
          <div className="relative mb-8">
            <h1 className="text-[12rem] font-black leading-none text-white/10 md:text-[16rem]">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <Sparkles className="h-16 w-16 animate-pulse text-brand-orange md:h-20 md:w-20" />
                <span className="text-6xl font-black text-white md:text-8xl">404</span>
                <Sparkles className="h-16 w-16 animate-pulse text-brand-teal md:h-20 md:w-20" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            Oops! Página Perdida no Espaço
          </h2>

          {/* Description */}
          <p className="mb-12 text-lg text-white/80 md:text-xl">
            A página que procura não existe ou foi movida para outra dimensão.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              asChild 
              size="lg" 
              className="group bg-white text-brand-teal hover:bg-white/90 hover:shadow-2xl"
            >
              <Link href="/pt">
                <Home className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="group border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/pt/contacto">
                <Search className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Contactar Suporte
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-16 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
            <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-white/60">
              Links Úteis
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <Link 
                href="/pt/servicos"
                className="group flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10 hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Serviços</span>
              </Link>
              
              <Link 
                href="/pt/portfolio"
                className="group flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10 hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Portfolio</span>
              </Link>
              
              <Link 
                href="/pt/blog"
                className="group flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10 hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Blog</span>
              </Link>
              
              <Link 
                href="/pt/sobre"
                className="group flex items-center gap-2 rounded-lg bg-white/5 px-4 py-3 text-white transition-all hover:bg-white/10 hover:shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Sobre</span>
              </Link>
            </div>
          </div>

          {/* Fun Message */}
          <p className="mt-8 text-sm text-white/60">
            💡 Dica: Verifique se o URL está correto ou use a pesquisa acima
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[20%] h-2 w-2 animate-ping rounded-full bg-white/40" />
        <div className="absolute right-[15%] top-[40%] h-2 w-2 animate-ping rounded-full bg-white/40 delay-300" />
        <div className="absolute left-[20%] bottom-[30%] h-2 w-2 animate-ping rounded-full bg-white/40 delay-700" />
        <div className="absolute right-[25%] bottom-[20%] h-2 w-2 animate-ping rounded-full bg-white/40 delay-1000" />
      </div>
    </div>
  )
}
