import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, ShieldCheck } from 'lucide-react'

export const Register = () => {
  const navigate = useNavigate()
  const { register } = useAssetifyStore()
  const { toast } = useToastStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const currentErrors = {}

    if (!name) currentErrors.name = 'Cadet identifier name required.'
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
      register(name, email, password)
      toast({
        title: 'Credentials Established',
        description: 'Welcome to the platform. Complete onboarding setup.',
        type: 'success'
      })
      navigate('/onboarding')
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
            REGISTER CADET
          </h1>
          <p className="text-xs text-text-muted max-w-xs leading-normal">
            Establish new credentials to configure your alternative asset academy profile.
          </p>
        </div>

        <GlassCard className="p-8" hoverEffect={false}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Cadet Call Sign / Name"
              placeholder="Alex Mercer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              icon={<User size={14} />}
            />

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
              label="Secure Passphrase"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<Lock size={14} />}
            />

            <Button type="submit" isLoading={isLoading} className="w-full mt-2">
              Establish Credentials
            </Button>
          </form>

          {/* Link back */}
          <div className="text-center mt-6 border-t border-border pt-4 select-none">
            <span className="text-[10px] text-text-muted">
              Already a cadet?{' '}
              <Link to="/login" className="text-text-emerald hover:underline font-bold uppercase tracking-wider ml-1">
                Access Account
              </Link>
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
export default Register
