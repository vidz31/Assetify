import express from 'express'
import { Community, Post, KnowledgeArticle } from '../models/Knowledge.js'
import { User } from '../models/User.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

const serializeCommunity = (community, userId) => ({
  id: community._id,
  _id: community._id,
  name: community.name,
  description: community.description,
  category: community.category,
  assetClass: community.assetClass,
  icon: community.icon,
  memberCount: community.memberCount || 0,
  isPrivate: !!community.isPrivate,
  joined: userId ? community.members?.some((id) => id.toString() === userId.toString()) : false
})

const serializePost = (post, userId) => ({
  id: post._id,
  _id: post._id,
  title: post.title,
  content: post.content,
  author: post.authorId
    ? {
        id: post.authorId._id,
        name: post.authorId.name,
        email: post.authorId.email,
        level: post.authorId.level,
        xp: post.authorId.xp
      }
    : null,
  communityId: post.communityId?._id || post.communityId,
  communityName: post.communityId?.name,
  tags: post.tags || [],
  type: post.type,
  status: post.status,
  moderationScore: post.moderationScore,
  moderationNote: post.moderationNote,
  verified: post.verified,
  likeCount: post.likeCount || 0,
  commentCount: post.commentCount || 0,
  views: post.views || 0,
  isPinned: !!post.isPinned,
  liked: userId ? post.likes?.some((id) => id.toString() === userId.toString()) : false,
  saved: userId ? post.savedBy?.some((id) => id.toString() === userId.toString()) : false,
  createdAt: post.createdAt,
  comments: (post.comments || []).map((comment) => ({
    id: comment._id,
    author: comment.authorId?.name ? {
      id: comment.authorId._id,
      name: comment.authorId.name,
      level: comment.authorId.level
    } : null,
    content: comment.content,
    parentCommentId: comment.parentCommentId,
    likeCount: comment.likes?.length || 0,
    createdAt: comment.createdAt
  }))
})

const getOptionalUserId = (req) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return null
  return req.userId || null
}

// ============== COMMUNITY ROUTES ==============

// Get all communities
router.get('/communities', async (req, res) => {
  try {
    const communities = await Community.find({ isPrivate: false })
    return res.status(200).json({
      success: true,
      communities: communities.map((community) => serializeCommunity(community, getOptionalUserId(req)))
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/community/overview', authMiddleware, async (req, res) => {
  try {
    const [communities, posts, caseStudies] = await Promise.all([
      Community.find({ isPrivate: false }),
      Post.find({ status: { $ne: 'archived' } }),
      Post.find({ type: 'case-study', status: 'published' })
    ])

    const onlineCount = Math.max(communities.reduce((sum, community) => sum + (community.memberCount || 0), 0), 1240)
    return res.status(200).json({
      success: true,
      overview: {
        onlineCount,
        communitiesCount: communities.length,
        postsCount: posts.length,
        caseStudiesCount: caseStudies.length,
        verifiedAnswersCount: posts.filter((post) => post.verified).length
      }
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Create community
router.post('/communities', authMiddleware, async (req, res) => {
  try {
    const { name, description, category, isPrivate } = req.body

    const community = new Community({
      name,
      description,
      category,
      isPrivate: isPrivate || false,
      creatorId: req.userId,
      members: [req.userId],
      memberCount: 1
    })

    await community.save()

    return res.status(201).json({
      success: true,
      message: 'Community created',
      community
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Join community
router.post('/communities/:communityId/join', authMiddleware, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' })
    }

    if (community.members.includes(req.userId)) {
      return res.status(200).json({
        success: true,
        message: 'Already a member'
      })
    }

    community.members.push(req.userId)
    community.memberCount = community.members.length
    await community.save()

    return res.status(200).json({
      success: true,
      message: 'Joined community',
      community
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Leave community
router.post('/communities/:communityId/leave', authMiddleware, async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId)
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' })
    }

    community.members = community.members.filter((m) => m.toString() !== req.userId.toString())
    community.memberCount = community.members.length
    await community.save()

    return res.status(200).json({
      success: true,
      message: 'Left community',
      community
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// ============== POST ROUTES ==============

// Get all posts in community
router.get('/communities/:communityId/posts', async (req, res) => {
  try {
    const { type, tag, search, savedOnly } = req.query
    const query = {
      communityId: req.params.communityId,
      status: { $ne: 'archived' }
    }

    if (type && type !== 'all') query.type = type
    if (tag && tag !== 'all') query.tags = tag
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    }
    if (savedOnly === 'true' && req.userId) query.savedBy = req.userId

    const posts = await Post.find(query)
      .populate('authorId', 'name email')
      .populate('communityId', 'name')
      .sort({ isPinned: -1, createdAt: -1 })

    return res.status(200).json({ success: true, posts: posts.map((post) => serializePost(post, getOptionalUserId(req))) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/posts', async (req, res) => {
  try {
    const { communityId, type = 'all', tag = 'all', search = '', sort = 'latest' } = req.query
    const query = { status: { $ne: 'archived' } }
    if (communityId && communityId !== 'all') query.communityId = communityId
    if (type !== 'all') query.type = type
    if (tag !== 'all') query.tags = tag
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    }

    const sortMap = {
      latest: { isPinned: -1, createdAt: -1 },
      popular: { isPinned: -1, likeCount: -1, commentCount: -1 },
      answered: { verified: -1, createdAt: -1 }
    }

    const posts = await Post.find(query)
      .populate('authorId', 'name email level xp')
      .populate('communityId', 'name')
      .sort(sortMap[sort] || sortMap.latest)

    return res.status(200).json({ success: true, posts: posts.map((post) => serializePost(post, getOptionalUserId(req))) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/posts/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('authorId', 'name email level xp')
      .populate('communityId', 'name')
      .populate('comments.authorId', 'name level xp')

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    post.views += 1
    await post.save()
    return res.status(200).json({ success: true, post: serializePost(post, getOptionalUserId(req)) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Create post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, content, communityId, tags, type } = req.body

    if (!title || !content || !communityId) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and communityId required'
      })
    }

    const post = new Post({
      title,
      content,
      authorId: req.userId,
      communityId,
      tags: tags || [],
      type: type || 'discussion',
      moderationScore: content.length < 40 ? 25 : 5,
      moderationNote: content.length < 40 ? 'Needs more context for high-quality peer review.' : ''
    })

    await post.save()
    await post.populate('authorId', 'name email')

    return res.status(201).json({
      success: true,
      message: 'Post created',
      post: serializePost(post, req.userId)
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/posts/:postId/save', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    const userIndex = post.savedBy.findIndex((id) => id.toString() === req.userId.toString())
    if (userIndex > -1) {
      post.savedBy.splice(userIndex, 1)
    } else {
      post.savedBy.push(req.userId)
    }
    await post.save()

    return res.status(200).json({ success: true, saved: userIndex === -1 })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Like post
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    const userIndex = post.likes.findIndex((id) => id.toString() === req.userId.toString())

    if (userIndex > -1) {
      post.likes.splice(userIndex, 1)
    } else {
      post.likes.push(req.userId)
    }

    post.likeCount = post.likes.length
    await post.save()

    return res.status(200).json({
      success: true,
      message: 'Post updated',
      post
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Add comment to post
router.post('/posts/:postId/comment', authMiddleware, async (req, res) => {
  try {
    const { content, parentCommentId } = req.body

    const post = await Post.findById(req.params.postId)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }

    post.comments.push({
      authorId: req.userId,
      content,
      createdAt: new Date(),
      parentCommentId,
      likes: []
    })

    post.commentCount = post.comments.length
    await post.save()

    return res.status(200).json({
      success: true,
      message: 'Comment added',
      post
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// ============== KNOWLEDGE ARTICLE ROUTES ==============

// Get all articles
router.get('/articles', async (req, res) => {
  try {
    const { category } = req.query
    const query = { isPublished: true }

    if (category) {
      query.category = category
    }

    const articles = await KnowledgeArticle.find(query)
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json({ success: true, articles })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Get single article
router.get('/articles/:articleId', async (req, res) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.articleId)
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' })
    }

    // Increment views
    article.views += 1
    await article.save()

    return res.status(200).json({ success: true, article })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Create article
router.post('/articles', authMiddleware, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body

    const article = new KnowledgeArticle({
      title,
      content,
      category,
      tags: tags || [],
      authorId: req.userId,
      isPublished: true
    })

    await article.save()
    await article.populate('authorId', 'name email')

    return res.status(201).json({
      success: true,
      message: 'Article created',
      article
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

// Rate article
router.post('/articles/:articleId/rate', authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const article = await KnowledgeArticle.findById(req.params.articleId)
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' })
    }

    const totalRating = article.rating * article.ratingCount + rating
    article.ratingCount += 1
    article.rating = totalRating / article.ratingCount

    await article.save()

    return res.status(200).json({
      success: true,
      message: 'Article rated',
      article
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
})

export default router
