import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Tec Fazer — Desenvolvimento Web e Tecnologia em Portugal',
  description: 'Empresa de tecnologia em Mafra Lisboa especializada em desenvolvimento web, mobile, cloud e marketing digital.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
