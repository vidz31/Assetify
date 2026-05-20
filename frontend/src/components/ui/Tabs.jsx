import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export const Tabs = ({
  options = [],
  activeTab = '',
  onChange,
  className = ''
}) => {
  return (
    <div className={cn('flex p-1 bg-surface-elevated/45 border border-border rounded-xl w-fit relative overflow-hidden select-none', className)}>
      {options.map((opt) => {
        const isActive = activeTab === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              'relative px-3.5 py-1.5 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors duration-300 outline-none z-10 cursor-pointer',
              isActive ? 'text-white' : 'text-text-muted hover:text-text-primary'
            )}
          >
            {opt.label}
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-luxury-emerald rounded-lg -z-10 shadow-neon-emerald/20"
                layoutId="activeTabGlow"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
