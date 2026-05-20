// 1. COURSES & LESSONS
export const COURSES_DATA = [
  {
    id: 're-101',
    title: 'Real Estate Tokenization & Yields',
    category: 'real-estate',
    description: 'Learn property equity fractionalization, calculating net cap rates, and leverage models.',
    iconName: 'Building2',
    lessons: [
      {
        id: 're-l1',
        title: 'Introduction to Rental Cap Rates',
        duration: '5 min',
        xpReward: 150,
        description: 'How to calculate gross vs net cap rates, and factoring in vacancy rates and maintenance reserves.',
        quiz: [
          {
            question: 'What is the formula for calculating Net Capitalization Rate (Cap Rate)?',
            options: [
              'Net Operating Income (NOI) / Property Purchase Price',
              'Gross Rental Income / Monthly Mortgage Payment',
              'Total Assets - Total Liabilities',
              'Annual Rent + Tax Deductions'
            ],
            correctIndex: 0,
            explanation: 'Cap Rate is calculated by dividing Net Operating Income (annual gross income minus operating expenses) by the property acquisition cost.'
          },
          {
            question: 'Which of the following is considered an operating expense in cap rate calculation?',
            options: [
              'Mortgage principal payment',
              'Property management fees',
              'Income tax on profits',
              'Personal home insurance'
            ],
            correctIndex: 1,
            explanation: 'Operating expenses include maintenance, taxes, insurance, and property management fees, but exclude mortgage interest/principal payments.'
          }
        ]
      },
      {
        id: 're-l2',
        title: 'Fractional Real Estate & Blockchain',
        duration: '7 min',
        xpReward: 200,
        description: 'How modern tokenization platforms allow investment in luxury properties with less than $100.',
        quiz: [
          {
            question: 'What primary problem does property tokenization solve for retail investors?',
            options: [
              'Eliminating property depreciation completely',
              'Lowering barrier to entry and enhancing liquidity',
              'Guaranteeing a fixed 20% annual return',
              'Bypassing local zoning regulations'
            ],
            correctIndex: 1,
            explanation: 'Tokenization allows dividing high-value real estate into digital shares, lowering minimum investment barriers and making real estate easier to trade (liquidity).'
          }
        ]
      }
    ]
  },
  {
    id: 'auto-101',
    title: 'High-Performance Car Valuations',
    category: 'automobile',
    description: 'Master automobile depreciation curves, collector scarcity factors, and lease-to-buy arbitrage.',
    iconName: 'Car',
    lessons: [
      {
        id: 'auto-l1',
        title: 'Depreciation Curves vs Scarcity',
        duration: '6 min',
        xpReward: 150,
        description: 'Why standard cars lose 20% in year one, while limited-edition supercars appreciate immediately.',
        quiz: [
          {
            question: 'What is the typical annual depreciation rate of a standard consumer vehicle in its first 3 years?',
            options: [
              '1% to 2%',
              '5% to 8%',
              '15% to 20%',
              '40% to 50%'
            ],
            correctIndex: 2,
            explanation: 'Most standard consumer cars lose roughly 15% to 20% of their value each year for the first three years.'
          },
          {
            question: 'Which factor is most likely to cause a vehicle to appreciate in value over time?',
            options: [
              'High annual mileage',
              'Extremely limited production numbers and historical significance',
              'Frequent aftermarket mechanical modifications',
              'Paint customization in non-factory shades'
            ],
            correctIndex: 1,
            explanation: 'Scarcity (limited production runs) combined with brand heritage and collector demand drives appreciation.'
          }
        ]
      }
    ]
  },
  {
    id: 'lux-101',
    title: 'Luxury Assets as Alternative Wealth',
    category: 'luxury',
    description: 'Explore the investment market for rare timepieces, designer fashion bags, and fine art indices.',
    iconName: 'Crown',
    lessons: [
      {
        id: 'lux-l1',
        title: 'The Watch Market (Rolex & Patek Indices)',
        duration: '8 min',
        xpReward: 250,
        description: 'Analyzing secondary market premiums, serial number tracking, and storage condition values.',
        quiz: [
          {
            question: 'Why do certain stainless steel sports watches retail below their secondary market valuation?',
            options: [
              'Manufactures purposely restrict production below public demand',
              'Retail stores add artificial markups to catalog sheets',
              'Stainless steel is more expensive than platinum',
              'Secondary market watches include warranty extensions'
            ],
            correctIndex: 0,
            explanation: 'Luxury watch brands like Rolex and Patek Philippe limit supply, causing secondary market premiums where buyers pay more to skip multi-year waitlists.'
          }
        ]
      }
    ]
  },
  {
    id: 'gold-101',
    title: 'Precious Metals & Macro Hedge',
    category: 'gold',
    description: 'Analyze physical storage fees vs gold futures, inflation correlations, and mining stocks.',
    iconName: 'Coins',
    lessons: [
      {
        id: 'gold-l1',
        title: 'Gold as an Inflation Hedge',
        duration: '5 min',
        xpReward: 150,
        description: 'Understanding real interest rates, dollar devaluations, and historical gold standard movements.',
        quiz: [
          {
            question: 'How does gold typically react when real interest rates (nominal rate minus inflation) are negative?',
            options: [
              'Gold price falls because cash yields are superior',
              'Gold price tends to rise as the opportunity cost of holding non-yielding cash decreases',
              'Gold becomes highly volatile and crashes 50%',
              'Gold price matches interest rates exactly'
            ],
            correctIndex: 1,
            explanation: 'When real interest rates are negative, holding cash guarantees a loss in purchasing power, boosting demand for inflation hedges like gold.'
          }
        ]
      }
    ]
  }
]

// 2. SANDBOX TRADING ASSETS
export const SANDBOX_ASSETS = [
  {
    id: 'asset-re-1',
    name: 'Manhattan Penthouse (Tokenized)',
    category: 'real-estate',
    price: 320.50,
    changePercent24h: 1.25,
    description: 'Fractional share in a luxury penthouse overlooking Central Park. Generates consistent monthly rental yield.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Annual Net Yield', value: '6.4%' },
      { label: 'LTV Ratio', value: '45%' },
      { label: 'Location', value: 'New York, USA' }
    ]
  },
  {
    id: 'asset-re-2',
    name: 'Tokyo Capsule Complex',
    category: 'real-estate',
    price: 185.00,
    changePercent24h: -0.45,
    description: 'Micro-apartment block situated in Shinjuku, highly optimized for business travelers and digital nomads.',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Annual Net Yield', value: '8.1%' },
      { label: 'Occupancy Rate', value: '94%' },
      { label: 'Location', value: 'Tokyo, Japan' }
    ]
  },
  {
    id: 'asset-auto-1',
    name: 'Porsche 911 GT3 RS (992)',
    category: 'automobile',
    price: 245000,
    changePercent24h: 3.80,
    description: 'Track-focused high performance sports car. Extreme demand and limited allocation drives collector values.',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Mileage', value: '1,200 miles' },
      { label: 'Production Limit', value: 'Unspecified' },
      { label: 'Rarity score', value: '8/10' }
    ]
  },
  {
    id: 'asset-auto-2',
    name: 'Vintage Ford Mustang 1967',
    category: 'automobile',
    price: 89000,
    changePercent24h: 0.15,
    description: 'Fully restored classic fastback. A staple of American muscle car collections with stable market demand.',
    image: 'https://images.unsplash.com/photo-1612466285769-ac9380ef54e8?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Restoration Tier', value: 'Concours Gold' },
      { label: 'Engine', value: '289 V8' },
      { label: 'Color', value: 'Raven Black' }
    ]
  },
  {
    id: 'asset-lux-1',
    name: 'Rolex Daytona "Paul Newman"',
    category: 'luxury',
    price: 310000,
    changePercent24h: 5.60,
    description: 'Extremely rare vintage chronograph timepiece. Widely recognized as the holy grail of sports watch collecting.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a1e?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Ref Number', value: '6239' },
      { label: 'Year', value: '1968' },
      { label: 'Box & Papers', value: 'Included' }
    ]
  },
  {
    id: 'asset-lux-2',
    name: 'Hermes Birkin 35 Black Togo',
    category: 'luxury',
    price: 24500,
    changePercent24h: 1.10,
    description: 'Handmade luxury leather tote bag. Historical returns outperforming standard indices due to production scarcity.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Hardware', value: '24k Gold Plated' },
      { label: 'Leather', value: 'Togo Calfskin' },
      { label: 'State', value: 'Pristine' }
    ]
  },
  {
    id: 'asset-gold-1',
    name: 'Physical Gold Bullion (1kg)',
    category: 'gold',
    price: 76400,
    changePercent24h: 0.85,
    description: 'LBMA certified 99.99% pure gold cast bar. Stored securely inside Zurich vault facility.',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=300&auto=format&fit=crop',
    details: [
      { label: 'Purity', value: '999.9 Fine' },
      { label: 'Vault Location', value: 'Zurich, Switzerland' },
      { label: 'Insurance Cover', value: '100% Lloyds' }
    ]
  }
]

// 3. GAMIFICATION BADGES
export const BADGES_DATA = [
  {
    id: 'rookie-investor',
    title: 'Rookie Investor',
    description: 'Joined Assetify and activated the account.',
    icon: 'Compass',
    category: 'general',
    xpRequired: 0
  },
  {
    id: 'real-estate-tycoon',
    title: 'Cap Rate Crusader',
    description: 'Completed all Real Estate Module lessons and quizzes.',
    icon: 'Building2',
    category: 'real-estate',
    xpRequired: 1000
  },
  {
    id: 'master-appraiser',
    title: 'Master Appraiser',
    description: 'Completed the Automobile Valuation quiz and bought a simulated Porsche.',
    icon: 'Car',
    category: 'automobile',
    xpRequired: 1500
  },
  {
    id: 'gold-collector',
    title: 'Inflation Defier',
    description: 'Held at least $50,000 in simulated Gold bullion.',
    icon: 'Coins',
    category: 'gold',
    xpRequired: 2000
  },
  {
    id: 'luxury-collector',
    title: 'Birkin Broker',
    description: 'Completed luxury watches lessons and owned a Rolex Daytona.',
    icon: 'Crown',
    category: 'luxury',
    xpRequired: 3000
  }
]

// 4. KNOWLEDGE GRAPH FOR TANGIBLE ASSETS
export const KNOWLEDGE_GRAPH_DATA = {
  nodes: [
    { id: 'root', label: 'Tangible Assets', group: 0, x: 0, y: 0, val: 20, desc: 'Physical resources held for wealth preservation and cash generation.' },
    
    // Real Estate branch
    { id: 're', label: 'Real Estate', group: 1, x: -180, y: -100, val: 15, desc: 'Properties ranging from residential houses to multi-family commercial spaces.' },
    { id: 'cap', label: 'Cap Rate', group: 1, x: -280, y: -180, val: 10, desc: 'Net Operating Income divided by asset cost, reflecting yield rate.' },
    { id: 'token', label: 'Tokenization', group: 1, x: -120, y: -220, val: 12, desc: 'Fractional ownership of properties on-chain, eliminating barrier entry.' },
    
    // Auto branch
    { id: 'auto', label: 'Automobiles', group: 2, x: 180, y: -100, val: 15, desc: 'Vehicles as investments, divided into utility cars and collector classics.' },
    { id: 'depr', label: 'Depreciation', group: 2, x: 280, y: -180, val: 10, desc: 'Value decline curve over years, typically 15-20% annually for commuter models.' },
    { id: 'scarce', label: 'Scarcity Premium', group: 2, x: 150, y: -220, val: 12, desc: 'Brand-enforced allocation limits triggering secondary appreciation (Porsche, Ferrari).' },
    
    // Luxury branch
    { id: 'lux', label: 'Luxury Goods', group: 3, x: 180, y: 120, val: 15, desc: 'Timepieces, fashion items, and rare collectibles holding secondary values.' },
    { id: 'watch', label: 'Horology Index', group: 3, x: 280, y: 220, val: 10, desc: 'Watch index tracking brands like Rolex, Patek, Audemars Piguet.' },
    
    // Gold branch
    { id: 'gold', label: 'Gold & Metals', group: 4, x: -180, y: 120, val: 15, desc: 'Precious metals holding intrinsic hedge value against global currencies.' },
    { id: 'hedge', label: 'Inflation Hedge', group: 4, x: -280, y: 220, val: 11, desc: 'Store of purchasing power during high nominal CPI increases.' }
  ],
  links: [
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
}

// 5. WEBINARS & DISCUSSIONS
export const WEBINARS_DATA = [
  {
    id: 'web-1',
    title: 'Fractional Real Estate: Post-2026 Regulations',
    expert: 'Sarah Jenkins',
    role: 'SVP Property Group',
    date: 'May 28, 2026',
    time: '8:00 PM EST',
    registered: false,
    attendees: 1205,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
  },
  {
    id: 'web-2',
    title: 'Supercar Allocation Tactics: Beating Dealer Playbooks',
    expert: 'Marcus Vance',
    role: 'Founder Elite Cars',
    date: 'June 03, 2026',
    time: '6:30 PM CET',
    registered: true,
    attendees: 844,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
  }
]
