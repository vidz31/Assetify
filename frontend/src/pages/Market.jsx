import React, { useEffect, useState, useMemo } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'
import {
  Building2, Car, ShieldAlert, Sparkles,
  Calculator, RefreshCw, Coins, Crown, Landmark,
  Scale, CheckSquare, AlertTriangle, ShieldCheck, HelpCircle
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { appService } from '@/services/api'
import { useToastStore } from '@/store/useToastStore'

const BAR_COLORS = ['#3b82f6', '#10b981', '#fbbf24', '#8b5cf6', '#ef4444']

export const Market = () => {
  const { toast } = useToastStore()
  const [activeTab, setActiveTab] = useState('re') // re, auto, due-diligence, tax-impact

  // Real Estate Calculator States
  const [purchasePrice, setPurchasePrice] = useState(500000)
  const [monthlyRent, setMonthlyRent] = useState(3500)
  const [annualExpenses, setAnnualExpenses] = useState(12000)

  // Auto Depreciation States
  const [initialValue, setInitialValue] = useState(80000)
  const [depreciationRate, setDepreciationRate] = useState(15) // percentage annual decline
  const [years, setYears] = useState(5)

  // Tax Configuration and calculation states
  const [taxRules, setTaxRules] = useState(null)
  const [taxAsset, setTaxAsset] = useState('real-estate') // real-estate, gold, luxury, automobile
  const [taxPurchasePrice, setTaxPurchasePrice] = useState(1000000)
  const [taxSalePrice, setTaxSalePrice] = useState(1500000)
  const [taxMonths, setTaxMonths] = useState(36)
  const [taxState, setTaxState] = useState('MH')
  const [taxUnderConstruction, setTaxUnderConstruction] = useState(false)

  // Due Diligence States
  const [ddAssetType, setDdAssetType] = useState('re') // re or auto
  const [ddStep, setDdStep] = useState(0) // 0: select, 1-4: steps, 5: report
  const [ddAnswers, setDdAnswers] = useState([]) // array of indices chosen per step

  // Load presets and tax config on mount
  useEffect(() => {
    appService.getMarketPresets().then((response) => {
      const re = response.presets?.find((preset) => preset.type === 'real-estate')?.values
      const auto = response.presets?.find((preset) => preset.type === 'automobile')?.values
      if (re) {
        setPurchasePrice(re.purchasePrice)
        setMonthlyRent(re.monthlyRent)
        setAnnualExpenses(re.annualExpenses)
      }
      if (auto) {
        setInitialValue(auto.initialValue)
        setDepreciationRate(auto.depreciationRate)
        setYears(auto.years)
      }
    }).catch(() => {})

    appService.getTaxConfig().then((response) => {
      if (response.success) {
        setTaxRules(response.rules)
      }
    }).catch(() => {})
  }, [])

  // Default tax configurations if API fails to load
  const activeRules = useMemo(() => {
    return taxRules || {
      gst: {
        real_estate: { luxury: 5, affordable: 1, ready_to_move: 0 },
        gold: 3,
        luxury: 18,
        automobile: 28
      },
      stamp_duty: {
        MH: { label: 'Maharashtra', rate: 6, registrationFee: 1 },
        DL: { label: 'Delhi', rate: 6, registrationFee: 1 },
        KA: { label: 'Karnataka', rate: 5.6, registrationFee: 1 },
        TN: { label: 'Tamil Nadu', rate: 7, registrationFee: 1 },
        TS: { label: 'Telangana', rate: 6, registrationFee: 1 }
      },
      tds: {
        real_estate: { threshold: 5000000, rate: 1 }
      },
      capital_gains: {
        real_estate: { ltcg_threshold_months: 24, ltcg_rate: 20, stcg_rate: 30 },
        gold: { ltcg_threshold_months: 24, ltcg_rate: 20, stcg_rate: 30 },
        luxury: { ltcg_threshold_months: 36, ltcg_rate: 20, stcg_rate: 30 },
        automobile: { ltcg_threshold_months: 36, ltcg_rate: 20, stcg_rate: 30 }
      }
    }
  }, [taxRules])

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

  // Tax calculations
  const taxResults = useMemo(() => {
    let gst = 0
    let stampDuty = 0
    let registrationFee = 0
    let tds = 0
    let capitalGainsTax = 0
    let taxCategory = 'None'

    // 1. GST Calculation
    if (taxAsset === 'real-estate') {
      if (taxUnderConstruction) {
        const gstRate = taxPurchasePrice <= 4500000 ? activeRules.gst.real_estate.affordable : activeRules.gst.real_estate.luxury
        gst = (taxPurchasePrice * gstRate) / 100
      }
    } else if (taxAsset === 'gold') {
      gst = (taxPurchasePrice * activeRules.gst.gold) / 100
    } else if (taxAsset === 'luxury') {
      gst = (taxPurchasePrice * activeRules.gst.luxury) / 100
    } else if (taxAsset === 'automobile') {
      gst = (taxPurchasePrice * activeRules.gst.automobile) / 100
    }

    // 2. Stamp Duty & Registration (Real Estate only)
    if (taxAsset === 'real-estate') {
      const stateRule = activeRules.stamp_duty[taxState] || activeRules.stamp_duty.MH
      stampDuty = (taxPurchasePrice * stateRule.rate) / 100
      registrationFee = (taxPurchasePrice * stateRule.registrationFee) / 100
    }

    // 3. TDS (Real Estate only, if price >= 50L)
    if (taxAsset === 'real-estate' && taxPurchasePrice >= activeRules.tds.real_estate.threshold) {
      tds = (taxPurchasePrice * activeRules.tds.real_estate.rate) / 100
    }

    // 4. Capital Gains Tax
    const profit = taxSalePrice - taxPurchasePrice
    if (profit > 0) {
      const assetGainsRule = activeRules.capital_gains[taxAsset] || activeRules.capital_gains.real_estate
      if (taxMonths >= assetGainsRule.ltcg_threshold_months) {
        // LTCG calculation with simulated indexation (assuming 5% inflation compound annually)
        const holdingYears = taxMonths / 12
        const indexedCost = taxPurchasePrice * Math.pow(1.05, holdingYears)
        const indexedProfit = taxSalePrice - indexedCost
        if (indexedProfit > 0) {
          capitalGainsTax = (indexedProfit * assetGainsRule.ltcg_rate) / 100
        }
        taxCategory = 'LTCG (Long-Term, 20% with indexation)'
      } else {
        // STCG (assumed standard slab rate approximation at 30% for education)
        capitalGainsTax = (profit * assetGainsRule.stcg_rate) / 100
        taxCategory = `STCG (Short-Term, ${assetGainsRule.stcg_rate}%)`
      }
    }

    const totalTax = gst + stampDuty + registrationFee + tds + capitalGainsTax
    const netAcquisitionPrice = taxPurchasePrice + gst + stampDuty + registrationFee + tds
    const totalOutflow = netAcquisitionPrice + capitalGainsTax
    const cashOverheadPercent = taxPurchasePrice > 0 ? (totalTax / taxPurchasePrice) * 100 : 0

    return {
      gst,
      stampDuty,
      registrationFee,
      tds,
      capitalGainsTax,
      totalTax,
      netAcquisitionPrice,
      totalOutflow,
      cashOverheadPercent,
      profit: Math.max(0, profit),
      taxCategory
    }
  }, [taxAsset, taxPurchasePrice, taxSalePrice, taxMonths, taxState, taxUnderConstruction, activeRules])

  const taxChartData = useMemo(() => {
    return [
      { name: 'Base Cost', value: taxPurchasePrice },
      { name: 'GST', value: taxResults.gst },
      { name: 'Stamp Duty', value: taxResults.stampDuty + taxResults.registrationFee },
      { name: 'TDS', value: taxResults.tds },
      { name: 'Capital Gains', value: taxResults.capitalGainsTax }
    ].filter(item => item.value > 0)
  }, [taxPurchasePrice, taxResults])

  // Due Diligence Steps Database
  const ddScenarios = {
    re: {
      title: 'Real Estate Due Diligence Audit',
      icon: <Building2 className="text-luxury-emerald" size={16} />,
      steps: [
        {
          title: 'Step 1: RERA Registry Search',
          prompt: 'Before making a deposit, do you check the project registration number on your state\'s RERA portal to verify builder approvals and check for litigation/past delays?',
          options: [
            { label: 'Perform RERA database check', scorePenalty: 0, cost: 'Vigilance: High', msg: 'Verified RERA details. Clear approval records confirmed. No hidden developer litigation found.' },
            { label: 'Skip search and proceed', scorePenalty: 30, cost: 'Litigation risk: +30%', msg: 'SKIPPED RERA CHECK. Simulated consequence: The builder defaulted on structural approval, halting construction for 18 months, costing you ₹3,50,000 in double rent.' }
          ]
        },
        {
          title: 'Step 2: Title Chain Verification',
          prompt: 'Do you hire a legal professional to run a title check going back 30 years at the Sub-Registrar\'s office, verifying a clean history of transfers and no active mortgages?',
          options: [
            { label: 'Hire expert for full title search', scorePenalty: 0, cost: 'Legal Fee: ₹5,000', msg: 'Clean 30-year chain of title confirmed. No unregistered encumbrances found.' },
            { label: ' Rety on bank loan approval', scorePenalty: 20, cost: 'Title dispute risk: +20%', msg: 'SKIPPED DETAILED TITLE SEARCH. Simulated consequence: An undisclosed legal heir surfaced claiming 25% ownership of the parcel, resulting in a litigation dispute.' }
          ]
        },
        {
          title: 'Step 3: Occupancy Certificate (OC) Check',
          prompt: 'Do you demand a copy of the municipal-issued Occupancy Certificate (OC) before taking possession, verifying the structural construction conforms to the approved plans?',
          options: [
            { label: 'Demand and inspect the official OC', scorePenalty: 0, cost: 'Vigilance: Medium', msg: 'OC verified. Municipal water and electricity links successfully established.' },
            { label: 'Assume ready-to-move means OC is received', scorePenalty: 25, cost: 'Penalty Risk: +25%', msg: 'SKIPPED OC AUDIT. Simulated consequence: The municipality disconnected water utilities due to deviation from plan. Retrospective regularization cost you ₹1,80,000 in penalties.' }
          ]
        },
        {
          title: 'Step 4: Interest Rate Stress Test',
          prompt: 'Do you stress-test your monthly repayment capacity against a potential 2.5% spike in floating home loan interest rates over your 15-year tenure?',
          options: [
            { label: 'Stress test EMI budget', scorePenalty: 0, cost: 'Finance audit: High', msg: 'Budget stress-tested. Confirmed buffer exists to absorb rate adjustments.' },
            { label: 'Borrow at maximum possible eligibility', scorePenalty: 25, cost: 'Insolvency risk: +25%', msg: 'SKIPPED BUDGET STRESS TEST. Simulated consequence: A 2% rate spike increased monthly EMIs by ₹18,000. You defaulted on payment, hurting your CIBIL score.' }
          ]
        }
      ]
    },
    auto: {
      title: 'Automobile Due Diligence Audit',
      icon: <Car className="text-luxury-blue" size={16} />,
      steps: [
        {
          title: 'Step 1: RC Online RTO Verification',
          prompt: 'Do you lookup the vehicle plate number on the RTO Vahan database to verify owner count, registration age, active hypothecation loans, and blacklists?',
          options: [
            { label: 'Verify RC on Vahan portal', scorePenalty: 0, cost: 'Vigilance: Medium', msg: 'Verified RTO details. Single owner confirmed, no active hypothecation loans.' },
            { label: 'Accept physical RC printout copy', scorePenalty: 25, cost: 'Hypothecation risk: +25%', msg: 'SKIPPED VAHAN SEARCH. Simulated consequence: The vehicle had an active bank lien. Transfer of registration was denied until the ₹1,20,000 bank loan was cleared.' }
          ]
        },
        {
          title: 'Step 2: Insurance Claim History Audit',
          prompt: 'Do you check the insurance history (No Claim Bonus details or claim summaries) to see if the vehicle has been declared a total loss/salvage after an accident or flood?',
          options: [
            { label: 'Audit insurance claim history', scorePenalty: 0, cost: 'Vigilance: Medium', msg: 'Verified insurance ledger. No major frame damage claims found.' },
            { label: 'Trust dealer assurance of "never crashed"', scorePenalty: 35, cost: 'Accident vehicle risk: +35%', msg: 'SKIPPED INSURANCE AUDIT. Simulated consequence: The vehicle had major undisclosed frame repair from a rollover accident, causing severe wheel alignment issues.' }
          ]
        },
        {
          title: 'Step 3: Mechanical Evaluation',
          prompt: 'Do you hire an independent technician to inspect engine compression, chassis corrosion, repaint thickness, and OBD scanners?',
          options: [
            { label: 'Hire certified vehicle inspector', scorePenalty: 0, cost: 'Inspection Fee: ₹2,000', msg: 'Professional inspector confirmed engine compression and body structural integrity are sound.' },
            { label: 'Test drive around block yourself', scorePenalty: 20, cost: 'Mechanical risk: +20%', msg: 'SKIPPED TECHNICAL INSPECTION. Simulated consequence: The transmission failed 3 weeks after purchase. Repair costs at service station totaled ₹95,000.' }
          ]
        },
        {
          title: 'Step 4: Traffic Challan Verification',
          prompt: 'Do you check regional traffic police registers for outstanding traffic fines, speed violations, or pending court summons against the vehicle?',
          options: [
            { label: 'Check online e-challan register', scorePenalty: 0, cost: 'Vigilance: Low', msg: 'Clean slate verified. No pending traffic penalties found.' },
            { label: 'Rely on RTO clearance photocopy', scorePenalty: 20, cost: 'Pending fines risk: +20%', msg: 'SKIPPED CHALLAN CHECK. Simulated consequence: The vehicle was seized during traffic stop due to 12 pending speeding fines totaling ₹24,000 and court summons.' }
          ]
        }
      ]
    }
  }

  const handleDdAnswer = (optionIdx) => {
    const currentScenario = ddScenarios[ddAssetType]
    const updatedAnswers = [...ddAnswers, optionIdx]
    setDdAnswers(updatedAnswers)

    if (ddStep < currentScenario.steps.length) {
      setDdStep(ddStep + 1)
    }
  }

  const ddScore = useMemo(() => {
    if (ddStep <= 4 || ddAnswers.length === 0) return 100
    const scenario = ddScenarios[ddAssetType]
    let penalty = 0
    ddAnswers.forEach((ansIdx, stepIdx) => {
      penalty += scenario.steps[stepIdx].options[ansIdx].scorePenalty
    })
    return Math.max(0, 100 - penalty)
  }, [ddStep, ddAnswers, ddAssetType])

  const tabOptions = [
    { id: 're', label: 'RE Cap Calculator' },
    { id: 'auto', label: 'Auto Depreciation' },
    { id: 'due-diligence', label: 'Due Diligence Simulator' },
    { id: 'tax-impact', label: 'Tax Impact Simulator' }
  ]

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Header Banner */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <Landmark size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Market Insights & Simulators</h2>
            <p className="text-[10px] text-text-muted">Simulate asset cap yields, depreciation curves, due diligence checkpoints, and tax structures.</p>
          </div>
        </div>
      </GlassCard>

      <Tabs
        options={tabOptions}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="w-full"
      />

      {/* TABS CONTENT */}

      {/* 1. Real Estate Cap Rate Calculator */}
      {activeTab === 're' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-5" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4">
              <h3 className="text-xs font-bold text-text-primary uppercase font-outfit tracking-wide flex items-center gap-1.5">
                <Building2 size={14} className="text-luxury-emerald" /> Property Parameters
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>PURCHASE PRICE</span>
                <span className="text-white font-outfit">₹{purchasePrice.toLocaleString()}</span>
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

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ESTIMATED MONTHLY RENT</span>
                <span className="text-white font-outfit">₹{monthlyRent.toLocaleString()}</span>
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

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ESTIMATED ANNUAL EXPENSES (TAX/FEE/RESERVE)</span>
                <span className="text-white font-outfit">₹{annualExpenses.toLocaleString()}</span>
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

              <div className="flex flex-col items-center justify-center py-4 relative">
                <div className="h-28 w-28 rounded-full border border-luxury-emerald/30 bg-[#07090e] flex flex-col items-center justify-center shadow-lg shadow-neon-emerald/10 relative z-10">
                  <span className="text-[9px] text-text-muted font-bold tracking-wider">NET YIELD</span>
                  <span className="text-xl font-black text-text-emerald font-outfit mt-0.5">
                    {reResults.capRate.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                  <span>Gross Annual Rent</span>
                  <span className="text-white">₹{reResults.gross.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                  <span>Net Operating Income (NOI)</span>
                  <span className="text-white">₹{reResults.noi.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-surface-elevated/45 border border-border rounded-xl flex gap-2 items-start text-[9.5px] text-text-secondary leading-relaxed">
                <Sparkles size={14} className="text-luxury-gold shrink-0 mt-0.5" />
                <span>
                  {reResults.capRate >= 8
                    ? 'Excellent yield profile. Typical for high occupancy commuter flats.'
                    : reResults.capRate >= 5
                      ? 'Healthy moderate yield profile. Typical for major metropolitan apartments.'
                      : 'Low yield profile. Vacancy reserves or expenses might be over-leveraged.'}
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 2. Auto Depreciation Simulator */}
      {activeTab === 'auto' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-5" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4">
              <h3 className="text-xs font-bold text-text-primary uppercase font-outfit tracking-wide flex items-center gap-1.5">
                <Car size={14} className="text-luxury-blue" /> Automobile Parameters
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>INITIAL MSRP VALUE</span>
                <span className="text-white font-outfit">₹{initialValue.toLocaleString()}</span>
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

          <div className="lg:col-span-1">
            <GlassCard glowColor="blue" className="p-6 flex flex-col gap-5 min-h-[350px] justify-between" hoverEffect={false}>
              <div className="flex flex-col gap-1 border-b border-border pb-4">
                <span className="text-[9px] text-luxury-blue font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Calculator size={12} /> Depreciation Curve
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit uppercase tracking-wide">
                  Value Decline Curve
                </h3>
              </div>

              <div className="h-36 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={autoDepreciationData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={8}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0c0f17', borderColor: '#1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#3b82f6', fontSize: '9px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '9px' }}
                      formatter={(val) => [`₹${val.toLocaleString()}`]}
                    />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-1 mt-2 border-t border-border pt-3">
                <span className="text-[8px] text-text-muted font-bold tracking-wider uppercase">SIMULATED RESIDUAL VALUE</span>
                <div className="flex justify-between items-center text-xs font-bold text-white font-outfit mt-1">
                  <span>After {years} Years:</span>
                  <span className="text-luxury-blue">
                    ₹{autoDepreciationData[autoDepreciationData.length - 1]?.value.toLocaleString()}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 3. Due Diligence Simulator */}
      {activeTab === 'due-diligence' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main simulator screen */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-5 min-h-[350px] justify-between" hoverEffect={false}>
            {ddStep === 0 ? (
              <div className="flex flex-col gap-6 py-6 text-center items-center justify-center">
                <div className="h-12 w-12 rounded-xl bg-luxury-gold/10 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold mb-2">
                  <Scale size={24} />
                </div>
                <div className="flex flex-col gap-1.5 max-w-md">
                  <h3 className="text-sm font-extrabold text-text-primary uppercase font-outfit tracking-wide">Due Diligence Audit Simulator</h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Test your transaction vigilance. Walk through legal verifications, paperwork audits, and structural check gates for high-value physical asset deals.
                  </p>
                </div>

                <div className="flex gap-4 w-full max-w-xs mt-2">
                  <button
                    onClick={() => { setDdAssetType('re'); setDdStep(1); setDdAnswers([]) }}
                    className="flex-1 py-3 px-4 rounded-xl border border-luxury-emerald/30 bg-luxury-emerald/5 text-text-emerald text-xs font-bold font-outfit hover:bg-luxury-emerald/10 cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Building2 size={20} />
                    Real Estate
                  </button>
                  <button
                    onClick={() => { setDdAssetType('auto'); setDdStep(1); setDdAnswers([]) }}
                    className="flex-1 py-3 px-4 rounded-xl border border-luxury-blue/30 bg-luxury-blue/5 text-luxury-blue text-xs font-bold font-outfit hover:bg-luxury-blue/10 cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Car size={20} />
                    Automobile
                  </button>
                </div>
              </div>
            ) : ddStep <= 4 ? (
              <div className="flex flex-col justify-between h-full min-h-[300px]">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Checkpoint {ddStep} of 4
                    </span>
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                      {ddScenarios[ddAssetType].icon} {ddScenarios[ddAssetType].title}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h4 className="text-sm font-extrabold text-white leading-normal font-outfit">
                      {ddScenarios[ddAssetType].steps[ddStep - 1].title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-elevated/45 border border-border p-3.5 rounded-xl">
                      {ddScenarios[ddAssetType].steps[ddStep - 1].prompt}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  {ddScenarios[ddAssetType].steps[ddStep - 1].options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleDdAnswer(optIdx)}
                      className="w-full p-4 rounded-xl border border-border bg-surface text-left text-xs font-bold text-text-primary hover:border-luxury-gold/50 hover:bg-surface-elevated/30 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span>{opt.label}</span>
                        <span className="text-[9px] text-text-muted font-normal mt-0.5">{opt.cost}</span>
                      </div>
                      <ChevronRight size={14} className="text-text-muted group-hover:text-luxury-gold group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Report Screen (Step 5)
              <div className="flex flex-col justify-between h-full min-h-[300px]">
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="text-xs font-bold text-text-primary uppercase font-outfit tracking-wide">
                      Audit Diagnostic Summary
                    </h3>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setDdStep(0)}
                    >
                      Reset Simulator
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                    {/* Compliance Score Gauge */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-surface-elevated/20 border border-border rounded-xl">
                      <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase mb-2">Compliance Score</span>
                      <div className={cn(
                        'h-24 w-24 rounded-full border-2 flex flex-col items-center justify-center shadow-lg',
                        ddScore === 100 ? 'border-luxury-emerald/45 bg-luxury-emerald/5 text-text-emerald shadow-neon-emerald/5' :
                        ddScore >= 70 ? 'border-luxury-gold/45 bg-luxury-gold/5 text-luxury-gold shadow-neon-gold/5' :
                        'border-red-500/45 bg-red-500/5 text-red-400'
                      )}>
                        <span className="text-2xl font-black font-outfit">{ddScore}%</span>
                        <span className="text-[8px] font-extrabold uppercase mt-0.5">Vigilant</span>
                      </div>
                    </div>

                    {/* Overall Risk Evaluation */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">Risk Evaluation</span>
                      <div className={cn(
                        'p-4 rounded-xl border flex gap-3 text-xs leading-relaxed',
                        ddScore === 100 ? 'bg-luxury-emerald/5 border-luxury-emerald/25 text-text-secondary' :
                        ddScore >= 70 ? 'bg-luxury-gold/5 border-luxury-gold/25 text-text-secondary' :
                        'bg-red-500/5 border-red-500/25 text-text-secondary'
                      )}>
                        <div className="mt-0.5">
                          {ddScore === 100 ? <ShieldCheck className="text-text-emerald" size={16} /> :
                           ddScore >= 70 ? <AlertTriangle className="text-luxury-gold" size={16} /> :
                           <ShieldAlert className="text-red-400" size={16} />}
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className={cn(
                            'font-bold uppercase tracking-wider text-[10px]',
                            ddScore === 100 ? 'text-text-emerald' :
                            ddScore >= 70 ? 'text-luxury-gold' :
                            'text-red-400'
                          )}>
                            {ddScore === 100 ? 'Secure Deal Profile' :
                             ddScore >= 70 ? 'Vulnerable Deal Profile' :
                             'High Exposure Risk'}
                          </span>
                          <span className="text-[9.5px]">
                            {ddScore === 100 ? 'Your due diligence protocol is fully compliant. In real transactions, this minimizes litigation overhead, municipal lockouts, and hidden repair costs.' :
                             ddScore >= 70 ? 'Warning. You bypassed critical inspection gates to save effort. You face minor legal liabilities or regularisation penalties.' :
                             'Alert. Critical protection gaps. High probability of title disputes, asset repossession, structural failures, or severe capital loss.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consequence Ledger */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-text-muted font-bold tracking-wider uppercase">Transaction Log Details</span>
                    <div className="flex flex-col gap-2 bg-surface-elevated/45 border border-border p-3.5 rounded-xl text-[10px] leading-relaxed max-h-[160px] overflow-y-auto">
                      {ddScenarios[ddAssetType].steps.map((step, idx) => {
                        const chosenOpt = step.options[ddAnswers[idx]]
                        const isSkipped = chosenOpt.scorePenalty > 0
                        return (
                          <div key={idx} className={cn(
                            'p-2.5 rounded-lg border flex gap-2 items-start',
                            isSkipped ? 'bg-red-950/10 border-red-500/15 text-red-400' : 'bg-luxury-emerald/5 border-luxury-emerald/15 text-text-emerald'
                          )}>
                            <div className="mt-0.5 shrink-0">
                              {isSkipped ? <AlertTriangle size={12} /> : <CheckSquare size={12} />}
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-extrabold uppercase text-[8px] tracking-wider">
                                {step.title}
                              </span>
                              <span className="text-text-secondary text-[9.5px] mt-0.5">
                                {chosenOpt.msg}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Sidebar Tips */}
          <div className="lg:col-span-1">
            <GlassCard glowColor="gold" className="p-6 flex flex-col gap-5 min-h-[350px] justify-between" hoverEffect={false}>
              <div className="flex flex-col gap-1 border-b border-border pb-4">
                <span className="text-[9px] text-luxury-gold font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <HelpCircle size={12} /> Legal Guidelines
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit uppercase tracking-wide">
                  Did you know?
                </h3>
              </div>

              <div className="flex flex-col gap-4 text-[10px] text-text-secondary leading-relaxed">
                <div className="p-3 bg-surface rounded-xl border border-border flex flex-col gap-1.5 text-left">
                  <span className="font-bold text-text-primary uppercase tracking-wider text-[8.5px]">Real Estate RERA Rules</span>
                  <span>Section 3 of the RERA Act mandates registration of any layout exceeding 500 sq meters or 8 apartment units. Buying in an unregistered layout voids RERA Tribunal dispute protection.</span>
                </div>

                <div className="p-3 bg-surface rounded-xl border border-border flex flex-col gap-1.5 text-left">
                  <span className="font-bold text-text-primary uppercase tracking-wider text-[8.5px]">Automobile Liens</span>
                  <span>RTO hypothecation represents a banks security interest in the asset. Purchasing a car without bank NOC and RTO Form 35 submission leaves you vulnerable to repossession.</span>
                </div>
              </div>

              <div className="p-3.5 bg-luxury-gold/5 border border-luxury-gold/20 text-luxury-gold text-[9.5px] rounded-xl leading-relaxed text-center font-semibold">
                Always prioritize verify step checks over transaction velocity.
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* 4. Tax Impact Simulator */}
      {activeTab === 'tax-impact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Sliders Input Panel */}
          <GlassCard className="lg:col-span-2 p-6 flex flex-col gap-5" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="text-xs font-bold text-text-primary uppercase font-outfit tracking-wide flex items-center gap-1.5">
                <Scale size={14} className="text-luxury-gold" /> Tax Structure Parameters
              </h3>
              <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border select-none">
                {['real-estate', 'gold', 'luxury', 'automobile'].map((type) => (
                  <button
                    key={type}
                    onClick={() => { setTaxAsset(type); if (type === 'gold' || type === 'luxury') setTaxState('MH') }}
                    className={cn(
                      'px-2.5 py-1 text-[8.5px] font-bold uppercase rounded-lg cursor-pointer transition-colors',
                      taxAsset === type ? 'bg-luxury-gold text-black' : 'text-text-muted hover:text-white'
                    )}
                  >
                    {type === 'real-estate' ? 'Property' : type === 'gold' ? 'Gold' : type === 'luxury' ? 'Luxury' : 'Auto'}
                  </button>
                ))}
              </div>
            </div>

            {/* Input: Base Purchase Price */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ACQUISITION VALUE (BASE COST)</span>
                <span className="text-white font-outfit">₹{taxPurchasePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="10000000"
                step="50000"
                value={taxPurchasePrice}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setTaxPurchasePrice(val)
                  if (taxSalePrice < val) setTaxSalePrice(val + 50000)
                }}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-gold"
              />
            </div>

            {/* Input: Target Sales Price */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>SIMULATED FUTURE SALE VALUE</span>
                <span className="text-white font-outfit">₹{taxSalePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={taxPurchasePrice}
                max="15000000"
                step="50000"
                value={taxSalePrice}
                onChange={(e) => setTaxSalePrice(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-gold"
              />
            </div>

            {/* Input: Holding Period (months) */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>HOLDING DURATION (MONTHS)</span>
                <span className="text-white font-outfit">{taxMonths} Months ({ (taxMonths / 12).toFixed(1) } Years)</span>
              </div>
              <input
                type="range"
                min="1"
                max="120"
                step="1"
                value={taxMonths}
                onChange={(e) => setTaxMonths(Number(e.target.value))}
                className="w-full h-1 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-luxury-gold"
              />
            </div>

            {/* Conditionally render State selector & under-construction checkboxes for Real Estate */}
            {taxAsset === 'real-estate' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/80">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">Purchase State (Stamp Duty)</span>
                  <select
                    value={taxState}
                    onChange={(e) => setTaxState(e.target.value)}
                    className="bg-surface border border-border rounded-xl p-2.5 text-xs text-text-primary outline-none focus:border-luxury-gold/50 cursor-pointer"
                  >
                    {Object.entries(activeRules.stamp_duty).map(([code, stateObj]) => (
                      <option key={code} value={code}>
                        {stateObj.label} ({stateObj.rate + stateObj.registrationFee}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 bg-surface-elevated/25 border border-border p-3.5 rounded-xl select-none mt-5">
                  <input
                    type="checkbox"
                    id="underConstruction"
                    checked={taxUnderConstruction}
                    onChange={(e) => setTaxUnderConstruction(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-surface text-luxury-gold focus:ring-0 accent-luxury-gold cursor-pointer"
                  />
                  <label htmlFor="underConstruction" className="flex flex-col gap-0.5 text-left text-xs cursor-pointer">
                    <span className="font-bold text-white">Under Construction Deal</span>
                    <span className="text-[9px] text-text-muted">Adds GST on structural works (1-5%). Ready-to-move has 0% GST.</span>
                  </label>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Results Output panel */}
          <div className="lg:col-span-1">
            <GlassCard glowColor="gold" className="p-6 flex flex-col gap-5 min-h-[350px] justify-between" hoverEffect={false}>
              <div className="flex flex-col gap-1 border-b border-border pb-4">
                <span className="text-[9px] text-luxury-gold font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Scale size={12} /> Tax Diagnostic Sheet
                </span>
                <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit uppercase tracking-wide">
                  Calculated Tax Overhead
                </h3>
              </div>

              {/* Stacked Chart representing tax segments */}
              <div className="h-32 w-full mt-1 flex justify-center">
                {taxChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: 'Tax', ...taxChartData.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {}) }]} layout="vertical" margin={{ left: -30, right: 10 }}>
                      <XAxis type="number" stroke="#94a3b8" fontSize={8} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0c0f17', borderColor: '#1e293b', borderRadius: '12px' }}
                        itemStyle={{ fontSize: '9px' }}
                        labelStyle={{ fontSize: '0px' }}
                        formatter={(val, name) => [`₹${val.toLocaleString()}`, name]}
                      />
                      {taxChartData.map((entry, index) => (
                        <Bar key={entry.name} dataKey={entry.name} stackId="a" fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-[10px] text-text-muted mt-8">No tax overhead computed</span>
                )}
              </div>

              {/* Tax Details list */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border text-[10.5px]">
                <div className="flex justify-between items-center text-text-secondary select-none">
                  <span className="font-semibold">GST on purchase</span>
                  <span className="text-white font-semibold">₹{taxResults.gst.toLocaleString()}</span>
                </div>
                {taxAsset === 'real-estate' && (
                  <>
                    <div className="flex justify-between items-center text-text-secondary select-none">
                      <span className="font-semibold">Stamp Duty & Reg Fee</span>
                      <span className="text-white font-semibold">₹{(taxResults.stampDuty + taxResults.registrationFee).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary select-none">
                      <span className="font-semibold">TDS (Sec 194-IA)</span>
                      <span className="text-white font-semibold">₹{taxResults.tds.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center text-text-secondary select-none">
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">Capital Gains Tax</span>
                    <span className="text-[8px] text-text-muted uppercase font-bold">{taxResults.taxCategory}</span>
                  </div>
                  <span className="text-white font-semibold">₹{taxResults.capitalGainsTax.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-text-primary font-bold border-t border-border pt-2 select-none">
                  <span>Total Tax Overhead:</span>
                  <span className="text-luxury-gold font-outfit text-xs">₹{taxResults.totalTax.toLocaleString()} ({taxResults.cashOverheadPercent.toFixed(1)}%)</span>
                </div>
              </div>

              <div className="p-3 bg-surface-elevated/45 border border-border rounded-xl flex gap-2 items-start text-[9px] text-text-secondary leading-relaxed">
                <Sparkles size={13} className="text-luxury-gold shrink-0 mt-0.5" />
                <span>
                  {taxAsset === 'real-estate'
                    ? 'Tip: Under Section 54 of the Income Tax Act, you can claim capital gains exemption by reinvesting profit in residential property in India within 2 years.'
                    : taxAsset === 'gold'
                      ? 'Tip: Gold jewellery triggers 3% GST on invoices. Sovereign Gold Bonds (SGB) are exempt from capital gains tax if held to maturity.'
                      : 'Tip: Depreciating personal assets (like cars) rarely trigger Capital Gains tax, but a 1% TCS applies if transaction price exceeds ₹10 Lakhs.'}
                </span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}
export default Market
