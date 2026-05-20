import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export const Dialog = ({
  isOpen = false,
  onClose,
  title = '',
  description = '',
  children,
  className = ''
}) => {
  // Listen for escape keys to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className={cn(
              'relative w-full max-w-md rounded-3xl border border-border bg-surface shadow-2xl p-6 z-10 flex flex-col gap-4 overflow-hidden',
              className
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Glossy top overlay */}
            <div className="absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            {/* Header info */}
            <div className="flex justify-between items-start select-none relative z-10">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-text-primary font-outfit">
                  {title}
                </h3>
                {description && (
                  <span className="text-[10px] text-text-muted font-medium leading-relaxed">
                    {description}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Core Body content */}
            <div className="relative z-10 select-text">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
