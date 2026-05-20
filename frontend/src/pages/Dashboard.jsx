import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp, TrendingDown, BookOpen, CircleDollarSign,
  Briefcase, Plus, UserCheck, ChevronRight
} from 'lucide-react'
import { cn } from '@/utils/cn'

// Mock net worth historic graph data
const NET_WORTH_HISTORY = [
  { month: 'Jan', value: 1000000 },
  { month: 'Feb', value: 1005000 },
  { month: 'Mar', value: 998000 },
  { month: 'Apr', value: 1012000 },
  { month: 'May', value: 1034000 }
]

const PIE_COLORS = ['#10b981', '#fbbf24', '#3b82f6', '#8b5cf6']

export const Dashboard = () => {
  const { user, portfolio, transactions } = useAssetifyStore()

  // Calculate stats
  const portfolioValue = useMemo(() => {
    return portfolio.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0)
  }, [portfolio])

  const totalValue = portfolioValue + user.virtualBalance
  const totalInvested = portfolio.reduce((sum, h) => sum + (h.buyPrice * h.quantity), 0)
  const unrealizedProfit = portfolioValue - totalInvested
  const profitPercent = totalInvested > 0 ? (unrealizedProfit / totalInvested) * 100 : 0

  // Asset distribution data
  const distributionData = useMemo(() => {
    const categories = {}
    portfolio.forEach(h => {
      categories[h.category] = (categories[h.category] || 0) + (h.currentPrice * h.quantity)
    })
    categories['Cash'] = user.virtualBalance

    return Object.entries(categories).map(([name, val]) => ({
      name: name === 'real-estate' ? 'Real Estate' : name === 'automobile' ? 'Auto' : name === 'luxury' ? 'Luxury' : name,
      value: val
    }))
  }, [portfolio, user.virtualBalance])

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* 1. TOP METRICS BLOCK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard glowColor="gold" className="flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">SIMULATED NET WORTH</span>
            <div className="p-1.5 rounded-lg bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/25">
              <CircleDollarSign size={14} />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-text-primary tracking-tight font-outfit">
              <AnimatedCounter value={totalValue} prefix="$" decimals={0} />
            </h2>
            <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">
              Portfolio Holdings + Cash
            </span>
          </div>
        </GlassCard>

        <GlassCard glowColor="emerald" className="flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">UNREALIZED PROFIT/LOSS</span>
            <div className={cn(
              'p-1.5 rounded-lg border',
              unrealizedProfit >= 0
                ? 'bg-luxury-emerald/10 text-text-emerald border-luxury-emerald/25'
                : 'bg-red-500/10 text-red-400 border-red-500/25'
            )}>
              {unrealizedProfit >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className={cn(
              'text-2xl font-extrabold tracking-tight font-outfit',
              unrealizedProfit >= 0 ? 'text-text-emerald' : 'text-red-400'
            )}>
              <AnimatedCounter value={unrealizedProfit} prefix={unrealizedProfit >= 0 ? '+$' : '-$'} decimals={0} />
            </h2>
            <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wide flex items-center gap-1.5 font-bold">
              {unrealizedProfit >= 0 ? '+' : ''}
              {profitPercent.toFixed(2)}% ROI ALL TIME
            </span>
          </div>
        </GlassCard>

        <GlassCard glowColor="blue" className="flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">CADET PROGRESS</span>
            <div className="p-1.5 rounded-lg bg-luxury-blue/10 text-luxury-blue border border-luxury-blue/25">
              <BookOpen size={14} />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-text-primary tracking-tight font-outfit uppercase">
              LEVEL {user.level}
            </h2>
            <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wide font-bold">
              {user.xp} TOTAL EXPERIENCE POINTS (XP)
            </span>
          </div>
        </GlassCard>
      </div>

      {/* 2. TREND CHART & PIE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 flex flex-col gap-4 min-h-[300px] overflow-hidden" hoverEffect={false}>
          <div className="flex items-center justify-between select-none">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-outfit">
              Simulated Wealth Trend
            </h3>
            <Badge variant="emerald" glow>Live Sync</Badge>
          </div>
          <div className="flex-1 h-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NET_WORTH_HISTORY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c0f17', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#10b981', fontSize: '11px' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Net Worth']}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorNetWorth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4 justify-between" hoverEffect={false}>
          <div className="flex items-center justify-between select-none">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-outfit">
              Asset Allocation
            </h3>
            <Badge variant="gold" glow>Ratio</Badge>
          </div>
          
          <div className="flex-1 flex justify-center items-center h-44 relative">
            {portfolio.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0f17', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-[10px] text-text-muted flex flex-col gap-1 items-center justify-center">
                <Briefcase size={20} className="text-border mb-1" />
                <span>No assets purchased.</span>
                <span>Portfolios hold 100% Cash.</span>
              </div>
            )}
            {portfolio.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-text-muted font-bold tracking-wider">CASH</span>
                <span className="text-xs font-black text-white font-outfit">
                  {((user.virtualBalance / totalValue) * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            {distributionData.map((d, idx) => (
              <div key={d.name} className="flex justify-between items-center text-[10px] font-semibold text-text-secondary select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span>{d.name}</span>
                </div>
                <span>{((d.value / totalValue) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* 3. TRANS ledgers & MOCK RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 flex flex-col gap-4 min-h-[250px]" hoverEffect={false}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-outfit">
              Simulated Transaction Log
            </h3>
            <Link to="/sandbox">
              <Button variant="ghost" size="sm" className="gap-1 flex">
                Sandbox Portal <ChevronRight size={12} />
              </Button>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[200px] flex flex-col gap-2">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-elevated/25 hover:bg-surface-elevated/45 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase',
                      tx.type === 'BUY' ? 'bg-luxury-emerald/10 text-text-emerald border border-luxury-emerald/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    )}>
                      {tx.type}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary">{tx.assetName}</span>
                      <span className="text-[9px] text-text-muted">
                        Qty: {tx.quantity} shares | {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white font-outfit">
                    ${(tx.price * tx.quantity).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center text-text-muted">
                <Briefcase size={22} className="text-border mb-2" />
                <span className="text-xs font-bold">No Transactions Recorded</span>
                <span className="text-[10px] text-text-muted mt-1 leading-normal max-w-xs">
                  Head to the Virtual Sandbox trade terminal to execute simulated trades.
                </span>
              </div>
            )}
          </div>
        </GlassCard>

        {/* AI Recommendations panel */}
        <GlassCard className="flex flex-col gap-4 justify-between" hoverEffect={false}>
          <div className="flex flex-col gap-1 select-none">
            <Badge variant="emerald" glow className="w-fit">AI ADVISOR MATCH</Badge>
            <h3 className="text-sm font-bold text-text-primary mt-2 font-outfit uppercase">
              Consolidated Recommendations
            </h3>
            <p className="text-[10px] text-text-muted leading-relaxed mt-1 select-none">
              Based on your calibrated preferences and active portfolio allocation index:
            </p>
          </div>

          <div className="flex flex-col gap-3 py-2">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-luxury-gold/5 border border-luxury-gold/25 select-none">
              <Plus size={16} className="text-luxury-gold shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-xs font-bold text-text-primary">Hedging Check Required</span>
                <span className="text-[9px] text-text-secondary leading-relaxed">
                  Your portfolio allocation is light on precious metals. Consider simulated physical gold hedges.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-luxury-blue/5 border border-border select-none">
              <UserCheck size={16} className="text-luxury-blue shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-xs font-bold text-text-primary">Academy Recommendation</span>
                <span className="text-[9px] text-text-secondary leading-relaxed">
                  Start the "Automobile Depreciation Curves" lesson to maximize collectible supercar yields.
                </span>
              </div>
            </div>
          </div>

          <Link to="/advisor" className="w-full">
            <Button variant="ghost" className="w-full text-center">
              Consult AI Assistant
            </Button>
          </Link>
        </GlassCard>
      </div>
    </div>
  )
}
export default Dashboard
