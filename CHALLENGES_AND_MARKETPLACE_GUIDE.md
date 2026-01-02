# 🏆 Challenges & Marketplace - Complete Guide

## Overview

This guide covers the fully functional **Challenges** and **Marketplace** systems in RitualOS.

---

## 🎯 Challenges System

### What It Does

The Challenges system helps users build consistency through structured 7-day, 14-day, and 30-day ritual challenges. Users can:

- Browse available challenges
- Join challenges
- Track daily progress
- Check in each day
- Earn points on completion
- Build streaks

### API Endpoints

#### 1. GET /api/challenges
**Description:** Get all available challenges

**Response:**
```json
{
  "challenges": [
    {
      "id": "...",
      "name": "Morning Momentum",
      "description": "Start every day with a 5-minute focus ritual",
      "duration": 7,
      "difficulty": "Easy",
      "points": 100,
      "goal": "Complete a morning ritual 7 days in a row",
      "benefits": ["..."],
      "icon": "🌅",
      "color": "from-orange-500 to-yellow-500"
    }
  ]
}
```

#### 2. POST /api/challenges/join
**Description:** Join a challenge

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "challengeId": "..."
}
```

**Response:**
```json
{
  "userChallenge": {
    "id": "...",
    "userId": "...",
    "challengeId": "...",
    "status": "active",
    "currentStreak": 0,
    "completedDays": 0,
    "checkIns": [],
    "startedAt": "...",
    "challenge": { ... }
  }
}
```

#### 3. GET /api/challenges/my
**Description:** Get user's active and completed challenges

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "active": [...],
  "completed": [...],
  "stats": {
    "activeCount": 2,
    "completedCount": 1,
    "totalPointsEarned": 100
  }
}
```

#### 4. POST /api/challenges/checkin
**Description:** Check in to a challenge (mark today as completed)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "userChallengeId": "..."
}
```

**Response:**
```json
{
  "userChallenge": { ... },
  "completed": false,
  "pointsEarned": 0
}
```

Or if challenge is completed:
```json
{
  "userChallenge": { ... },
  "completed": true,
  "pointsEarned": 100
}
```

### Frontend Usage

**File:** `app/app/challenges/page.tsx`

**Features:**
- Three tabs: Available, Active, Completed
- Real-time stats dashboard
- Challenge cards with details
- Join modal with confirmation
- Progress tracking with visual progress bar
- Daily check-in button
- Streak counter
- Completion celebration

**Example Flow:**
1. User views Available challenges
2. Clicks "Join Challenge"
3. Modal shows challenge details
4. User clicks "Start Challenge"
5. API creates UserChallenge record
6. User switches to Active tab
7. User clicks "Check In Today"
8. Progress updates in real-time
9. On completion, user earns points and sees completion screen

### Database Schema

```prisma
model Challenge {
  id          String          @id @default(cuid())
  name        String          @unique
  description String
  duration    Int
  difficulty  String
  points      Int
  goal        String
  benefits    Json
  icon        String
  color       String
  createdAt   DateTime        @default(now())
  userChallenges UserChallenge[]
}

model UserChallenge {
  id           String    @id @default(cuid())
  userId       String
  challengeId  String
  status       String
  currentStreak Int      @default(0)
  completedDays Int      @default(0)
  checkIns     Json
  startedAt    DateTime  @default(now())
  completedAt  DateTime?
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge    Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
}
```

---

## 🏪 Marketplace System

### What It Does

The Marketplace allows users to:

- Browse community-created ritual templates
- Filter by category (Focus, Reset, Social, Sleep)
- Sort by popularity, rating, newest, shortest
- View detailed ritual steps
- Use templates (adds to their rituals)
- Share their own rituals with the community
- Rate rituals

### API Endpoints

#### 1. GET /api/marketplace
**Description:** Get all community rituals

**Query Params:**
- `category` (optional): Filter by category
- `sortBy` (optional): popular, rating, newest, shortest

**Response:**
```json
{
  "rituals": [
    {
      "id": "...",
      "name": "The 2-Minute Power Start",
      "authorId": "...",
      "author": {
        "id": "...",
        "name": "Sarah Chen"
      },
      "authorAvatar": "👩‍💻",
      "description": "Quick morning ritual for busy professionals",
      "category": "Focus",
      "duration": 2,
      "steps": [
        { "name": "Intention Setting", "duration": 1 },
        { "name": "Energy Boost", "duration": 1 }
      ],
      "usesCount": 1247,
      "rating": 4.9,
      "createdAt": "..."
    }
  ]
}
```

#### 2. POST /api/marketplace
**Description:** Share a new ritual to the marketplace

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "name": "My Amazing Ritual",
  "description": "Description here",
  "category": "Focus",
  "duration": 10,
  "steps": [
    { "name": "Step 1", "duration": 5 },
    { "name": "Step 2", "duration": 5 }
  ]
}
```

**Response:**
```json
{
  "ritual": { ... }
}
```

#### 3. POST /api/marketplace/use
**Description:** Use a community ritual template

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "communityRitualId": "...",
  "customize": {
    "name": "Custom Name (optional)",
    "description": "Custom Description (optional)"
  }
}
```

**Response:**
```json
{
  "ritual": {
    "id": "...",
    "userId": "...",
    "name": "...",
    "category": "Focus",
    "description": "...",
    "duration": 10,
    "steps": [...],
    "metadata": {
      "fromCommunity": true,
      "communityRitualId": "..."
    }
  },
  "message": "Ritual added to your collection!"
}
```

#### 4. POST /api/marketplace/rate
**Description:** Rate a community ritual

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "communityRitualId": "...",
  "rating": 5
}
```

**Response:**
```json
{
  "rating": 4.9,
  "message": "Thank you for rating!"
}
```

### Frontend Usage

**File:** `app/app/marketplace/page.tsx`

**Features:**
- Stats banner with real-time counts
- Category filter buttons
- Sort dropdown
- Ritual cards with:
  - Author info
  - Category badge
  - Duration
  - Rating (stars)
  - Use count
  - Steps preview
- Click to view details modal
- "Use Template" button
- "Share Your Ritual" CTA
- Share modal with form:
  - Name, description
  - Category dropdown
  - Duration input
  - Dynamic steps array (add/remove)

**Example Flow:**
1. User browses marketplace
2. Filters by "Focus" category
3. Clicks on a ritual card
4. Modal shows full details and steps
5. User clicks "Use This Template"
6. API creates a new Ritual for the user
7. Increments usesCount on the community ritual
8. User receives success message
9. Ritual appears in their Ritual Builder

### Database Schema

```prisma
model CommunityRitual {
  id           String   @id @default(cuid())
  authorId     String
  name         String
  description  String
  category     String
  duration     Int
  steps        Json
  authorAvatar String
  usesCount    Int      @default(0)
  rating       Float    @default(0)
  createdAt    DateTime @default(now())
  author       User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

---

## 🌱 Seeding Default Data

We've created a seed script that populates:

### Default Challenges (5):
1. **Morning Momentum** (7 days, Easy, 100 pts)
2. **Digital Detox** (14 days, Medium, 250 pts)
3. **Focus Mastery** (21 days, Medium, 350 pts)
4. **Anxiety Reset** (14 days, Hard, 300 pts)
5. **30-Day Ritual Lifestyle** (30 days, Hard, 500 pts)

### Default Community Rituals (6):
1. The 2-Minute Power Start
2. Digital Sunset Protocol
3. Anxiety SOS
4. Deep Work Activation
5. Social Confidence Boost
6. Midday Energy Reset

### How to Run Seed:

**Local (with PostgreSQL connected):**
```bash
npm run seed
```

**Production (Vercel):**
The seed will run automatically during the first deployment when `prisma db push` creates the tables.

---

## 🚀 Deployment Notes

### Build Process

The `package.json` build script includes:
```bash
prisma generate && prisma db push --accept-data-loss && next build
```

This ensures:
1. Prisma client is generated
2. Database tables are created/updated
3. Next.js app is built

### Environment Variables Required

```env
DATABASE_URL=postgres://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Post-Deployment

After first deployment:
1. SSH into your database or use Prisma Studio
2. Run the seed script to populate default challenges and rituals
3. OR manually create them via the API

---

## 🎨 UX Highlights

### Challenges
- **Visual Progress Bars:** Show completion percentage
- **Streak Counter:** Gamified with 🔥 emoji
- **Difficulty Badges:** Color-coded (green/yellow/red)
- **Benefits List:** Clear value proposition
- **Modal Confirmation:** Prevents accidental joins
- **Real-time Updates:** Immediate feedback on check-in

### Marketplace
- **Beautiful Cards:** Hover effects, author avatars
- **Star Ratings:** Clear quality indicators
- **Use Count:** Social proof
- **Steps Preview:** See what's inside
- **Category Colors:** Visual categorization
- **Share Form:** Easy ritual submission
- **Dynamic Steps:** Add/remove as needed

---

## 📊 Analytics Opportunities

Track these metrics:
- Most popular challenges
- Challenge completion rates
- Average streak length
- Most used community rituals
- Top-rated rituals
- User engagement (check-ins per week)

---

## 🔮 Future Enhancements

### Challenges
- [ ] Weekly/Monthly leaderboards
- [ ] Team challenges
- [ ] Custom user-created challenges
- [ ] Challenge reminders/notifications
- [ ] Reward badges/achievements

### Marketplace
- [ ] Comments on rituals
- [ ] Ritual collections/playlists
- [ ] Follow favorite authors
- [ ] Search functionality
- [ ] Advanced filters (duration range, difficulty)
- [ ] "Trending" section
- [ ] Personal ritual recommendations

---

## 🐛 Debugging Tips

### Challenge Check-In Not Working
1. Check if user is authenticated (token present)
2. Verify userChallengeId is correct
3. Check if already checked in today
4. Look for errors in browser console

### Marketplace Rituals Not Loading
1. Verify DATABASE_URL is set
2. Check if seed script ran successfully
3. Inspect network tab for API errors
4. Check server logs for Prisma errors

### Points Not Updating
1. Verify challenge completion logic
2. Check User.totalPoints field
3. Ensure transaction is committed
4. Refresh user data after completion

---

## ✅ Testing Checklist

### Challenges
- [x] Can view all available challenges
- [x] Can join a challenge (creates UserChallenge)
- [x] Can view active challenges
- [x] Can check in daily
- [x] Streak increases correctly
- [x] Progress bar updates
- [x] Challenge completes at target days
- [x] Points awarded on completion
- [x] Completed challenges show in Completed tab
- [x] Cannot join same challenge twice

### Marketplace
- [x] Can view all community rituals
- [x] Can filter by category
- [x] Can sort by different criteria
- [x] Can view ritual details
- [x] Can use a template (creates Ritual)
- [x] Use count increments
- [x] Can share own ritual
- [x] Stats update in real-time
- [x] Form validation works
- [x] Can add/remove steps dynamically

---

## 🎉 Success!

Both Challenges and Marketplace are now **fully functional end-to-end**! Users can:

1. ✅ Browse and join challenges
2. ✅ Track daily progress
3. ✅ Earn points and build streaks
4. ✅ Discover community rituals
5. ✅ Use templates instantly
6. ✅ Share their own creations

**Ready for production use!** 🚀








