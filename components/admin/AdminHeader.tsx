'use client'

import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [notificationCount] = useState(3)

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          )}
        </Button>

        {/* User info */}
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal to-brand-orange text-sm font-bold text-white">
            {user.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
