import React from 'react'
import { Zap } from 'lucide-react'

export const XPProgress = ({
  xp = 0,
  level = 1,
  showIcon = true
}) => {
  // 1000 XP per level
  const currentXPInLevel = xp % 1000
  const percentComplete = (currentXPInLevel / 1000) * 100

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5 font-outfit">
          {showIcon && <Zap size={13} className="text-luxury-emerald animate-pulse" />}
          Level {level} Cadet
        </span>
        <span className="text-[10px] text-text-muted font-bold">
          {currentXPInLevel} / 1000 XP
        </span>
      </div>
      
      {/* Progress Track */}
      <div className="w-full h-2.5 bg-surface-elevated/45 rounded-full overflow-hidden border border-border">
        <div
          className="h-full bg-gradient-to-r from-luxury-emerald to-emerald-600 rounded-full transition-all duration-500 shadow-neon-emerald/20"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  )
}
