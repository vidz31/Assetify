import React, { useState, useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  TrendingUp, Building2, Car, ShieldAlert, Sparkles,
  HelpCircle, ChevronRight, Calculator, RefreshCw
} from 'lucide-react'
import { cn } from '@/utils/cn'

export const Market = () => {
  const [activeTab, setActiveTab] = useState('re') // re or auto

  // Real Estate Calculator States
  const [purchasePrice, setPurchasePrice] = useState(500000)
  const [monthlyRent, setMonthlyRent] = useState(3500)
  const [annualExpenses, setAnnualExpenses] = useState(12000)

  // Auto Depreciation States
  const [initialValue, setInitialValue] = useState(80000)
  const [depreciationRate, setDepreciationRate] = useState(15) // percentage annual decline
  const [years, setYears] = useState(5)

  // Real Estate Cap Rate calculation
  const reResults = useMemo(() => {
    const annualGross = monthlyRent * 12
    const netOperatingIncome = annualGross - annualExpenses
    const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0
    return {
      gross: annualGross,
      noi: netOperatingIncome,
      capRate: Math.max(0, capRate)
    }
  }, [purchasePrice, monthlyRent, annualExpenses])

  // Auto Depreciation trend values over years
  const autoDepreciationData = useMemo(() => {
    const data = []
    let currentVal = initialValue
    data.push({ year: 'Year 0', value: Math.round(currentVal) })

    for (let i = 1; i <= years; i++) {
      currentVal = currentVal * (1 - depreciationRate / 100)
      data.push({ year: `Year ${i}`, value: Math.round(currentVal) })
    }
    return data
  }, [initialValue, depreciationRate, years])

  const tabOptions = [
    { id: 're', label: 'Real Estate Cap Calculator' },
    { id: 'auto', label: 'Auto Depreciation Simulator' }
  ]

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Market insights header banner */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <Calculator size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Local Market Insights</h2>
            <p className="text-[10px] text-text-muted">Simulate asset equations interactively. Check capitalization yields and depreciation trends.</p>
          </div>
        </div>
      </GlassCard>

      <Tabs
        options={tabOptions}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="w-full sm:w-auto"
      />

      {activeTab === 're' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Sliders Input */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-5" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4 select-none">
              <h3 className="text-xs font-bold text-text-primary uppercase font-outfit tracking-wide flex items-center gap-1.5">
                <Building2 size={14} className="text-luxury-emerald" /> Property Parameters
              </h3>
            </div>

            {/* Parameter: Purchase Price */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>PURCHASE PRICE</span>
                <span className="text-white font-outfit">${purchasePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="3000000"
                step="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-emerald"
              />
            </div>

            {/* Parameter: Monthly rent */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ESTIMATED MONTHLY RENT</span>
                <span className="text-white font-outfit">${monthlyRent.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="250"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-emerald"
              />
            </div>

            {/* Parameter: Annual expenses */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ESTIMATED ANNUAL EXPENSES (TAX/FEE/RESERVE)</span>
                <span className="text-white font-outfit">${annualExpenses.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="100000"
                step="1000"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-emerald"
              />
            </div>
          </GlassCard>

          {/* Results Output panel */}
          <div className="lg:col-span-1">
            <GlassCard glowColor="emerald" className="p-6 flex flex-col gap-5 min-h-[350px] justify-between" hoverEffect={false}>
              
              <div className="flex flex-col gap-1 border-b border-border pb-4">
                <span className="text-[9px] text-text-emerald font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Calculator size={12} /> Yield Diagnostic
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit uppercase tracking-wide">
                  Calculated Net Cap Rate
                </h3>
              </div>

              {/* Big metric circle */}
              <div className="flex flex-col items-center justify-center py-4 relative select-none">
                <div className="h-28 w-28 rounded-full border border-luxury-emerald/30 bg-[#07090e] flex flex-col items-center justify-center shadow-lg shadow-neon-emerald/10 relative z-10">
                  <span className="text-[9px] text-text-muted font-bold tracking-wider">NET YIELD</span>
                  <span className="text-xl font-black text-text-emerald font-outfit mt-0.5">
                    {reResults.capRate.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border select-none">
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                  <span>Gross Annual Rent</span>
                  <span className="text-white">${reResults.gross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                  <span>Net Operating Income (NOI)</span>
                  <span className="text-white">${reResults.noi.toLocaleString()}</span>
                </div>
              </div>

              {/* Threshold indicator advice */}
              <div className="p-3 bg-surface-elevated/45 border border-border rounded-xl flex gap-2 items-start text-[9.5px] text-text-secondary leading-relaxed select-none">
                <Sparkles size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                <span>
                  {reResults.capRate >= 8 
                    ? 'Excellent yield profile. Typical for high occupancy commuter flats.' 
                    : reResults.capRate >= 5 
                      ? 'Healthy moderate yield profile. Typical for major metropolitan penthouses.' 
                      : 'Low yield profile. Vacancy reserves or expenses might be over-leveraged.'}
                </span>
              </div>

            </GlassCard>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Sliders Input */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-5" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4 select-none">
              <h3 className="text-xs font-bold text-text-primary uppercase font-outfit tracking-wide flex items-center gap-1.5">
                <Car size={14} className="text-luxury-blue" /> Automobile Parameters
              </h3>
            </div>

            {/* Parameter: Initial MSRP */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>INITIAL MSRP VALUE</span>
                <span className="text-white font-outfit">${initialValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="500000"
                step="10000"
                value={initialValue}
                onChange={(e) => setInitialValue(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-blue"
              />
            </div>

            {/* Parameter: Depreciation rate */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ANNUAL DEPRECIATION PERCENTAGE</span>
                <span className="text-white font-outfit">{depreciationRate}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={depreciationRate}
                onChange={(e) => setDepreciationRate(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-blue"
              />
            </div>

            {/* Parameter: Years range */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>SIMULATOR DURATION (YEARS)</span>
                <span className="text-white font-outfit">{years} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-blue"
              />
            </div>
          </GlassCard>

          {/* Graph Output panel */}
          <div className="lg:col-span-1">
            <GlassCard glowColor="blue" className="p-6 flex flex-col gap-5 min-h-[350px] justify-between" hoverEffect={false}>
              
              <div className="flex flex-col gap-1 border-b border-border pb-4 select-none">
                <span className="text-[9px] text-luxury-blue font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Calculator size={12} /> Depreciation Curve
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit uppercase tracking-wide">
                  Value Decline Curve
                </h3>
              </div>

              {/* Small Chart */}
              <div className="flex-1 h-36 min-h-[140px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={autoDepreciationData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={8}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0c0f17', borderColor: '#1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#3b82f6', fontSize: '9px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '9px' }}
                      formatter={(val) => [`$${val.toLocaleString()}`]}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* End value */}
              <div className="flex flex-col gap-1 mt-2 select-none border-t border-border pt-3">
                <span className="text-[8px] text-text-muted font-bold tracking-wider uppercase">SIMULATED RESIDUAL VALUE</span>
                <div className="flex justify-between items-center text-xs font-bold text-white font-outfit mt-1">
                  <span>After {years} Years:</span>
                  <span className="text-luxury-blue">
                    ${autoDepreciationData[autoDepreciationData.length - 1]?.value.toLocaleString()}
                  </span>
                </div>
              </div>

            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}
export default Market
