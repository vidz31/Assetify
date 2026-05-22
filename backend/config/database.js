import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/assetify'
    await mongoose.connect(MONGODB_URI)
    console.log('✓ MongoDB Connected Successfully')
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message)
    process.exit(1)
  }
}

export default connectDB
