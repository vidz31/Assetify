# 🚀 Quick Reference Guide

## Starting the Project

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Server runs at: `http://localhost:5000`

### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
```
App runs at: `http://localhost:5173`

### Terminal 3 - MongoDB
```bash
# macOS
brew services start mongodb-community

# Windows - Auto-starts as service
# Or manual: mongosh
```

---

## Testing the Application

### 1. Register User
```
GET http://localhost:5173
→ Click "Register Credentials"
→ Fill form with:
  Name: John Doe
  Email: john@example.com
  Password: password123
→ Submit
```

### 2. Check Database
```bash
# In a terminal:
mongosh assetify
db.users.find()
```

### 3. Login
```
→ Go to http://localhost:5173/login
→ Enter email and password
→ Should see dashboard
```

### 4. Try Learning Module
```
→ Click "LEARN" in sidebar
→ View courses
→ Complete lesson → Get XP
```

### 5. Try Sandbox
```
→ Click "SANDBOX" in sidebar
→ Buy assets with virtual $
→ See portfolio
```

### 6. Try Community
```
→ Click "COMMUNITY" in sidebar
→ Create/join communities
→ Post discussions
```

---

## Common API Calls (from Frontend)

### Authentication
```javascript
import { authService } from '@/services/api'

// Register
const result = await authService.register('John', 'john@example.com', 'pass123')

// Login
const result = await authService.login('john@example.com', 'pass123')

// Get current user
const user = await authService.getCurrentUser()
```

### Learning
```javascript
import { learningService } from '@/services/api'

// Get all courses
const modules = await learningService.getModules()

// Complete lesson
const result = await learningService.completeLesson(lessonId)
```

### Trading
```javascript
import { sandboxService } from '@/services/api'

// Get assets
const assets = await sandboxService.getAssets()

// Buy asset
const result = await sandboxService.buyAsset(assetId, quantity)

// Get portfolio
const portfolio = await sandboxService.getPortfolio()
```

### Community
```javascript
import { knowledgeService } from '@/services/api'

// Get communities
const communities = await knowledgeService.getCommunities()

// Create post
const post = await knowledgeService.createPost(title, content, communityId)
```

---

## File Locations

### Backend Routes
- Auth: `backend/routes/authRoutes.js`
- Learning: `backend/routes/learningRoutes.js`
- Sandbox: `backend/routes/sandboxRoutes.js`
- Knowledge: `backend/routes/knowledgeRoutes.js`

### Backend Models
- User: `backend/models/User.js`
- Learning: `backend/models/Learning.js`
- Sandbox: `backend/models/Sandbox.js`
- Knowledge: `backend/models/Knowledge.js`

### Frontend Services
- API: `frontend/src/services/api.js`

### Frontend Pages
- Login: `frontend/src/pages/Login.jsx`
- Register: `frontend/src/pages/Register.jsx`
- Dashboard: `frontend/src/pages/Dashboard.jsx`
- Learning: `frontend/src/pages/Learning.jsx`
- Sandbox: `frontend/src/pages/Sandbox.jsx`

---

## Database Collections

```
assetify (database)
├── users (user accounts)
├── modules (courses)
├── lessons (lesson content)
├── certifications (certificates)
├── assets (tradable assets)
├── transactions (buy/sell records)
├── portfolioholdings (user positions)
├── communities (discussion groups)
├── posts (community posts)
└── knowledgearticles (articles)
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/assetify
JWT_SECRET=assetify_jwt_secret_key_2024_development
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Debugging

### Check Backend
```bash
# Test health endpoint
curl http://localhost:5000/health

# Test database
mongosh assetify
> db.users.countDocuments()
```

### Check Frontend
1. Open DevTools: F12
2. Check Console for errors
3. Check Network tab for API calls
4. Check Application tab → localStorage for token

### Check Database
```bash
mongosh assetify

# See all users
db.users.find()

# See all assets
db.assets.find()

# See all transactions
db.transactions.find()

# See user by email
db.users.findOne({ email: "john@example.com" })
```

---

## Adding New Data

### Add Asset
```bash
mongosh assetify
db.assets.insertOne({
  symbol: "GOOGL",
  name: "Google",
  type: "stock",
  currentPrice: 140.50,
  description: "Search engine company"
})
```

### Add Course
```bash
mongosh assetify
db.modules.insertOne({
  title: "Advanced Trading",
  description: "Learn advanced strategies",
  difficulty: "advanced",
  category: "Trading"
})
```

---

## Error Codes

| Error | Cause | Solution |
|-------|-------|----------|
| "No token provided" | Not authenticated | Login first |
| "Invalid token" | Token expired | Re-login |
| "Email already exists" | Duplicate signup | Use different email |
| "Cannot connect to MongoDB" | MongoDB not running | Start MongoDB |
| "CORS error" | Frontend URL mismatch | Check .env FRONTEND_URL |

---

## Performance Tips

1. Use indexes on frequently queried fields
2. Limit API responses (pagination)
3. Cache asset data
4. Batch database operations
5. Monitor database size

---

## Production Checklist

- [ ] Change JWT_SECRET to random key
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas instead of local
- [ ] Enable HTTPS
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring/logging
- [ ] Setup email service
- [ ] Add rate limiting
- [ ] Add API documentation
- [ ] Setup backup system

---

## Useful Commands

```bash
# Backend
npm install              # Install deps
npm run dev             # Development
npm start               # Production
npm run seed            # Seed data
npm run lint            # Check code

# Frontend
npm run dev             # Development
npm run build           # Production build
npm run preview         # Preview build
npm run lint            # Check code

# MongoDB
mongosh assetify        # Connect to DB
show collections        # List collections
db.collection.count()   # Count docs
db.collection.find()    # Get docs
```

---

## Rate Limits (for production)

Suggested limits per user per hour:
- Login attempts: 5
- API calls: 1000
- Post creation: 50
- Comment creation: 100

---

## Support Resources

- API Docs: `backend/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Implementation: `IMPLEMENTATION_SUMMARY.md`
- Frontend: `frontend/README.md`

---

**Last Updated**: May 21, 2026
**Status**: Ready for Development ✅
