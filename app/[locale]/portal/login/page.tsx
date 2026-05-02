'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag, MessageSquare, CreditCard, Folder } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type LoginFormData = z.infer<typeof loginSchema>

export default function PortalLoginPage({ params }: { params: { locale: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const isPt = params.locale === 'pt'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const result = await signIn('portal', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: `/${params.locale}/portal/dashboard`,
      })
      if (result?.error) {
        toast.error(isPt ? 'Email ou password incorretos' : 'Incorrect email or password')
      } else if (result?.ok) {
        // Hard navigate to avoid RSC redirect loop
        window.location.href = `/${params.locale}/portal/dashboard`
      } else {
        toast.error(isPt ? 'Erro ao fazer login. Tente novamente.' : 'Error logging in. Please try again.')
      }
    } catch {
      toast.error(isPt ? 'Erro ao fazer login. Tente novamente.' : 'Error logging in. Please try again.')
    } finally { setIsLoading(false) }
  }

  const features = [
    { icon: ShoppingBag, text: isPt ? 'Acompanhe os seus servicos' : 'Track your services' },
    { icon: Folder, text: isPt ? 'Veja o progresso dos projetos' : 'View project progress' },
    { icon: MessageSquare, text: isPt ? 'Comunique com a equipa' : 'Communicate with the team' },
    { icon: CreditCard, text: isPt ? 'Gerencie pagamentos e faturas' : 'Manage payments and invoices' },
  ]

  return (
    <div className="min-h-screen bg-[#060d1f] flex">
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
            {isPt ? 'Portal do Cliente' : 'Client Portal'}
          </h1>
          <p className="text-white/50 text-lg mb-10">
            {isPt ? 'Acompanhe os seus projetos, comunique com a equipa e gerencie os seus servicos.' : 'Track your projects, communicate with the team and manage your services.'}
          </p>
          <div className="space-y-4">
            {features.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <f.icon className="h-4 w-4 text-[#1B7A8A]" />
                </div>
                <span className="text-white/70 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Tec Fazer. {isPt ? 'Todos os direitos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f0f2f5]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href={`/${params.locale}`} className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-sm shadow-lg">TF</div>
              <span className="font-black text-slate-900 text-lg">Tec Fazer</span>
            </Link>
          </div>

          <div className="rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-[#1B7A8A] to-[#F5A623]" />
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                {isPt ? 'Entrar na sua conta' : 'Sign in to your account'}
              </h2>
              <p className="text-slate-500 text-sm mb-7">
                {isPt ? 'Aceda ao seu painel de cliente.' : 'Access your client dashboard.'}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('email')} type="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder={isPt ? 'o-seu-email@exemplo.com' : 'your-email@example.com'} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{isPt ? 'Email invalido' : 'Invalid email'}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('password')} type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{isPt ? 'Password muito curta' : 'Password too short'}</p>}
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] py-3.5 text-sm font-black text-white shadow-lg hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 transition-all">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {isLoading ? (isPt ? 'A entrar...' : 'Signing in...') : (isPt ? 'Entrar' : 'Sign In')}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  {isPt ? 'Nao tem conta? ' : "Don't have an account? "}
                  <Link href={`/${params.locale}/contacto`} className="font-bold text-[#1B7A8A] hover:underline">
                    {isPt ? 'Compre um servico' : 'Purchase a service'}
                  </Link>
                  {isPt ? ' para obter acesso.' : ' to get access.'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link href={`/${params.locale}`} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              ← {isPt ? 'Voltar ao site' : 'Back to website'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
