import mongoose from 'mongoose'

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Module title is required']
    },
    description: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    lessons: [mongoose.Schema.Types.ObjectId],
    stableId: {
      type: String,
      unique: true,
      sparse: true
    },
    thumbnailUrl: String,
    category: String,
    totalDuration: Number, // in minutes
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required']
    },
    description: String,
    content: String,
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true
    },
    stableId: {
      type: String,
      unique: true,
      sparse: true
    },
    videoUrl: String,
    resourceUrl: String,
    duration: Number, // in minutes
    xpReward: {
      type: Number,
      default: 100
    },
    order: Number,
    quiz: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        correctIndex: Number,
        explanation: String
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required']
    },
    description: String,
    requiredLessons: [mongoose.Schema.Types.ObjectId],
    passingScore: {
      type: Number,
      default: 70
    },
    issueDate: Date,
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export const Module = mongoose.model('Module', moduleSchema)
export const Lesson = mongoose.model('Lesson', lessonSchema)
export const Certification = mongoose.model('Certification', certificationSchema)
