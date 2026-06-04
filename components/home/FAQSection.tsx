'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/lib/faq-data'

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border rounded-xl overflow-hidden transition-all" style={{ borderColor: isOpen ? '#4F6D7A' : '#E2E8F0' }}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
        aria-expanded={isOpen}
      >
        <span className="font-semibold pr-4 text-sm md:text-base" style={{ color: '#1E293B' }}>
          {question}
        </span>
        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform"
          style={{
            color: '#4F6D7A',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

export default function FAQSection({ showAll = false }: { showAll?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const displayFaqs = showAll ? faqs : faqs.slice(0, 6)

  return (
    <section className="py-16 md:py-20" style={{ background: '#F8FAFC' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {!showAll && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#1E293B' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg" style={{ color: '#64748B' }}>
              Everything you need to know about SSTikPro.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {displayFaqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
