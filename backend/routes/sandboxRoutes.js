import express from 'express'
import { Asset, Transaction, PortfolioHolding } from '../models/Sandbox.js'
import { User } from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const serializeAsset = (asset) => ({
  id: asset.stableId || asset._id.toString(),
  _id: asset._id,
  symbol: asset.symbol,
  name: asset.name,
  type: asset.type,
  category: asset.category,
  price: asset.currentPrice,
  currentPrice: asset.currentPrice,
  changePercent24h: asset.percentChange24h || 0,
  percentChange24h: asset.percentChange24h || 0,
  description: asset.description,
  image: asset.image || asset.imageUrl,
  imageUrl: asset.imageUrl || asset.image,
  details: asset.details || []
})

const findAsset = (assetId) => {
  const query = [{ stableId: assetId }, { symbol: assetId?.toUpperCase?.() }]
  if (/^[0-9a-fA-F]{24}$/.test(assetId)) query.push({ _id: assetId })
  return Asset.findOne({ $or: query })
}

// Get all assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.find()
    return res.status(200).json({ success: true, assets: assets.map(serializeAsset) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get single asset
router.get('/assets/:assetId', async (req, res) => {
  try {
    const asset = await findAsset(req.params.assetId)
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' })
    }
    return res.status(200).json({ success: true, asset: serializeAsset(asset) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Buy asset
router.post('/buy', authMiddleware, async (req, res) => {
  try {
    const { assetId, quantity } = req.body

    if (!assetId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid assetId and quantity required'
      })
    }

    const asset = await findAsset(assetId)
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' })
    }

    const user = await User.findById(req.userId)
    const totalCost = asset.currentPrice * quantity

    if (user.virtualBalance < totalCost) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient virtual balance'
      })
    }

    // Deduct balance
    user.virtualBalance -= totalCost
    await user.save()

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      assetId: asset._id,
      type: 'buy',
      quantity,
      pricePerUnit: asset.currentPrice,
      totalAmount: totalCost,
      status: 'completed'
    })
    await transaction.save()

    // Update or create portfolio holding
    let holding = await PortfolioHolding.findOne({ userId: req.userId, assetId: asset._id })

    if (holding) {
      const oldTotalValue = holding.averageBuyPrice * holding.quantity
      const newTotalValue = oldTotalValue + totalCost
      holding.quantity += quantity
      holding.averageBuyPrice = newTotalValue / holding.quantity
      holding.currentValue = holding.quantity * asset.currentPrice
    } else {
      holding = new PortfolioHolding({
        userId: req.userId,
        assetId: asset._id,
        quantity,
        averageBuyPrice: asset.currentPrice,
        currentValue: totalCost
      })
    }

    await holding.save()

    return res.status(201).json({
      success: true,
      message: 'Asset purchased successfully',
      transaction,
      balance: user.virtualBalance,
      holding
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Sell asset
router.post('/sell', authMiddleware, async (req, res) => {
  try {
    const { assetId, quantity } = req.body

    if (!assetId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid assetId and quantity required'
      })
    }

    const asset = await findAsset(assetId)
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found' })
    }

    const holding = await PortfolioHolding.findOne({ userId: req.userId, assetId: asset._id })
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity to sell'
      })
    }

    const user = await User.findById(req.userId)
    const totalAmount = asset.currentPrice * quantity

    // Add balance
    user.virtualBalance += totalAmount
    await user.save()

    // Create transaction
    const transaction = new Transaction({
      userId: req.userId,
      assetId: asset._id,
      type: 'sell',
      quantity,
      pricePerUnit: asset.currentPrice,
      totalAmount,
      status: 'completed'
    })
    await transaction.save()

    // Update portfolio holding
    holding.quantity -= quantity
    if (holding.quantity === 0) {
      await PortfolioHolding.deleteOne({ _id: holding._id })
    } else {
      holding.currentValue = holding.quantity * asset.currentPrice
      await holding.save()
    }

    return res.status(200).json({
      success: true,
      message: 'Asset sold successfully',
      transaction,
      balance: user.virtualBalance
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get user portfolio
router.get('/portfolio', authMiddleware, async (req, res) => {
  try {
    const holdings = await PortfolioHolding.find({ userId: req.userId }).populate('assetId')
    const user = await User.findById(req.userId)

    let totalPortfolioValue = 0
    holdings.forEach((h) => {
      totalPortfolioValue += h.currentValue || 0
    })

    return res.status(200).json({
      success: true,
      portfolio: {
        holdings,
        totalValue: totalPortfolioValue,
        virtualBalance: user.virtualBalance
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get user transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId })
      .populate('assetId')
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, transactions })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

export default router
