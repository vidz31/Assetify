import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Cpu, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: "Hello! I am your Assetify Copilot. Ask me anything about tangible asset portfolios, rental cap rates, or depreciation hedges." }
  ])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const suggestionChips = [
    { text: 'Calculate Cap Rate', query: 'Can you show me the formula for cap rate and a quick example?' },
    { text: 'Vintage Car Index', query: 'Why do classic cars appreciate? Give me an investment overview.' },
    { text: 'Gold vs CPI', query: 'How does physical gold act as a macro inflation hedge?' }
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return

    const newMsg = { sender: 'user', text: textToSend }
    setMessages((prev) => [...prev, newMsg])
    setInputVal('')
    setIsTyping(true)

    // Generate mock smart responses based on input queries
    setTimeout(() => {
      let reply = "That is a great question. Tangible assets require careful valuation! Could you clarify if you are tracking cash flows (yield) or long-term capital gains?"
      const lowercaseQuery = textToSend.toLowerCase()
      
      if (lowercaseQuery.includes('cap rate') || lowercaseQuery.includes('calculate')) {
        reply = "Cap Rate = Net Operating Income (NOI) / Property Purchase Price. Example: A property generates $64,000 NOI annually and costs $1,000,000. Cap Rate = $64,000 / $1,000,000 = 6.4%. Standard yields range from 5% to 8% in high-demand metros."
      } else if (lowercaseQuery.includes('car') || lowercaseQuery.includes('vintage') || lowercaseQuery.includes('porsche')) {
        reply = "Classic automobiles fluctuate based on historical rarity. The Porsche 911 GT3 RS (992) appreciates due to dealer allocation limits: buyers pay a 'scarcity premium' over MSRP on the secondary market. Standard commuter cars, by contrast, depreciate 15-20% annually."
      } else if (lowercaseQuery.includes('gold') || lowercaseQuery.includes('cpi') || lowercaseQuery.includes('inflation')) {
        reply = "Gold acts as a macro inflation hedge because it has zero counterparty risk and limited global supply. When real yields (interest rates minus inflation) turn negative, gold prices typically rally as the opportunity cost of holding non-yielding bullion drops."
      }

      setMessages((prev) => [...prev, { sender: 'assistant', text: reply }])
      setIsTyping(false)
    }, 1800)
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'h-12 w-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all focus:outline-none',
          isOpen
            ? 'bg-surface-elevated border border-border text-text-primary'
            : 'bg-gradient-to-r from-luxury-emerald to-luxury-blue text-white shadow-neon-emerald/20 hover:shadow-neon-emerald/40 hover:scale-105'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>

      {/* Assistant Side-drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[500px] rounded-2xl border border-border bg-surface/95 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden z-50"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface-elevated/20 flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-luxury-emerald/10 text-luxury-emerald flex items-center justify-center border border-luxury-emerald/25">
                  <Cpu size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-text-primary tracking-wide uppercase">Assetify Copilot</h3>
                  <span className="text-[9px] text-text-emerald font-semibold flex items-center gap-1">
                    <Sparkles size={8} className="animate-spin" /> AI ADVISOR ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex flex-col max-w-[80%] rounded-2xl p-3 text-xs leading-normal',
                    msg.sender === 'user'
                      ? 'bg-luxury-emerald text-white rounded-br-none self-end'
                      : 'bg-surface-elevated border border-border text-text-secondary rounded-bl-none self-start'
                  )}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              ))}

              {isTyping && (
                <div className="bg-surface-elevated border border-border text-text-muted rounded-2xl rounded-bl-none p-3 text-xs self-start flex gap-1 items-center max-w-[80%] select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip.text}
                    onClick={() => handleSend(chip.query)}
                    className="px-2.5 py-1 text-[10px] font-semibold text-text-secondary bg-surface-elevated border border-border hover:border-luxury-emerald hover:text-text-primary rounded-lg transition-all text-left"
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend(inputVal)
              }}
              className="p-3 border-t border-border bg-surface-elevated/15 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about rental yields, gold, Porsche..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-surface-elevated/45 text-xs text-text-primary px-3.5 py-2 rounded-xl border border-border focus:border-luxury-emerald/40 outline-none"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="p-2 rounded-xl bg-luxury-emerald text-white hover:shadow-neon-emerald/25 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
