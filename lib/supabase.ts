import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      visitors: {
        Row: {
          id: string
          ip_hash: string
          page: string
          created_at: string
        }
        Insert: {
          id?: string
          ip_hash: string
          page: string
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          category: string
          content: string
          excerpt: string
          cover_image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: string
          content: string
          excerpt: string
          cover_image?: string | null
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          event: string
          data: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          event: string
          data?: Record<string, unknown> | null
          created_at?: string
        }
      }
    }
  }
}
