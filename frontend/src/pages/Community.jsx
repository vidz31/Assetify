import React, { useEffect, useMemo, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Building2, Car, Coins, Crown, MessageSquare, Radio, Search,
  Send, Users, Video, Bookmark, Heart, ShieldCheck, MessageCircle,
  CalendarDays, Ticket, Library, HelpCircle
} from 'lucide-react'
import { useToastStore } from '@/store/useToastStore'
import { appService, knowledgeService } from '@/services/api'
import { cn } from '@/utils/cn'

const CATEGORY_OPTIONS = ['Real Estate', 'Automobile', 'Luxury Goods', 'Precious Metals']
const TYPE_OPTIONS = [
  { id: 'all', label: 'All Threads', icon: MessageSquare },
  { id: 'discussion', label: 'Discussions', icon: MessageCircle },
  { id: 'case-study', label: 'Case Studies', icon: Library },
  { id: 'ama-question', label: 'AMA Questions', icon: HelpCircle }
]

const ASSET_ICONS = {
  'real-estate': Building2,
  automobile: Car,
  luxury: Crown,
  gold: Coins,
  general: Users
}

const typeLabels = {
  discussion: 'Discussion',
  'case-study': 'Case Study',
  'ama-question': 'AMA'
}

export const Community = () => {
  const { toast } = useToastStore()

  const [overview, setOverview] = useState(null)
  const [communities, setCommunities] = useState([])
  const [activeCommunityId, setActiveCommunityId] = useState('all')
  const [activeType, setActiveType] = useState('all')
  const [sort, setSort] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [webinars, setWebinars] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostCategory, setNewPostCategory] = useState('Real Estate')
  const [newPostType, setNewPostType] = useState('discussion')
  const [commentText, setCommentText] = useState('')

  const activeCommunity = useMemo(
    () => communities.find((community) => community.id === activeCommunityId),
    [communities, activeCommunityId]
  )

  const loadCommunity = async () => {
    setIsLoading(true)
    const [overviewRes, webinarRes, communitiesRes, postsRes] = await Promise.all([
      knowledgeService.getCommunityOverview(),
      appService.getWebinars(),
      knowledgeService.getCommunities(),
      knowledgeService.getAllPosts({
        communityId: activeCommunityId,
        type: activeType,
        search: searchQuery,
        sort
      })
    ])

    const nextThreads = postsRes.posts || []
    setOverview(overviewRes.overview)
    setWebinars(webinarRes.webinars || [])
    setCommunities(communitiesRes.communities || [])
    setThreads(nextThreads)
    setSelectedThread((current) => {
      if (!current) return nextThreads[0] || null
      return nextThreads.find((thread) => thread.id === current.id) || nextThreads[0] || null
    })
    setIsLoading(false)
  }

  useEffect(() => {
    loadCommunity().catch((error) => {
      setIsLoading(false)
      toast({ title: 'Community Load Failed', description: error.message, type: 'error' })
    })
  }, [activeCommunityId, activeType, sort])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    loadCommunity().catch((error) => toast({ title: 'Search Failed', description: error.message, type: 'error' }))
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()
    const targetCommunity = activeCommunityId !== 'all' ? activeCommunityId : communities[0]?.id
    if (!targetCommunity || !newPostTitle.trim() || !newPostContent.trim()) return

    try {
      await knowledgeService.createPost(
        newPostTitle,
        newPostContent,
        targetCommunity,
        [newPostCategory],
        newPostType
      )
      setNewPostTitle('')
      setNewPostContent('')
      await loadCommunity()
      toast({
        title: 'Thread Published',
        description: 'Your community contribution was saved to MongoDB.',
        type: 'success'
      })
    } catch (error) {
      toast({ title: 'Publish Failed', description: error.message, type: 'error' })
    }
  }

  const refreshSelectedThread = async (threadId) => {
    const response = await knowledgeService.getPost(threadId)
    setSelectedThread(response.post)
    setThreads((current) => current.map((thread) => (thread.id === threadId ? response.post : thread)))
  }

  const handleLikeThread = async (thread) => {
    try {
      await knowledgeService.likePost(thread.id)
      await refreshSelectedThread(thread.id)
    } catch (error) {
      toast({ title: 'Action Failed', description: error.message, type: 'error' })
    }
  }

  const handleSaveThread = async (thread) => {
    try {
      await knowledgeService.savePost(thread.id)
      await refreshSelectedThread(thread.id)
    } catch (error) {
      toast({ title: 'Save Failed', description: error.message, type: 'error' })
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    if (!selectedThread || !commentText.trim()) return

    try {
      await knowledgeService.addComment(selectedThread.id, commentText)
      setCommentText('')
      await refreshSelectedThread(selectedThread.id)
      toast({ title: 'Reply Added', description: 'Your reply is now part of the thread.', type: 'success' })
    } catch (error) {
      toast({ title: 'Reply Failed', description: error.message, type: 'error' })
    }
  }

  const handleRegisterWebinar = async (webinar) => {
    try {
      await appService.toggleWebinar(webinar.id)
      await loadCommunity()
      toast({
        title: webinar.registered ? 'Registration Cancelled' : 'Seat Reserved',
        description: webinar.registered ? `Cancelled booking for ${webinar.title}.` : `You are registered for ${webinar.title}.`,
        type: webinar.registered ? 'info' : 'success'
      })
    } catch (error) {
      toast({ title: 'Registration Failed', description: error.message, type: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-6 select-none text-left">
      <GlassCard className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-6 gap-5" hoverEffect={false}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-luxury-emerald/10 text-luxury-emerald border border-luxury-emerald/25 flex items-center justify-center">
            <Users size={20} />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-text-primary uppercase tracking-wide font-outfit">
              Expert Webinars & Community Forum
            </h2>
            <p className="text-[10px] text-text-muted max-w-2xl">
              Verified AMAs, peer case studies, and domain-specific discussions for tangible asset decisions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full xl:w-auto">
          {[
            { label: 'Online', value: overview?.onlineCount || 0, icon: Radio },
            { label: 'Threads', value: overview?.postsCount || 0, icon: MessageSquare },
            { label: 'Case Files', value: overview?.caseStudiesCount || 0, icon: Library },
            { label: 'Verified', value: overview?.verifiedAnswersCount || 0, icon: ShieldCheck }
          ].map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="bg-surface-elevated/35 border border-border rounded-xl px-3 py-2 min-w-28">
                <div className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold uppercase">
                  <Icon size={11} /> {metric.label}
                </div>
                <div className="text-sm font-black text-text-primary font-outfit mt-1">{metric.value.toLocaleString()}</div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-1 flex flex-col gap-6">
          <GlassCard className="p-5 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-text-primary font-outfit">Channels</h3>
              <p className="text-[10px] text-text-muted">Choose a domain community.</p>
            </div>

            <button
              onClick={() => setActiveCommunityId('all')}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-colors',
                activeCommunityId === 'all'
                  ? 'bg-luxury-emerald/10 border-luxury-emerald/30 text-text-emerald'
                  : 'bg-surface-elevated/25 border-border text-text-secondary hover:text-text-primary'
              )}
            >
              All Communities
            </button>

            <div className="flex flex-col gap-2">
              {communities.map((community) => {
                const Icon = ASSET_ICONS[community.assetClass] || Users
                const active = activeCommunityId === community.id
                return (
                  <button
                    key={community.id}
                    onClick={() => setActiveCommunityId(community.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-xl border transition-colors flex gap-3',
                      active
                        ? 'bg-luxury-emerald/10 border-luxury-emerald/30'
                        : 'bg-surface-elevated/25 border-border hover:bg-surface-elevated/45'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg border h-fit', active ? 'text-text-emerald border-luxury-emerald/30 bg-luxury-emerald/10' : 'text-text-muted border-border bg-surface')}>
                      <Icon size={14} />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-xs font-bold text-text-primary truncate">{community.name}</span>
                      <span className="text-[9px] text-text-muted leading-normal">{community.memberCount?.toLocaleString()} members</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-bold uppercase tracking-wide text-text-primary font-outfit">Ask The Community</h3>
              <p className="text-[10px] text-text-muted">Publish a discussion, AMA question, or anonymized case study.</p>
            </div>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
              <Input
                placeholder="Thread title"
                value={newPostTitle}
                onChange={(event) => setNewPostTitle(event.target.value)}
              />
              <textarea
                value={newPostContent}
                onChange={(event) => setNewPostContent(event.target.value)}
                placeholder="Add enough context for verified peer review..."
                className="min-h-28 bg-surface-elevated/45 text-xs text-text-primary px-4 py-3 rounded-xl border border-border focus:border-luxury-emerald/40 outline-none resize-none"
              />

              <div className="grid grid-cols-1 gap-2">
                <select
                  value={newPostType}
                  onChange={(event) => setNewPostType(event.target.value)}
                  className="bg-surface-elevated/45 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                >
                  <option value="discussion">Discussion</option>
                  <option value="case-study">Case Study</option>
                  <option value="ama-question">AMA Question</option>
                </select>
                <select
                  value={newPostCategory}
                  onChange={(event) => setNewPostCategory(event.target.value)}
                  className="bg-surface-elevated/45 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" size="sm" className="gap-1.5 flex justify-center">
                <Send size={12} /> Publish
              </Button>
            </form>
          </GlassCard>
        </div>

        <div className="xl:col-span-2 flex flex-col gap-6">
          <GlassCard className="p-5 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const active = activeType === option.id
                  return (
                    <button
                      key={option.id}
                      onClick={() => setActiveType(option.id)}
                      className={cn(
                        'px-3 py-2 rounded-xl border text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors',
                        active ? 'bg-luxury-emerald/10 border-luxury-emerald/30 text-text-emerald' : 'bg-surface-elevated/25 border-border text-text-muted hover:text-text-primary'
                      )}
                    >
                      <Icon size={11} /> {option.label}
                    </button>
                  )
                })}
              </div>

              <form onSubmit={handleSearchSubmit} className="flex gap-2 min-w-0">
                <div className="relative min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={13} />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search threads..."
                    className="w-full lg:w-52 bg-surface-elevated/45 border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-text-primary outline-none focus:border-luxury-emerald/40"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-surface-elevated/45 border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="answered">Verified</option>
                </select>
              </form>
            </div>

            <div className="flex flex-col gap-3">
              {isLoading ? (
                <div className="text-xs text-text-muted p-6 text-center">Loading community threads...</div>
              ) : threads.length === 0 ? (
                <div className="text-xs text-text-muted p-6 text-center">No matching threads found.</div>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={cn(
                      'text-left p-4 rounded-2xl border transition-colors bg-surface-elevated/25 hover:bg-surface-elevated/45',
                      selectedThread?.id === thread.id ? 'border-luxury-emerald/40' : 'border-border'
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant={thread.type === 'case-study' ? 'gold' : thread.type === 'ama-question' ? 'blue' : 'gray'}>
                            {typeLabels[thread.type] || 'Thread'}
                          </Badge>
                          {thread.verified && (
                            <span className="text-[9px] text-text-emerald font-bold flex items-center gap-1">
                              <ShieldCheck size={10} /> VERIFIED
                            </span>
                          )}
                          {thread.isPinned && <span className="text-[9px] text-text-gold font-bold">PINNED</span>}
                        </div>
                        <h3 className="text-sm font-bold text-text-primary leading-normal">{thread.title}</h3>
                        <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-2">{thread.content}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(thread.tags || []).slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-surface border border-border rounded-lg text-[9px] font-semibold text-text-muted">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[9px] text-text-muted shrink-0">
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                        <span>{thread.likeCount} likes</span>
                        <span>{thread.commentCount} replies</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>

          {selectedThread && (
            <GlassCard glowColor="emerald" className="p-5 flex flex-col gap-4" hoverEffect={false}>
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={selectedThread.type === 'case-study' ? 'gold' : selectedThread.type === 'ama-question' ? 'blue' : 'gray'}>
                      {typeLabels[selectedThread.type] || 'Thread'}
                    </Badge>
                    {selectedThread.verified && <Badge variant="emerald">Verified</Badge>}
                    {selectedThread.communityName && <Badge variant="gray">{selectedThread.communityName}</Badge>}
                  </div>
                  <h3 className="text-base font-extrabold text-text-primary font-outfit leading-normal">{selectedThread.title}</h3>
                  <span className="text-[10px] text-text-muted">
                    Posted by <strong className="text-text-secondary">{selectedThread.author?.name || 'Assetify Cadet'}</strong>
                    {' '}on {new Date(selectedThread.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleLikeThread(selectedThread)}
                    className={cn('p-2 rounded-xl border transition-colors', selectedThread.liked ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-surface border-border text-text-muted hover:text-text-primary')}
                  >
                    <Heart size={14} />
                  </button>
                  <button
                    onClick={() => handleSaveThread(selectedThread)}
                    className={cn('p-2 rounded-xl border transition-colors', selectedThread.saved ? 'bg-luxury-gold/10 border-luxury-gold/30 text-text-gold' : 'bg-surface border-border text-text-muted hover:text-text-primary')}
                  >
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed select-text">{selectedThread.content}</p>

              {selectedThread.moderationNote && (
                <div className="p-3 rounded-xl border border-luxury-gold/25 bg-luxury-gold/5 text-[10px] text-text-secondary leading-relaxed">
                  <strong className="text-text-gold">Moderation note:</strong> {selectedThread.moderationNote}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-3 border-t border-border">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide font-outfit">
                  Replies ({selectedThread.comments?.length || 0})
                </h4>
                {(selectedThread.comments || []).length > 0 ? (
                  selectedThread.comments.map((comment, index) => (
                    <div key={comment.id || comment._id || index} className="p-3 rounded-xl border border-border bg-surface-elevated/25">
                      <div className="flex justify-between gap-3 text-[9px] text-text-muted mb-1">
                        <span className="font-bold text-text-secondary">{comment.author?.name || 'Assetify Cadet'}</span>
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-[10px] text-text-muted">No replies yet.</span>
                )}

                <form onSubmit={handleAddComment} className="flex gap-2 items-start">
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder="Write a helpful reply..."
                    className="min-h-16 flex-1 bg-surface-elevated/45 text-xs text-text-primary px-3 py-2 rounded-xl border border-border focus:border-luxury-emerald/40 outline-none resize-none"
                  />
                  <Button type="submit" className="shrink-0 flex gap-1.5">
                    <Send size={12} /> Reply
                  </Button>
                </form>
              </div>
            </GlassCard>
          )}
        </div>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <GlassCard className="p-5 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex flex-col gap-1 border-b border-border pb-4">
              <h3 className="text-xs font-bold text-text-primary font-outfit uppercase tracking-wide">Expert Webinars</h3>
              <p className="text-[10px] text-text-muted">Monthly expert AMAs with ticketed seats.</p>
            </div>

            <div className="flex flex-col gap-4">
              {webinars.map((webinar) => (
                <div key={webinar.id} className="flex flex-col gap-3 p-3.5 border border-border bg-surface-elevated/25 rounded-2xl">
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] text-text-muted font-semibold flex items-center gap-1">
                      <Video size={10} /> {webinar.status === 'live' ? 'Live Now' : 'Scheduled'}
                    </span>
                    <Badge variant={webinar.registered ? 'emerald' : 'gray'}>
                      {webinar.registered ? 'Booked' : webinar.price > 0 ? `₹${webinar.price}` : 'Free'}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-text-primary leading-normal select-text">{webinar.title}</h4>

                  <div className="flex items-start gap-2.5">
                    <img src={webinar.avatar} alt={webinar.expert} className="h-8 w-8 rounded-full border border-border object-cover" />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-white">{webinar.expert}</span>
                      <span className="text-[8px] text-text-muted leading-normal">{webinar.role}</span>
                    </div>
                  </div>

                  {webinar.expertBio && (
                    <p className="text-[9px] text-text-secondary leading-relaxed">{webinar.expertBio}</p>
                  )}

                  <div className="text-[9px] text-text-secondary font-semibold bg-surface border border-border p-2 rounded-xl flex flex-col gap-1 select-none">
                    <span className="flex items-center gap-1"><CalendarDays size={10} /> {webinar.date} • {webinar.time}</span>
                    <span className="flex items-center gap-1"><Ticket size={10} /> {webinar.attendees?.toLocaleString()} registered • {webinar.durationMinutes} min</span>
                  </div>

                  <Button
                    onClick={() => handleRegisterWebinar(webinar)}
                    variant={webinar.registered ? 'secondary' : 'primary'}
                    className="w-full select-none cursor-pointer"
                  >
                    {webinar.registered ? 'Cancel Seat' : 'Reserve Seat'}
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
