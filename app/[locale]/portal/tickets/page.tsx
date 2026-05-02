'use client'

import { useState } from 'react'
import { MessageSquare, Plus, Send, X, Loader2, AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

export default function PortalTicketsPage({ params }: { params: { locale: string } }) {
  const isPt = params.locale === 'pt'
  const [showNew, setShowNew] = useState(false)
  const [sending, setSending] = useState(false)
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'MEDIUM' })
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [reply, setReply] = useState('')

  // Demo tickets for UI
  const demoTickets = [
    { id: '1', subject: isPt ? 'Questao sobre o meu projeto' : 'Question about my project', status: 'OPEN', priority: 'MEDIUM', createdAt: new Date(Date.now() - 86400000 * 2), messages: 3 },
    { id: '2', subject: isPt ? 'Pedido de alteracao de design' : 'Design change request', status: 'IN_PROGRESS', priority: 'HIGH', createdAt: new Date(Date.now() - 86400000 * 5), messages: 7 },
  ]

  const statusConfig: Record<string, { label: string; labelPt: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
    OPEN:        { label: 'Open',        labelPt: 'Aberto',       bg: 'bg-blue-100',   text: 'text-blue-700',   icon: AlertCircle },
    IN_PROGRESS: { label: 'In Progress', labelPt: 'Em Progresso', bg: 'bg-amber-100',  text: 'text-amber-700',  icon: Clock },
    CLOSED:      { label: 'Closed',      labelPt: 'Fechado',      bg: 'bg-slate-100',  text: 'text-slate-500',  icon: CheckCircle2 },
  }

  const priorityConfig: Record<string, { label: string; labelPt: string; bg: string; text: string }> = {
    LOW:    { label: 'Low',    labelPt: 'Baixa',   bg: 'bg-slate-100',  text: 'text-slate-500' },
    MEDIUM: { label: 'Medium', labelPt: 'Media',   bg: 'bg-blue-100',   text: 'text-blue-700' },
    HIGH:   { label: 'High',   labelPt: 'Alta',    bg: 'bg-orange-100', text: 'text-orange-700' },
    URGENT: { label: 'Urgent', labelPt: 'Urgente', bg: 'bg-red-100',    text: 'text-red-700' },
  }

  const handleSubmitTicket = async () => {
    if (!newTicket.subject || !newTicket.message) {
      toast.error(isPt ? 'Preencha todos os campos' : 'Fill in all fields')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: isPt ? 'Cliente Portal' : 'Portal Client',
          email: 'portal@tecfazer.pt',
          message: `[TICKET - ${newTicket.priority}] ${newTicket.subject}\n\n${newTicket.message}`,
          locale: params.locale,
        }),
      })
      if (res.ok) {
        toast.success(isPt ? 'Mensagem enviada! Responderemos em breve.' : 'Message sent! We will reply shortly.')
        setShowNew(false)
        setNewTicket({ subject: '', message: '', priority: 'MEDIUM' })
      } else throw new Error()
    } catch {
      toast.error(isPt ? 'Erro ao enviar. Tente novamente.' : 'Error sending. Please try again.')
    } finally { setSending(false) }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{isPt ? 'Mensagens' : 'Messages'}</h1>
          <p className="text-slate-500 mt-1">{isPt ? 'Comunique com a nossa equipa.' : 'Communicate with our team.'}</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-5 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          <Plus className="h-4 w-4" />
          {isPt ? 'Nova Mensagem' : 'New Message'}
        </button>
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {demoTickets.map(ticket => {
          const sc = statusConfig[ticket.status] || statusConfig.OPEN
          const pc = priorityConfig[ticket.priority] || priorityConfig.MEDIUM
          const StatusIcon = sc.icon
          return (
            <button key={ticket.id} onClick={() => setSelectedTicket(ticket.id === selectedTicket ? null : ticket.id)}
              className="w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-5 text-left hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${sc.bg}`}>
                    <StatusIcon className={`h-5 w-5 ${sc.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{ticket.subject}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                        {isPt ? sc.labelPt : sc.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${pc.bg} ${pc.text}`}>
                        {isPt ? pc.labelPt : pc.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {ticket.createdAt.toLocaleDateString(isPt ? 'pt-PT' : 'en-US')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {ticket.messages}
                  </span>
                  <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${selectedTicket === ticket.id ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Expanded chat */}
              {selectedTicket === ticket.id && (
                <div className="mt-5 pt-5 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                  {/* Demo messages */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                        {isPt ? 'EU' : 'ME'}
                      </div>
                      <div className="flex-1">
                        <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm text-slate-700">
                          {isPt ? 'Ola, tenho uma questao sobre o meu projeto.' : 'Hello, I have a question about my project.'}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 ml-1">{isPt ? 'Ha 2 dias' : '2 days ago'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-xs font-bold text-white">
                        TF
                      </div>
                      <div className="flex-1 flex flex-col items-end">
                        <div className="rounded-2xl rounded-tr-sm bg-[#1B7A8A]/10 px-4 py-3 text-sm text-slate-700 max-w-xs">
                          {isPt ? 'Ola! Claro, como posso ajudar?' : 'Hello! Of course, how can I help?'}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 mr-1">{isPt ? 'Ha 2 dias' : '2 days ago'} · Tec Fazer</p>
                      </div>
                    </div>
                  </div>
                  {/* Reply input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && reply.trim()) { toast.success(isPt ? 'Mensagem enviada!' : 'Message sent!'); setReply('') } }}
                      placeholder={isPt ? 'Escreva a sua resposta...' : 'Write your reply...'}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none transition-all"
                    />
                    <button
                      onClick={() => { if (reply.trim()) { toast.success(isPt ? 'Mensagem enviada!' : 'Message sent!'); setReply('') } }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B7A8A] text-white hover:bg-[#156570] transition-colors">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </button>
          )
        })}

        {demoTickets.length === 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-16 text-center">
            <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="font-black text-slate-900 mb-2">{isPt ? 'Nenhuma mensagem' : 'No messages'}</h3>
            <p className="text-slate-500 text-sm mb-5">{isPt ? 'Envie uma mensagem para a nossa equipa.' : 'Send a message to our team.'}</p>
            <button onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B7A8A] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#156570] transition-colors">
              <Plus className="h-4 w-4" />
              {isPt ? 'Nova Mensagem' : 'New Message'}
            </button>
          </div>
        )}
      </div>

      {/* New ticket modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setShowNew(false) }}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-6 py-5 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">{isPt ? 'Nova Mensagem' : 'New Message'}</h3>
              <button onClick={() => setShowNew(false)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{isPt ? 'Assunto *' : 'Subject *'}</label>
                <input type="text" value={newTicket.subject} onChange={e => setNewTicket(p => ({ ...p, subject: e.target.value }))}
                  placeholder={isPt ? 'Descreva brevemente o assunto' : 'Briefly describe the subject'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{isPt ? 'Prioridade' : 'Priority'}</label>
                <select value={newTicket.priority} onChange={e => setNewTicket(p => ({ ...p, priority: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm transition-all bg-white">
                  <option value="LOW">{isPt ? 'Baixa' : 'Low'}</option>
                  <option value="MEDIUM">{isPt ? 'Media' : 'Medium'}</option>
                  <option value="HIGH">{isPt ? 'Alta' : 'High'}</option>
                  <option value="URGENT">{isPt ? 'Urgente' : 'Urgent'}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{isPt ? 'Mensagem *' : 'Message *'}</label>
                <textarea value={newTicket.message} onChange={e => setNewTicket(p => ({ ...p, message: e.target.value }))}
                  rows={5} placeholder={isPt ? 'Descreva detalhadamente a sua questao ou pedido...' : 'Describe your question or request in detail...'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1B7A8A] focus:ring-2 focus:ring-[#1B7A8A]/20 outline-none text-sm resize-none transition-all" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowNew(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                  {isPt ? 'Cancelar' : 'Cancel'}
                </button>
                <button onClick={handleSubmitTicket} disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-sm font-bold text-white hover:shadow-lg disabled:opacity-60 transition-all">
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isPt ? 'Enviar' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
