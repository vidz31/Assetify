import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

      // Auth actions
      login: (email, password) => {
        set({
          isLoggedIn: true,
          user: {
            ...INITIAL_USER,
            name: email.split('@')[0],
            email,
            streak: 1
          }
        })
      },
      register: (name, email, password) => {
        set({
          isLoggedIn: true,
          user: {
            ...INITIAL_USER,
            name,
            email,
            streak: 1
          }
        })
      },
      logout: () => {
        set({
          isLoggedIn: false,
          user: { ...INITIAL_USER },
          portfolio: [],
          transactions: [],
          learning: { ...INITIAL_LEARNING }
        })
      },
      completeOnboarding: (interests, riskProfile) => {
        set((state) => ({
          user: {
            ...state.user,
            interests,
            riskProfile,
            onboarded: true,
            xp: state.user.xp + 500
          }
        }))
        get().checkLevelUp()
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
      completeLesson: (moduleId, lessonId, xpReward) => {
        const completed = get().learning.completedLessons
        if (completed.includes(lessonId)) return

        set((state) => ({
          learning: {
            ...state.learning,
            completedLessons: [...completed, lessonId]
          },
          user: {
            ...state.user,
            xp: state.user.xp + xpReward
          }
        }))
        get().checkLevelUp()
      },

      // Sandbox actions
      buyAsset: (asset, quantity, price) => {
        const totalCost = price * quantity
        const currentBalance = get().user.virtualBalance

        if (currentBalance < totalCost) return false

        // Deduct balance
        set((state) => ({
          user: {
            ...state.user,
            virtualBalance: currentBalance - totalCost
          }
        }))

        // Update portfolio
        const existingHolding = get().portfolio.find((h) => h.id === asset.id)
        if (existingHolding) {
          set((state) => ({
            portfolio: state.portfolio.map((h) =>
              h.id === asset.id
                ? {
                    ...h,
                    quantity: h.quantity + quantity,
                    buyPrice: Math.round(((h.buyPrice * h.quantity) + totalCost) / (h.quantity + quantity))
                  }
                : h
            )
          }))
        } else {
          set((state) => ({
            portfolio: [
              ...state.portfolio,
              {
                id: asset.id,
                name: asset.name,
                category: asset.category,
                quantity,
                buyPrice: price,
                currentPrice: price,
                changePercent: asset.changePercent
              }
            ]
          }))
        }

        // Add Transaction
        const transaction = {
          id: Math.random().toString(36).substring(2, 9),
          assetId: asset.id,
          assetName: asset.name,
          type: 'BUY',
          quantity,
          price,
          date: new Date().toISOString()
        }
        set((state) => ({
          transactions: [transaction, ...state.transactions]
        }))

        return true
      },

      sellAsset: (assetId, quantity, price) => {
        const holding = get().portfolio.find((h) => h.id === assetId)
        if (!holding || holding.quantity < quantity) return false

        const saleValue = price * quantity
        const currentBalance = get().user.virtualBalance

        // Add balance
        set((state) => ({
          user: {
            ...state.user,
            virtualBalance: currentBalance + saleValue
          }
        }))

        // Update portfolio
        if (holding.quantity === quantity) {
          set((state) => ({
            portfolio: state.portfolio.filter((h) => h.id !== assetId)
          }))
        } else {
          set((state) => ({
            portfolio: state.portfolio.map((h) =>
              h.id === assetId
                ? {
                    ...h,
                    quantity: h.quantity - quantity
                  }
                : h
            )
          }))
        }

        // Add Transaction
        const transaction = {
          id: Math.random().toString(36).substring(2, 9),
          assetId,
          assetName: holding.name,
          type: 'SELL',
          quantity,
          price,
          date: new Date().toISOString()
        }
        set((state) => ({
          transactions: [transaction, ...state.transactions]
        }))

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
