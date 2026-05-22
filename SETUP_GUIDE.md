# Assetify Complete Setup Guide

## Project Overview

Assetify is a financial education platform with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Three Main Modules**:
  1. **Learning**: Educational courses with XP system
  2. **Sandbox**: Virtual trading simulation
  3. **Knowledge**: Community discussions and articles

---

## Complete Setup Instructions

### Step 1: Install MongoDB

#### Windows:
1. Download MongoDB Community from [mongodb.com/try/download](https://www.mongodb.com/try/download)
2. Run installer and follow prompts
3. MongoDB should auto-start as a service

#### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Verify MongoDB is running:
```bash
mongo --eval "db.adminCommand('ping')"
```

### Step 2: Setup Backend

#### 2a. Navigate to backend folder
```bash
cd backend
```

#### 2b. Install dependencies
```bash
npm install
```

#### 2c. Verify .env file
```bash
cat .env
```

Should contain:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/assetify
JWT_SECRET=assetify_jwt_secret_key_2024_development
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### 2d. Seed database with initial data
```bash
npm run seed
```

Output should show:
```
✓ MongoDB Connected Successfully
✓ Cleared existing data
✓ Created 5 sample assets
✓ Created sample modules
✓ Created 4 sample lessons
✓ Database seeding completed successfully!
```

#### 2e. Start backend server
```bash
npm run dev
```

Success message:
```
✓ Server running on port 5000
✓ Frontend URL configured: http://localhost:5173
```

### Step 3: Setup Frontend

#### 3a. Navigate to frontend folder
```bash
cd ../frontend
```

#### 3b. Install dependencies (if not already done)
```bash
npm install
```

#### 3c. Verify .env file
```bash
cat .env
```

Should contain:
```
VITE_API_URL=http://localhost:5000/api
```

#### 3d. Start frontend server
```bash
npm run dev
```

Output:
```
Local:   http://localhost:5173/
```

### Step 4: Access the Application

1. Open browser → http://localhost:5173
2. Click "Register Credentials" to create account
3. Fill in: Name, Email, Password
4. Submit registration
5. Complete onboarding
6. Access dashboard

---

## Project Structure

```
Assetify-main/
├── backend/                          # Express.js API
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── errorHandler.js          # Error handling
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Learning.js              # Module, Lesson, Certification
│   │   ├── Sandbox.js               # Asset, Transaction, Portfolio
│   │   └── Knowledge.js             # Community, Post, Article
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── learningRoutes.js        # Learning endpoints
│   │   ├── sandboxRoutes.js         # Trading endpoints
│   │   └── knowledgeRoutes.js       # Community endpoints
│   ├── scripts/
│   │   └── seedDatabase.js          # Initial data
│   ├── .env                         # Environment variables
│   ├── server.js                    # Main server file
│   └── package.json
│
└── frontend/                        # React + Vite
    ├── src/
    │   ├── services/
    │   │   └── api.js               # API calls
    │   ├── pages/
    │   │   ├── Login.jsx            # Login page
    │   │   ├── Register.jsx         # Register page
    │   │   ├── Dashboard.jsx        # Main dashboard
    │   │   ├── Learning.jsx         # Learning page
    │   │   ├── Sandbox.jsx          # Trading page
    │   │   └── Community.jsx        # Community page
    │   ├── store/
    │   │   └── useAssetifyStore.js  # Zustand store
    │   └── components/
    ├── .env                         # Environment variables
    └── package.json
```

---

## API Reference

### Authentication

**Register User**
```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Login User**
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "xp": 0,
    "level": 1,
    "virtualBalance": 1000000
  }
}
```

### Learning Module

**Get All Courses**
```
GET /api/learning/modules
Authorization: Bearer <token>
```

**Complete Lesson**
```
POST /api/learning/lessons/:lessonId/complete
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "message": "Lesson completed",
  "xpGained": 100,
  "totalXP": 100,
  "level": 1
}
```

### Sandbox (Trading)

**Get All Assets**
```
GET /api/sandbox/assets
```

**Buy Asset**
```
POST /api/sandbox/buy
Authorization: Bearer <token>
{
  "assetId": "...",
  "quantity": 10
}
```

**Get Portfolio**
```
GET /api/sandbox/portfolio
Authorization: Bearer <token>
```

### Knowledge (Community)

**Get Communities**
```
GET /api/knowledge/communities
```

**Create Post**
```
POST /api/knowledge/posts
Authorization: Bearer <token>
{
  "title": "Bitcoin future",
  "content": "Post content here...",
  "communityId": "...",
  "tags": ["crypto", "bitcoin"]
}
```

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  xp: Number,
  level: Number,
  streak: Number,
  virtualBalance: Number,
  onboarded: Boolean,
  interests: [String],
  riskProfile: String,
  completedLessons: [ObjectId],
  createdAt: Date
}
```

### Asset Collection
```javascript
{
  _id: ObjectId,
  symbol: String (unique),
  name: String,
  type: String ('stock'|'crypto'|'commodity'|'mutual_fund'),
  currentPrice: Number,
  priceHistory: [{price, timestamp}],
  percentChange24h: Number,
  description: String,
  category: String
}
```

### Module Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: String,
  lessons: [ObjectId],
  thumbnailUrl: String,
  category: String,
  totalDuration: Number
}
```

---

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Verify MongoDB is running: `mongosh`
- Check MONGODB_URI in .env
- For remote DB: Use MongoDB Atlas connection string

### Issue: "Token Invalid / Authentication Failed"
**Solution:**
- Clear localStorage in browser
- Check JWT_SECRET matches in .env
- Restart both frontend and backend

### Issue: "CORS Error"
**Solution:**
- Ensure frontend URL is correct in backend .env
- Check FRONTEND_URL matches actual URL

### Issue: "Assets not showing in Sandbox"
**Solution:**
```bash
# Run seed script to populate data
cd backend
npm run seed
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## Testing the Flow

### 1. Register New User
- Go to http://localhost:5173
- Click "Register Credentials"
- Enter name, email, password
- Submit (should create user in MongoDB)

### 2. Login
- Go to http://localhost:5173/login
- Enter email and password
- Should receive JWT token (saved in localStorage)

### 3. Complete Onboarding
- Select interests and risk profile
- Submit onboarding

### 4. Access Learning
- Go to /learn page
- See courses from database
- Complete lessons to gain XP

### 5. Trade in Sandbox
- Go to /sandbox page
- Buy/sell simulated assets
- Check portfolio updates

### 6. Community Discussion
- Go to /community page
- Create/join communities
- Post and comment

---

## Development Commands

### Backend
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Install new package
npm install package-name
```

### Frontend
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Run linter
npm run lint
```

---

## Next Steps

1. **Customize Assets**: Edit `backend/scripts/seedDatabase.js`
2. **Add More Courses**: Insert documents in Learning module
3. **Set JWT_SECRET**: Change in production `.env`
4. **Configure CORS**: Update in `backend/server.js`
5. **Deploy to Production**: Use services like Heroku, Railway, or Vercel

---

## Support

For issues or questions:
1. Check logs in terminal
2. Verify MongoDB connection
3. Review API responses in browser DevTools
4. Check backend console for errors

---

## License

MIT
