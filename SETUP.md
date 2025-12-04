# RitualOS - Quick Setup Guide

## Initial Setup (First Time Only)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
You need to manually create a `.env` file since it's gitignored:

```bash
# Create .env file with these contents:
DATABASE_URL="file:./dev.db"
JWT_SECRET="ritualos-dev-secret-key-2024"
AI_API_KEY=""
AI_API_ENDPOINT="https://api.openai.com/v1/chat/completions"
AI_MODEL="gpt-4"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Or copy from the example:
```bash
# If you have the .env.example file:
cp .env.example .env
```

### 3. Generate Prisma Client & Set Up Database

**If you're having SSL certificate issues with Prisma**, try:

```bash
# Option 1: Use NODE_TLS_REJECT_UNAUTHORIZED (development only!)
NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate
NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma db push
```

**Or standard commands:**

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:3000`

---

## Troubleshooting

### Prisma SSL Certificate Error

If you see:
```
Error: unable to get local issuer certificate
```

**Solution 1** (Quick):
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma generate
NODE_TLS_REJECT_UNAUTHORIZED=0 npx prisma db push
```

**Solution 2** (Better):
Update your Node.js certificates or reinstall Node.js

### Database Issues

If the database seems corrupted:
```bash
# Delete the database file
rm prisma/dev.db

# Recreate it
npx prisma db push
```

### Port Already in Use

If port 3000 is taken:
```bash
# Run on a different port
PORT=3001 npm run dev
```

---

## First User Account

1. Go to `http://localhost:3000`
2. Click "Get Started" or navigate to `/signup`
3. Create an account with:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Focus Goal: (optional) Study, Work, etc.
4. You'll be automatically logged in and redirected to `/app`

---

## Features to Try

1. **Create a Micro-Ritual**
   - Go to "Rituals" in sidebar
   - Fill out the form (name, category, duration)
   - Watch the live preview update

2. **Build a Ritual Loop**
   - Go to "Loops" in sidebar
   - Click rituals to add them to a loop
   - Drag to reorder
   - Create your loop

3. **Experience the Ritual Player**
   - Click on a loop in your dashboard or loops page
   - Click "Begin Ritual"
   - Experience the full-screen immersive player

4. **Check Your Insights**
   - Complete a few rituals
   - Go to "Insights" to see charts and patterns

---

## Tech Stack Quick Reference

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev), easily swappable to PostgreSQL
- **Auth**: JWT with bcryptjs
- **State**: Zustand
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit

---

## Project Structure

```
ritualos/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Utilities (auth, AI, prisma, store)
├── types/            # TypeScript types
├── prisma/           # Database schema
└── public/           # Static assets
```

---

## Adding AI Features (Optional)

To enable AI ritual suggestions:

1. Get an API key from OpenAI or Anthropic
2. Add to `.env`:
   ```
   AI_API_KEY=your-key-here
   ```
3. Restart the dev server
4. Click "I Feel Distracted" on the dashboard to test

---

## Questions?

Check the main README.md for full documentation.

