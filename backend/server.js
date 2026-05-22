import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import learningRoutes from './routes/learningRoutes.js'
import sandboxRoutes from './routes/sandboxRoutes.js'
import knowledgeRoutes from './routes/knowledgeRoutes.js'
import appRoutes from './routes/appRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const ALLOWED_ORIGINS = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`CORS blocked origin: ${origin}`))
    },
    credentials: true
  })
)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/learning', learningRoutes)
app.use('/api/sandbox', sandboxRoutes)
app.use('/api/knowledge', knowledgeRoutes)
app.use('/api/app', appRoutes)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ Frontend URL configured: ${FRONTEND_URL}`)
})
