import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, GraduationCap, Building2, UserCircle, LineChart, Cpu, FileBadge, Compass, HelpCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

export const CommandPalette = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef(null)

  const items = [
    { title: 'Home Dashboard', category: 'Navigation', path: '/dashboard', icon: <Compass size={14} /> },
    { title: 'Gamified Learning Modules', category: 'Navigation', path: '/learn', icon: <GraduationCap size={14} /> },
    { title: 'Virtual Sandbox Investing', category: 'Navigation', path: '/sandbox', icon: <LineChart size={14} /> },
    { title: 'AI Advisor Consulting', category: 'Navigation', path: '/advisor', icon: <Cpu size={14} /> },
    { title: 'Asset Knowledge Graph', category: 'Navigation', path: '/knowledge', icon: <Building2 size={14} /> },
    { title: 'Unlocked Certifications & Badges', category: 'Navigation', path: '/certifications', icon: <FileBadge size={14} /> },
    { title: 'Community Boards & Webinars', category: 'Navigation', path: '/community', icon: <UserCircle size={14} /> },
    { title: 'Local Property & Auto Insights', category: 'Navigation', path: '/market', icon: <LineChart size={14} /> },
  ]

  // Intercept Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  const handleKeyDown = (e) => {
    if (!isOpen) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleNavigate(filteredItems[selectedIndex].path)
      }
    }
  }

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop Blur */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog Container */}
          <motion.div
            ref={containerRef}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl p-2 z-10 flex flex-col overflow-hidden"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onKeyDown={handleKeyDown}
          >
            {/* Input Wrapper */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-surface-elevated/25">
              <Search className="text-text-muted" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or page filter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
              />
              <span className="text-[10px] bg-surface-elevated border border-border text-text-muted font-bold px-1.5 py-0.5 rounded uppercase select-none">
                ESC
              </span>
            </div>

            {/* Items List */}
            <div className="max-h-[300px] overflow-y-auto p-1 flex flex-col gap-0.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex
                  return (
                    <div
                      key={item.title}
                      onClick={() => handleNavigate(item.path)}
                      className={cn(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-xs font-semibold',
                        isSelected
                          ? 'bg-luxury-emerald/10 text-text-emerald border border-luxury-emerald/20'
                          : 'text-text-secondary border border-transparent hover:text-text-primary hover:bg-surface-elevated/40'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          'p-1.5 rounded-lg',
                          isSelected ? 'bg-luxury-emerald/20 text-text-emerald' : 'bg-surface-elevated text-text-muted'
                        )}>
                          {item.icon}
                        </div>
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-medium">{item.category}</span>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-text-muted select-none">
                  <HelpCircle size={22} className="text-border mb-2" />
                  <span className="text-xs font-semibold">No results match this query</span>
                  <span className="text-[10px] text-text-muted mt-1 leading-normal max-w-[200px]">
                    Try filtering for learning modules or sandbox assets.
                  </span>
                </div>
              )}
            </div>

            {/* Quick tips footer */}
            <div className="border-t border-border p-2 px-3 text-[10px] text-text-muted flex justify-between select-none">
              <span>Use ↑↓ arrows to navigate, enter to select.</span>
              <span>Assetify Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
