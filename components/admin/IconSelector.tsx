'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Code,
  Smartphone,
  Cloud,
  Palette,
  TrendingUp,
  Database,
  Shield,
  Zap,
  Headphones,
  Globe,
  Mail,
  MessageSquare,
  ShoppingCart,
  Users,
  Settings,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const icons = [
  { name: 'Code', icon: Code },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Cloud', icon: Cloud },
  { name: 'Palette', icon: Palette },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Database', icon: Database },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Headphones', icon: Headphones },
  { name: 'Globe', icon: Globe },
  { name: 'Mail', icon: Mail },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Users', icon: Users },
  { name: 'Settings', icon: Settings },
]

interface IconSelectorProps {
  value: string
  onChange: (icon: string) => void
  disabled?: boolean
}

export default function IconSelector({
  value,
  onChange,
  disabled,
}: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedIcon = icons.find((i) => i.name === value)
  const SelectedIconComponent = selectedIcon?.icon || Code

  const filteredIcons = icons.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (iconName: string) => {
    onChange(iconName)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={disabled}
        >
          <SelectedIconComponent className="mr-2 h-4 w-4" />
          {value || 'Select icon'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid max-h-[400px] grid-cols-4 gap-2 overflow-y-auto">
            {filteredIcons.map((icon) => {
              const IconComponent = icon.icon
              const isSelected = value === icon.name

              return (
                <button
                  key={icon.name}
                  type="button"
                  onClick={() => handleSelect(icon.name)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent',
                    isSelected && 'border-brand-teal bg-brand-teal/10'
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs">{icon.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
