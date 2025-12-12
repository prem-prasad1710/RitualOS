# 🔧 Fix 500 Errors - Database Setup Required

## 🎉 Good News!

Your deployment **SUCCEEDED!** The TypeScript compilation worked perfectly.

## ❌ Current Problem

You're getting **500 Internal Server Errors** because:
- ✅ Your app is deployed
- ❌ **Database tables don't exist yet**
- ❌ API routes can't query non-existent tables

---

## ✅ Solution: Create Database Tables

You need to run `prisma db push` **once** to create all the tables.

### **Option 1: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Link to your project
vercel link

# Create tables on production database
vercel exec -- npx prisma db push

# Seed with default data
vercel exec -- npm run seed
```

### **Option 2: Via Vercel Dashboard**

1. Go to: https://vercel.com/prem-prasad1710s-projects
2. Click your **RitualOS** project
3. Go to **"Storage"** tab
4. If no Postgres database exists:
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Choose **"Hobby"** (Free)
   - Name: `ritualos-db`
   - Click **"Create"**
5. After creation:
   - Click **"Connect to Project"**
   - Select your project
   - Check all environments
   - Click **"Connect"**
6. This auto-adds environment variables
7. **Redeploy** your project (Settings → Deployments → Redeploy)

### **Option 3: Use Prisma Migrate (Best for Production)**

```bash
# Create migration locally
npx prisma migrate dev --name init

# Deploy migration to production
npx prisma migrate deploy

# Or via Vercel CLI
vercel exec -- npx prisma migrate deploy
```

---

## 🗄️ What Tables Will Be Created

Running `prisma db push` will create these tables:

**Core Tables:**
- User
- Ritual
- RitualLoop
- RitualLoopStep
- RitualSession
- RitualReflection

**New Feature Tables:**
- Challenge
- UserChallenge
- CommunityRitual
- ChatMessage
- JournalEntry
- QuickRitual
- Achievement
- UserAchievement
- Circle
- CircleMember

---

## 🌱 Seed Default Data

After tables are created, seed with default challenges and community rituals:

```bash
# Via Vercel CLI
vercel exec -- npm run seed

# Or if running locally with production DB
npm run seed
```

This will create:
- **5 default challenges** (Morning Momentum, Digital Detox, etc.)
- **6 community ritual templates**
- **1 demo user** for community content

---

## 🔍 Check Vercel Logs

To see the actual error:

1. Go to **Deployments** tab
2. Click on latest deployment
3. Click **"Runtime Logs"** or **"Functions"**
4. Look for errors like:
   - `table "User" does not exist`
   - `relation "Challenge" does not exist`

---

## ✅ After Database Setup

Once tables are created:
1. ✅ Refresh your app
2. ✅ Sign up works
3. ✅ Login works
4. ✅ Challenges load
5. ✅ Marketplace loads
6. ✅ All features work!

---

## 🚀 Quick Fix Command

**Run this ONE command to fix everything:**

```bash
# Install Vercel CLI, link project, create tables, and seed
npm i -g vercel && \
vercel link && \
vercel exec -- npx prisma db push && \
vercel exec -- npm run seed
```

Follow the prompts and you're done!

---

## 🐛 If Still Getting Errors

### Check Environment Variables

Go to **Settings → Environment Variables** and verify:

```
DATABASE_URL = postgres://... (your Vercel Postgres URL)
JWT_SECRET = ritualos-production-secret-2024
NEXT_PUBLIC_APP_URL = https://your-vercel-url.vercel.app
```

All should be checked for: ✓ Production ✓ Preview ✓ Development

### Redeploy After Adding Variables

If you added/updated variables:
1. Go to **Deployments**
2. Click **"..."** on latest
3. Click **"Redeploy"**

---

## 📋 Summary

**Problem:** 500 errors because database tables don't exist

**Solution:** 
1. Run `vercel exec -- npx prisma db push`
2. Run `vercel exec -- npm run seed`
3. Refresh app
4. Everything works! 🎉

---

**Run the commands above and your app will be fully functional!** 🚀




