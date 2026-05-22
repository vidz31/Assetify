import mongoose from 'mongoose'

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: String,
    category: {
      type: String,
      enum: ['learning', 'trading', 'general', 'Real Estate', 'Automobile', 'Luxury Goods', 'Precious Metals'],
      default: 'general'
    },
    assetClass: {
      type: String,
      enum: ['real-estate', 'automobile', 'luxury', 'gold', 'general'],
      default: 'general'
    },
    icon: String,
    members: [mongoose.Schema.Types.ObjectId],
    memberCount: Number,
    creatorId: mongoose.Schema.Types.ObjectId,
    isPrivate: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community',
      required: true
    },
    tags: [String],
    type: {
      type: String,
      enum: ['discussion', 'case-study', 'ama-question'],
      default: 'discussion'
    },
    status: {
      type: String,
      enum: ['published', 'flagged', 'under-review', 'archived'],
      default: 'published'
    },
    moderationScore: {
      type: Number,
      default: 0
    },
    moderationNote: String,
    verified: {
      type: Boolean,
      default: false
    },
    savedBy: [mongoose.Schema.Types.ObjectId],
    likes: [mongoose.Schema.Types.ObjectId],
    likeCount: {
      type: Number,
      default: 0
    },
    comments: [
      {
        authorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        content: String,
        createdAt: Date,
        parentCommentId: mongoose.Schema.Types.ObjectId,
        likes: [mongoose.Schema.Types.ObjectId]
      }
    ],
    commentCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    isPinned: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const knowledgeArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: ['stocks', 'crypto', 'bonds', 'commodities', 'general', 'real-estate', 'automobile', 'luxury', 'gold'],
      required: true
    },
    tags: [String],
    views: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

export const Community = mongoose.model('Community', communitySchema)
export const Post = mongoose.model('Post', postSchema)
export const KnowledgeArticle = mongoose.model('KnowledgeArticle', knowledgeArticleSchema)
