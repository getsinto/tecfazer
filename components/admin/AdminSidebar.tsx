'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Mail,
  ShoppingCart,
  MessageSquare,
  Star,
  FileText,
  Briefcase,
  UserCircle,
  DollarSign,
  Settings,
  LogOut,
  ChevronDown,
  Code,
  FolderOpen,
  Newspaper,
  UsersRound,
  MessageCircle,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Overview', 'Business', 'Content'])

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    )
  }

  const navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Business',
      items: [
        { title: 'Leads', href: '/admin/leads', icon: Mail },
        { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { title: 'Clients', href: '/admin/clients', icon: Users },
        { title: 'Tickets', href: '/admin/tickets', icon: MessageSquare },
        { title: 'Reviews', href: '/admin/reviews', icon: Star },
      ],
    },
    {
      title: 'Content',
      items: [
        { title: 'Services', href: '/admin/content/services', icon: Code },
        { title: 'Projects', href: '/admin/content/projects', icon: FolderOpen },
        { title: 'Blog', href: '/admin/content/blog', icon: Newspaper },
        { title: 'Team', href: '/admin/content/team', icon: UsersRound },
        { title: 'Testimonials', href: '/admin/content/testimonials', icon: MessageCircle },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Pricing', href: '/admin/pricing', icon: DollarSign },
        { title: 'Site Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange opacity-20 blur" />
          <div className="relative flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange">
            <span className="text-sm font-bold text-white">TF</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-none">
            <span className="text-brand-teal">Tec</span>{' '}
            <span className="text-brand-orange">Fazer</span>
          </span>
          <span className="text-[10px] text-muted-foreground">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {navGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.title)

            return (
              <div key={group.title}>
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="mb-2 flex w-full items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  {group.title}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            active
                              ? 'bg-brand-teal text-white'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.title}
                          {item.badge !== undefined && (
                            <span className="ml-auto rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
