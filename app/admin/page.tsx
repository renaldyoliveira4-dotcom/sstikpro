import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Users, Eye, TrendingUp, Globe, BarChart3, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard - SSTikPro',
  robots: { index: false, follow: false },
}

export const revalidate = 0 // Always fresh data
export const dynamic = 'force-dynamic'

async function getAnalytics() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Today visits
    const { count: todayVisits } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart)

    // Week visits
    const { count: weekVisits } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart)

    // Month visits
    const { count: monthVisits } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart)

    // Top pages
    const { data: allVisitors } = await supabase
      .from('visitors')
      .select('page')
      .gte('created_at', monthStart)

    // Count pages
    const pageCounts: Record<string, number> = {}
    allVisitors?.forEach(v => {
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1
    })
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([page, views]) => ({
        page,
        views,
        percentage: Math.round((views / (allVisitors?.length || 1)) * 100)
      }))

    // Top countries
    const { data: countryData } = await supabase
      .from('visitors')
      .select('country')
      .gte('created_at', monthStart)
      .not('country', 'is', null)

    const countryCounts: Record<string, number> = {}
    countryData?.forEach(v => {
      if (v.country) {
        countryCounts[v.country] = (countryCounts[v.country] || 0) + 1
      }
    })
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Recent visits
    const { data: recentVisits } = await supabase
      .from('visitors')
      .select('page, country, created_at')
      .order('created_at', { ascending: false })
      .limit(10)

    return {
      today: todayVisits || 0,
      week: weekVisits || 0,
      month: monthVisits || 0,
      topPages,
      topCountries,
      recentVisits: recentVisits || [],
    }
  } catch (error) {
    console.error('Analytics error:', error)
    return {
      today: 0, week: 0, month: 0,
      topPages: [], topCountries: [], recentVisits: [],
    }
  }
}

function StatCard({ title, value, sub, icon: Icon, color }: { 
  title: string; value: string | number; sub: string; icon: React.ElementType; color: string 
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>{title}</p>
          <p className="text-2xl font-extrabold" style={{ color: '#1E293B' }}>{value}</p>
          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const data = await getAnalytics()

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="border-b bg-white px-6 py-4" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#1E293B' }}>SSTikPro Admin</h1>
            <p className="text-xs" style={{ color: '#64748B' }}>Analytics Dashboard — Dados Reais</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#64748B' }}>Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Visitas Hoje" value={data.today.toLocaleString()} sub="Visitantes únicos" icon={Users} color="#4F6D7A" />
          <StatCard title="Visitas Semana" value={data.week.toLocaleString()} sub="Últimos 7 dias" icon={Eye} color="#6B8793" />
          <StatCard title="Visitas Mês" value={data.month.toLocaleString()} sub="Últimos 30 dias" icon={BarChart3} color="#8B5CF6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>
              🏆 Páginas Mais Acessadas
            </h2>
            {data.topPages.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>Sem dados ainda</p>
            ) : (
              <div className="space-y-3">
                {data.topPages.map((page, i) => (
                  <div key={page.page}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate max-w-xs" style={{ color: '#1E293B' }}>
                        <span className="text-xs mr-2" style={{ color: '#94A3B8' }}>#{i + 1}</span>
                        {page.page}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-xs font-semibold" style={{ color: '#64748B' }}>
                          {page.views.toLocaleString()}
                        </span>
                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                          {page.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${page.percentage}%`, background: 'linear-gradient(90deg, #4F6D7A, #89A5B1)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Countries */}
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>
              🌍 Países
            </h2>
            {data.topCountries.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>Sem dados ainda</p>
            ) : (
              <div className="space-y-3">
                {data.topCountries.map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{country}</span>
                    <span className="text-sm font-bold" style={{ color: '#4F6D7A' }}>{count} visitas</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>⚡ Atividade Recente</h2>
          {data.recentVisits.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>Sem dados ainda</p>
          ) : (
            <div className="space-y-2">
              {data.recentVisits.map((visit, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#4F6D7A' }} />
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{visit.page}</span>
                    {visit.country && (
                      <span className="text-xs" style={{ color: '#94A3B8' }}>{visit.country}</span>
                    )}
                  </div>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>
                    {new Date(visit.created_at).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}