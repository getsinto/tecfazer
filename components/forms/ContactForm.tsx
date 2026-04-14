'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { contactSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { z } from 'zod'

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const t = useTranslations('contact')
  const tErrors = useTranslations('errors')
  const tSuccess = useTranslations('success')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success(tSuccess('contactSent'))
      reset()
    } catch (error) {
      toast.error(t('errorMsg'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t('nameLabel')}</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="João Silva"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('emailLabel')}</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="joao@example.com"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{t('phoneLabel')}</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+351 963 101 123"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">{t('companyLabel')}</Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Empresa Lda"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="serviceInterest">{t('serviceLabel')}</Label>
          <Select
            onValueChange={(value) => setValue('serviceInterest', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="website">Website Development</SelectItem>
              <SelectItem value="webapp">Web Application</SelectItem>
              <SelectItem value="mobile">Mobile App</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="cloud">Cloud Solutions</SelectItem>
              <SelectItem value="design">UI/UX Design</SelectItem>
              <SelectItem value="marketing">Digital Marketing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budgetRange">{t('budgetLabel')}</Label>
          <Select
            onValueChange={(value) => setValue('budgetRange', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um orçamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<5k">&lt; €5,000</SelectItem>
              <SelectItem value="5k-10k">€5,000 - €10,000</SelectItem>
              <SelectItem value="10k-25k">€10,000 - €25,000</SelectItem>
              <SelectItem value="25k-50k">€25,000 - €50,000</SelectItem>
              <SelectItem value=">50k">&gt; €50,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t('messageLabel')}</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Descreva o seu projeto..."
          rows={6}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          t('submitBtn')
        )}
      </Button>
    </form>
  )
}
