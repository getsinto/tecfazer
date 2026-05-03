import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CookieConsent from '@/components/layout/CookieConsent'
import ChatWidget from '@/components/chat/ChatWidget'

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages = {}
  try {
    messages = await getMessages()
  } catch {
    // fallback to empty messages
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
      <CookieConsent />
      <ChatWidget />
      <Toaster position="top-right" />
    </NextIntlClientProvider>
  )
}
