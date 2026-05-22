import mongoose from 'mongoose'

const badgeSchema = new mongoose.Schema(
  {
    stableId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    icon: String,
    category: String,
    xpRequired: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const webinarSchema = new mongoose.Schema(
  {
    stableId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    expert: String,
    expertBio: String,
    role: String,
    assetClass: {
      type: String,
      enum: ['real-estate', 'automobile', 'luxury', 'gold', 'general'],
      default: 'general'
    },
    date: String,
    time: String,
    scheduledAt: Date,
    durationMinutes: {
      type: Number,
      default: 60
    },
    price: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    streamUrl: String,
    recordingUrl: String,
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed'],
      default: 'scheduled'
    },
    attendees: { type: Number, default: 0 },
    avatar: String,
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

const knowledgeNodeSchema = new mongoose.Schema(
  {
    stableId: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    group: Number,
    x: Number,
    y: Number,
    val: Number,
    desc: String
  },
  { timestamps: true }
)

const knowledgeLinkSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    target: { type: String, required: true }
  },
  { timestamps: true }
)

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    desc: String,
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const advisorMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
)

const marketPresetSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['real-estate', 'automobile'], required: true },
    name: { type: String, required: true },
    values: { type: Object, default: {} }
  },
  { timestamps: true }
)

export const Badge = mongoose.model('Badge', badgeSchema)
export const Webinar = mongoose.model('Webinar', webinarSchema)
export const KnowledgeNode = mongoose.model('KnowledgeNode', knowledgeNodeSchema)
export const KnowledgeLink = mongoose.model('KnowledgeLink', knowledgeLinkSchema)
export const Notification = mongoose.model('Notification', notificationSchema)
export const AdvisorMessage = mongoose.model('AdvisorMessage', advisorMessageSchema)
export const MarketPreset = mongoose.model('MarketPreset', marketPresetSchema)
