import type { Metadata } from 'next'
import { Users, Eye, TrendingUp, Globe, BarChart3, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard - SSTikPro',
  robots: { index: false, follow: false },
}

// In production, this data would come from Supabase
const mockAnalytics = {
  today: { visits: 1247, downloads: 389, bounceRate: '34%' },
  week: { visits: 8934, downloads: 2891, bounceRate: '32%' },
  month: { visits: 38420, downloads: 12890, bounceRate: '35%' },
  topPages: [
    { page: '/', views: 18420, percentage: 48 },
    { page: '/blog', views: 7840, percentage: 20 },
    { page: '/faq', views: 4920, percentage: 13 },
    { page: '/blog/download-tiktok-videos-without-watermark-2025', views: 3200, percentage: 8 },
    { page: '/contact', views: 1890, percentage: 5 },
    { page: '/privacy-policy', views: 780, percentage: 2 },
  ],
  topSources: [
    { source: 'Organic Search', visits: 19210, percentage: 50 },
    { source: 'Direct', visits: 9610, percentage: 25 },
    { source: 'Social Media', visits: 5763, percentage: 15 },
    { source: 'Referral', visits: 2305, percentage: 6 },
    { source: 'Other', visits: 1532, percentage: 4 },
  ],
  recentEvents: [
    { time: '2 min ago', event: 'Page View', page: '/' },
    { time: '3 min ago', event: 'Download Attempt', page: '/' },
    { time: '5 min ago', event: 'Page View', page: '/blog' },
    { time: '6 min ago', event: 'Page View', page: '/faq' },
    { time: '8 min ago', event: 'Download Attempt', page: '/' },
  ],
}

function StatCard({ title, value, sub, icon: Icon, color }: { title: string; value: string; sub: string; icon: React.ElementType; color: string }) {
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

export default function AdminDashboard() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <div className="border-b bg-white px-6 py-4" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: '#1E293B' }}>SSTikPro Admin</h1>
            <p className="text-xs" style={{ color: '#64748B' }}>Analytics Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium" style={{ color: '#64748B' }}>Live</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard title="Today's Visits" value={mockAnalytics.today.visits.toLocaleString()} sub="Unique visitors" icon={Users} color="#4F6D7A" />
          <StatCard title="Today's DL" value={mockAnalytics.today.downloads.toLocaleString()} sub="Download attempts" icon={TrendingUp} color="#22C55E" />
          <StatCard title="Week Visits" value={mockAnalytics.week.visits.toLocaleString()} sub="Last 7 days" icon={Eye} color="#6B8793" />
          <StatCard title="Week DL" value={mockAnalytics.week.downloads.toLocaleString()} sub="Last 7 days" icon={Activity} color="#F59E0B" />
          <StatCard title="Month Visits" value={mockAnalytics.month.visits.toLocaleString()} sub="Last 30 days" icon={BarChart3} color="#8B5CF6" />
          <StatCard title="Bounce Rate" value={mockAnalytics.today.bounceRate} sub="Today average" icon={Globe} color="#EF4444" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>
              🏆 Top Pages (This Month)
            </h2>
            <div className="space-y-3">
              {mockAnalytics.topPages.map((page, i) => (
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
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${page.percentage}%`, background: 'linear-gradient(90deg, #4F6D7A, #89A5B1)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
            <h2 className="text-base font-extrabold mb-5" style={{ color: '#1E293B' }}>
              🌐 Traffic Sources
            </h2>
            <div className="space-y-3">
              {mockAnalytics.topSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{source.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold" style={{ color: '#64748B' }}>
                        {source.visits.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: '#94A3B8' }}>
                        {source.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: '#F1F5F9' }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${source.percentage}%`, background: 'linear-gradient(90deg, #22C55E, #16A34A)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border shadow-sm p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-extrabold" style={{ color: '#1E293B' }}>⚡ Recent Activity</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs" style={{ color: '#64748B' }}>Real-time</span>
            </div>
          </div>
          <div className="space-y-2">
            {mockAnalytics.recentEvents.map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                style={{ background: '#F8FAFC' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: event.event === 'Download Attempt' ? '#22C55E' : '#4F6D7A' }}
                  />
                  <span className="text-sm font-medium" style={{ color: '#1E293B' }}>{event.event}</span>
                  <span className="text-xs" style={{ color: '#94A3B8' }}>{event.page}</span>
                </div>
                <span className="text-xs" style={{ color: '#94A3B8' }}>{event.time}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#CBD5E1' }}>
          Dashboard shows mock data. Connect Supabase + Google Analytics for real data.
        </p>
      </div>
    </div>
  )
}
