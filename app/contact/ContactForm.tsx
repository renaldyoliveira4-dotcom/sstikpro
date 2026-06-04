'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MessageSquare, User, Send, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Contact form submitted:', data)
    setSubmitted(true)
    setSubmitting(false)
    reset()
  }

  if (submitted) {
    return (
      <div className="min-h-96 flex items-center justify-center p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#22C55E' }} />
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: '#1E293B' }}>Message Sent!</h2>
          <p className="mb-6" style={{ color: '#64748B' }}>
            Thank you for reaching out. We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #4F6D7A, #6B8793)' }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1E293B' }}>
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
          <input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors"
            style={{
              borderColor: errors.name ? '#EF4444' : '#E2E8F0',
              color: '#1E293B',
              background: '#F8FAFC',
            }}
          />
        </div>
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1E293B' }}>
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#94A3B8' }} />
          <input
            {...register('email')}
            type="email"
            placeholder="john@example.com"
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors"
            style={{
              borderColor: errors.email ? '#EF4444' : '#E2E8F0',
              color: '#1E293B',
              background: '#F8FAFC',
            }}
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1E293B' }}>
          Subject
        </label>
        <input
          {...register('subject')}
          type="text"
          placeholder="How can we help you?"
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors"
          style={{
            borderColor: errors.subject ? '#EF4444' : '#E2E8F0',
            color: '#1E293B',
            background: '#F8FAFC',
          }}
        />
        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#1E293B' }}>
          Message
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4" style={{ color: '#94A3B8' }} />
          <textarea
            {...register('message')}
            placeholder="Describe your issue or question in detail..."
            rows={5}
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none"
            style={{
              borderColor: errors.message ? '#EF4444' : '#E2E8F0',
              color: '#1E293B',
              background: '#F8FAFC',
            }}
          />
        </div>
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        style={{ background: 'linear-gradient(135deg, #4F6D7A, #6B8793)' }}
      >
        {submitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
