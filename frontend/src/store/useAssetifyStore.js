import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, learningService, sandboxService } from '@/services/api'

const INITIAL_USER = {
  name: '',
  email: '',
  xp: 0,
  level: 1,
  streak: 0,
  virtualBalance: 1000000,
  onboarded: false,
  interests: []
}

const INITIAL_LEARNING = {
  completedLessons: [],
  currentModuleId: null
}

export const useAssetifyStore = create(
  persist(
    (set, get) => ({
      // State
      isLoggedIn: false,
      user: { ...INITIAL_USER },
      portfolio: [],
      transactions: [],
      learning: { ...INITIAL_LEARNING },
      assets: [],

      // Auth actions
      setUserFromApi: (apiUser) => {
        set({
          isLoggedIn: true,
          user: {
            ...INITIAL_USER,
            ...apiUser,
            id: apiUser.id || apiUser._id,
            streak: apiUser.streak || 1,
            interests: apiUser.interests || []
          }
        })
      },
      hydrateSession: async () => {
        const token = localStorage.getItem('authToken')
        if (!token) return false
        try {
          const response = await authService.getCurrentUser()
          get().setUserFromApi(response.user)
          await get().syncSandbox()
          await get().syncLearningProgress()
          return true
        } catch {
          get().logout()
          return false
        }
      },
      login: (userOrEmail) => {
        if (typeof userOrEmail === 'object') {
          get().setUserFromApi(userOrEmail)
          return
        }
        set({
          isLoggedIn: true,
          user: {
            ...INITIAL_USER,
            name: userOrEmail.split('@')[0],
            email: userOrEmail,
            streak: 1
          }
        })
      },
      register: (userOrName, email) => {
        if (typeof userOrName === 'object') {
          get().setUserFromApi(userOrName)
          return
        }
        set({ isLoggedIn: true, user: { ...INITIAL_USER, name: userOrName, email, streak: 1 } })
      },
      logout: () => {
        authService.logout()
        set({
          isLoggedIn: false,
          user: { ...INITIAL_USER },
          portfolio: [],
          transactions: [],
          learning: { ...INITIAL_LEARNING },
          assets: []
        })
      },
      completeOnboarding: async (interests, riskProfile) => {
        const response = await authService.completeOnboarding(interests, riskProfile)
        get().setUserFromApi({ ...get().user, ...response.user, interests, riskProfile, onboarded: true })
        return response
      },

      // Learning actions
      addXP: (amount) => {
        set((state) => ({
          user: {
            ...state.user,
            xp: state.user.xp + amount
          }
        }))
        get().checkLevelUp()
      },
      checkLevelUp: () => {
        const { xp, level } = get().user
        // 1000 XP per level
        const targetLevel = Math.floor(xp / 1000) + 1
        if (targetLevel > level) {
          set((state) => ({
            user: {
              ...state.user,
              level: targetLevel
            }
          }))
        }
      },
      syncLearningProgress: async () => {
        try {
          const response = await learningService.getProgress()
          set((state) => ({
            user: {
              ...state.user,
              xp: response.progress.xp,
              level: response.progress.level
            },
            learning: {
              ...state.learning,
              completedLessons: response.progress.completedLessonIds || state.learning.completedLessons
            }
          }))
        } catch {
          return null
        }
      },
      completeLesson: async (moduleId, lessonId) => {
        const completed = get().learning.completedLessons
        if (completed.includes(lessonId)) return
        const response = await learningService.completeLesson(lessonId)
        set((state) => ({
          learning: { ...state.learning, completedLessons: [...completed, lessonId] },
          user: { ...state.user, xp: response.totalXP, level: response.level }
        }))
        return response
      },

      // Sandbox actions
      syncSandbox: async () => {
        const [assetsRes, portfolioRes, transactionsRes] = await Promise.all([
          sandboxService.getAssets(),
          sandboxService.getPortfolio(),
          sandboxService.getTransactions()
        ])
        const portfolio = (portfolioRes.portfolio.holdings || []).map((holding) => ({
          id: holding.assetId?.stableId || holding.assetId?._id || holding.assetId,
          name: holding.assetId?.name,
          category: holding.assetId?.category,
          quantity: holding.quantity,
          buyPrice: holding.averageBuyPrice,
          currentPrice: holding.assetId?.currentPrice || holding.averageBuyPrice,
          changePercent: holding.assetId?.percentChange24h || 0
        }))
        const transactions = (transactionsRes.transactions || []).map((tx) => ({
          id: tx._id,
          assetId: tx.assetId?.stableId || tx.assetId?._id,
          assetName: tx.assetId?.name,
          type: tx.type.toUpperCase(),
          quantity: tx.quantity,
          price: tx.pricePerUnit,
          date: tx.createdAt
        }))
        set((state) => ({
          assets: assetsRes.assets,
          portfolio,
          transactions,
          user: { ...state.user, virtualBalance: portfolioRes.portfolio.virtualBalance }
        }))
      },
      buyAsset: async (asset, quantity) => {
        await sandboxService.buyAsset(asset.id || asset._id, quantity)
        await get().syncSandbox()
        return true
      },

      sellAsset: async (assetId, quantity) => {
        await sandboxService.sellAsset(assetId, quantity)
        await get().syncSandbox()
        return true
      },

      updateAssetPrices: () => {
        // Randomly fluctuate portfolio prices (+/- 1-5%)
        set((state) => ({
          portfolio: state.portfolio.map((h) => {
            const factor = 1 + ((Math.random() * 10 - 5) / 100)
            const nextPrice = Math.max(1, Math.round(h.currentPrice * factor))
            const changePercent = Math.round(((nextPrice - h.buyPrice) / h.buyPrice) * 100)
            return {
              ...h,
              currentPrice: nextPrice,
              changePercent
            }
          })
        }))
      }
    }),
    {
      name: 'assetify-storage'
    }
  )
)
