import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/layout/CookieConsent'
import ChatWidget from '@/components/chat/ChatWidget'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
          <CookieConsent />
          <ChatWidget />
          <Toaster position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
