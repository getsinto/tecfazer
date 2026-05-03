import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import SessionProvider from '@/components/providers/SessionProvider'
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
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-N7M3QCZZZK'

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
