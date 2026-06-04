-- ============================================================
-- SSTikPro - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Table: visitors
-- Tracks page visits with hashed IP for privacy
-- ============================================================
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ip_hash VARCHAR(64) NOT NULL,
  page VARCHAR(500) NOT NULL,
  user_agent TEXT,
  country VARCHAR(2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_visitors_created_at ON visitors(created_at DESC);
CREATE INDEX idx_visitors_page ON visitors(page);
CREATE INDEX idx_visitors_ip_hash ON visitors(ip_hash);

-- ============================================================
-- Table: blog_posts
-- Blog content management
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image VARCHAR(1000),
  meta_description TEXT,
  published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- ============================================================
-- Table: analytics
-- Custom event tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event VARCHAR(100) NOT NULL,
  data JSONB,
  session_id VARCHAR(100),
  page VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_analytics_event ON analytics(event);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);

-- ============================================================
-- Table: contact_messages
-- Store contact form submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(500) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT for visitors (anonymous tracking)
CREATE POLICY "Allow public visitor tracking" ON visitors
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public INSERT for analytics events
CREATE POLICY "Allow public analytics events" ON analytics
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public INSERT for contact messages
CREATE POLICY "Allow public contact messages" ON contact_messages
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public SELECT for published blog posts
CREATE POLICY "Allow public read blog posts" ON blog_posts
  FOR SELECT TO anon USING (published = true);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access visitors" ON visitors
  FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access blog" ON blog_posts
  FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access analytics" ON analytics
  FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access contact" ON contact_messages
  FOR ALL TO service_role USING (true);

-- ============================================================
-- Analytics Helper Views
-- ============================================================

CREATE OR REPLACE VIEW daily_stats AS
SELECT
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) as total_visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM visitors
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY day DESC;

CREATE OR REPLACE VIEW top_pages AS
SELECT
  page,
  COUNT(*) as views,
  COUNT(DISTINCT ip_hash) as unique_views
FROM visitors
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY page
ORDER BY views DESC
LIMIT 20;

-- ============================================================
-- Auto-update updated_at for blog_posts
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Done! Your SSTikPro database is ready.
-- ============================================================
