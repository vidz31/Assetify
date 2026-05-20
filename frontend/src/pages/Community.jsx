import React, { useState } from 'react'
import { WEBINARS_DATA } from '@/constants/mockData'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Users, MessageSquare, Plus, Send, Radio,
  Video, Share2, Compass, AlertCircle, Sparkles
} from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'
import { cn } from '@/utils/cn'

export const Community = () => {
  const { toast } = useToastStore()

  // Webinars register toggles
  const [webinars, setWebinars] = useState(WEBINARS_DATA)
  
  // Forum thread states
  const [threads, setThreads] = useState([
    {
      id: 't-1',
      title: 'Is 6.4% Cap Rate acceptable for tokenized Manhattan residential property?',
      author: 'David Vance',
      repliesCount: 14,
      category: 'Real Estate',
      date: '1 hour ago'
    },
    {
      id: 't-2',
      title: 'Rolex secondary market price trends: Will Daytonas keep falling?',
      author: 'Marcus Sterling',
      repliesCount: 8,
      category: 'Luxury Goods',
      date: '3 hours ago'
    }
  ])

  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('Real Estate')

  const handleRegisterWebinar = (id) => {
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextReg = !w.registered
          toast({
            title: nextReg ? 'Seat Registered' : 'Registration Terminated',
            description: nextReg ? `You are registered for: ${w.title}` : `Cancelled booking for: ${w.title}`,
            type: nextReg ? 'success' : 'info'
          })
          return {
            ...w,
            registered: nextReg,
            attendees: nextReg ? w.attendees + 1 : w.attendees - 1
          }
        }
        return w
      })
    )
  }

  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!newPostTitle.trim()) return

    const newThread = {
      id: `t-${Date.now()}`,
      title: newPostTitle,
      author: 'Alex Mercer', // default logged user name
      repliesCount: 0,
      category: newPostCategory,
      date: 'Just now'
    }

    setThreads((prev) => [newThread, ...prev])
    setNewPostTitle('')
    toast({
      title: 'Topic Published',
      description: 'Your inquiry has been broadcasted to the community ledger.',
      type: 'success'
    })
  }

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Community Banner */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Cadet Community Hub</h2>
            <p className="text-[10px] text-text-muted">Register for upcoming expert webinars and participate in forum threads.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-luxury-emerald/10 text-text-emerald border border-luxury-emerald/25 px-3 py-1.5 rounded-xl text-[10px] font-bold">
          <Radio size={11} className="animate-pulse" /> 1,240 Cadets Online
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Forums & Post broadcast */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Create Thread block */}
          <GlassCard className="p-6" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4 mb-4">
              <h3 className="text-sm font-bold text-text-primary uppercase font-outfit tracking-wide">Broadcast Topic</h3>
              <p className="text-[10px] text-text-muted">Inquire about cap rates, luxury scarcity premiums, or physical hedges.</p>
            </div>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
              <Input
                placeholder="Write your topic discussion inquiry..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-2">
                  {['Real Estate', 'Automobile', 'Luxury Goods', 'Precious Metals'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewPostCategory(cat)}
                      className={cn(
                        'px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg border transition-all',
                        newPostCategory === cat
                          ? 'bg-luxury-emerald/10 border-luxury-emerald text-text-emerald'
                          : 'bg-surface border-border text-text-muted hover:text-text-primary'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <Button type="submit" size="sm" className="gap-1.5 flex select-none cursor-pointer">
                  <Send size={11} /> Broadcast
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Forums List */}
          <GlassCard className="p-6 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-text-primary uppercase font-outfit tracking-wide">Active Inquiries</h3>
              <p className="text-[10px] text-text-muted font-medium">Read threads posted by fellow academy cadets.</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              {threads.map((thr) => (
                <div
                  key={thr.id}
                  className="p-4 rounded-2xl border border-border bg-surface-elevated/25 hover:bg-surface-elevated/45 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-surface border border-border text-text-muted mt-0.5">
                      <MessageSquare size={13} />
                    </div>
                    <div className="flex flex-col gap-1 select-text">
                      <span className="text-xs font-bold text-text-primary hover:text-text-emerald transition-colors cursor-pointer">
                        {thr.title}
                      </span>
                      <span className="text-[9px] text-text-muted">
                        Broadcasted by <strong className="text-text-secondary">{thr.author}</strong> | {thr.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
                    <Badge variant="gray">{thr.category}</Badge>
                    <span className="text-[9px] text-text-muted font-bold">{thr.repliesCount} replies</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Expert webinars listings */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col gap-5 min-h-[350px]" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4">
              <h3 className="text-sm font-bold text-text-primary font-outfit uppercase tracking-wide">Expert Webinars</h3>
              <p className="text-[10px] text-text-muted">Simultaneous streams mapping global regulatory indices.</p>
            </div>

            <div className="flex flex-col gap-4">
              {webinars.map((web) => (
                <div key={web.id} className="flex flex-col gap-3 p-3.5 border border-border bg-surface-elevated/25 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1">
                      <Video size={10} /> Live Stream
                    </span>
                    <Badge variant={web.registered ? 'emerald' : 'gray'}>
                      {web.registered ? 'Booked' : 'Open'}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-text-primary leading-normal select-text">
                    {web.title}
                  </h4>

                  <div className="flex items-center gap-2.5">
                    <img src={web.avatar} alt={web.expert} className="h-6 w-6 rounded-full border border-border" />
                    <div className="flex flex-col leading-none">
                      <span className="text-[10px] font-bold text-white">{web.expert}</span>
                      <span className="text-[8px] text-text-muted mt-0.5">{web.role}</span>
                    </div>
                  </div>

                  <div className="text-[9px] text-text-secondary font-semibold bg-surface border border-border p-2 rounded-xl flex justify-between select-none">
                    <span>{web.date}</span>
                    <span className="text-text-muted">{web.time}</span>
                  </div>

                  <Button
                    onClick={() => handleRegisterWebinar(web.id)}
                    variant={web.registered ? 'secondary' : 'primary'}
                    className="w-full select-none cursor-pointer"
                  >
                    {web.registered ? 'Terminate Registration' : 'Reserve Seat'}
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
export default Community
