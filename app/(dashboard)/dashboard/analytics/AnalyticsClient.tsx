'use client'

import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, BarChart, Bar, Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MousePointerClick, Smartphone, Monitor, Tablet } from 'lucide-react'

interface Click {
  clicked_at: string
  device: string | null
  country: string | null
  page_id: string
  block_id: string | null
}

interface Page { id: string; title: string; slug: string }

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export function AnalyticsClient({ pages, clicks }: { pages: Page[]; clicks: Click[] }) {

  // Kliknięcia per dzień (ostatnie 30 dni)
  const clicksByDay = useMemo(() => {
    const map: Record<string, number> = {}
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })
      map[key] = 0
    }
    clicks.forEach(c => {
      const key = new Date(c.clicked_at).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' })
      if (key in map) map[key]++
    })
    return Object.entries(map).map(([date, count]) => ({ date, count }))
  }, [clicks])

  // Podział urządzeń
  const deviceData = useMemo(() => {
    const map: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 }
    clicks.forEach(c => {
      const d = c.device ?? 'unknown'
      map[d] = (map[d] ?? 0) + 1
    })
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [clicks])

  // Top kraje
  const countryData = useMemo(() => {
    const map: Record<string, number> = {}
    clicks.forEach(c => {
      const country = c.country ?? 'Nieznany'
      map[country] = (map[country] ?? 0) + 1
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))
  }, [clicks])

  // Kliknięcia per strona
  const pageData = useMemo(() => {
    return pages.map(page => ({
      name: page.title.length > 14 ? page.title.slice(0, 14) + '…' : page.title,
      clicks: clicks.filter(c => c.page_id === page.id).length,
    })).sort((a, b) => b.clicks - a.clicks)
  }, [pages, clicks])

  const totalClicks = clicks.length
  const todayClicks = clicks.filter(c =>
    new Date(c.clicked_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <div className="space-y-6">
      {/* Karty podsumowania */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Łącznie (30 dni)', value: totalClicks, icon: MousePointerClick, color: 'text-blue-500' },
          { label: 'Dzisiaj',           value: todayClicks, icon: MousePointerClick, color: 'text-green-500' },
          { label: 'Mobile',            value: deviceData.find(d => d.name === 'mobile')?.value ?? 0, icon: Smartphone, color: 'text-purple-500' },
          { label: 'Desktop',           value: deviceData.find(d => d.name === 'desktop')?.value ?? 0, icon: Monitor, color: 'text-orange-500' },
        ].map(card => (
          <Card key={card.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{card.label}</p>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <p className="text-3xl font-bold">{card.value.toLocaleString('pl-PL')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wykres liniowy kliknięć */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kliknięcia — ostatnie 30 dni</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={clicksByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                interval={4}
              />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Kliknięcia"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Urządzenia — PieChart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Urządzenia</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Brak danych</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%" cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deviceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {deviceData.map((d, i) => (
                    <Badge key={d.name} variant="outline" className="text-xs gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                      {d.name} ({d.value})
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top kraje */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top kraje</CardTitle>
          </CardHeader>
          <CardContent>
            {countryData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Brak danych</p>
            ) : (
              <div className="space-y-3">
                {countryData.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(c.value / (countryData[0]?.value ?? 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kliknięcia per strona */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kliknięcia per strona</CardTitle>
          </CardHeader>
          <CardContent>
            {pageData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Brak danych</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={pageData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="clicks" name="Kliknięcia" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
