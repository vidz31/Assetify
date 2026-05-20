import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glowColor = 'emerald'
}) => {
  const glowClasses = {
    emerald: 'after:bg-luxury-emerald/5 hover:after:bg-luxury-emerald/10 shadow-neon-emerald/5',
    gold: 'after:bg-luxury-gold/5 hover:after:bg-luxury-gold/10 shadow-neon-gold/5',
    blue: 'after:bg-luxury-blue/5 hover:after:bg-luxury-blue/10 shadow-neon-blue/5',
    none: 'after:hidden'
  }

  return (
    <motion.div
      className={cn(
        'glass-card relative overflow-hidden rounded-3xl border border-border bg-surface-elevated/45 p-6 backdrop-blur-md transition-all duration-500',
        glowClasses[glowColor] || glowClasses.emerald,
        hoverEffect && 'hover:-translate-y-1 hover:border-border-glowing hover:shadow-lg',
        className
      )}
      whileHover={hoverEffect ? { scale: 1.005 } : undefined}
    >
      {/* Glossy lighting overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  )
}
