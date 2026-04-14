'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Replace the locale in the pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1 rounded-md border p-1">
      <button
        onClick={() => switchLocale('pt')}
        className={cn(
          'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
          locale === 'pt'
            ? 'bg-brand-teal text-white'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Globe className="h-3 w-3" />
        PT
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
          locale === 'en'
            ? 'bg-brand-teal text-white'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Globe className="h-3 w-3" />
        EN
      </button>
    </div>
  )
}
