import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase rounded-xl transition-all duration-300 outline-none select-none border'
  
  const variants = {
    primary: 'bg-luxury-emerald border-luxury-emerald/20 text-white hover:bg-emerald-600 hover:shadow-neon-emerald/30 shadow-md',
    secondary: 'bg-surface-elevated border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated/80',
    gold: 'bg-luxury-gold border-luxury-gold/20 text-black hover:bg-yellow-500 hover:shadow-neon-gold/30 shadow-md',
    ghost: 'bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
    danger: 'bg-red-500 border-red-500/20 text-white hover:bg-red-600'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px] rounded-lg',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3 text-sm rounded-2xl'
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 pointer-events-none cursor-not-allowed',
        className
      )}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          {/* Circular typing/loading indicator */}
          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          Processing...
        </span>
      ) : children}
    </motion.button>
  )
}
