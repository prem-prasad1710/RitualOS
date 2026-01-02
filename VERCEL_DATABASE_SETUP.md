# 🗄️ Database Setup for Vercel Deployment

## The Problem

SQLite doesn't work on Vercel (serverless environment). You need PostgreSQL for production.

Error: `500 Internal Server Error` when trying to login.

---

## ✅ Solution: Set Up PostgreSQL Database

### **Option 1: Vercel Postgres (Recommended - Easiest)**

**Step 1: Create Vercel Postgres Database**

1. Go to your Vercel project: https://vercel.com/prem-prasad1710s-projects/ritual
2. Click **"Storage"** tab (top menu)
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Choose **"Continue"**
6. Name it: `ritualos-db`
7. Select region closest to you
8. Click **"Create"**

**Step 2: Connect to Your Project**

1. After creation, click **"Connect Project"**
2. Select your `ritual` project
3. Click **"Connect"**
4. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← **This is the one we need!**
   - `POSTGRES_URL_NON_POOLING`

**Step 3: Update Environment Variable**

1. Go to **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Update its value to: Use the value from `POSTGRES_PRISMA_URL`
   - Or add new variable: `DATABASE_URL` = value of `POSTGRES_PRISMA_URL`

**Step 4: Redeploy**

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete ✅

---

### **Option 2: Supabase (Free Alternative)**

**Step 1: Create Supabase Account**

1. Go to: https://supabase.com/
2. Sign up with GitHub (or email)
3. Click **"New project"**

**Step 2: Create Database**

1. **Organization:** Create new (or use existing)
2. **Project name:** `ritualos`
3. **Database Password:** Generate a strong password and **SAVE IT!**
4. **Region:** Choose closest to you
5. Click **"Create new project"** (takes ~2 minutes)

**Step 3: Get Connection String**

1. Once ready, go to **Settings** (⚙️ icon in sidebar)
2. Click **"Database"**
3. Scroll to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual password

Example:
```
postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

**Step 4: Add to Vercel**

1. Go to your Vercel project
2. **Settings** → **Environment Variables**
3. Find `DATABASE_URL` or click **"Add New"**
4. **Key:** `DATABASE_URL`
5. **Value:** Paste your Supabase connection string
6. **Environment:** Check all (Production, Preview, Development)
7. Click **"Save"**

**Step 5: Redeploy**

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

---

### **Option 3: Railway (Another Free Option)**

**Step 1: Create Railway Account**

1. Go to: https://railway.app/
2. Sign up with GitHub
3. Click **"New Project"**
4. Select **"Provision PostgreSQL"**

**Step 2: Get Connection String**

1. Click on the **Postgres** service
2. Go to **"Variables"** tab
3. Copy the value of **`DATABASE_URL`**

**Step 3: Add to Vercel**

1. Same as Supabase Option 2 - Step 4 above
2. Paste Railway's DATABASE_URL
3. Save and redeploy

---

## 🚀 After Setting Up Database

### Push the Code Changes

```bash
cd "/Users/premprasad/Desktop/desktop/personal project/project/ritualos"

# Push the PostgreSQL schema change
git push https://YOUR_TOKEN@github.com/prem-prasad1710/RitualOS.git main
```

### Verify Deployment

1. Go to your Vercel deployment URL
2. Try to sign up for a new account
3. Login should work! ✅

---

## 🔍 Troubleshooting

### Still Getting 500 Error?

**Check Vercel Logs:**
1. Go to your Vercel project
2. Click **"Deployments"**
3. Click on the latest deployment
4. Scroll to **"Runtime Logs"**
5. Look for the actual error

**Common Issues:**

1. **DATABASE_URL not set:**
   - Verify it exists in Environment Variables
   - Make sure all environments are checked

2. **Wrong connection string:**
   - Must start with `postgresql://`
   - Must include password
   - Must be URL-encoded if password has special characters

3. **Prisma not migrating:**
   - Tables might not exist yet
   - Run migration on Supabase SQL editor:
   ```sql
   -- Go to Supabase → SQL Editor → New query
   -- Paste schema from Prisma
   ```

### Test Connection Locally

Update your local `.env`:
```env
DATABASE_URL="postgresql://your-connection-string-here"
```

Run:
```bash
npx prisma db push
npx prisma generate
npm run dev
```

If it works locally, it should work on Vercel!

---

## 📋 Quick Checklist

```
☐ Created PostgreSQL database (Vercel/Supabase/Railway)
☐ Got DATABASE_URL connection string
☐ Added DATABASE_URL to Vercel Environment Variables
☐ Pushed PostgreSQL schema change to GitHub
☐ Redeployed on Vercel
☐ Tested signup/login on deployed site
```

---

## 💡 Recommended: Vercel Postgres

**Why Vercel Postgres is best:**
- ✅ Automatic integration with your project
- ✅ Same dashboard as your deployment
- ✅ Optimized for Vercel's edge network
- ✅ Easy connection pooling
- ✅ No additional signup needed

**Cost:** Free tier includes:
- 256 MB storage
- 60 hours compute time/month
- Perfect for portfolio projects!

---

## 🎉 Once Working

Your RitualOS will be fully functional with:
- ✅ User authentication
- ✅ Ritual creation
- ✅ Loop building
- ✅ Session tracking
- ✅ All features working!

---

Need help? Let me know which option you chose and I'll guide you through it! 🚀








