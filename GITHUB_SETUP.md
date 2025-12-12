# 🚀 GitHub Setup Guide for RitualOS

## GitHub Repository Description

### Short Description (for repo homepage)

```
🧘‍♂️ RitualOS - The Micro-Ritual Operating System for Gen Z. Transform scattered attention into focused action through AI-powered micro-rituals, emergency relief modes, and community-driven wellness. Built with Next.js, TypeScript, Prisma.
```

### About Section

**Website:** `https://ritualos.vercel.app` (or your deployed URL)

**Topics/Tags:**
```
nextjs, typescript, prisma, mental-health, productivity, 
wellness, gen-z, rituals, ai-coach, saas, tailwindcss, 
framer-motion, habit-tracker, mindfulness, focus
```

**Description:**
```
The Micro-Ritual Operating System for the Distracted Generation
```

---

## Repository Settings

### 1. General Settings

**Repository name:** `ritualos`

**Description:** 
```
🧘‍♂️ The Micro-Ritual Operating System for Gen Z | AI-powered micro-rituals for focus, anxiety relief & mental wellness | Next.js 14 + TypeScript + Prisma
```

**Website:** Your deployed URL

**Topics:** (Add at least 10 tags)
- nextjs
- typescript
- prisma
- mental-health
- wellness
- productivity
- gen-z
- ai-coach
- tailwindcss
- framer-motion

### 2. Features to Enable

☑️ Issues
☑️ Discussions (optional - for community)
☑️ Preserve this repository
☐ Wikis (not needed)
☐ Projects (optional)

### 3. Social Preview

**Upload a social preview image** (1280x640px)
- Create one showing the app dashboard
- Or use the landing page hero
- Tool: [Canva](https://www.canva.com/) or Figma

---

## Files to Include

### 1. LICENSE

Create a `LICENSE` file:

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 2. .gitignore (Already exists ✓)

Make sure it includes:
```
.next
.env
.env.local
*.db
*.db-journal
node_modules
```

### 3. CONTRIBUTING.md (Optional but professional)

```markdown
# Contributing to RitualOS

Thank you for considering contributing to RitualOS!

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Setup

See README.md for installation instructions.

## Code Style

- Use TypeScript
- Follow existing code patterns
- Add comments for complex logic
- Update README if adding features

## Reporting Bugs

Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

Open an issue with:
- Clear description of the feature
- Why it would be useful
- How it fits with RitualOS philosophy
```

---

## Git Commands

### Initial Setup

```bash
cd ritualos

# Initialize git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: RitualOS - Micro-Ritual Operating System"

# Create GitHub repo (on github.com)
# Then:
git remote add origin https://github.com/yourusername/ritualos.git
git branch -M main
git push -u origin main
```

### After Adding Screenshots

```bash
# Create screenshots folder
mkdir screenshots

# Add your screenshots (see SCREENSHOT_GUIDE.md)

# Add and commit
git add screenshots/
git add README.md
git commit -m "Add screenshots and complete documentation"
git push
```

### Recommended Commit Messages

```bash
# Feature commits
git commit -m "feat: add Quick Ritual emergency mode"
git commit -m "feat: add AI Chat Coach with conversational interface"
git commit -m "feat: add Community Marketplace for ritual templates"
git commit -m "feat: add Challenges system with 7-30 day programs"

# Documentation commits
git commit -m "docs: add comprehensive README with feature descriptions"
git commit -m "docs: add screenshot guide and GitHub setup instructions"

# Bug fixes
git commit -m "fix: resolve chunk loading error in dev mode"

# Style/UI
git commit -m "style: improve dashboard quick actions layout"
git commit -m "style: add animations to Quick Ritual cards"
```

---

## GitHub Profile README

Add RitualOS to your GitHub profile! Create a pinned repository card.

### In Your Profile README:

```markdown
### 🌟 Featured Project: RitualOS

[![RitualOS](https://github-readme-stats.vercel.app/api/pin/?username=yourusername&repo=ritualos&theme=radical)](https://github.com/yourusername/ritualos)

**The Micro-Ritual Operating System for Gen Z**

A full-stack SaaS application helping Gen Z combat digital overwhelm through:
- ⚡ Emergency anxiety relief (Quick Rituals)
- 🤖 AI-powered coaching
- 🏆 Structured 7-30 day challenges
- 🏪 Community marketplace

**Tech:** Next.js 14, TypeScript, Prisma, Tailwind CSS, Framer Motion

🔗 [Live Demo](https://ritualos.vercel.app) | 📖 [Documentation](https://github.com/yourusername/ritualos)
```

---

## SEO Optimization

### README Keywords (Already included)

Make sure these keywords appear in your README:
- Gen Z mental health
- Productivity app
- Anxiety relief
- Focus improvement
- Micro-habits
- Ritual tracking
- AI wellness coach
- Next.js portfolio project

### GitHub Search Optimization

Your repo will rank higher for:
- "nextjs mental health app"
- "typescript productivity saas"
- "gen z wellness app"
- "ritual tracker"
- "ai coaching app"

---

## Deployment (Optional but Recommended)

### Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ritualos
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project name? ritualos
# - In which directory? ./
# - Want to override settings? No

# Add environment variables in Vercel dashboard
# - DATABASE_URL (use PostgreSQL on Vercel or Supabase)
# - JWT_SECRET
# - AI_API_KEY (optional)
```

### Update README with Live Demo Link

After deploying, update README.md:

```markdown
[Live Demo](https://ritualos.vercel.app)
```

---

## Post-Push Checklist

After pushing to GitHub, verify:

☑️ README renders correctly
☑️ All screenshots show up
☑️ Badges display properly
☑️ Links work (including anchor links)
☑️ Code blocks have syntax highlighting
☑️ Table formatting is correct
☑️ License file exists
☑️ .gitignore is working (no .env or .next in repo)

---

## Making Your Repo Stand Out

### 1. Add GitHub Actions Badge (Optional)

```markdown
![Build Status](https://github.com/yourusername/ritualos/workflows/CI/badge.svg)
```

### 2. Add Star History

After getting stars:
```markdown
[![Star History](https://api.star-history.com/svg?repos=yourusername/ritualos&type=Date)](https://star-history.com/#yourusername/ritualos)
```

### 3. Add Stats Badges

```markdown
![GitHub stars](https://img.shields.io/github/stars/yourusername/ritualos?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ritualos?style=social)
![Last Commit](https://img.shields.io/github/last-commit/yourusername/ritualos)
![Code Size](https://img.shields.io/github/languages/code-size/yourusername/ritualos)
```

### 4. Add Demo Video

Record a 1-2 minute demo and upload to:
- YouTube
- Loom
- GitHub (as a release asset)

Add to README:
```markdown
## 🎥 Demo Video

[![RitualOS Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
```

---

## Sample GitHub Profile Bio

Update your GitHub bio to mention RitualOS:

```
🧑‍💻 Full-Stack Developer | Building mental wellness tools for Gen Z
🧘‍♂️ Creator of RitualOS - Micro-Ritual Operating System
💻 Next.js • TypeScript • React • Prisma
🌱 Open to collaborations
```

---

## Share Your Project

### Where to Share:

1. **Reddit**
   - r/webdev
   - r/reactjs
   - r/nextjs
   - r/SideProject
   - r/productivity
   - r/selfimprovement

2. **Twitter/X**
   ```
   Just launched RitualOS 🧘‍♂️⚡
   
   A micro-ritual operating system helping Gen Z combat:
   - Digital overwhelm
   - Anxiety spikes
   - Scattered focus
   
   Features:
   ⚡ Emergency anxiety relief
   🤖 AI coaching
   🏆 7-30 day challenges
   🏪 Community marketplace
   
   Built with Next.js + TypeScript
   
   Live: [link]
   GitHub: [link]
   
   #webdev #nextjs #mentalhealth
   ```

3. **Dev.to / Hashnode**
   - Write a blog post about building it
   - "How I Built RitualOS: A Mental Wellness SaaS"

4. **LinkedIn**
   - Share as a project on your profile
   - Write a post about the problem you solved

5. **Product Hunt** (when fully polished)
   - Launch as a product
   - Get feedback from the community

---

## Quick GitHub Setup Checklist

```
☑️ Create GitHub repository
☑️ Add description and topics
☑️ Upload screenshots (9 images)
☑️ Verify README renders correctly
☑️ Add LICENSE file
☑️ Verify .gitignore works
☑️ Update README with your info (name, links)
☑️ Pin repository on your profile
☑️ Deploy to Vercel (optional)
☑️ Add live demo link to README
☑️ Share on social media
☑️ Add to portfolio website
☑️ Update LinkedIn projects section
☑️ Add to resume
```

---

## Ready to Ship! 🚀

Your RitualOS repo is now:
- ✨ Professional
- 📸 Visually appealing
- 📝 Well-documented
- 🎯 Resume-worthy
- 🌟 GitHub-optimized

Good luck! 🎉




