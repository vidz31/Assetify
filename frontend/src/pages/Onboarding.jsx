import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Car, Crown, Coins, Shield, Target, Trophy, Sparkles } from 'lucide-react'

const INTEREST_OPTIONS = [
  { id: 'real-estate', title: 'Real Estate', description: 'Cap rates, REITs, tokenization models.', icon: Building2, color: 'emerald' },
  { id: 'automobile', title: 'Automobiles', description: 'Depreciation curves, classic cars, collector valuations.', icon: Car, color: 'blue' },
  { id: 'luxury', title: 'Luxury Goods', description: 'Timepieces, designer handbags, art asset indices.', icon: Crown, color: 'gold' },
  { id: 'gold', title: 'Gold & Metals', description: 'Physical gold custody, hedging, precious metal bullions.', icon: Coins, color: 'purple' }
]

const RISK_PROFILES = [
  {
    id: 'conservative',
    title: 'Conservative Wealth',
    description: 'Prioritize physical hedges and rental property yield. Low drawdown risk.',
    chart: { gold: '60%', re: '30%', luxury: '5%', cash: '5%' }
  },
  {
    id: 'moderate',
    title: 'Moderate Balanced',
    description: 'Equally distributed between tokenized real estate, stable gold, and selective classic cars.',
    chart: { gold: '30%', re: '40%', luxury: '20%', cash: '10%' }
  },
  {
    id: 'aggressive',
    title: 'Aggressive Alpha',
    description: 'Maximize allocation to high-appreciation supercars, rare luxury timepieces, and leverage properties.',
    chart: { gold: '10%', re: '20%', luxury: '60%', cash: '10%' }
  }
]

export const Onboarding = () => {
  const navigate = useNavigate()
  const { user, completeOnboarding } = useAssetifyStore()
  const { toast } = useToastStore()

  const [step, setStep] = useState(0) // 0: Welcome, 1: Interests, 2: Risk, 3: Funds, 4: Reward
  const [selectedInterests, setSelectedInterests] = useState([])
  const [riskProfile, setRiskProfile] = useState('moderate')
  const [isActivatingFunds, setIsActivatingFunds] = useState(false)

  const handleToggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleNextStep = () => {
    if (step === 1 && selectedInterests.length === 0) {
      toast({
        title: 'Interest Required',
        description: 'Please select at least one asset category.',
        type: 'error'
      })
      return
    }
    setStep((prev) => prev + 1)
  }

  const handleActivateFunds = async () => {
    setIsActivatingFunds(true)
    try {
      await completeOnboarding(selectedInterests, riskProfile)
      setIsActivatingFunds(false)
      setStep(4)
      toast({
        title: 'Console Initialized',
        description: 'Account parameters set. Sandbox balance loaded.',
        type: 'gold'
      })
    } catch (error) {
      setIsActivatingFunds(false)
      toast({
        title: 'Initialization Failed',
        description: error.message,
        type: 'error'
      })
    }
  }

  const handleFinishOnboarding = () => {
    navigate('/dashboard')
  }

  const fadeVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-mesh bg-background overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-luxury-emerald/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-luxury-blue/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10 flex flex-col gap-6">
        {/* Onboarding progress */}
        {step > 0 && step < 4 && (
          <div className="w-full flex flex-col gap-2.5 px-2 select-none">
            <div className="flex justify-between items-center text-xs tracking-wider text-text-secondary font-medium uppercase">
              <span>Setup Terminal</span>
              <span>Step {step} of 3</span>
            </div>
            <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full bg-gradient-to-r from-luxury-emerald to-luxury-blue rounded-full"
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: WELCOME */}
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-8 text-center flex flex-col items-center gap-6" hoverEffect={false}>
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-luxury-emerald via-emerald-600 to-luxury-blue flex items-center justify-center shadow-lg relative group">
                  <Shield size={32} className="text-white animate-pulse" />
                  <div className="absolute inset-0 rounded-2xl bg-luxury-emerald/30 blur-md opacity-80" />
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="gold" glow className="mx-auto">SYSTEM ACTIVE</Badge>
                  <h1 className="text-3xl font-extrabold tracking-tight mt-2 font-outfit text-text-primary uppercase leading-tight">
                    Welcome to the Assetify Terminal, {user.name || 'Investor'}
                  </h1>
                  <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    You have unlocked access to the premier alternative asset academy. Let's calibrate your intelligence system to tailor your learning recommendations.
                  </p>
                </div>

                <Button onClick={handleNextStep} size="lg" className="w-full max-w-sm mt-2">
                  Begin Calibration
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 1: INTERESTS */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-8 flex flex-col gap-6" hoverEffect={false}>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-text-primary tracking-wide">CALIBRATE INTERESTS</h2>
                  <p className="text-xs text-text-secondary">Select the tangible asset categories you want to master.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INTEREST_OPTIONS.map((option) => {
                    const isSelected = selectedInterests.includes(option.id)
                    const Icon = option.icon
                    return (
                      <motion.div
                        key={option.id}
                        onClick={() => handleToggleInterest(option.id)}
                        className={`relative p-5 rounded-2xl border cursor-pointer select-none transition-all duration-300 flex flex-col gap-3 group bg-surface-elevated/40 hover:bg-surface-elevated/80 ${
                          isSelected
                            ? 'border-luxury-emerald bg-luxury-emerald/5 shadow-neon-emerald/5'
                            : 'border-border'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-luxury-emerald text-white' : 'bg-surface text-text-secondary group-hover:text-text-primary'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-sm font-semibold tracking-wide ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {option.title}
                          </span>
                          <span className="text-[11px] text-text-muted leading-relaxed">
                            {option.description}
                          </span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                <div className="flex gap-3 justify-end mt-4">
                  <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={handleNextStep}>Save & Continue</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 2: RISK PROFILE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-8 flex flex-col gap-6" hoverEffect={false}>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-text-primary tracking-wide">RISK CAPABILITY</h2>
                  <p className="text-xs text-text-secondary">Determine your investment threshold profile.</p>
                </div>

                <div className="flex flex-col gap-4">
                  {RISK_PROFILES.map((profile) => {
                    const isSelected = riskProfile === profile.id
                    return (
                      <div
                        key={profile.id}
                        onClick={() => setRiskProfile(profile.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-elevated/45 hover:bg-surface-elevated/85 ${
                          isSelected
                            ? 'border-luxury-emerald bg-luxury-emerald/5 shadow-neon-emerald/5'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-luxury-emerald text-white' : 'bg-surface text-text-muted'
                          }`}>
                            <Target size={15} />
                          </div>
                          <div className="flex flex-col gap-0.5 max-w-[280px]">
                            <span className="text-sm font-semibold tracking-wide text-text-primary">{profile.title}</span>
                            <span className="text-[11px] text-text-muted leading-relaxed">{profile.description}</span>
                          </div>
                        </div>

                        <div className="flex gap-1.5 items-center bg-background/50 border border-border p-2 rounded-lg text-[9px] font-bold text-text-secondary select-none w-full sm:w-auto">
                          <span className="text-text-gold">{profile.chart.gold} Gold</span>
                          <span className="text-text-emerald">{profile.chart.re} RE</span>
                          <span className="text-luxury-blue">{profile.chart.luxury} Lux</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3 justify-end mt-4">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleNextStep}>Save & Continue</Button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 3: ALLOCATION UNLOCK */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-8 text-center flex flex-col items-center gap-6" hoverEffect={false}>
                <div className="h-16 w-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold flex items-center justify-center animate-[pulse_3s_infinite]">
                  <Coins size={30} />
                </div>

                <div className="flex flex-col gap-2">
                  <Badge variant="gold" glow className="mx-auto">SANDBOX PRE-FUNDING</Badge>
                  <h2 className="text-2xl font-bold text-text-primary uppercase mt-1 tracking-wide font-outfit">
                    Unlocking Simulated Capital
                  </h2>
                  <p className="text-xs text-text-secondary max-w-md leading-relaxed">
                    To practice tangible asset investing, we are instantiating a virtual brokerage balance of <strong className="text-text-gold">$1,000,000 USD</strong>. Use this cash to simulate live purchases risk-free.
                  </p>
                </div>

                <Button
                  onClick={handleActivateFunds}
                  isLoading={isActivatingFunds}
                  variant="gold"
                  size="lg"
                  className="w-full max-w-sm cursor-pointer"
                >
                  INITIALIZE $1,000,000 SANDBOX FUNDS
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* STEP 4: CONGRATULATIONS */}
          {step === 4 && (
            <motion.div
              key="step-4"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <GlassCard className="p-8 text-center flex flex-col items-center gap-6" hoverEffect={false}>
                <div className="h-16 w-16 rounded-full bg-luxury-emerald/10 border border-luxury-emerald/30 text-luxury-emerald flex items-center justify-center animate-bounce">
                  <Trophy size={30} />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 justify-center">
                    <Badge variant="emerald" glow>SYSTEM READY</Badge>
                    <Badge variant="gold" glow>+500 XP BOOST</Badge>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-text-primary uppercase mt-1 tracking-wide font-outfit">
                    Initialization Complete!
                  </h2>
                  <p className="text-xs text-text-secondary max-w-md leading-relaxed mx-auto">
                    Excellent work! Your dashboard is now calibrated, and your $1,000,000 trading console is ready.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-surface-elevated/45 border border-border p-4 rounded-2xl w-full max-w-xs justify-center shadow-inner">
                  <Sparkles className="text-luxury-gold animate-spin" size={18} />
                  <span className="text-xs font-bold text-text-primary">LEVEL 1 STATUS ACTIVATED</span>
                </div>

                <Button onClick={handleFinishOnboarding} size="lg" className="w-full max-w-sm">
                  Enter Command Center
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
export default Onboarding
