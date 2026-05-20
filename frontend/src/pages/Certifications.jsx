import React, { useState } from 'react'
import { useAssetifyStore } from '@/store/useAssetifyStore'
import { useToastStore } from '@/store/useToastStore'
import { BADGES_DATA } from '@/constants/mockData'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import {
  FileBadge, Trophy, Share2, Award, Calendar, Compass,
  Building2, Car, Crown, Coins, ShieldAlert, Sparkles
} from 'lucide-react'
import { cn } from '@/utils/cn'

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Marcus Sterling', xp: 4850, badge: 'Birkin Broker', avatar: 'M' },
  { rank: 2, name: 'Clara Dupont', xp: 3920, badge: 'Cap Rate Crusader', avatar: 'C' },
  { rank: 3, name: 'Hassan Al-Fayed', xp: 3450, badge: 'Inflation Defier', avatar: 'H' },
  { rank: 4, name: 'Sofia Rodriguez', xp: 2900, badge: 'Birkin Broker', avatar: 'S' }
]

export const Certifications = () => {
  const { user } = useAssetifyStore()
  const { toast } = useToastStore()

  const [activeCert, setActiveCert] = useState(null)

  const badgeIcons = {
    Compass: <Compass size={16} />,
    Building2: <Building2 size={16} />,
    Car: <Car size={16} />,
    Coins: <Coins size={16} />,
    Crown: <Crown size={16} />
  }

  const handleShareCredentials = () => {
    toast({
      title: 'Link Copied',
      description: 'Credential URL saved to clipboard. Ready to share.',
      type: 'success'
    })
  }

  // Filter earned badges based on user XP
  const earnedBadgeIds = BADGES_DATA.filter(b => user.xp >= b.xpRequired).map(b => b.id)

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      {/* Certifications Header Banner */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <Award size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">Certifications & Ranks</h2>
            <p className="text-[10px] text-text-muted">Review credentials unlocked through gamified lessons and portfolio returns.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-surface border border-border px-3.5 py-1.5 rounded-xl">
          <Trophy size={13} className="text-luxury-gold animate-bounce" />
          <span className="text-[10px] text-text-secondary font-bold font-outfit uppercase">
            Global Rank: #43 Cadet
          </span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Badges Grid & Custom Certificate Track */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold text-text-primary tracking-wide font-outfit uppercase">Unlocked Milestones</h3>
              <p className="text-[10px] text-text-muted">Earn XP to unlock achievements and credentials.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {BADGES_DATA.map((badge) => {
                const isUnlocked = earnedBadgeIds.includes(badge.id)
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      'p-4.5 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 relative overflow-hidden bg-surface-elevated/25 hover:bg-surface-elevated/45',
                      isUnlocked ? 'border-luxury-emerald/30' : 'border-border/60 opacity-60'
                    )}
                  >
                    {/* Glowing active node */}
                    {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-luxury-emerald/5 to-transparent pointer-events-none" />}

                    <div className={cn(
                      'p-2.5 rounded-xl border shrink-0',
                      isUnlocked ? 'bg-luxury-emerald/15 text-text-emerald border-luxury-emerald/25' : 'bg-surface text-text-muted border-border'
                    )}>
                      {badgeIcons[badge.icon] || <Trophy size={16} />}
                    </div>

                    <div className="flex flex-col gap-0.5 select-text">
                      <span className="text-xs font-bold text-text-primary">{badge.title}</span>
                      <span className="text-[10px] text-text-secondary leading-normal">{badge.description}</span>
                      <span className="text-[9px] text-text-muted font-semibold mt-1">
                        {isUnlocked ? 'Unlocked' : `Requires ${badge.xpRequired} XP`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Certificate Track Card */}
          <GlassCard glowColor="gold" className="p-6 flex flex-col sm:flex-row items-center justify-between gap-5" hoverEffect={false}>
            <div className="flex items-start gap-4 text-left">
              <div className="p-3 bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/25 rounded-2xl shrink-0 mt-0.5">
                <Award size={26} className="animate-[pulse_3s_infinite]" />
              </div>
              <div className="flex flex-col gap-1">
                <Badge variant="gold" glow className="w-fit">Professional Track</Badge>
                <h3 className="text-sm font-bold text-text-primary mt-1 uppercase font-outfit tracking-wide">
                  Tangible Asset Analyst Certificate
                </h3>
                <p className="text-[10px] text-text-secondary leading-relaxed max-w-sm">
                  Complete all academy modules and achieve Level 3 status to generate your signed, blockchain-secured asset analyst credential.
                </p>
              </div>
            </div>

            <Button
              variant="gold"
              disabled={user.level < 3}
              onClick={() => setActiveCert(true)}
              className="w-full sm:w-auto shrink-0 select-none cursor-pointer"
            >
              Generate Credential
            </Button>
          </GlassCard>
        </div>

        {/* Right Side: Global Leaderboard */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 flex flex-col gap-5 min-h-[350px]" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4">
              <h3 className="text-sm font-bold text-text-primary font-outfit uppercase tracking-wide">Global Leaderboard</h3>
              <p className="text-[10px] text-text-muted">Compete with cadets worldwide for yield performance.</p>
            </div>

            <div className="flex flex-col gap-3">
              {MOCK_LEADERBOARD.map((usr) => (
                <div
                  key={usr.rank}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-elevated/25"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-text-gold font-outfit w-4">{usr.rank}</span>
                    <div className="h-7 w-7 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-xs text-text-secondary">
                      {usr.avatar}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-text-primary">{usr.name}</span>
                      <span className="text-[9px] text-text-muted">{usr.badge}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white font-outfit">{usr.xp} XP</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Dynamic Digital Certificate Dialog */}
      <Dialog
        isOpen={!!activeCert}
        onClose={() => setActiveCert(false)}
        title="Verified Credential Issued"
        description="Verify tangible asset management competency metrics."
        className="max-w-xl"
      >
        <div className="p-6 border border-luxury-gold/30 rounded-2xl bg-[#090b11] text-center flex flex-col gap-6 relative select-none">
          {/* Certificate background watermark */}
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col gap-2 relative z-10">
            <span className="text-[10px] text-text-gold font-bold tracking-widest uppercase">ASSETIFY ACADEMY CERTIFICATION</span>
            <h2 className="text-xl font-extrabold text-white font-outfit uppercase mt-2 tracking-wide">
              TANGIBLE ASSET MANAGEMENT ANALYST
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent my-3" />
          </div>

          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">This is to certify that</span>
            <span className="text-lg font-black text-white font-outfit tracking-wide">{user.name || 'Alex Mercer'}</span>
            <p className="text-[10px] text-text-secondary leading-relaxed max-w-sm mx-auto mt-2">
              has completed all analytical qualifications, rental yield indices assessments, and simulated vehicle depreciation curves exams.
            </p>
          </div>

          <div className="flex justify-between items-end mt-4 pt-4 border-t border-border/80 text-left relative z-10 text-[9px] font-semibold text-text-muted">
            <div className="flex flex-col gap-1">
              <span>ISSUED BY: ASSETIFY EDTECH</span>
              <span className="flex items-center gap-1"><Calendar size={10} /> DATE: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="text-right">
              <span className="block text-text-gold font-bold uppercase tracking-wider font-outfit">GENESIS VERIFIED</span>
              <span>HASH: 0x98f...d34e</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="secondary" onClick={() => setActiveCert(false)}>Close</Button>
          <Button onClick={handleShareCredentials} className="gap-2 flex">
            <Share2 size={13} /> Share Credential
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
export default Certifications
