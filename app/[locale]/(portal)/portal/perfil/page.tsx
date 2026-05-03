'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, Building2, MapPin, Save, Loader2, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function PortalProfilePage({ params }: { params: { locale: string } }) {
  const { data: session } = useSession()
  const isPt = params.locale === 'pt'

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: isPt ? 'Portugal' : 'Portugal',
    nif: '',
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    toast.success(isPt ? 'Perfil atualizado com sucesso!' : 'Profile updated successfully!')
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePasswordChange = async () => {
    if (!passwords.current) { toast.error(isPt ? 'Introduza a password atual' : 'Enter current password'); return }
    if (passwords.new.length < 8) { toast.error(isPt ? 'Nova password deve ter pelo menos 8 caracteres' : 'New password must be at least 8 characters'); return }
    if (passwords.new !== passwords.confirm) { toast.error(isPt ? 'Passwords nao coincidem' : 'Passwords do not match'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setPasswords({ current: '', new: '', confirm: '' })
    toast.success(isPt ? 'Password alterada com sucesso!' : 'Password changed successfully!')
  }

  const userInitial = (session?.user?.name || 'U').charAt(0).toUpperCase()

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{isPt ? 'O Meu Perfil' : 'My Profile'}</h1>
        <p className="text-slate-500 mt-1">{isPt ? 'Gerencie as suas informacoes pessoais e de conta.' : 'Manage your personal and account information.'}</p>
      </div>

      {/* Avatar */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white font-black text-3xl shadow-xl">
            {userInitial}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">{session?.user?.name}</h2>
            <p className="text-slate-500 text-sm">{session?.user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              {isPt ? 'Conta Verificada' : 'Verified Account'}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <User className="h-4 w-4 text-[#1B7A8A]" />
            {isPt ? 'Informacoes Pessoais' : 'Personal Information'}
          </h3>
        </div>
        <div className="p-6 grid gap-5 sm:grid-cols-2">
          {[
            { key: 'name', label: isPt ? 'Nome Completo' : 'Full Name', icon: User, type: 'text', placeholder: isPt ? 'O seu nome' : 'Your name' },
            { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'email@exemplo.com' },
            { key: 'phone', label: isPt ? 'Telefone' : 'Phone', icon: Phone, type: 'tel', placeholder: '+351 9XX XXX XXX' },
            { key: 'company', label: isPt ? 'Empresa' : 'Company', icon: Building2, type: 'text', placeholder: isPt ? 'Nome da empresa' : 'Company name' },
            { key: 'nif', label: isPt ? 'NIF / NIPC' : 'Tax ID', icon: Building2, type: 'text', placeholder: isPt ? 'Numero de contribuinte' : 'Tax number' },
            { key: 'address', label: isPt ? 'Morada' : 'Address', icon: MapPin, type: 'text', placeholder: isPt ? 'Rua, numero' : 'Street, number' },
            { key: 'city', label: isPt ? 'Cidade' : 'City', icon: MapPin, type: 'text', placeholder: isPt ? 'Lisboa' : 'City' },
            { key: 'country', label: isPt ? 'Pais' : 'Country', icon: MapPin, type: 'text', placeholder: 'Portugal' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={field.type}
                  value={(profile as any)[field.key]}
                  onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 transition-all">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? (isPt ? 'A guardar...' : 'Saving...') : saved ? (isPt ? 'Guardado!' : 'Saved!') : (isPt ? 'Guardar Alteracoes' : 'Save Changes')}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#1B7A8A]" />
            {isPt ? 'Alterar Password' : 'Change Password'}
          </h3>
        </div>
        <div className="p-6 space-y-4 max-w-md">
          {[
            { key: 'current', label: isPt ? 'Password Atual' : 'Current Password' },
            { key: 'new', label: isPt ? 'Nova Password' : 'New Password' },
            { key: 'confirm', label: isPt ? 'Confirmar Nova Password' : 'Confirm New Password' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">{f.label}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={(passwords as any)[f.key]}
                  onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          <button onClick={handlePasswordChange} disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-60 transition-all">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {isPt ? 'Alterar Password' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <h3 className="font-bold text-red-700 mb-2">{isPt ? 'Zona de Perigo' : 'Danger Zone'}</h3>
        <p className="text-sm text-red-600/80 mb-4">
          {isPt ? 'Ao eliminar a sua conta, todos os dados serao permanentemente removidos.' : 'Deleting your account will permanently remove all your data.'}
        </p>
        <button className="rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors">
          {isPt ? 'Eliminar Conta' : 'Delete Account'}
        </button>
      </div>
    </div>
  )
}
