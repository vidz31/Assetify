import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false // Don't return password by default
    },
    xp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streak: {
      type: Number,
      default: 0
    },
    virtualBalance: {
      type: Number,
      default: 1000000
    },
    onboarded: {
      type: Boolean,
      default: false
    },
    interests: [String],
    riskProfile: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive', 'low', 'medium', 'high'],
      default: 'moderate'
    },
    completedLessons: [mongoose.Schema.Types.ObjectId],
    portfolio: [
      {
        assetId: String,
        name: String,
        quantity: Number,
        buyPrice: Number,
        currentPrice: Number,
        totalCost: Number
      }
    ],
    transactions: [mongoose.Schema.Types.ObjectId],
    certifications: [mongoose.Schema.Types.ObjectId],
    lastLoginAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

export const User = mongoose.model('User', userSchema)
