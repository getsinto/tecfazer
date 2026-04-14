'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const t = useTranslations('cookie')
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    functional: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem('tec-fazer-consent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const saveConsent = (prefs: typeof preferences) => {
    localStorage.setItem('tec-fazer-consent', JSON.stringify(prefs))
    setShowBanner(false)
    setShowPreferences(false)

    // Dispatch event for analytics initialization
    if (prefs.analytics) {
      window.dispatchEvent(new Event('analytics-consent-granted'))
    }
  }

  const acceptAll = () => {
    saveConsent({ functional: true, analytics: true, marketing: true })
  }

  const rejectAll = () => {
    saveConsent({ functional: true, analytics: false, marketing: false })
  }

  const savePreferences = () => {
    saveConsent(preferences)
  }

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4 shadow-lg"
          >
            <div className="container mx-auto">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    {t('message')}{' '}
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="font-medium text-brand-teal hover:underline"
                    >
                      {t('learnMore')}
                    </button>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreferences(true)}
                  >
                    {t('manageBtn')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={rejectAll}>
                    {t('rejectAll')}
                  </Button>
                  <Button variant="default" size="sm" onClick={acceptAll}>
                    {t('acceptAll')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Dialog */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('manageBtn')}</DialogTitle>
            <DialogDescription>{t('message')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Functional Cookies (Always On) */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm font-medium">{t('functionalLabel')}</Label>
                <p className="text-xs text-muted-foreground">
                  {t('functionalLabel')} - Always enabled
                </p>
              </div>
              <div className="flex h-6 w-11 items-center rounded-full bg-brand-teal">
                <div className="h-5 w-5 translate-x-5 rounded-full bg-white shadow-sm transition-transform" />
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm font-medium">{t('analyticsLabel')}</Label>
                <p className="text-xs text-muted-foreground">
                  Help us improve our website
                </p>
              </div>
              <button
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))
                }
                className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.analytics ? 'bg-brand-teal' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label className="text-sm font-medium">{t('marketingLabel')}</Label>
                <p className="text-xs text-muted-foreground">
                  Personalized content and ads
                </p>
              </div>
              <button
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))
                }
                className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.marketing ? 'bg-brand-teal' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={rejectAll} className="flex-1">
              {t('rejectAll')}
            </Button>
            <Button onClick={savePreferences} className="flex-1">
              {t('savePreferences')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
