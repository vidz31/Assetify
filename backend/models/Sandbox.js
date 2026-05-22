import mongoose from 'mongoose'

const assetSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    stableId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['stock', 'crypto', 'commodity', 'mutual_fund', 'real-estate', 'automobile', 'luxury', 'gold'],
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    priceHistory: [
      {
        price: Number,
        timestamp: Date
      }
    ],
    percentChange24h: Number,
    percentChange7d: Number,
    percentChange30d: Number,
    description: String,
    imageUrl: String,
    image: String,
    details: [
      {
        label: String,
        value: String
      }
    ],
    category: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    pricePerUnit: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'completed'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const portfolioHoldingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    averageBuyPrice: Number,
    currentValue: Number,
    profitLoss: Number,
    profitLossPercentage: Number,
    acquiredAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export const Asset = mongoose.model('Asset', assetSchema)
export const Transaction = mongoose.model('Transaction', transactionSchema)
export const PortfolioHolding = mongoose.model('PortfolioHolding', portfolioHoldingSchema)
