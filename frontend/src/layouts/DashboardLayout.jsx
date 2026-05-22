import React, { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { XPProgress } from '@/components/ui/XPProgress'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { FloatingAIAssistant } from '@/components/layout/FloatingAIAssistant'
import { ToastContainer } from '@/components/ui/ToastContainer'
import {
  Compass, GraduationCap, LineChart, Cpu, Building2,
  FileBadge, Users, Search, Flame, Bell, LogOut, Menu, X, Landmark
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { appService } from '@/services/api'

export const DashboardLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAssetifyStore()
  const { toast } = useToastStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifTrayOpen, setNotifTrayOpen] = useState(false)
  const [streakOpen, setStreakOpen] = useState(false)

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    appService.getNotifications()
      .then((response) => setNotifications(response.notifications || []))
      .catch(() => {})
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = async () => {
    await appService.markNotificationsRead().catch(() => {})
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast({
      title: 'Notifications Cleared',
      description: 'All system notifications marked as read.',
      type: 'info'
    })
  }

  const handleLogout = () => {
    logout()
    toast({
      title: 'Session Terminated',
      description: 'You have signed out of the Assetify Console.',
      type: 'info'
    })
    navigate('/login')
  }

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Compass },
    { label: 'Academy', path: '/learn', icon: GraduationCap },
    { label: 'Sandbox', path: '/sandbox', icon: LineChart },
    { label: 'AI Advisor', path: '/advisor', icon: Cpu },
    { label: 'Knowledge Graph', path: '/knowledge', icon: Building2 },
    { label: 'Certifications', path: '/certifications', icon: FileBadge },
    { label: 'Market & Simulators', path: '/market', icon: Landmark },
    { label: 'Community', path: '/community', icon: Users },
  ]

  const getPageTitle = () => {
    const active = navigationItems.find(item => item.path === location.pathname)
    return active ? active.label : 'Assetify Console'
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface/50 border-r border-border backdrop-blur-md p-5 select-none shrink-0 relative z-20">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 mb-8 px-2 group">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-luxury-emerald to-luxury-blue flex items-center justify-center shadow-md shadow-neon-emerald/10 group-hover:scale-105 transition-transform">
            <Landmark size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-base tracking-wider font-outfit bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent uppercase">
            ASSETIFY
          </span>
        </Link>

        {/* Navigation list */}
        <nav className="flex-1 flex flex-col gap-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border outline-none',
                  isActive
                    ? 'bg-luxury-emerald/10 text-text-emerald border-luxury-emerald/20 shadow-neon-emerald/5'
                    : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-surface-elevated/40'
                )}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User stats widget & profile panel at bottom */}
        <div className="border-t border-border pt-4 mt-4 flex flex-col gap-3">
          <div className="bg-surface-elevated/35 border border-border/80 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-luxury-gold to-yellow-600 flex items-center justify-center font-bold text-black text-xs font-outfit shadow-sm shadow-neon-gold/15">
                {user.name ? user.name.slice(0, 2).toUpperCase() : 'AM'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-primary">{user.name || 'Alex Mercer'}</span>
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Premium Cadet</span>
              </div>
            </div>
            
            <XPProgress xp={user.xp} level={user.level} showIcon={false} />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-red-400 hover:bg-red-950/20 border border-transparent transition-all outline-none"
          >
            <span className="flex items-center gap-2"><LogOut size={13} /> Terminate Link</span>
            <span className="text-[8px] opacity-40 uppercase">V2.6</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-border bg-background/55 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
          {/* Left panel info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-white/5"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold tracking-wider uppercase text-text-primary hidden sm:block font-outfit select-none">
              {getPageTitle()}
            </h1>
          </div>

          {/* Quick search input (summons Cmd+K Command Palette) */}
          <div
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface-elevated/25 text-xs text-text-muted hover:border-luxury-emerald/30 cursor-pointer w-64 select-none"
          >
            <Search size={13} />
            <span>Search Terminal...</span>
            <span className="ml-auto text-[9px] bg-surface-elevated border border-border px-1.5 py-0.5 rounded font-bold uppercase select-none">
              Ctrl+K
            </span>
          </div>

          {/* Right navbar elements */}
          <div className="flex items-center gap-4">
            
            {/* Virtual Balance widget */}
            <div className="bg-surface-elevated/45 border border-border px-3.5 py-1.5 rounded-xl flex items-center gap-2 select-none">
              <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">Balance:</span>
              <span className="text-xs font-bold text-text-gold font-outfit">
                ${user.virtualBalance?.toLocaleString()}
              </span>
            </div>

            {/* Streak Tracker with Popover */}
            <div className="relative">
              <button
                onClick={() => setStreakOpen(!streakOpen)}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold select-none outline-none',
                  user.streak > 0 
                    ? 'border-orange-500/30 bg-orange-950/15 text-orange-400 shadow-sm shadow-orange-500/5'
                    : 'border-border bg-surface-elevated/25 text-text-muted'
                )}
              >
                <Flame size={14} className={cn(user.streak > 0 && 'animate-pulse')} />
                <span>{user.streak}D Streak</span>
              </button>
              
              <AnimatePresence>
                {streakOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setStreakOpen(false)} />
                    <motion.div
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-2xl p-4 z-50 text-xs flex flex-col gap-2.5 backdrop-blur-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <h4 className="font-bold text-text-primary flex items-center gap-1.5 select-none">
                        <Flame size={14} className="text-orange-500" /> STREAK STABILITY
                      </h4>
                      <p className="text-text-secondary leading-relaxed select-none">
                        You have checked in for <strong className="text-text-primary">{user.streak} consecutive days</strong>. Complete lessons daily to multiply your streak XP bonuses!
                      </p>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Bell & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifTrayOpen(!notifTrayOpen)}
                className="relative p-2 rounded-xl border border-border bg-surface-elevated/25 text-text-secondary hover:text-text-primary transition-all outline-none"
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute top-[-2px] right-[-2px] h-3.5 w-3.5 bg-luxury-emerald rounded-full text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifTrayOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifTrayOpen(false)} />
                    <motion.div
                      className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-surface shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="p-3 border-b border-border bg-surface-elevated/20 flex items-center justify-between select-none">
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wide">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] text-luxury-emerald hover:underline font-semibold cursor-pointer">
                            Mark Read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-[220px] overflow-y-auto flex flex-col">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif._id || notif.id}
                              className={cn(
                                'p-3 border-b border-border/60 text-xs flex flex-col gap-0.5 transition-colors',
                                !notif.read ? 'bg-luxury-emerald/5' : 'bg-transparent'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className={cn('font-semibold', !notif.read ? 'text-text-primary' : 'text-text-secondary')}>
                                  {notif.title}
                                </span>
                                {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-luxury-emerald" />}
                              </div>
                              <span className="text-[10px] text-text-muted leading-relaxed">{notif.desc}</span>
                            </div>
                          ))
                        ) : (
                          <span className="p-5 text-center text-text-muted text-[10px]">No recent updates</span>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* 3. SCROLLABLE CONTENT BODY */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-mesh">
          <Outlet />
        </main>
        
      </div>

      {/* 4. MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="relative w-64 bg-surface border-r border-border p-5 flex flex-col z-10"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-8 select-none">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-luxury-emerald to-luxury-blue flex items-center justify-center">
                    <Landmark size={14} className="text-white" />
                  </div>
                  <span className="font-extrabold text-sm tracking-wider font-outfit uppercase">ASSETIFY</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text-primary p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border outline-none',
                        isActive
                          ? 'bg-luxury-emerald/10 text-text-emerald border-luxury-emerald/20 shadow-neon-emerald/5'
                          : 'text-text-secondary border-transparent hover:text-text-primary hover:bg-surface-elevated/40'
                      )}
                    >
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="border-t border-border pt-4 mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-luxury-gold to-yellow-600 flex items-center justify-center font-bold text-black text-xs font-outfit">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'AM'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-text-primary">{user.name || 'Alex Mercer'}</span>
                    <span className="text-[10px] text-text-muted">Level {user.level}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-red-400 hover:bg-red-950/20 border border-transparent transition-all outline-none"
                >
                  <LogOut size={13} /> Sign Out Console
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. AUXILIARY UTILITIES */}
      <CommandPalette />
      <FloatingAIAssistant />
      <ToastContainer />
    </div>
  )
}
