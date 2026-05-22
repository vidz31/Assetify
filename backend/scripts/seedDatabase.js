import dotenv from 'dotenv'
import { Asset } from '../models/Sandbox.js'
import { Module, Lesson } from '../models/Learning.js'
import { Community, KnowledgeArticle, Post } from '../models/Knowledge.js'
import { User } from '../models/User.js'
import {
  Badge,
  KnowledgeLink,
  KnowledgeNode,
  MarketPreset,
  Notification,
  Webinar
} from '../models/AppData.js'
import connectDB from '../config/database.js'

dotenv.config()

const assets = [
  {
    stableId: 'asset-re-1',
    symbol: 'MHP',
    name: 'Manhattan Penthouse (Tokenized)',
    type: 'real-estate',
    category: 'real-estate',
    currentPrice: 320.5,
    percentChange24h: 1.25,
    description: 'Fractional share in a luxury penthouse overlooking Central Park.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Annual Net Yield', value: '6.4%' },
      { label: 'LTV Ratio', value: '45%' },
      { label: 'Location', value: 'New York, USA' }
    ]
  },
  {
    stableId: 'asset-re-2',
    symbol: 'TKC',
    name: 'Tokyo Capsule Complex',
    type: 'real-estate',
    category: 'real-estate',
    currentPrice: 185,
    percentChange24h: -0.45,
    description: 'Micro-apartment block in Shinjuku optimized for business travelers.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Annual Net Yield', value: '8.1%' },
      { label: 'Occupancy Rate', value: '94%' },
      { label: 'Location', value: 'Tokyo, Japan' }
    ]
  },
  {
    stableId: 'asset-auto-1',
    symbol: 'GT3RS',
    name: 'Porsche 911 GT3 RS (992)',
    type: 'automobile',
    category: 'automobile',
    currentPrice: 245000,
    percentChange24h: 3.8,
    description: 'Track-focused sports car with collector scarcity premium.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Mileage', value: '1,200 miles' },
      { label: 'Production Limit', value: 'Unspecified' },
      { label: 'Rarity score', value: '8/10' }
    ]
  },
  {
    stableId: 'asset-auto-2',
    symbol: 'MUST67',
    name: 'Vintage Ford Mustang 1967',
    type: 'automobile',
    category: 'automobile',
    currentPrice: 89000,
    percentChange24h: 0.15,
    description: 'Restored American muscle car with stable collector demand.',
    image: 'https://images.unsplash.com/photo-1612466285769-ac9380ef54e8?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Restoration Tier', value: 'Concours Gold' },
      { label: 'Engine', value: '289 V8' },
      { label: 'Color', value: 'Raven Black' }
    ]
  },
  {
    stableId: 'asset-lux-1',
    symbol: 'DAY6239',
    name: 'Rolex Daytona "Paul Newman"',
    type: 'luxury',
    category: 'luxury',
    currentPrice: 310000,
    percentChange24h: 5.6,
    description: 'Rare vintage chronograph with strong secondary market recognition.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a1e?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Ref Number', value: '6239' },
      { label: 'Year', value: '1968' },
      { label: 'Box & Papers', value: 'Included' }
    ]
  },
  {
    stableId: 'asset-lux-2',
    symbol: 'BRK35',
    name: 'Hermes Birkin 35 Black Togo',
    type: 'luxury',
    category: 'luxury',
    currentPrice: 24500,
    percentChange24h: 1.1,
    description: 'Luxury leather tote with scarcity-driven resale demand.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Hardware', value: '24k Gold Plated' },
      { label: 'Leather', value: 'Togo Calfskin' },
      { label: 'State', value: 'Pristine' }
    ]
  },
  {
    stableId: 'asset-gold-1',
    symbol: 'GLD1KG',
    name: 'Physical Gold Bullion (1kg)',
    type: 'gold',
    category: 'gold',
    currentPrice: 76400,
    percentChange24h: 0.85,
    description: 'LBMA certified 99.99% pure gold stored in Zurich vault custody.',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Purity', value: '999.9 Fine' },
      { label: 'Vault Location', value: 'Zurich, Switzerland' },
      { label: 'Insurance Cover', value: '100% Lloyds' }
    ]
  }
]

const modules = [
  {
    stableId: 're-101',
    title: 'Real Estate Tokenization & Yields',
    category: 'real-estate',
    description: 'Learn property equity fractionalization, cap rates, and leverage models.',
    difficulty: 'beginner',
    lessons: [
      {
        stableId: 're-l1',
        title: 'Introduction to Rental Cap Rates',
        duration: 5,
        xpReward: 150,
        description: 'How to calculate gross vs net cap rates and operating expenses.',
        quiz: [
          {
            question: 'What is the formula for calculating Net Capitalization Rate?',
            options: ['NOI / Property Purchase Price', 'Gross Rent / Mortgage', 'Assets - Liabilities', 'Annual Rent + Deductions'],
            correctIndex: 0,
            correctAnswer: 0,
            explanation: 'Cap Rate is Net Operating Income divided by acquisition cost.'
          }
        ]
      },
      {
        stableId: 're-l2',
        title: 'Fractional Real Estate & Blockchain',
        duration: 7,
        xpReward: 200,
        description: 'How tokenization lowers investment minimums and improves liquidity.',
        quiz: [
          {
            question: 'What problem does property tokenization solve?',
            options: ['Eliminates depreciation', 'Lowers barrier to entry and enhances liquidity', 'Guarantees fixed return', 'Bypasses zoning'],
            correctIndex: 1,
            correctAnswer: 1,
            explanation: 'Tokenization divides high-value property into smaller tradable shares.'
          }
        ]
      }
    ]
  },
  {
    stableId: 'auto-101',
    title: 'High-Performance Car Valuations',
    category: 'automobile',
    description: 'Master depreciation curves, collector scarcity, and secondary premiums.',
    difficulty: 'beginner',
    lessons: [
      {
        stableId: 'auto-l1',
        title: 'Depreciation Curves vs Scarcity',
        duration: 6,
        xpReward: 150,
        description: 'Why standard cars depreciate while limited-production cars can appreciate.',
        quiz: [
          {
            question: 'What can cause a vehicle to appreciate?',
            options: ['High mileage', 'Limited production and historical significance', 'Poor maintenance', 'Non-factory paint'],
            correctIndex: 1,
            correctAnswer: 1,
            explanation: 'Scarcity plus provenance drives collector demand.'
          }
        ]
      }
    ]
  },
  {
    stableId: 'lux-101',
    title: 'Luxury Assets as Alternative Wealth',
    category: 'luxury',
    description: 'Explore watches, designer bags, and collectible indices.',
    difficulty: 'intermediate',
    lessons: [
      {
        stableId: 'lux-l1',
        title: 'The Watch Market',
        duration: 8,
        xpReward: 250,
        description: 'Analyze secondary market premiums and storage condition.',
        quiz: [
          {
            question: 'Why can watches trade above retail?',
            options: ['Restricted production below demand', 'Steel is rarer than platinum', 'Warranty extensions', 'Mandatory markups'],
            correctIndex: 0,
            correctAnswer: 0,
            explanation: 'Luxury brands restrict supply, creating secondary market premiums.'
          }
        ]
      }
    ]
  },
  {
    stableId: 'gold-101',
    title: 'Precious Metals & Macro Hedge',
    category: 'gold',
    description: 'Analyze physical storage, futures, inflation, and real rates.',
    difficulty: 'beginner',
    lessons: [
      {
        stableId: 'gold-l1',
        title: 'Gold as an Inflation Hedge',
        duration: 5,
        xpReward: 150,
        description: 'Understand real interest rates and currency devaluation.',
        quiz: [
          {
            question: 'How does gold often react when real interest rates are negative?',
            options: ['Falls because cash wins', 'Tends to rise as cash loses purchasing power', 'Crashes exactly 50%', 'Matches rates exactly'],
            correctIndex: 1,
            correctAnswer: 1,
            explanation: 'Negative real rates increase demand for non-cash stores of value.'
          }
        ]
      }
    ]
  }
]

const badges = [
  { stableId: 'rookie-investor', title: 'Rookie Investor', description: 'Joined Assetify and activated the account.', icon: 'Compass', category: 'general', xpRequired: 0 },
  { stableId: 'real-estate-tycoon', title: 'Cap Rate Crusader', description: 'Completed real estate lessons and quizzes.', icon: 'Building2', category: 'real-estate', xpRequired: 1000 },
  { stableId: 'master-appraiser', title: 'Master Appraiser', description: 'Completed automobile valuation milestones.', icon: 'Car', category: 'automobile', xpRequired: 1500 },
  { stableId: 'gold-collector', title: 'Inflation Defier', description: 'Built strong simulated bullion exposure.', icon: 'Coins', category: 'gold', xpRequired: 2000 },
  { stableId: 'luxury-collector', title: 'Birkin Broker', description: 'Mastered luxury scarcity markets.', icon: 'Crown', category: 'luxury', xpRequired: 3000 }
]

const graphNodes = [
  { stableId: 'root', label: 'Tangible Assets', group: 0, x: 0, y: 0, val: 20, desc: 'Physical resources held for wealth preservation and cash generation.' },
  { stableId: 're', label: 'Real Estate', group: 1, x: -180, y: -100, val: 15, desc: 'Properties ranging from residential houses to commercial spaces.' },
  { stableId: 'cap', label: 'Cap Rate', group: 1, x: -280, y: -180, val: 10, desc: 'NOI divided by asset cost, reflecting yield rate.' },
  { stableId: 'token', label: 'Tokenization', group: 1, x: -120, y: -220, val: 12, desc: 'Fractional ownership of properties on-chain.' },
  { stableId: 'auto', label: 'Automobiles', group: 2, x: 180, y: -100, val: 15, desc: 'Vehicles divided into utility cars and collector classics.' },
  { stableId: 'depr', label: 'Depreciation', group: 2, x: 280, y: -180, val: 10, desc: 'Value decline curve over years.' },
  { stableId: 'scarce', label: 'Scarcity Premium', group: 2, x: 150, y: -220, val: 12, desc: 'Allocation limits triggering secondary appreciation.' },
  { stableId: 'lux', label: 'Luxury Goods', group: 3, x: 180, y: 120, val: 15, desc: 'Timepieces, fashion items, and rare collectibles.' },
  { stableId: 'watch', label: 'Horology Index', group: 3, x: 280, y: 220, val: 10, desc: 'Watch indices tracking Rolex, Patek, and Audemars Piguet.' },
  { stableId: 'gold', label: 'Gold & Metals', group: 4, x: -180, y: 120, val: 15, desc: 'Precious metals hedging global currency risk.' },
  { stableId: 'hedge', label: 'Inflation Hedge', group: 4, x: -280, y: 220, val: 11, desc: 'Store of purchasing power during high CPI periods.' }
]

const graphLinks = [
  { source: 'root', target: 're' },
  { source: 're', target: 'cap' },
  { source: 're', target: 'token' },
  { source: 'root', target: 'auto' },
  { source: 'auto', target: 'depr' },
  { source: 'auto', target: 'scarce' },
  { source: 'root', target: 'lux' },
  { source: 'lux', target: 'watch' },
  { source: 'root', target: 'gold' },
  { source: 'gold', target: 'hedge' }
]

const seedDatabase = async () => {
  try {
    await connectDB()

    await Promise.all([
      Asset.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Badge.deleteMany({}),
      Webinar.deleteMany({}),
      KnowledgeNode.deleteMany({}),
      KnowledgeLink.deleteMany({}),
      MarketPreset.deleteMany({}),
      Community.deleteMany({}),
      Post.deleteMany({}),
      KnowledgeArticle.deleteMany({}),
      Notification.deleteMany({}),
      User.deleteMany({ email: 'system@assetify.io' })
    ])

    await Asset.insertMany(assets)

    for (const moduleData of modules) {
      const module = await Module.create({
        stableId: moduleData.stableId,
        title: moduleData.title,
        category: moduleData.category,
        description: moduleData.description,
        difficulty: moduleData.difficulty,
        totalDuration: moduleData.lessons.reduce((sum, l) => sum + l.duration, 0)
      })
      const lessons = await Lesson.insertMany(
        moduleData.lessons.map((lesson) => ({
          ...lesson,
          moduleId: module._id,
          content: lesson.description
        }))
      )
      module.lessons = lessons.map((lesson) => lesson._id)
      await module.save()
    }

    await Badge.insertMany(badges)
    await KnowledgeNode.insertMany(graphNodes)
    await KnowledgeLink.insertMany(graphLinks)
    await MarketPreset.insertMany([
      { type: 'real-estate', name: 'Metro Penthouse', values: { purchasePrice: 500000, monthlyRent: 3500, annualExpenses: 12000 } },
      { type: 'automobile', name: 'Collector Coupe', values: { initialValue: 80000, depreciationRate: 15, years: 5 } }
    ])
    await Webinar.insertMany([
      {
        stableId: 'web-1',
        title: 'Fractional Real Estate: Post-2026 Regulations',
        expert: 'Sarah Jenkins',
        expertBio: 'RERA compliance advisor focused on buyer protection and fractional property structures.',
        role: 'SVP Property Group',
        assetClass: 'real-estate',
        date: 'May 28, 2026',
        time: '8:00 PM EST',
        scheduledAt: new Date('2026-05-28T20:00:00+05:30'),
        durationMinutes: 75,
        price: 499,
        streamUrl: 'https://daily.co/assetify-real-estate-ama',
        status: 'scheduled',
        attendees: 1205,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
      },
      {
        stableId: 'web-2',
        title: 'Supercar Allocation Tactics: Beating Dealer Playbooks',
        expert: 'Marcus Vance',
        expertBio: 'Former collector-car auction manager specializing in scarcity premiums and condition grading.',
        role: 'Founder Elite Cars',
        assetClass: 'automobile',
        date: 'June 03, 2026',
        time: '6:30 PM CET',
        scheduledAt: new Date('2026-06-03T22:00:00+05:30'),
        durationMinutes: 60,
        price: 799,
        streamUrl: 'https://daily.co/assetify-auto-ama',
        status: 'scheduled',
        attendees: 844,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
      },
      {
        stableId: 'web-3',
        title: 'Gold, Jewellery Bills, and Purity Verification',
        expert: 'Aditi Menon',
        expertBio: 'Certified precious-metals appraiser advising families on bullion custody and jewellery buyback risk.',
        role: 'Independent Bullion Valuer',
        assetClass: 'gold',
        date: 'June 12, 2026',
        time: '7:30 PM IST',
        scheduledAt: new Date('2026-06-12T19:30:00+05:30'),
        durationMinutes: 60,
        price: 199,
        streamUrl: 'https://daily.co/assetify-gold-ama',
        status: 'scheduled',
        attendees: 612,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop'
      }
    ])

    const createdCommunities = await Community.insertMany([
      {
        name: 'Real Estate Due Diligence',
        description: 'RERA checks, title verification, EMI stress tests, cap rates, and city-level buying questions.',
        category: 'Real Estate',
        assetClass: 'real-estate',
        icon: 'Building2',
        memberCount: 428,
        isPrivate: false
      },
      {
        name: 'Automobile Valuation Desk',
        description: 'Depreciation, RC checks, accident history, auction prices, and collector-car scarcity premiums.',
        category: 'Automobile',
        assetClass: 'automobile',
        icon: 'Car',
        memberCount: 291,
        isPrivate: false
      },
      {
        name: 'Luxury & Collectibles Circle',
        description: 'Watches, handbags, art, authenticity verification, storage, liquidity, and resale spreads.',
        category: 'Luxury Goods',
        assetClass: 'luxury',
        icon: 'Crown',
        memberCount: 184,
        isPrivate: false
      },
      {
        name: 'Gold & Precious Metals',
        description: 'Purity, storage, GST, jeweller buyback policies, bullion custody, and inflation hedging.',
        category: 'Precious Metals',
        assetClass: 'gold',
        icon: 'Coins',
        memberCount: 337,
        isPrivate: false
      }
    ])
    const systemUser = await User.create({
      name: 'Assetify Research Desk',
      email: 'system@assetify.io',
      password: 'system-password'
    })
    await Post.insertMany([
      {
        title: 'Is 6.4% Cap Rate acceptable for tokenized Manhattan residential property?',
        content: 'I am comparing a 6.4% net cap rate against vacancy reserve assumptions, maintenance drag, and the liquidity discount of a fractional property instrument. What thresholds would you use before calling the deal fairly priced?',
        authorId: systemUser._id,
        communityId: createdCommunities[0]._id,
        tags: ['Real Estate', 'Cap Rate', 'RERA'],
        type: 'discussion',
        verified: true,
        isPinned: true,
        likeCount: 18,
        likes: [systemUser._id],
        commentCount: 1,
        comments: [
          {
            authorId: systemUser._id,
            content: 'Start by separating gross rental yield from net operating income. Then test vacancy at 10%, 15%, and 20% before comparing cap rate.',
            createdAt: new Date(),
            likes: []
          }
        ]
      },
      {
        title: 'Rolex secondary market price trends: Will Daytonas keep falling?',
        content: 'Recent listings show wider spreads between asking price and realized resale value. Is this a liquidity correction or a deeper scarcity premium reset?',
        authorId: systemUser._id,
        communityId: createdCommunities[2]._id,
        tags: ['Luxury Goods', 'Watches', 'Liquidity'],
        type: 'discussion',
        moderationScore: 3,
        likeCount: 11
      },
      {
        title: 'Case Study: Avoided a flat booking after missing OC and unclear possession date',
        content: 'An anonymized buyer in Ahmedabad walked away after the builder could not provide occupancy certificate documents and had vague possession language. The user saved the token amount by asking for RERA registration, title chain, approved plan, and OC timeline before signing.',
        authorId: systemUser._id,
        communityId: createdCommunities[0]._id,
        tags: ['Case Study', 'Legal Check', 'First-Time Buyer'],
        type: 'case-study',
        verified: true,
        moderationScore: 2,
        likeCount: 32
      },
      {
        title: 'Case Study: Used service history to negotiate 11% lower used-car price',
        content: 'A learner inspected insurance claim history, tyre age, service invoices, and transfer records before buying a used sedan. The seller reduced price after two skipped service intervals and repaint evidence were documented.',
        authorId: systemUser._id,
        communityId: createdCommunities[1]._id,
        tags: ['Case Study', 'Used Cars', 'Negotiation'],
        type: 'case-study',
        verified: true,
        moderationScore: 4,
        likeCount: 24
      },
      {
        title: 'AMA Question: How should jewellery buyback deductions be compared across stores?',
        content: 'For gold jewellery, should I compare making charges, wastage, GST, purity certificate, and buyback deduction separately? What is the simplest checklist before purchase?',
        authorId: systemUser._id,
        communityId: createdCommunities[3]._id,
        tags: ['AMA', 'Gold', 'Jewellery'],
        type: 'ama-question',
        verified: false,
        moderationScore: 1,
        likeCount: 9
      }
    ])
    await KnowledgeArticle.create({
      title: 'Cap Rate Basics',
      content: 'Cap rate measures net operating income divided by purchase price.',
      category: 'real-estate',
      tags: ['cap-rate'],
      authorId: systemUser._id
    })

    console.log('✓ Assetify database seeded with app data')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
