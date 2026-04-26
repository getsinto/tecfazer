'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function PortalLoginPage({ params }: { params: { locale: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isPt = params.locale === 'pt'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const result = await signIn('portal', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(
          isPt 
            ? 'Email ou password incorretos' 
            : 'Incorrect email or password'
        )
      } else {
        router.push(`/${params.locale}/portal/dashboard`)
      }
    } catch (error) {
      toast.error(
        isPt 
          ? 'Erro ao fazer login. Tente novamente.' 
          : 'Error logging in. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal/10 to-brand-orange/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${params.locale}`} className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-teal to-brand-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">
              TF
            </div>
            <span className="font-bold text-2xl">Tec Fazer</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isPt ? 'Portal do Cliente' : 'Client Portal'}
          </h1>
          <p className="text-gray-600">
            {isPt ? 'Aceda à sua conta' : 'Access your account'}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {isPt ? 'Email' : 'Email'}
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                placeholder={isPt ? 'seu@email.com' : 'your@email.com'}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {isPt ? 'Password' : 'Password'}
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-teal focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-brand-teal to-brand-orange text-white font-bold rounded-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isPt ? 'Entrando...' : 'Logging in...'}
                </>
              ) : (
                isPt ? 'Entrar' : 'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {isPt ? 'Não tem conta? ' : "Don't have an account? "}
              <Link href={`/${params.locale}/contacto`} className="text-brand-teal hover:underline font-medium">
                {isPt ? 'Contacte-nos' : 'Contact us'}
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href={`/${params.locale}`} className="text-gray-600 hover:text-brand-teal transition-colors">
            ← {isPt ? 'Voltar ao site' : 'Back to website'}
          </Link>
        </div>
      </div>
    </div>
  )
}
