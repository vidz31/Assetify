import express from 'express'
import { Module, Lesson, Certification } from '../models/Learning.js'
import { User } from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const serializeLesson = (lesson) => ({
  id: lesson.stableId || lesson._id.toString(),
  _id: lesson._id,
  title: lesson.title,
  description: lesson.description,
  content: lesson.content,
  duration: typeof lesson.duration === 'number' ? `${lesson.duration} min` : lesson.duration,
  xpReward: lesson.xpReward,
  order: lesson.order,
  quiz: (lesson.quiz || []).map((q) => ({
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex ?? q.correctAnswer ?? 0,
    explanation: q.explanation
  }))
})

const serializeModule = (module) => ({
  id: module.stableId || module._id.toString(),
  _id: module._id,
  title: module.title,
  description: module.description,
  difficulty: module.difficulty,
  category: module.category,
  thumbnailUrl: module.thumbnailUrl,
  totalDuration: module.totalDuration,
  lessons: (module.lessons || []).map(serializeLesson)
})

const byIdOrStableId = (value) => {
  const query = [{ stableId: value }]
  if (/^[0-9a-fA-F]{24}$/.test(value)) query.push({ _id: value })
  return { $or: query }
}

// Get all modules
router.get('/modules', async (req, res) => {
  try {
    const modules = await Module.find().populate('lessons')
    return res.status(200).json({ success: true, modules: modules.map(serializeModule) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get single module with lessons
router.get('/modules/:moduleId', async (req, res) => {
  try {
    const module = await Module.findOne(byIdOrStableId(req.params.moduleId)).populate('lessons')
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found' })
    }
    return res.status(200).json({ success: true, module: serializeModule(module) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get single lesson
router.get('/lessons/:lessonId', async (req, res) => {
  try {
    const lesson = await Lesson.findOne(byIdOrStableId(req.params.lessonId))
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' })
    }
    return res.status(200).json({ success: true, lesson: serializeLesson(lesson) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Complete lesson
router.post('/lessons/:lessonId/complete', authMiddleware, async (req, res) => {
  try {
    const lesson = await Lesson.findOne(byIdOrStableId(req.params.lessonId))
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' })
    }

    const user = await User.findById(req.userId)

    // Check if already completed
    if (user.completedLessons.some((id) => id.toString() === lesson._id.toString())) {
      return res.status(200).json({
        success: true,
        message: 'Lesson already completed',
        xpGained: 0
      })
    }

    // Add lesson to completed and award XP
    const xpReward = lesson.xpReward || 100
    user.completedLessons.push(lesson._id)
    user.xp += xpReward

    // Check level up
    const targetLevel = Math.floor(user.xp / 1000) + 1
    if (targetLevel > user.level) {
      user.level = targetLevel
    }

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Lesson completed',
      xpGained: xpReward,
      totalXP: user.xp,
      level: user.level
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get user progress
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const totalLessons = await Lesson.countDocuments()
    const completedCount = user.completedLessons.length
    const completed = await Lesson.find({ _id: { $in: user.completedLessons } })

    return res.status(200).json({
      success: true,
      progress: {
        completedLessons: completedCount,
        completedLessonIds: completed.map((lesson) => lesson.stableId || lesson._id.toString()),
        totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        xp: user.xp,
        level: user.level
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Create certification (admin)
router.post('/certifications', authMiddleware, async (req, res) => {
  try {
    const { title, description, requiredLessons, passingScore } = req.body

    const certification = new Certification({
      title,
      description,
      requiredLessons,
      passingScore
    })

    await certification.save()

    return res.status(201).json({
      success: true,
      message: 'Certification created',
      certification
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get user certifications
router.get('/my-certifications', authMiddleware, async (req, res) => {
  try {
    const certifications = await Certification.find({ userId: req.userId })
    return res.status(200).json({ success: true, certifications })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

export default router
