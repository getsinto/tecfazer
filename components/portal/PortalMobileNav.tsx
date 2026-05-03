'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, Home, FileText, Folder, MessageSquare, CreditCard, User, ShoppingBag, Bell } from 'lucide-react'

// Use icon name strings instead of component references
// (React components cannot be passed from Server to Client components)
const ICON_MAP: Record<string, React.ElementType> = {
  Home, FileText, Folder, MessageSquare, CreditCard, User, ShoppingBag, Bell,
}

interface NavItem {
  name: string
  href: string
  iconName: string
}

interface Props {
  navigation: NavItem[]
  userInitial: string
  userName: string
  userEmail: string
  locale: string
  isPt: boolean
}

export default function PortalMobileNav({ navigation, userInitial, userName, userEmail, isPt }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-[#0a0f1e] border-b border-white/10 px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-xs shadow-lg">
            TF
          </div>
          <span className="font-black text-white text-sm">Tec Fazer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-xs shadow-md">
            {userInitial}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0a0f1e] shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-sm shadow-md">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">{userName}</p>
              <p className="text-xs text-white/40 truncate">{userEmail}</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = ICON_MAP[item.iconName] || Home
            return (
              <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all text-sm font-medium">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <Link href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span>{isPt ? 'Sair' : 'Logout'}</span>
          </Link>
        </div>
      </div>
    </>
  )
}
