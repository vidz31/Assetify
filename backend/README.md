# Assetify Backend API

A comprehensive Node.js/Express backend with MongoDB integration for the Assetify platform. Includes authentication, learning modules, sandbox trading, and knowledge community features.

## Architecture Overview

### Three Main Modules

1. **Learning Module** (`/api/learning`)
   - Courses and lessons
   - User progress tracking
   - XP and leveling system
   - Certifications

2. **Sandbox Module** (`/api/sandbox`)
   - Virtual asset trading
   - Portfolio management
   - Real-time price updates
   - Transaction history

3. **Knowledge Module** (`/api/knowledge`)
   - Communities
   - Discussion posts
   - Knowledge articles
   - User ratings and reviews

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**Edit `.env`:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/assetify
JWT_SECRET=your_jwt_secret_key_change_this_in_production
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# macOS (using Homebrew):
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get connection string
3. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/assetify
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/onboarding` | Complete onboarding |

### Learning

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/learning/modules` | Get all modules |
| GET | `/api/learning/modules/:id` | Get single module |
| GET | `/api/learning/lessons/:id` | Get lesson |
| POST | `/api/learning/lessons/:id/complete` | Complete lesson |
| GET | `/api/learning/progress` | Get user progress |
| GET | `/api/learning/my-certifications` | Get user certs |

### Sandbox (Trading)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sandbox/assets` | Get all assets |
| GET | `/api/sandbox/assets/:id` | Get single asset |
| POST | `/api/sandbox/buy` | Buy asset |
| POST | `/api/sandbox/sell` | Sell asset |
| GET | `/api/sandbox/portfolio` | Get portfolio |
| GET | `/api/sandbox/transactions` | Get transactions |

### Knowledge

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/knowledge/communities` | Get communities |
| POST | `/api/knowledge/communities` | Create community |
| POST | `/api/knowledge/communities/:id/join` | Join community |
| GET | `/api/knowledge/communities/:id/posts` | Get posts |
| POST | `/api/knowledge/posts` | Create post |
| GET | `/api/knowledge/articles` | Get articles |
| POST | `/api/knowledge/articles` | Create article |

## Database Models

### User
```javascript
{
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
  portfolio: [Object],
  transactions: [ObjectId]
}
```

### Asset
```javascript
{
  symbol: String (unique),
  name: String,
  type: String (stock|crypto|commodity|mutual_fund),
  currentPrice: Number,
  priceHistory: [{ price, timestamp }],
  percentChange: Object
}
```

### Module & Lesson
```javascript
// Module
{
  title: String,
  description: String,
  difficulty: String,
  lessons: [ObjectId],
  thumbnailUrl: String,
  category: String,
  totalDuration: Number
}

// Lesson
{
  title: String,
  content: String,
  moduleId: ObjectId,
  videoUrl: String,
  duration: Number,
  xpReward: Number,
  quiz: [Object]
}
```

### Community & Post
```javascript
// Community
{
  name: String,
  description: String,
  category: String,
  members: [ObjectId],
  creatorId: ObjectId,
  isPrivate: Boolean
}

// Post
{
  title: String,
  content: String,
  authorId: ObjectId,
  communityId: ObjectId,
  tags: [String],
  likes: [ObjectId],
  comments: [Object],
  views: Number
}
```

## Authentication Flow

1. **Register**: User creates account → Password hashed → User saved to DB
2. **Login**: User provides credentials → Password verified → JWT token generated
3. **Protected Routes**: Token sent in `Authorization: Bearer <token>` header
4. **Token Verification**: Middleware extracts and verifies JWT

## Error Handling

All endpoints return consistent error format:

```javascript
{
  success: false,
  message: "Error description"
}
```

## Frontend Integration

Frontend uses the API service in `/frontend/src/services/api.js`:

```javascript
import { authService, learningService, sandboxService, knowledgeService } from '@/services/api'

// Login
await authService.login(email, password)

// Get modules
await learningService.getModules()

// Buy asset
await sandboxService.buyAsset(assetId, quantity)

// Create post
await knowledgeService.createPost(title, content, communityId)
```

## Development Workflow

1. **Start MongoDB**: `brew services start mongodb-community`
2. **Start Backend**: `npm run dev` (port 5000)
3. **Start Frontend**: `npm run dev` in frontend folder (port 5173)
4. **Access App**: http://localhost:5173

## Common Issues

### "MongoDB Connection Error"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, ensure IP whitelist includes your IP

### "Token Invalid"
- Token expired (30 days)
- `JWT_SECRET` mismatch between requests
- Token not sent in header format: `Authorization: Bearer <token>`

### "CORS Error"
- Ensure `FRONTEND_URL` matches actual frontend URL
- Update CORS origin in `server.js` if needed

## Future Enhancements

- [ ] Real-time WebSocket price updates
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Notification system

## License

MIT
