import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { User } from '../models/User.js'
import { Asset, PortfolioHolding, Transaction } from '../models/Sandbox.js'
import { Lesson } from '../models/Learning.js'
import {
  AdvisorMessage,
  Badge,
  KnowledgeLink,
  KnowledgeNode,
  MarketPreset,
  Notification,
  Webinar
} from '../models/AppData.js'
import { Post } from '../models/Knowledge.js'

const router = express.Router()

const assetName = (holding) => holding.assetId?.name || holding.name || 'Asset'

router.get('/dashboard', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId)
  const holdings = await PortfolioHolding.find({ userId: req.userId }).populate('assetId')
  const transactions = await Transaction.find({ userId: req.userId }).populate('assetId').sort({ createdAt: -1 }).limit(20)

  const portfolioValue = holdings.reduce((sum, h) => sum + (h.quantity * (h.assetId?.currentPrice || h.averageBuyPrice || 0)), 0)
  const invested = holdings.reduce((sum, h) => sum + (h.quantity * (h.averageBuyPrice || 0)), 0)
  const totalValue = portfolioValue + user.virtualBalance

  const allocation = {}
  holdings.forEach((h) => {
    const category = h.assetId?.category || 'Other'
    allocation[category] = (allocation[category] || 0) + h.quantity * (h.assetId?.currentPrice || 0)
  })
  allocation.Cash = user.virtualBalance

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  const history = months.map((month, index) => ({
    month,
    value: Math.round(totalValue * (0.96 + index * 0.01))
  }))

  res.json({
    success: true,
    dashboard: {
      portfolioValue,
      totalValue,
      invested,
      unrealizedProfit: portfolioValue - invested,
      history,
      allocation: Object.entries(allocation).map(([name, value]) => ({ name, value })),
      transactions: transactions.map((tx) => ({
        id: tx._id,
        type: tx.type.toUpperCase(),
        assetName: tx.assetId?.name || 'Asset',
        quantity: tx.quantity,
        price: tx.pricePerUnit,
        date: tx.createdAt
      })),
      recommendations: [
        holdings.length === 0
          ? 'Start with a small diversified tangible asset position in the Sandbox.'
          : `Your largest active holding area is ${assetName(holdings[0])}. Review concentration before adding more.`,
        user.completedLessons.length < 2
          ? 'Complete two Academy lessons to unlock stronger portfolio diagnostics.'
          : 'Your learning progress supports more advanced allocation experiments.'
      ]
    }
  })
})

router.get('/knowledge-graph', async (req, res) => {
  const nodes = await KnowledgeNode.find().sort({ stableId: 1 })
  const links = await KnowledgeLink.find()
  res.json({
    success: true,
    graph: {
      nodes: nodes.map((n) => ({
        id: n.stableId,
        label: n.label,
        group: n.group,
        x: n.x,
        y: n.y,
        val: n.val,
        desc: n.desc
      })),
      links: links.map((l) => ({ source: l.source, target: l.target }))
    }
  })
})

router.get('/badges', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId)
  const badges = await Badge.find().sort({ xpRequired: 1 })
  const users = await User.find().sort({ xp: -1 }).limit(10)
  res.json({
    success: true,
    badges,
    earnedBadgeIds: badges.filter((b) => user.xp >= b.xpRequired).map((b) => b.stableId),
    leaderboard: users.map((u, index) => ({
      rank: index + 1,
      name: u.name,
      xp: u.xp,
      badge: badges.filter((b) => u.xp >= b.xpRequired).at(-1)?.title || 'Rookie Investor',
      avatar: u.name?.charAt(0)?.toUpperCase() || 'U'
    }))
  })
})

router.get('/webinars', authMiddleware, async (req, res) => {
  const webinars = await Webinar.find().sort({ date: 1 })
  res.json({
    success: true,
    webinars: webinars.map((w) => ({
      id: w.stableId,
      title: w.title,
      expert: w.expert,
      expertBio: w.expertBio,
      role: w.role,
      assetClass: w.assetClass,
      date: w.date,
      time: w.time,
      scheduledAt: w.scheduledAt,
      durationMinutes: w.durationMinutes,
      price: w.price,
      currency: w.currency,
      streamUrl: w.streamUrl,
      recordingUrl: w.recordingUrl,
      status: w.status,
      attendees: w.attendees,
      avatar: w.avatar,
      registered: w.registeredUsers.some((id) => id.toString() === req.userId.toString())
    }))
  })
})

router.post('/webinars/:id/toggle', authMiddleware, async (req, res) => {
  const webinar = await Webinar.findOne({ stableId: req.params.id })
  if (!webinar) return res.status(404).json({ success: false, message: 'Webinar not found' })
  const idx = webinar.registeredUsers.findIndex((id) => id.toString() === req.userId.toString())
  if (idx > -1) {
    webinar.registeredUsers.splice(idx, 1)
    webinar.attendees = Math.max(0, webinar.attendees - 1)
  } else {
    webinar.registeredUsers.push(req.userId)
    webinar.attendees += 1
  }
  await webinar.save()
  res.json({ success: true, webinar })
})

router.get('/notifications', authMiddleware, async (req, res) => {
  const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(20)
  res.json({ success: true, notifications })
})

router.post('/notifications/read-all', authMiddleware, async (req, res) => {
  await Notification.updateMany({ userId: req.userId }, { read: true })
  res.json({ success: true })
})

router.get('/market-presets', async (req, res) => {
  const presets = await MarketPreset.find()
  res.json({ success: true, presets })
})

router.get('/tax-config', async (req, res) => {
  res.json({
    success: true,
    rules: {
      gst: {
        real_estate: { luxury: 5, affordable: 1, ready_to_move: 0 },
        gold: 3,
        luxury: 18,
        automobile: 28
      },
      stamp_duty: {
        MH: { label: 'Maharashtra', rate: 6, registrationFee: 1 },
        DL: { label: 'Delhi', rate: 6, registrationFee: 1 },
        KA: { label: 'Karnataka', rate: 5.6, registrationFee: 1 },
        TN: { label: 'Tamil Nadu', rate: 7, registrationFee: 1 },
        TS: { label: 'Telangana', rate: 6, registrationFee: 1 }
      },
      tds: {
        real_estate: { threshold: 5000000, rate: 1 }
      },
      capital_gains: {
        real_estate: { ltcg_threshold_months: 24, ltcg_rate: 20, stcg_rate: 30 },
        gold: { ltcg_threshold_months: 24, ltcg_rate: 20, stcg_rate: 30 },
        luxury: { ltcg_threshold_months: 36, ltcg_rate: 20, stcg_rate: 30 },
        automobile: { ltcg_threshold_months: 36, ltcg_rate: 20, stcg_rate: 30 }
      }
    }
  })
})


router.get('/advisor/messages', authMiddleware, async (req, res) => {
  const messages = await AdvisorMessage.find({ userId: req.userId }).sort({ createdAt: 1 }).limit(50)
  res.json({ success: true, messages })
})

router.post('/advisor/chat', authMiddleware, async (req, res) => {
  const { message } = req.body
  if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message is required' })

  await AdvisorMessage.create({ userId: req.userId, sender: 'user', text: message })
  const user = await User.findById(req.userId)
  const holdings = await PortfolioHolding.find({ userId: req.userId }).populate('assetId')
  const assets = await Asset.find().limit(5)
  const lessonCount = await Lesson.countDocuments()
  const postCount = await Post.countDocuments()
  const lower = message.toLowerCase()

  let reply = `I checked your database profile: Level ${user.level}, ${user.xp} XP, ${holdings.length} active holdings, and ${lessonCount} Academy lessons available. `
  if (lower.includes('portfolio') || lower.includes('analyze')) {
    reply += holdings.length
      ? `Your holdings are ${holdings.map((h) => `${h.quantity}x ${h.assetId?.name}`).join(', ')}. Keep cash reserves near your ${user.riskProfile} risk profile and avoid concentrating in one category.`
      : `You currently have only virtual cash. Start with one lower-volatility asset, then compare results in Market Insights.`
  } else if (lower.includes('gold')) {
    reply += 'Gold data in the catalog is useful as a defensive allocation because it offsets inflation and currency risk.'
  } else if (lower.includes('car') || lower.includes('scarcity')) {
    reply += 'Collector car value is mostly scarcity, condition, mileage, provenance, and production allocation.'
  } else {
    reply += `The platform currently tracks ${assets.length} seeded assets and ${postCount} community discussions, so I can use those records for recommendations.`
  }

  await AdvisorMessage.create({ userId: req.userId, sender: 'assistant', text: reply })
  res.json({ success: true, reply })
})

export default router
