# 📸 Screenshot Guide for RitualOS

## How to Take Screenshots for GitHub

### 1. Create Screenshots Folder

```bash
mkdir screenshots
```

### 2. Screenshots to Take

#### **A. Landing Page Hero** (`landing-hero.png`)
- **URL:** `http://localhost:3000/`
- **What to capture:** Full hero section with animated background
- **Tips:** 
  - Wait for animations to settle
  - Capture the "Turn Distracted Time Into Meaningful Rituals" headline
  - Include the CTA buttons

#### **B. Dashboard** (`dashboard.png`)
- **URL:** `http://localhost:3000/app`
- **What to capture:** Full dashboard with stats and quick actions
- **Tips:**
  - Make sure you have some data (create a ritual first)
  - Capture the streak counter, stats cards, and 4 quick action buttons
  - Show "Your Ritual Loops" section

#### **C. Quick Rituals** (`quick-rituals.png`)
- **URL:** `http://localhost:3000/app/quick-ritual`
- **What to capture:** The 4 quick ritual cards
- **Tips:**
  - Show the emergency banner at the top
  - Capture all 4 ritual cards (3-Minute Calm, Stress Reset, Focus Now, Energy Boost)

#### **D. AI Coach** (`ai-coach.png`)
- **URL:** `http://localhost:3000/app/coach`
- **What to capture:** Chat interface with a conversation
- **Tips:**
  - Type a message like "I can't stop scrolling before bed"
  - Wait for the AI response
  - Capture the full conversation showing the detailed ritual suggestion

#### **E. Ritual Builder** (`ritual-builder.png`)
- **URL:** `http://localhost:3000/app/rituals`
- **What to capture:** The ritual creation form with live preview
- **Tips:**
  - Fill out the form partially
  - Show the live preview card on the right updating in real-time
  - Display some created rituals at the bottom

#### **F. Marketplace** (`marketplace.png`)
- **URL:** `http://localhost:3000/app/marketplace`
- **What to capture:** The grid of community ritual templates
- **Tips:**
  - Show the stats banner at top
  - Capture the filter tabs
  - Show 6+ template cards with ratings and uses

#### **G. Challenges** (`challenges.png`)
- **URL:** `http://localhost:3000/app/challenges`
- **What to capture:** The challenges page with multiple challenge cards
- **Tips:**
  - Show the stats cards at top
  - Capture at least 3 challenge cards
  - Show different difficulty levels

#### **H. Ritual Player** (`ritual-player.png`)
- **URL:** `http://localhost:3000/app/loops/[id]` (click on a loop)
- **What to capture:** The full-screen ritual player
- **Tips:**
  - Start a ritual
  - Capture during an active step
  - Show the timer, step name, and controls
  - Capture the breathing animation if visible

#### **I. Insights** (`insights.png`)
- **URL:** `http://localhost:3000/app/insights`
- **What to capture:** Dashboard with charts and AI insights
- **Tips:**
  - Complete a few rituals first to have data
  - Show the 3 stat cards at top
  - Capture at least 2 charts
  - Show the AI-generated insights cards

---

## Screenshot Tools

### macOS
- **Command + Shift + 4** – Select area
- **Command + Shift + 5** – Screenshot menu (full screen, window, area)

### Windows
- **Windows + Shift + S** – Snipping tool
- **PrtScn** – Full screen

### Browser Extensions
- **Awesome Screenshot** (Chrome/Firefox)
- **Nimbus Screenshot** (Chrome/Firefox)
- **Full Page Screen Capture** (Chrome)

---

## Screenshot Best Practices

### 1. Resolution
- Use at least **1920x1080** resolution
- Retina displays recommended for crisp images

### 2. Browser Window
- Use a clean browser (hide bookmarks bar)
- Zoom to 100% (no zoom in/out)
- Use Chrome/Firefox for best results

### 3. Timing
- Wait for all animations to complete
- Wait for data to load
- Wait for any loading states to finish

### 4. Content
- Use realistic data (not "test test test")
- Show meaningful ritual names
- Use actual feature functionality

### 5. Format
- Save as **PNG** (better quality than JPG)
- Name files exactly as specified in README
- Keep file sizes under 1MB if possible

---

## Quick Screenshot Workflow

### Setup Phase (Do Once)

```bash
# 1. Make sure app is running
npm run dev

# 2. Create a test account
# Go to http://localhost:3000/signup
# Email: demo@ritualos.com
# Password: demo123

# 3. Create some sample data
# - Create 3-4 rituals
# - Create 2 ritual loops
# - Complete 1-2 ritual sessions
```

### Screenshot Phase

```bash
# 1. Open the URL for each screenshot
# 2. Wait for page to fully load
# 3. Take screenshot (Cmd+Shift+4 on Mac)
# 4. Save to screenshots/ folder
# 5. Name exactly as specified
```

### File Checklist

```
screenshots/
├── landing-hero.png       ✓
├── dashboard.png          ✓
├── quick-rituals.png      ✓
├── ai-coach.png          ✓
├── ritual-builder.png     ✓
├── marketplace.png        ✓
├── challenges.png         ✓
├── ritual-player.png      ✓
└── insights.png          ✓
```

---

## Optional: Create GIFs

For even better GitHub presentation, create GIFs of key features:

### 1. **Drag-and-Drop Ritual Builder**
- Record dragging rituals to create a loop
- Tool: **LICEcap** (free, Mac/Windows)

### 2. **Quick Ritual in Action**
- Record clicking through a quick ritual
- Show the step-by-step flow

### 3. **AI Coach Conversation**
- Record typing a message and receiving response
- Show the full interaction

### Tools for GIFs:
- **LICEcap** (free, simple)
- **Kap** (Mac, open source)
- **ScreenToGif** (Windows, free)

Save GIFs in `screenshots/` folder as:
- `loop-builder-demo.gif`
- `quick-ritual-demo.gif`
- `ai-coach-demo.gif`

---

## After Taking Screenshots

### 1. Optimize Images (Optional)

```bash
# Install imagemagick
brew install imagemagick  # Mac
# or
choco install imagemagick # Windows

# Optimize PNGs
mogrify -strip -quality 85 screenshots/*.png
```

### 2. Verify in README

Open `README.md` and verify all image paths are correct:

```markdown
![Landing Page Hero](./screenshots/landing-hero.png)
```

### 3. Test on GitHub

After pushing, verify images render correctly on GitHub.

---

## Troubleshooting

### Images not showing on GitHub?

**Issue:** Relative paths incorrect

**Fix:** Use relative path from README location
```markdown
![Image](./screenshots/image.png)  ✓ Correct
![Image](/screenshots/image.png)   ✗ Wrong
![Image](screenshots/image.png)    ✓ Also works
```

### Images too large?

**Issue:** File size over 1MB

**Fix:** Compress with:
- [TinyPNG](https://tinypng.com/)
- [ImageOptim](https://imageoptim.com/) (Mac)
- `imagemagick` (command line)

### Images blurry?

**Issue:** Browser zoom or low resolution

**Fix:**
- Set browser zoom to 100%
- Use at least 1920x1080 resolution
- Save as PNG, not JPG

---

## Pro Tips

1. **Dark Mode**: RitualOS is optimized for dark mode - use it!
2. **Consistency**: Use the same browser and resolution for all screenshots
3. **Data**: Use realistic data, not lorem ipsum
4. **Timing**: Take screenshots in the morning (better lighting for screen)
5. **Background**: Close unnecessary tabs/windows for clean screenshots

---

## Example Folder Structure After Screenshots

```
ritualos/
├── screenshots/
│   ├── landing-hero.png
│   ├── dashboard.png
│   ├── quick-rituals.png
│   ├── ai-coach.png
│   ├── ritual-builder.png
│   ├── marketplace.png
│   ├── challenges.png
│   ├── ritual-player.png
│   ├── insights.png
│   ├── loop-builder-demo.gif (optional)
│   ├── quick-ritual-demo.gif (optional)
│   └── ai-coach-demo.gif (optional)
├── README.md
└── ... (other files)
```

---

## Ready to Push!

Once you have all 9 screenshots:

```bash
git add screenshots/
git add README.md
git commit -m "Add screenshots and complete README"
git push
```

Your GitHub repo will look professional and complete! 🎉

