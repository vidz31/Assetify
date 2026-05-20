import React from 'react'
import { cn } from '@/utils/cn'

export const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  error = '',
  icon = null,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full select-none text-left">
      {label && (
        <label className="text-[10px] font-bold text-text-muted tracking-wider uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full bg-surface-elevated/45 border text-xs text-text-primary px-3.5 py-3.5 rounded-xl border-border focus:border-luxury-emerald/40 outline-none transition-all placeholder:text-text-muted',
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] font-semibold text-red-400 mt-0.5 select-none">
          {error}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'
