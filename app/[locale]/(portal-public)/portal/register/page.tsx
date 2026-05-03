'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Building2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  phone: z.string().optional(),
  company: z.string().optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function PortalRegisterPage({ params }: { params: { locale: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const isPt = params.locale === 'pt'

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Register
      const res = await fetch('/api/portal/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          company: data.company,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          toast.error(isPt ? 'Este email ja esta registado.' : 'This email is already registered.')
        } else {
          toast.error(isPt ? 'Erro ao criar conta.' : 'Error creating account.')
        }
        return
      }

      // Auto login after registration
      const loginResult = await signIn('portal', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (loginResult?.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = `/${params.locale}/portal/dashboard`
        }, 1500)
      } else {
        // Registration worked but auto-login failed — redirect to login
        toast.success(isPt ? 'Conta criada! Faca login.' : 'Account created! Please log in.')
        window.location.href = `/${params.locale}/portal/login`
      }
    } catch {
      toast.error(isPt ? 'Erro ao criar conta.' : 'Error creating account.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0f2f5]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {isPt ? 'Conta criada!' : 'Account created!'}
          </h2>
          <p className="text-slate-500">{isPt ? 'A redirecionar...' : 'Redirecting...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#060d1f]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#1B7A8A]/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#F5A623]/15 blur-[80px]" />
        <div className="relative">
          <Link href={`/${params.locale}`} className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-sm shadow-lg">TF</div>
            <span className="font-black text-white text-lg">Tec Fazer</span>
          </Link>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            {isPt ? 'Crie a sua conta' : 'Create your account'}
          </h1>
          <p className="text-white/50 text-lg mb-8">
            {isPt
              ? 'Registe-se para acompanhar os seus projetos, comunicar com a equipa e gerir os seus servicos.'
              : 'Register to track your projects, communicate with the team and manage your services.'}
          </p>
          <div className="space-y-3">
            {[
              isPt ? 'Acesso imediato apos registo' : 'Immediate access after registration',
              isPt ? 'Acompanhe todos os seus pedidos' : 'Track all your orders',
              isPt ? 'Comunicacao direta com a equipa' : 'Direct communication with the team',
              isPt ? 'Historico de pagamentos e faturas' : 'Payment history and invoices',
            ].map(t => (
              <div key={t} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#1B7A8A] flex-shrink-0" />
                <span className="text-white/70 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/20 text-xs">&copy; {new Date().getFullYear()} Tec Fazer.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f0f2f5] overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <div className="lg:hidden text-center mb-6">
            <Link href={`/${params.locale}`} className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-sm shadow-lg">TF</div>
              <span className="font-black text-slate-900 text-lg">Tec Fazer</span>
            </Link>
          </div>

          <div className="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623]" />
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                {isPt ? 'Criar conta gratuita' : 'Create free account'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                {isPt ? 'Preencha os seus dados para comecar.' : 'Fill in your details to get started.'}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    {isPt ? 'Nome Completo *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('name')} type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder={isPt ? 'O seu nome completo' : 'Your full name'} />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{isPt ? 'Nome obrigatorio (min. 2 caracteres)' : 'Name required (min. 2 chars)'}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('email')} type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder="email@exemplo.com" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{isPt ? 'Email invalido' : 'Invalid email'}</p>}
                </div>

                {/* Phone + Company */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      {isPt ? 'Telefone' : 'Phone'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input {...register('phone')} type="tel"
                        className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                        placeholder="+351 9XX..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      {isPt ? 'Empresa' : 'Company'}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input {...register('company')} type="text"
                        className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                        placeholder={isPt ? 'Opcional' : 'Optional'} />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    {isPt ? 'Password *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('password')} type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder={isPt ? 'Minimo 8 caracteres' : 'Minimum 8 characters'} />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{isPt ? 'Minimo 8 caracteres' : 'Minimum 8 characters'}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    {isPt ? 'Confirmar Password *' : 'Confirm Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('confirmPassword')} type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder="••••••••" />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{isPt ? 'Passwords nao coincidem' : 'Passwords do not match'}</p>}
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] py-3.5 text-sm font-black text-white shadow-lg hover:shadow-xl disabled:opacity-60 transition-all mt-2">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {isLoading ? (isPt ? 'A criar conta...' : 'Creating account...') : (isPt ? 'Criar Conta' : 'Create Account')}
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  {isPt ? 'Ja tem conta? ' : 'Already have an account? '}
                  <Link href={`/${params.locale}/portal/login`} className="font-bold text-[#1B7A8A] hover:underline">
                    {isPt ? 'Entrar' : 'Sign In'}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link href={`/${params.locale}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              {isPt ? 'Voltar ao site' : 'Back to website'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
