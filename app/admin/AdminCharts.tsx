'use client'

import { Users, Eye, Download, AlertCircle, MousePointer, TrendingUp } from 'lucide-react'

interface DailyVisit { date: string; label: string; visits: number }
interface TopPage { page: string; views: number; percentage: number }

interface AdminData {
  today: number; week: number; month: number
  todayDownloads: number; weekDownloads: number
  totalErrors: number; conversionRate: number
  totalCliques: number; totalDownloads: number
  topPages: TopPage[]
  topCountries: [string, number][]
  recentVisits: { page: string; country: string; created_at: string }[]
  platformCounts: Record<string, number>
  dailyVisits: DailyVisit[]
}

function StatCard({ title, value, sub, icon: Icon, color }: {
  title: string; value: string | number; sub: string; icon: React.ElementType; color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: '#E2E8F0' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase mb-1" style={{ color: '#94A3B8', letterSpacing: 0.5 }}>{title}</p>
          <p className="text-3xl font-extrabold" style={{ color: '#1E293B' }}>{value}</p>
          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

// Line Chart SVG
function LineChart({ data }: { data: DailyVisit[] }) {
  if (!data.length) return <p className="text-center py-8 text-sm" style={{ color: '#94A3B8' }}>Sem dados ainda</p>
  const max = Math.max(...data.map(d => d.visits), 1)
  const W = 500, H = 120, PAD = 20
  const step = (W - PAD * 2) / (data.length - 1 || 1)

  const points = data.map((d, i) => ({
    x: PAD + i * step,
    y: PAD + (1 - d.visits / max) * (H - PAD * 2),
    ...d
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F6D7A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4F6D7A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t} x1={PAD} y1={PAD + t * (H - PAD * 2)} x2={W - PAD} y2={PAD + t * (H - PAD * 2)}
            stroke="#F1F5F9" strokeWidth="1" />
        ))}
        {/* Area */}
        <path d={areaD} fill="url(#lineGrad)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#4F6D7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#4F6D7A" strokeWidth="2" />
            <text x={p.x} y={H + 15} textAnchor="middle" fontSize="10" fill="#94A3B8">{p.label}</text>
            {p.visits > 0 && (
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4F6D7A">{p.visits}</text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

// Donut Chart SVG
function DonutChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, v]) => s + v, 0)
  if (!total) return <p className="text-center py-8 text-sm" style={{ color: '#94A3B8' }}>Sem dados ainda</p>

  const colors: Record<string, string> = { tiktok: '#4F6D7A', instagram: '#E1306C', youtube: '#CC0000' }
  const defaultColors = ['#6B8793', '#89A5B1', '#A7BDC6', '#C5D5DA']

  let cumulative = 0
  const R = 60, CX = 80, CY = 80, strokeW = 28

  const arcs = entries.map(([platform, count], i) => {
    const pct = count / total
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
    cumulative += pct
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2
    const x1 = CX + R * Math.cos(startAngle)
    const y1 = CY + R * Math.sin(startAngle)
    const x2 = CX + R * Math.cos(endAngle)
    const y2 = CY + R * Math.sin(endAngle)
    const largeArc = pct > 0.5 ? 1 : 0
    return {
      platform, count, pct,
      d: `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      color: colors[platform] || defaultColors[i % defaultColors.length]
    }
  })

  const icons: Record<string, string> = { tiktok: '🎵', instagram: '📸', youtube: '▶️' }

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" width="120" height="120" className="flex-shrink-0">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F1F5F9" strokeWidth={strokeW} />
        {arcs.map(arc => (
          <path key={arc.platform} d={arc.d} fill="none" stroke={arc.color} strokeWidth={strokeW}
            strokeLinecap="butt" />
        ))}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1E293B">{total}</text>
        <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fill="#94A3B8">downloads</text>
      </svg>
      <div className="space-y-2 flex-1">
        {arcs.map(arc => (
          <div key={arc.platform} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: arc.color }} />
              <span className="text-sm capitalize" style={{ color: '#1E293B' }}>
                {icons[arc.platform] || '🌐'} {arc.platform}
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: '#64748B' }}>
              {arc.count} ({Math.round(arc.pct * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Bar Chart for Countries
function BarChart({ data }: { data: [string, number][] }) {
  if (!data.length) return <p className="text-center py-8 text-sm" style={{ color: '#94A3B8' }}>Sem dados ainda</p>
  const max = Math.max(...data.map(([, v]) => v), 1)
  const flags: Record<string, string> = { BR: '🇧🇷', US: '🇺🇸', FR: '🇫🇷', UK: '🇬🇧', DE: '🇩🇪', CA: '🇨🇦', AR: '🇦🇷', MX: '🇲🇽', PT: '🇵🇹', ES: '🇪🇸' }

  return (
    <div className="space-y-3">
      {data.map(([country, count]) => (
        <div key={country}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium" style={{ color: '#1E293B' }}>
              {flags[country] || '🌐'} {country}
            </span>
            <span className="text-sm font-bold" style={{ color: '#4F6D7A' }}>{count}</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#F1F5F9' }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${(count / max) * 100}%`, background: 'linear-gradient(90deg, #4F6D7A, #89A5B1)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminCharts({ data }: { data: AdminData }) {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 sticky top-0 z-10" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold" style={{ color: '#1E293B' }}>SSTikPro Admin</h1>
            <p className="text-xs" style={{ color: '#64748B' }}>Analytics em tempo real</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: '#F0FDF4' }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard title="Hoje" value={data.today} sub="visitas" icon={Eye} color="#4F6D7A" />
          <StatCard title="Semana" value={data.week} sub="visitas" icon={Users} color="#6B8793" />
          <StatCard title="Mês" value={data.month} sub="visitas" icon={TrendingUp} color="#8B5CF6" />
          <StatCard title="Downloads Hoje" value={data.todayDownloads} sub="conversões" icon={Download} color="#22C55E" />
          <StatCard title="Downloads Semana" value={data.weekDownloads} sub="conversões" icon={Download} color="#16A34A" />
          <StatCard title="Conversão" value={`${data.conversionRate}%`} sub="cliques→downloads" icon={MousePointer} color="#F59E0B" />
        </div>

        {/* Line Chart - Visitas por dia */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-extrabold" style={{ color: '#1E293B' }}>📈 Visitas por dia</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#F1F5F9', color: '#64748B' }}>Últimos 7 dias</span>
          </div>
          <LineChart data={data.dailyVisits} />
        </div>

        {/* Donut + Bar side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut - Plataformas */}
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>📱 Downloads por plataforma</h2>
            <DonutChart data={data.platformCounts} />
          </div>

          {/* Bar - Países */}
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>🌍 Países</h2>
            <BarChart data={data.topCountries} />
          </div>
        </div>

        {/* Funil */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
          <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>🎯 Funil de Conversão</h2>
          <div className="space-y-3">
            {[
              { label: '👁️ Visitas', value: data.month, color: '#4F6D7A' },
              { label: '👆 Cliques Baixar', value: data.totalCliques, color: '#F59E0B' },
              { label: '✅ Downloads', value: data.totalDownloads, color: '#22C55E' },
            ].map((step, i) => {
              const pct = data.month > 0 ? Math.round((step.value / data.month) * 100) : 0
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{step.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color: '#1E293B' }}>{step.value}</span>
                      <span className="text-xs w-8 text-right" style={{ color: '#94A3B8' }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ background: '#F1F5F9' }}>
                    <div className="h-2.5 rounded-full" style={{ width: `${Math.max(pct, 1)}%`, background: step.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Pages + Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-4" style={{ color: '#1E293B' }}>🏆 Top Páginas</h2>
            {data.topPages.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>Sem dados</p>
            ) : (
              <div className="space-y-3">
                {data.topPages.map((page, i) => (
                  <div key={page.page}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm truncate max-w-xs" style={{ color: '#1E293B' }}>
                        <span className="text-xs mr-1" style={{ color: '#94A3B8' }}>#{i + 1}</span>{page.page}
                      </span>
                      <span className="text-xs ml-2 flex-shrink-0" style={{ color: '#64748B' }}>{page.views} ({page.percentage}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${page.percentage}%`, background: 'linear-gradient(90deg, #4F6D7A, #89A5B1)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-4" style={{ color: '#1E293B' }}>⚡ Atividade Recente</h2>
            {data.recentVisits.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#94A3B8' }}>Sem dados</p>
            ) : (
              <div className="space-y-2">
                {data.recentVisits.map((visit, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#4F6D7A' }} />
                      <span className="text-sm font-medium truncate max-w-24" style={{ color: '#1E293B' }}>{visit.page}</span>
                      {visit.country && <span className="text-xs" style={{ color: '#94A3B8' }}>{visit.country}</span>}
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: '#94A3B8' }}>
                      {new Date(visit.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Erros */}
        {data.totalErrors > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm p-4" style={{ borderColor: '#FEE2E2' }}>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium" style={{ color: '#EF4444' }}>
                {data.totalErrors} erros de download no mês
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
