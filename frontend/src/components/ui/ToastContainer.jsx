import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '@/store/useToastStore'
import { X, CheckCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToastStore()

  const toastIcons = {
    success: <CheckCircle size={15} className="text-text-emerald" />,
    error: <AlertTriangle size={15} className="text-red-400" />,
    info: <Info size={15} className="text-luxury-blue" />,
    gold: <Sparkles size={15} className="text-text-gold animate-bounce" />
  }

  const borderColors = {
    success: 'border-luxury-emerald/30 bg-luxury-emerald/5',
    error: 'border-red-500/30 bg-red-950/15',
    info: 'border-luxury-blue/30 bg-luxury-blue/5',
    gold: 'border-luxury-gold/30 bg-luxury-gold/5'
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full select-none pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={cn(
              'pointer-events-auto w-full p-4 rounded-xl border backdrop-blur-md flex items-start justify-between gap-3 shadow-lg',
              borderColors[toast.type] || borderColors.info
            )}
          >
            <div className="flex gap-3">
              <div className="mt-0.5">{toastIcons[toast.type] || toastIcons.info}</div>
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-xs font-bold text-text-primary font-outfit uppercase">
                  {toast.title}
                </span>
                <span className="text-[10px] text-text-secondary leading-normal">
                  {toast.description}
                </span>
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer"
            >
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
export default ToastContainer
