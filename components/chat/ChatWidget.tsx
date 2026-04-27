'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { MessageCircle, X, Send, Minimize2, Bot } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const locale = useLocale()
  const t = useTranslations('chat')

  // Set greeting on mount
  useEffect(() => {
    setMessages([
      { id: 'greeting', role: 'assistant', content: t('greeting') },
    ])
  }, [t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || data.error || t('greeting'),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            locale === 'pt'
              ? 'Desculpe, ocorreu um erro. Por favor, tente novamente ou contacte-nos em info@tecfazer.pt 😊'
              : 'Sorry, an error occurred. Please try again or contact us at info@tecfazer.pt 😊',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const quickReplies = t.raw('quickReplies') as string[]

  // Floating button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div
      className={`fixed z-50 flex flex-col bg-white rounded-xl shadow-2xl transition-all duration-300
        ${isMinimized
          ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-72 sm:w-80'
          : 'bottom-0 right-0 w-full sm:bottom-6 sm:right-6 sm:w-[380px] sm:rounded-xl rounded-none'
        }
        ${!isMinimized ? 'h-[100dvh] sm:h-[580px]' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] px-4 py-3 text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Tec Fazer</h3>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
              <p className="text-xs opacity-90">{t('greetingSubtitle')}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
            aria-label={t('minimizeBtn')}
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#1B7A8A] to-[#156570] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B7A8A] to-[#F5A623] text-white mt-1">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1 items-center">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies — only show after greeting */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(reply)}
                    className="rounded-full border border-[#1B7A8A]/30 bg-white px-3 py-1 text-xs text-[#1B7A8A] hover:bg-[#1B7A8A] hover:text-white transition-colors font-medium"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t bg-white p-3 flex-shrink-0 rounded-b-xl">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-[#1B7A8A] focus:outline-none focus:ring-2 focus:ring-[#1B7A8A]/20 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#1B7A8A] to-[#F5A623] text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
