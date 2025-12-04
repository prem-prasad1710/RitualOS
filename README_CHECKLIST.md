# ✅ GitHub Push Checklist

## Pre-Push Checklist

### 1. Take Screenshots ✓

Follow `SCREENSHOT_GUIDE.md` to capture:

```
screenshots/
├── landing-hero.png       ☐
├── dashboard.png          ☐
├── quick-rituals.png      ☐
├── ai-coach.png          ☐
├── ritual-builder.png     ☐
├── marketplace.png        ☐
├── challenges.png         ☐
├── ritual-player.png      ☐
└── insights.png          ☐
```

**How to:**
1. Create folder: `mkdir screenshots`
2. Go to http://localhost:3000
3. Navigate to each page
4. Take screenshots (Cmd+Shift+4 on Mac, Win+Shift+S on Windows)
5. Save with exact names above

### 2. Update README.md with Your Info ✓

Replace these placeholders in `README.md`:

```
☐ [Your Name] → Your actual name
☐ [your-portfolio.com] → Your portfolio URL
☐ [linkedin.com/in/yourprofile] → Your LinkedIn
☐ [@yourusername] → Your GitHub username
☐ your.email@example.com → Your email
☐ [Live Demo](#) → Your deployed URL (or remove if not deployed)
```

**Find & Replace in README.md:**
- `yourusername` → your GitHub username
- `[Your Name]` → your actual name

### 3. Verify Files Exist ✓

```
☐ README.md (complete with screenshots)
☐ LICENSE
☐ .gitignore
☐ .env.example
☐ SCREENSHOT_GUIDE.md
☐ GITHUB_SETUP.md
☐ NEW_FEATURES.md
☐ FEATURES_SUMMARY.md
☐ PROJECT_SUMMARY.md
☐ screenshots/ (9 images)
```

### 4. Clean Up ✓

Remove files you don't want on GitHub:

```bash
# Make sure these are in .gitignore:
.env
.next/
node_modules/
*.db
*.db-journal
```

Verify:
```bash
git status
# Should NOT show:
# - .env
# - .next/
# - node_modules/
# - dev.db
```

---

## GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `ritualos`
3. **Description:** Use from `GITHUB_REPO_DESCRIPTION.txt`
4. **Public** repository
5. **Do NOT** initialize with README (you already have one)
6. Click "Create repository"

### Step 2: Add Description & Topics

After creating repo:

1. Click **⚙️ Settings** (top right)
2. Scroll to "About" section
3. Click **⚙️ Edit** next to About

**Description:**
```
🧘‍♂️ The Micro-Ritual Operating System for Gen Z | AI-powered micro-rituals for focus, anxiety relief & mental wellness | Next.js 14 + TypeScript + Prisma
```

**Website:** (leave empty for now, add after deploying)

**Topics:** (copy-paste)
```
nextjs typescript prisma mental-health productivity wellness gen-z rituals ai-coach saas tailwindcss framer-motion habit-tracker mindfulness focus
```

4. Click "Save changes"

---

## Git Commands

### First Time Push

```bash
cd ritualos

# Check what will be committed
git status

# Add all files
git add .

# Check again (make sure .env is NOT listed)
git status

# Commit
git commit -m "Initial commit: RitualOS - Micro-Ritual Operating System for Gen Z"

# Add remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/ritualos.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### After Adding Screenshots

```bash
# Add screenshots
git add screenshots/

# Commit
git commit -m "docs: add screenshots and visual documentation"

# Push
git push
```

---

## Post-Push Verification

### On GitHub, verify:

```
☐ README renders correctly
☐ All 9 screenshots show up
☐ Badges display properly
☐ Table formatting is correct
☐ No .env file in repo
☐ No .next folder in repo
☐ No node_modules in repo
☐ LICENSE file shows up
☐ Description and topics are set
```

### If images don't show:

1. Check file names match exactly
2. Check screenshots/ folder is in root
3. Check image paths in README: `./screenshots/image.png`
4. Wait 1-2 minutes and refresh (GitHub caching)

---

## Optional: Deploy to Vercel

### Why Deploy?

- Live demo link for README
- Shows project in action
- Better for portfolio/resume
- Free on Vercel

### Quick Deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? [your-username]
# Link to existing project? No
# What's your project name? ritualos
# In which directory? ./ 
# Want to override settings? No
```

### After Deployment:

1. Get deployment URL: `https://ritualos.vercel.app`
2. Update README.md: Replace `[Live Demo](#)` with your URL
3. Update GitHub repo: Add website URL in About section
4. Push changes:
   ```bash
   git add README.md
   git commit -m "docs: add live demo link"
   git push
   ```

---

## Share Your Project

### After pushing to GitHub:

### 1. Update Your GitHub Profile

**Pin this repository:**
1. Go to your GitHub profile
2. Click "Customize your pins"
3. Select "ritualos"
4. Click "Save pins"

### 2. Add to LinkedIn

**Add as a project:**
1. LinkedIn → Profile → Projects
2. "Add project"
3. **Project name:** RitualOS
4. **Project URL:** GitHub link
5. **Description:** Use from `GITHUB_REPO_DESCRIPTION.txt` (LinkedIn section)

**Post about it:**
```
Excited to share RitualOS 🧘‍♂️⚡

A full-stack mental wellness platform I built to help Gen Z combat digital overwhelm.

Key innovations:
⚡ Quick Rituals - Emergency anxiety relief (one-tap)
🤖 AI Chat Coach - Explains WHY rituals work psychologically
🏆 Challenges - Structured 7-30 day programs
🏪 Marketplace - 500+ community ritual templates

Tech: Next.js 14, TypeScript, Prisma, Tailwind CSS, Framer Motion

12 complete features | 9 pages | Production-ready architecture

Check it out: [GitHub link]
Live demo: [Vercel link]

#webdev #nextjs #typescript #mentalhealth #productivity
```

### 3. Update Resume

Add under "Projects" section:

```
RitualOS - Micro-Ritual Operating System                    [Month Year]
• Built full-stack mental wellness SaaS with 12 features including AI coaching,
  emergency anxiety relief, and community marketplace
• Implemented Next.js 14, TypeScript, Prisma ORM, JWT auth, and real-time features
• Designed 4 unique systems: Quick Rituals (emergency), AI Coach (learning),
  Marketplace (discovery), Challenges (motivation)
• Created drag-and-drop ritual builder, full-screen player, and data visualization
  dashboard with Recharts and Framer Motion animations
• Tech: Next.js, TypeScript, Prisma, Tailwind CSS, Zustand, @dnd-kit

GitHub: github.com/[username]/ritualos | Live: [demo-url]
```

### 4. Add to Portfolio Website

**Project Card:**
```
RitualOS
The Micro-Ritual Operating System for Gen Z

A comprehensive mental wellness platform helping Gen Z combat digital
overwhelm through AI-powered micro-rituals.

[View Live] [View Code] [Case Study]

Tags: Next.js • TypeScript • Prisma • AI • Full-Stack
```

---

## Quick Reference

### GitHub Repo URL:
```
https://github.com/[yourusername]/ritualos
```

### Clone Command (for sharing):
```bash
git clone https://github.com/[yourusername]/ritualos.git
```

### Short Description (for sharing):
```
🧘‍♂️ RitualOS - The Micro-Ritual Operating System for Gen Z
Transform scattered attention into focused action through AI-powered micro-rituals
Built with Next.js 14, TypeScript, Prisma
```

---

## Troubleshooting

### "Git LFS" errors?
```bash
# You don't need LFS, skip it
git config --global filter.lfs.smudge "git-lfs smudge --skip -- %f"
git config --global filter.lfs.process "git-lfs filter-process --skip"
```

### "Authentication failed"?
```bash
# Use Personal Access Token instead of password
# Go to: GitHub Settings → Developer settings → Personal access tokens
# Generate token with 'repo' scope
# Use token as password when pushing
```

### "Remote already exists"?
```bash
# Remove and re-add
git remote remove origin
git remote add origin https://github.com/yourusername/ritualos.git
```

### Screenshots not showing?
```bash
# Check file names (case-sensitive!)
ls screenshots/

# Should match exactly:
# landing-hero.png (not Landing-Hero.png)
# dashboard.png (not Dashboard.PNG)
```

---

## Final Checklist

Before closing this file, verify:

```
☑️ Created GitHub repository
☑️ Added description and topics
☑️ Took all 9 screenshots
☑️ Updated README with your info
☑️ Pushed to GitHub
☑️ Verified README renders correctly
☑️ Pinned repository on profile
☑️ (Optional) Deployed to Vercel
☑️ Added to LinkedIn
☑️ Added to resume
☑️ Added to portfolio website
```

---

## 🎉 You're Done!

Your RitualOS is now on GitHub with:
- ✨ Professional README
- 📸 Screenshots
- 📝 Complete documentation
- 🎯 Resume-worthy presentation
- 🌟 GitHub-optimized

**Next Steps:**
1. Share on social media
2. Add to portfolio
3. Show to recruiters
4. Get feedback from community
5. Keep building! 🚀

---

## Need Help?

Check these files:
- `SCREENSHOT_GUIDE.md` - How to take screenshots
- `GITHUB_SETUP.md` - Detailed GitHub setup
- `GITHUB_REPO_DESCRIPTION.txt` - Copy-paste descriptions
- `NEW_FEATURES.md` - Feature details
- `FEATURES_SUMMARY.md` - Complete feature list

Good luck! 🎊

