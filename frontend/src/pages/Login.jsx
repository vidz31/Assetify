import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, ShieldCheck } from 'lucide-react'

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAssetifyStore()
  const { toast } = useToastStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const currentErrors = {}

    if (!email) currentErrors.email = 'Email connection parameters required.'
    if (!password) currentErrors.password = 'Authentication key passphrase required.'

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    // Simulate database lookup latency
    setTimeout(() => {
      setIsLoading(false)
      login(email, password)
      toast({
        title: 'Authentication Authorized',
        description: 'Welcome back to the Assetify Control Console.',
        type: 'success'
      })
      navigate('/dashboard')
    }, 1500)
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
            <ShieldCheck size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-widest font-outfit uppercase mt-2 bg-gradient-to-r from-text-primary via-text-secondary to-text-muted bg-clip-text text-transparent">
            ASSETIFY CONSOLE
          </h1>
          <p className="text-xs text-text-muted max-w-xs leading-normal">
            Cadet login. Establish secure intelligence connection linking simulated wealth indices.
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
              error={errors.email}
              icon={<Mail size={14} />}
            />

            <Input
              label="Access Passphrase"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock size={14} />}
            />

            {/* Forgot passphrase link */}
            <div className="text-right select-none">
              <Link to="/forgot-password" className="text-[10px] text-text-muted hover:text-text-primary transition-colors font-bold uppercase tracking-wider">
                Forgot Passphrase?
              </Link>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Authorize Connection
            </Button>
          </form>

          {/* Create link */}
          <div className="text-center mt-6 border-t border-border pt-4 select-none">
            <span className="text-[10px] text-text-muted">
              First time cadet?{' '}
              <Link to="/register" className="text-text-emerald hover:underline font-bold uppercase tracking-wider ml-1">
                Register Credentials
              </Link>
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
export default Login
