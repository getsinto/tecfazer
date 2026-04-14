import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { Decimal } from '@prisma/client/runtime/library'
import crypto from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatCurrency(amount: number | Decimal, currency: string = 'EUR'): string {
  const numAmount = typeof amount === 'number' ? amount : Number(amount)
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
  }).format(numAmount)
}

export function formatDate(date: Date | string, locale: string = 'pt'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'PPP', { locale: locale === 'pt' ? undefined : undefined })
}

export function calculateReadingTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.ceil(words / 200)
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + '...'
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
