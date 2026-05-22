import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToastStore } from '@/store/useToastStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, ShieldAlert } from 'lucide-react'
import { authService } from '@/services/api'

export const ForgotPassword = () => {
  const { toast } = useToastStore()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email address required to verify cadet.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      await authService.forgotPassword(email)
      toast({
        title: 'Recovery Key Sent',
        description: `Reset passphrase link sent to ${email}. Check mailbox.`,
        type: 'info'
      })
    } catch (error) {
      toast({
        title: 'Recovery Failed',
        description: error.message,
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-mesh bg-background overflow-hidden select-none">
      {/* Background neon glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-luxury-emerald/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-luxury-blue/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-luxury-emerald to-luxury-blue flex items-center justify-center shadow-lg shadow-neon-emerald/15">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-widest font-outfit uppercase mt-2 bg-gradient-to-r from-text-primary via-text-secondary to-text-muted bg-clip-text text-transparent">
            RECOVER KEY
          </h1>
          <p className="text-xs text-text-muted max-w-xs leading-normal">
            Request an override reset passphrase for locked console links.
          </p>
        </div>

        <GlassCard className="p-8" hoverEffect={false}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Cadet Email Address"
              type="email"
              placeholder="cadet@assetify.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              icon={<Mail size={14} />}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Send Recovery Link
            </Button>
          </form>

          {/* Return link */}
          <div className="text-center mt-6 border-t border-border pt-4 select-none">
            <span className="text-[10px] text-text-muted">
              Return to{' '}
              <Link to="/login" className="text-text-emerald hover:underline font-bold uppercase tracking-wider ml-1">
                Access Port
              </Link>
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
export default ForgotPassword
