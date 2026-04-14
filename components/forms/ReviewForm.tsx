'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Star, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

const reviewSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  clientCompany: z.string().optional(),
  clientCountry: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
  projectType: z.string().optional(),
  serviceUsed: z.string().optional(),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  locale: string
  token?: string
}

export default function ReviewForm({ locale, token }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  })

  const handleRatingClick = (value: number) => {
    setRating(value)
    setValue('rating', value, { shouldValidate: true })
  }

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error(locale === 'pt' ? 'Por favor, selecione uma classificação' : 'Please select a rating')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          rating,
          verificationToken: token,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setIsSuccess(true)
      toast.success(
        locale === 'pt' 
          ? 'Obrigado pela sua avaliação! Será revista em breve.' 
          : 'Thank you for your review! It will be reviewed soon.'
      )
    } catch (error) {
      toast.error(
        locale === 'pt' 
          ? 'Erro ao enviar avaliação. Tente novamente.' 
          : 'Error submitting review. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">
          {locale === 'pt' ? 'Obrigado!' : 'Thank You!'}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {locale === 'pt' 
            ? 'A sua avaliação foi recebida e será publicada após revisão.'
            : 'Your review has been received and will be published after review.'}
        </p>
        <a
          href={`/${locale}/portfolio`}
          className="inline-block px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all"
        >
          {locale === 'pt' ? 'Ver Portfolio' : 'View Portfolio'}
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-3">
            {locale === 'pt' ? 'Classificação *' : 'Rating *'}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    value <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {locale === 'pt' ? 'Nome *' : 'Name *'}
          </label>
          <input
            {...register('clientName')}
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
            placeholder={locale === 'pt' ? 'O seu nome' : 'Your name'}
          />
          {errors.clientName && (
            <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {locale === 'pt' ? 'Email *' : 'Email *'}
          </label>
          <input
            {...register('clientEmail')}
            type="email"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
            placeholder={locale === 'pt' ? 'seu@email.com' : 'your@email.com'}
          />
          {errors.clientEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>
          )}
        </div>

        {/* Company and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {locale === 'pt' ? 'Empresa' : 'Company'}
            </label>
            <input
              {...register('clientCompany')}
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
              placeholder={locale === 'pt' ? 'Nome da empresa' : 'Company name'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {locale === 'pt' ? 'País' : 'Country'}
            </label>
            <input
              {...register('clientCountry')}
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
              placeholder={locale === 'pt' ? 'Portugal' : 'Portugal'}
            />
          </div>
        </div>

        {/* Project Type and Service */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              {locale === 'pt' ? 'Tipo de Projeto' : 'Project Type'}
            </label>
            <select
              {...register('projectType')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
            >
              <option value="">
                {locale === 'pt' ? 'Selecione...' : 'Select...'}
              </option>
              <option value="website">
                {locale === 'pt' ? 'Website' : 'Website'}
              </option>
              <option value="ecommerce">
                {locale === 'pt' ? 'E-commerce' : 'E-commerce'}
              </option>
              <option value="web-app">
                {locale === 'pt' ? 'Aplicação Web' : 'Web App'}
              </option>
              <option value="mobile-app">
                {locale === 'pt' ? 'App Móvel' : 'Mobile App'}
              </option>
              <option value="custom">
                {locale === 'pt' ? 'Software Personalizado' : 'Custom Software'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {locale === 'pt' ? 'Serviço Utilizado' : 'Service Used'}
            </label>
            <input
              {...register('serviceUsed')}
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
              placeholder={locale === 'pt' ? 'Ex: Desenvolvimento Web' : 'Ex: Web Development'}
            />
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {locale === 'pt' ? 'A Sua Avaliação *' : 'Your Review *'}
          </label>
          <textarea
            {...register('reviewText')}
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none resize-none"
            placeholder={
              locale === 'pt'
                ? 'Partilhe a sua experiência connosco...'
                : 'Share your experience with us...'
            }
          />
          {errors.reviewText && (
            <p className="text-red-500 text-sm mt-1">{errors.reviewText.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {locale === 'pt' ? 'Enviando...' : 'Sending...'}
            </>
          ) : (
            <>
              {locale === 'pt' ? 'Enviar Avaliação' : 'Submit Review'}
              <Check className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          {locale === 'pt' 
            ? 'A sua avaliação será revista antes de ser publicada.'
            : 'Your review will be reviewed before being published.'}
        </p>
      </form>
    </div>
  )
}
