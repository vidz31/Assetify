import React, { useState, useRef, useEffect } from 'react'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Send, Cpu, Sparkles, AlertCircle, Building2,
  TrendingUp, Compass, Target
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { appService } from '@/services/api'

export const Advisor = () => {
  const { user, portfolio } = useAssetifyStore()
  const { toast } = useToastStore()

  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Welcome Cadet. I am your Assetify portfolio strategist. Suggest queries or write custom inputs below for diagnostic asset breakdowns." }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const suggestionPills = [
    { text: 'Analyze Portfolio', query: 'Can you analyze my current portfolio and give asset allocation suggestions?' },
    { text: 'Compare Gold & Real Estate', query: 'Compare physical gold vs tokenized real estate as conservative hedges.' },
    { text: 'Supercar Scarcity Premium', query: 'What is a scarcity premium and how does it affect classic car pricing?' }
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    appService.getAdvisorMessages().then((response) => {
      if (response.messages?.length) {
        setMessages(response.messages.map((msg) => ({ sender: msg.sender, text: msg.text })))
      }
    }).catch(() => {})
  }, [])

  const handleSendMessage = async (text) => {
    if (!text.trim()) return

    const userMessage = { sender: 'user', text }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await appService.sendAdvisorMessage(text)
      setMessages((prev) => [...prev, { sender: 'assistant', text: response.reply }])
    } catch (error) {
      toast({ title: 'Advisor Failed', description: error.message, type: 'error' })
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-120px)] text-left select-none">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Side Info Cards */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <GlassCard className="p-5 flex flex-col gap-3" hoverEffect={false}>
            <Badge variant="emerald" glow className="w-fit">AI Diagnostic</Badge>
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider font-outfit mt-1">Advisor Engine</h3>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Consolidated intelligence processing simulated asset risks, inflation variables, and secondary watch premiums.
            </p>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col gap-3" hoverEffect={false}>
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">Cadet Statistics</span>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                <span className="flex items-center gap-1"><Compass size={11} /> RATING PROFILE:</span>
                <span className="text-white font-outfit uppercase">{user.riskProfile || 'Moderate'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-text-secondary">
                <span className="flex items-center gap-1"><Target size={11} /> ACADEMY LEVEL:</span>
                <span className="text-white font-outfit">Lvl {user.level} Cadet</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Center Chat Panel */}
        <GlassCard glowColor="emerald" className="lg:col-span-3 p-5 flex flex-col justify-between h-full min-h-0" hoverEffect={false}>
          
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-luxury-emerald/10 text-luxury-emerald flex items-center justify-center border border-luxury-emerald/20">
                <Cpu size={14} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">Advisor Console</h3>
                <span className="text-[9px] text-text-emerald font-semibold flex items-center gap-0.5"><Sparkles size={8} /> AI COMPILER RUNNING</span>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-4 px-1 flex flex-col gap-3.5 select-text">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex flex-col max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed',
                  msg.sender === 'user'
                    ? 'bg-luxury-emerald text-white rounded-br-none self-end'
                    : 'bg-surface-elevated border border-border text-text-secondary rounded-bl-none self-start'
                )}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}

            {isTyping && (
              <div className="bg-surface-elevated border border-border text-text-muted rounded-2xl rounded-bl-none p-4 text-xs self-start flex gap-1 items-center max-w-[80%] select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions pills */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 pb-3 pt-2">
              {suggestionPills.map((pill) => (
                <button
                  key={pill.text}
                  onClick={() => handleSendMessage(pill.query)}
                  className="px-3 py-1.5 text-[10px] font-semibold text-text-secondary bg-surface-elevated border border-border hover:border-luxury-emerald hover:text-text-primary rounded-xl transition-all text-left"
                >
                  {pill.text}
                </button>
              ))}
            </div>
          )}

          {/* Chat Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage(inputValue)
            }}
            className="flex items-center gap-2 border-t border-border pt-3 bg-transparent"
          >
            <input
              type="text"
              placeholder="Query portfolio analysis, gold hedging, cap rate calculations..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-surface-elevated/45 text-xs text-text-primary px-4 py-3 rounded-xl border border-border focus:border-luxury-emerald/40 outline-none placeholder:text-text-muted"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="py-3 px-4 shrink-0 flex items-center justify-center"
            >
              <Send size={13} />
            </Button>
          </form>

        </GlassCard>
      </div>
    </div>
  )
}
export default Advisor
