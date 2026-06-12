import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import AdminCharts from './AdminCharts'

export const metadata: Metadata = {
  title: 'Admin Dashboard - SSTikPro',
  robots: { index: false, follow: false },
}

export const revalidate = 0
export const dynamic = 'force-dynamic'

async function getAnalytics() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [
      { count: todayVisits },
      { count: weekVisits },
      { count: monthVisits },
      { data: visitorsRaw },
      { data: countryData },
      { data: recentVisits },
      { count: todayDownloads },
      { count: weekDownloads },
      { count: totalErrors },
      { data: platformData },
      { data: dailyVisitsRaw },
    ] = await Promise.all([
      supabase.from('visitors').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString()),
      supabase.from('visitors').select('*', { count: 'exact', head: true }).gte('created_at', weekStart.toISOString()),
      supabase.from('visitors').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
      supabase.from('visitors').select('page').gte('created_at', monthStart.toISOString()),
      supabase.from('visitors').select('country').gte('created_at', monthStart.toISOString()).not('country', 'is', null),
      supabase.from('visitors').select('page, country, created_at').order('created_at', { ascending: false }).limit(8),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('event_name', 'download_sucesso').gte('created_at', todayStart.toISOString()),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('event_name', 'download_sucesso').gte('created_at', weekStart.toISOString()),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('event_name', 'download_erro').gte('created_at', monthStart.toISOString()),
      supabase.from('events').select('platform').gte('created_at', monthStart.toISOString()),
      supabase.from('visitors').select('created_at').gte('created_at', weekStart.toISOString()).order('created_at', { ascending: true }),
    ])

    // Top pages
    const pageCounts: Record<string, number> = {}
    visitorsRaw?.forEach(v => { pageCounts[v.page] = (pageCounts[v.page] || 0) + 1 })
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([page, views]) => ({ page, views, percentage: Math.round((views / (visitorsRaw?.length || 1)) * 100) }))

    // Countries
    const countryCounts: Record<string, number> = {}
    countryData?.forEach(v => { if (v.country) countryCounts[v.country] = (countryCounts[v.country] || 0) + 1 })
    const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

    // Platforms
    const platformCounts: Record<string, number> = {}
    platformData?.forEach((v: { platform: string }) => { if (v.platform) platformCounts[v.platform] = (platformCounts[v.platform] || 0) + 1 })

    // Daily visits (last 7 days)
    const dailyMap: Record<string, number> = {}
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      dailyMap[key] = 0
      days.push(key)
    }
    dailyVisitsRaw?.forEach(v => {
      const key = new Date(v.created_at).toISOString().split('T')[0]
      if (dailyMap[key] !== undefined) dailyMap[key]++
    })
    const dailyVisits = days.map(d => ({
      date: d,
      label: new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      visits: dailyMap[d]
    }))

    // Conversion
    const { count: totalCliques } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('event_name', 'clique_baixar').gte('created_at', monthStart.toISOString())
    const { count: totalDownloads } = await supabase.from('events').select('*', { count: 'exact', head: true }).eq('event_name', 'download_sucesso').gte('created_at', monthStart.toISOString())
    const conversionRate = (totalCliques || 0) > 0 ? Math.round(((totalDownloads || 0) / (totalCliques || 1)) * 100) : 0

    return {
      today: todayVisits || 0,
      week: weekVisits || 0,
      month: monthVisits || 0,
      todayDownloads: todayDownloads || 0,
      weekDownloads: weekDownloads || 0,
      totalErrors: totalErrors || 0,
      conversionRate,
      totalCliques: totalCliques || 0,
      totalDownloads: totalDownloads || 0,
      topPages,
      topCountries,
      recentVisits: recentVisits || [],
      platformCounts,
      dailyVisits,
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return {
      today: 0, week: 0, month: 0, todayDownloads: 0, weekDownloads: 0,
      totalErrors: 0, conversionRate: 0, totalCliques: 0, totalDownloads: 0,
      topPages: [], topCountries: [], recentVisits: [], platformCounts: {}, dailyVisits: [],
    }
  }
}

export default async function AdminDashboard() {
  const data = await getAnalytics()
  return <AdminCharts data={data} />
}
