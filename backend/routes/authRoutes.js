import express from 'express'
import { User } from '../models/User.js'
import { Notification } from '../models/AppData.js'
import { generateToken, authMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      })
    }

    // Create new user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    })

    await user.save()
    await Notification.insertMany([
      { userId: user._id, title: 'Welcome to Assetify', desc: 'Rookie Investor badge awarded.', read: false },
      { userId: user._id, title: 'New Lesson Available', desc: 'Explore tangible asset fundamentals.', read: false }
    ])

    const token = generateToken(user._id)

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        virtualBalance: user.virtualBalance,
        onboarded: user.onboarded
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    const token = generateToken(user._id)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        virtualBalance: user.virtualBalance,
        onboarded: user.onboarded
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
})

// Get Current User
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        virtualBalance: user.virtualBalance,
        onboarded: user.onboarded,
        interests: user.interests,
        riskProfile: user.riskProfile
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    })
  }
})

// Complete Onboarding
router.post('/onboarding', authMiddleware, async (req, res) => {
  try {
    const { interests, riskProfile } = req.body

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        interests,
        riskProfile,
        onboarded: true,
        xp: 500
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        onboarded: user.onboarded
      }
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    return res.status(500).json({
      success: false,
      message: 'Onboarding failed',
      error: error.message
    })
  }
})

// Forgot password placeholder endpoint. In production this should create a one-time
// token and send email through a transactional mail provider.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    return res.status(200).json({
      success: true,
      message: 'If that email exists, a recovery link has been queued.'
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Recovery request failed', error: error.message })
  }
})

export default router
