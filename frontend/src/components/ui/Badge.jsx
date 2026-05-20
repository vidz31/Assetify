import React from 'react'
import { cn } from '@/utils/cn'

export const Badge = ({
  children,
  variant = 'emerald',
  size = 'sm',
  glow = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase rounded-full select-none border font-outfit'
  
  const variants = {
    emerald: 'bg-luxury-emerald/10 border-luxury-emerald/25 text-text-emerald',
    gold: 'bg-luxury-gold/10 border-luxury-gold/25 text-text-gold',
    blue: 'bg-luxury-blue/10 border-luxury-blue/25 text-luxury-blue',
    gray: 'bg-surface-elevated/45 border-border text-text-muted',
    danger: 'bg-red-500/10 border-red-500/25 text-red-400'
  }

  const glows = {
    emerald: 'shadow-neon-emerald/10',
    gold: 'shadow-neon-gold/10',
    blue: 'shadow-neon-blue/10',
    gray: '',
    danger: ''
  }

  const sizes = {
    xs: 'px-2 py-0.5 text-[8px]',
    sm: 'px-3 py-1 text-[9px]',
    lg: 'px-4 py-1.5 text-[11px]'
  }

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant] || variants.emerald,
        sizes[size] || sizes.sm,
        glow && (glows[variant] || glows.emerald),
        className
      )}
    >
      {children}
    </span>
  )
}
