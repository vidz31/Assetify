import React, { useState, useMemo, useEffect } from 'react'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import {
  TrendingUp, TrendingDown, CircleDollarSign, Plus, Minus,
  Coins, Building2, Car, Crown, RefreshCw, BarChart2, Briefcase
} from 'lucide-react'
import { cn } from '@/utils/cn'

export const Sandbox = () => {
  const { user, portfolio, assets, buyAsset, sellAsset, syncSandbox } = useAssetifyStore()
  const { toast } = useToastStore()

  const [activeTab, setActiveTab] = useState('all')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [tradeType, setTradeType] = useState('BUY') // BUY or SELL
  const [tradeQuantity, setTradeQuantity] = useState(1)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    syncSandbox()
  }, [syncSandbox])

  useEffect(() => {
    if (!selectedAsset && assets.length > 0) {
      setSelectedAsset(assets[0])
    }
  }, [assets, selectedAsset])

  const handleManualPriceSync = () => {
    setIsUpdating(true)
    syncSandbox().finally(() => {
      setIsUpdating(false)
      toast({
        title: 'Indices Synced',
        description: 'Asset catalog and portfolio values refreshed from database.',
        type: 'info'
      })
    })
  }

  // Filter assets
  const filteredAssets = useMemo(() => {
    if (activeTab === 'all') return assets
    return assets.filter((a) => a.category === activeTab)
  }, [activeTab, assets])

  // Get active holding in portfolio
  const activeHolding = useMemo(() => {
    if (!selectedAsset) return null
    return portfolio.find((h) => h.id === selectedAsset.id)
  }, [portfolio, selectedAsset])

  const categoryIcons = {
    'real-estate': <Building2 size={13} />,
    'automobile': <Car size={13} />,
    'luxury': <Crown size={13} />,
    'gold': <Coins size={13} />
  }

  const categoryTabOptions = [
    { id: 'all', label: 'All Catalog' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'automobile', label: 'Auto' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'gold', label: 'Gold' }
  ]

  const totalCost = (selectedAsset?.price || 0) * tradeQuantity

  const handleExecuteTrade = async () => {
    if (tradeQuantity <= 0 || !selectedAsset) return

    if (tradeType === 'BUY') {
      try {
        await buyAsset(selectedAsset, tradeQuantity)
        toast({
          title: 'Trade Executed',
          description: `Simulated BUY of ${tradeQuantity} shares in ${selectedAsset.name}.`,
          type: 'success'
        })
      } catch (error) {
        toast({
          title: 'Margin Depleted',
          description: error.message,
          type: 'error'
        })
      }
    } else {
      try {
        await sellAsset(selectedAsset.id, tradeQuantity)
        toast({
          title: 'Trade Executed',
          description: `Simulated SELL of ${tradeQuantity} shares in ${selectedAsset.name}.`,
          type: 'success'
        })
      } catch (error) {
        toast({
          title: 'Insufficient Shares',
          description: error.message,
          type: 'error'
        })
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* 1. HEADER BROKERAGE BAR */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/25 flex items-center justify-center">
            <BarChart2 size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Virtual Sandbox Terminal</h2>
            <p className="text-[10px] text-text-muted">Simulate investment buying power with real-time assets. No loss hazard.</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">Virtual Equity Cash</span>
            <span className="text-sm font-extrabold text-text-gold font-outfit">${user.virtualBalance?.toLocaleString()}</span>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleManualPriceSync}
            disabled={isUpdating}
            className="gap-1 flex"
          >
            <RefreshCw size={12} className={cn(isUpdating && 'animate-spin')} /> Fluctuate Indices
          </Button>
        </div>
      </GlassCard>

      {/* Categories Tabs filter */}
      <Tabs
        options={categoryTabOptions}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="w-full sm:w-auto"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Assets Catalog */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAssets.map((asset) => {
            const holding = portfolio.find((h) => h.id === asset.id)
            return (
              <GlassCard
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={cn(
                  'p-5 flex flex-col gap-4 cursor-pointer',
                  selectedAsset?.id === asset.id ? 'border-luxury-emerald bg-luxury-emerald/5' : ''
                )}
              >
                <div className="relative h-32 rounded-xl overflow-hidden border border-border/60">
                  <img src={asset.image} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2">
                    <Badge variant={asset.category === 'real-estate' ? 'emerald' : asset.category === 'luxury' ? 'gold' : asset.category === 'automobile' ? 'blue' : 'gray'}>
                      {asset.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-text-primary truncate max-w-[150px]">{asset.name}</span>
                    <span className="text-[9px] text-text-muted">Index Asset Code</span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-white font-outfit">${asset.price.toLocaleString()}</span>
                    <span className={cn(
                      'text-[9px] font-bold flex items-center justify-end gap-0.5',
                      asset.changePercent24h >= 0 ? 'text-text-emerald' : 'text-red-400'
                    )}>
                      {asset.changePercent24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h}%
                    </span>
                  </div>
                </div>

                {holding && (
                  <div className="flex items-center justify-between border-t border-border pt-3 select-none text-[9px] font-bold text-text-emerald">
                    <span className="flex items-center gap-1"><Briefcase size={10} /> OWNED BALANCE:</span>
                    <span>{holding.quantity} Shares (${(holding.currentPrice * holding.quantity).toLocaleString()})</span>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>

        {/* Trade Execution Panel */}
        <div className="lg:col-span-1">
          <GlassCard glowColor="emerald" className="p-6 flex flex-col gap-5 select-none" hoverEffect={false}>
            {selectedAsset && (
            <>
            {/* Header info */}
            <div className="flex flex-col gap-1.5 border-b border-border pb-4">
              <span className="text-[9px] text-text-emerald font-extrabold uppercase tracking-widest flex items-center gap-1">
                <CircleDollarSign size={12} /> Execution Slip
              </span>
              <h3 className="text-sm font-bold text-text-primary mt-1 font-outfit truncate uppercase leading-relaxed">
                {selectedAsset.name}
              </h3>
            </div>

            {/* Asset specifications */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">Asset Metrics</span>
              <div className="flex flex-col gap-1 bg-surface-elevated/45 border border-border p-3 rounded-xl">
                {selectedAsset.details.map((det) => (
                  <div key={det.label} className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                    <span>{det.label}</span>
                    <span className="text-text-primary">{det.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BUY / SELL Switch */}
            <div className="flex p-1 bg-surface-elevated/45 border border-border rounded-xl w-full">
              <button
                onClick={() => { setTradeType('BUY'); setTradeQuantity(1) }}
                className={cn(
                  'w-1/2 py-2 text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer',
                  tradeType === 'BUY' ? 'bg-luxury-emerald text-white' : 'text-text-muted'
                )}
              >
                Simulate Buy
              </button>
              <button
                onClick={() => { setTradeType('SELL'); setTradeQuantity(1) }}
                className={cn(
                  'w-1/2 py-2 text-[10px] font-bold uppercase rounded-lg transition-colors cursor-pointer',
                  tradeType === 'SELL' ? 'bg-red-500 text-white' : 'text-text-muted'
                )}
              >
                Simulate Sell
              </button>
            </div>

            {/* Quantity Slider / Selector */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-text-muted font-bold uppercase">Volume (Shares)</span>
                {tradeType === 'SELL' && activeHolding && (
                  <span className="text-text-muted">Owned: {activeHolding.quantity}</span>
                )}
              </div>
              <div className="flex items-center gap-3 bg-surface border border-border rounded-xl p-2 justify-between">
                <button
                  onClick={() => setTradeQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 cursor-pointer"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold text-white font-outfit">{tradeQuantity}</span>
                <button
                  onClick={() => setTradeQuantity((q) => q + 1)}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 cursor-pointer"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                <span>ESTIMATED {tradeType === 'BUY' ? 'COST' : 'PROCEEDS'}</span>
                <span className="text-white font-outfit text-xs">${totalCost.toLocaleString()}</span>
              </div>
            </div>

            <Button
              className="w-full mt-2"
              variant={tradeType === 'BUY' ? 'primary' : 'danger'}
              onClick={handleExecuteTrade}
            >
              EXECUTE SIMULATED {tradeType}
            </Button>
            </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
export default Sandbox
