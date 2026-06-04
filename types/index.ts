export interface NavItem {
  label: string
  href: string
}

export interface BenefitCard {
  icon: string
  title: string
  description: string
}

export interface HowItWorksStep {
  step: number
  title: string
  description: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface VisitorData {
  page: string
  ip_hash?: string
}

export interface AnalyticsEvent {
  event: string
  data?: Record<string, unknown>
}
