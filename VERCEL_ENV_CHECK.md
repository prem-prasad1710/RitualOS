# ✅ Vercel Environment Variables Checklist

## 🔍 VERIFY THESE ON VERCEL BEFORE PUSHING

Go to: https://vercel.com/prem-prasad1710s-projects → Your Project → **Settings** → **Environment Variables**

---

## Required Variables:

### 1. DATABASE_URL ⭐ (MOST IMPORTANT)

```
Key: DATABASE_URL
Value: postgres://ddf8641d891fb700833174d239122ad04ef9bc20d876f371a00cd2215e777fd3:sk_4qKpJMD0auewr-6V__OYU@db.prisma.io:5432/postgres?sslmode=require
Environments: ✓ Production ✓ Preview ✓ Development
```

**Check:**
- ☐ Starts with `postgres://` or `postgresql://`
- ☐ All three environments checked

---

### 2. JWT_SECRET

```
Key: JWT_SECRET
Value: ritualos-production-secret-key-2024-super-secure
Environments: ✓ Production ✓ Preview ✓ Development
```

**Check:**
- ☐ Is a random string
- ☐ All three environments checked

---

### 3. NEXT_PUBLIC_APP_URL

```
Key: NEXT_PUBLIC_APP_URL
Value: https://ritual-geyjsuisj-prem-prasad1710s-projects.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```

**Check:**
- ☐ Is your actual Vercel deployment URL
- ☐ Starts with https://
- ☐ All three environments checked

---

## 🎯 How to Add/Edit Variables

### If Variable Doesn't Exist:

1. Click **"Add New"** button
2. Enter Key (e.g., `DATABASE_URL`)
3. Enter Value (your postgres URL)
4. Check all three environments
5. Click **"Save"**

### If Variable Exists:

1. Click **"Edit"** (pencil icon)
2. Update the value
3. Make sure all three environments are checked
4. Click **"Save"**

---

## ⚠️ Common Mistakes

### DATABASE_URL Issues:

❌ **Wrong:** `file:./dev.db` (SQLite - doesn't work on Vercel)
✅ **Correct:** `postgres://...@db.prisma.io:5432/postgres?sslmode=require`

❌ **Wrong:** Missing in environment variables
✅ **Correct:** Added to all three environments

❌ **Wrong:** Using PRISMA_DATABASE_URL (with Accelerate)
✅ **Correct:** Using direct POSTGRES_URL

---

## 🔍 Verify They're Set

After adding variables:

1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Scroll to **"Environment Variables"** section
4. Verify DATABASE_URL shows up (value will be hidden)

---

## 🚀 After Verification

Once all 3 variables are set correctly:

1. **Push your code to GitHub** (see FINAL_PUSH_INSTRUCTIONS.txt)
2. **Vercel will auto-deploy** with correct settings
3. **Tables will be created** automatically
4. **Login will work!** ✅

---

## 💡 Quick Test

After deployment, test:
1. Go to your Vercel URL
2. Click "Sign Up"
3. Create account
4. If it works → Everything is configured correctly! 🎉
5. If 500 error → Check Vercel logs (Deployments → Click deployment → Runtime Logs)

---

**Check these variables, then push your code!**








