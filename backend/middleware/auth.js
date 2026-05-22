import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'assetify-dev-secret')
    req.userId = decoded.userId

    // Validate that the user exists in MongoDB to prevent crashes in down-stream handlers
    const userExists = await User.exists({ _id: req.userId })
    if (!userExists) {
      return res.status(401).json({ success: false, message: 'Session invalid or user deleted' })
    }

    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'assetify-dev-secret', { expiresIn: '30d' })
}
