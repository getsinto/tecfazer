'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
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
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            TF
          </div>
          <span className="font-bold text-lg">Tec Fazer</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {userInitial}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl transition-transform duration-300 lg:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] rounded-full flex items-center justify-center text-white font-bold">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>{isPt ? 'Sair' : 'Logout'}</span>
          </Link>
        </div>
      </div>
    </>
  )
}
