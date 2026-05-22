const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }

  return data
}

// ============== AUTH SERVICES ==============

export const authService = {
  register: async (name, email, password) => {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })

    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }

    return data
  },

  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (data.token) {
      localStorage.setItem('authToken', data.token)
    }

    return data
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me')
  },

  forgotPassword: async (email) => {
    return apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  },

  completeOnboarding: async (interests, riskProfile) => {
    return apiCall('/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify({ interests, riskProfile })
    })
  },

  logout: () => {
    localStorage.removeItem('authToken')
  }
}

// ============== LEARNING SERVICES ==============

export const learningService = {
  getModules: async () => {
    return apiCall('/learning/modules')
  },

  getModule: async (moduleId) => {
    return apiCall(`/learning/modules/${moduleId}`)
  },

  getLesson: async (lessonId) => {
    return apiCall(`/learning/lessons/${lessonId}`)
  },

  completeLesson: async (lessonId) => {
    return apiCall(`/learning/lessons/${lessonId}/complete`, {
      method: 'POST'
    })
  },

  getProgress: async () => {
    return apiCall('/learning/progress')
  },

  getMyCertifications: async () => {
    return apiCall('/learning/my-certifications')
  }
}

// ============== SANDBOX SERVICES ==============

export const sandboxService = {
  getAssets: async () => {
    return apiCall('/sandbox/assets')
  },

  getAsset: async (assetId) => {
    return apiCall(`/sandbox/assets/${assetId}`)
  },

  buyAsset: async (assetId, quantity) => {
    return apiCall('/sandbox/buy', {
      method: 'POST',
      body: JSON.stringify({ assetId, quantity })
    })
  },

  sellAsset: async (assetId, quantity) => {
    return apiCall('/sandbox/sell', {
      method: 'POST',
      body: JSON.stringify({ assetId, quantity })
    })
  },

  getPortfolio: async () => {
    return apiCall('/sandbox/portfolio')
  },

  getTransactions: async () => {
    return apiCall('/sandbox/transactions')
  }
}

// ============== KNOWLEDGE SERVICES ==============

export const knowledgeService = {
  // Communities
  getCommunities: async () => {
    return apiCall('/knowledge/communities')
  },

  getCommunityOverview: async () => {
    return apiCall('/knowledge/community/overview')
  },

  createCommunity: async (name, description, category, isPrivate) => {
    return apiCall('/knowledge/communities', {
      method: 'POST',
      body: JSON.stringify({ name, description, category, isPrivate })
    })
  },

  joinCommunity: async (communityId) => {
    return apiCall(`/knowledge/communities/${communityId}/join`, {
      method: 'POST'
    })
  },

  leaveCommunity: async (communityId) => {
    return apiCall(`/knowledge/communities/${communityId}/leave`, {
      method: 'POST'
    })
  },

  // Posts
  getPosts: async (communityId, filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.append(key, value)
    })
    const query = params.toString()
    return apiCall(`/knowledge/communities/${communityId}/posts${query ? `?${query}` : ''}`)
  },

  getAllPosts: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.append(key, value)
    })
    const query = params.toString()
    return apiCall(`/knowledge/posts${query ? `?${query}` : ''}`)
  },

  getPost: async (postId) => {
    return apiCall(`/knowledge/posts/${postId}`)
  },

  createPost: async (title, content, communityId, tags, type = 'discussion') => {
    return apiCall('/knowledge/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content, communityId, tags, type })
    })
  },

  likePost: async (postId) => {
    return apiCall(`/knowledge/posts/${postId}/like`, {
      method: 'POST'
    })
  },

  addComment: async (postId, content) => {
    return apiCall(`/knowledge/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content })
    })
  },

  savePost: async (postId) => {
    return apiCall(`/knowledge/posts/${postId}/save`, {
      method: 'POST'
    })
  },

  // Knowledge Articles
  getArticles: async (category) => {
    const params = category ? `?category=${category}` : ''
    return apiCall(`/knowledge/articles${params}`)
  },

  getArticle: async (articleId) => {
    return apiCall(`/knowledge/articles/${articleId}`)
  },

  createArticle: async (title, content, category, tags) => {
    return apiCall('/knowledge/articles', {
      method: 'POST',
      body: JSON.stringify({ title, content, category, tags })
    })
  },

  rateArticle: async (articleId, rating) => {
    return apiCall(`/knowledge/articles/${articleId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating })
    })
  }
}

// ============== APP DATA SERVICES ==============

export const appService = {
  getDashboard: async () => apiCall('/app/dashboard'),
  getKnowledgeGraph: async () => apiCall('/app/knowledge-graph'),
  getBadges: async () => apiCall('/app/badges'),
  getWebinars: async () => apiCall('/app/webinars'),
  toggleWebinar: async (webinarId) => apiCall(`/app/webinars/${webinarId}/toggle`, { method: 'POST' }),
  getNotifications: async () => apiCall('/app/notifications'),
  markNotificationsRead: async () => apiCall('/app/notifications/read-all', { method: 'POST' }),
  getMarketPresets: async () => apiCall('/app/market-presets'),
  getTaxConfig: async () => apiCall('/app/tax-config'),
  getAdvisorMessages: async () => apiCall('/app/advisor/messages'),
  sendAdvisorMessage: async (message) => apiCall('/app/advisor/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  })
}

export default {
  authService,
  learningService,
  sandboxService,
  knowledgeService,
  appService
}
