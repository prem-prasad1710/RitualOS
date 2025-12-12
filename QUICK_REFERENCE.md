# 🚀 Quick Reference Guide - New Features

## 📍 Where to Find Everything

### Landing Page (/)
```
Home Page
├── ✨ Enhanced Hero Section (with 3D effects)
├── 📖 Problem Section
├── 💡 Solution Section
├── 🔄 How It Works
├── 🌟 Why Different
├── ⭐ NEW: Testimonials Section
├── 📣 CTA Section
└── 📄 Footer
```

### Dashboard (/app)
```
Dashboard
├── 📊 Stats Cards (3D hover effects)
│   ├── 🔥 Ritual Streak
│   ├── ✨ Today's Rituals
│   └── 🔄 Total Loops
│
├── ⚡ Quick Actions (8 buttons)
│   ├── 🧘 Breathing Exercise (NEW)
│   ├── 😊 Mood Tracker (NEW)
│   ├── ⏱️ Focus Timer (NEW)
│   ├── 🏆 Achievements (NEW)
│   ├── ⚡ Quick Ritual (SOS)
│   ├── 🤖 AI Coach
│   ├── 🎯 Challenges
│   └── 🏪 Marketplace
│
├── 📊 Floating Button (bottom-right)
│   └── Progress Visualization (NEW)
│
└── 🔄 Your Ritual Loops
```

### Demo Page (/demo)
```
Demo Page
├── 🧘 Breathing Exercise Demo
├── 😊 Mood Tracker Demo
├── ⏱️ Focus Timer Demo
├── 🏆 Achievement Badges Demo
├── 📊 Progress Charts Demo
├── ✨ Loading Animations Demo
├── 🔔 Notification Toasts
├── 🎆 Streak Fireworks
└── 🎨 Animation Showcase
```

---

## ⚡ Quick Actions Reference

| Icon | Feature | What It Does | Access |
|------|---------|--------------|--------|
| 🧘 | **Breathing** | Guided breathing exercises | Dashboard → Quick Actions |
| 😊 | **Mood Tracker** | Log your emotions | Dashboard → Quick Actions |
| ⏱️ | **Focus Timer** | Pomodoro with sounds | Dashboard → Quick Actions |
| 🏆 | **Achievements** | View badges | Dashboard → Quick Actions |
| 📊 | **Progress** | View charts | Floating button (bottom-right) |
| ⚡ | **Quick Ritual** | Emergency relief | Dashboard → Quick Actions |
| 🤖 | **AI Coach** | Get personalized help | Dashboard → Quick Actions |
| 🎯 | **Challenges** | Join challenges | Dashboard → Quick Actions |
| 🏪 | **Marketplace** | Browse rituals | Dashboard → Quick Actions |

---

## 🎨 Animation Classes Reference

### CSS Classes You Can Use

```css
/* Entrance Animations */
.animate-fadeInUp       /* Slide up with fade */
.animate-fadeInDown     /* Slide down with fade */
.animate-slideInLeft    /* Slide from left */
.animate-slideInRight   /* Slide from right */
.animate-scaleIn        /* Scale up entrance */

/* Continuous Animations */
.animate-float          /* Gentle floating */
.animate-pulse          /* Pulsing effect */
.animate-shimmer        /* Shimmer overlay */
.animate-glow           /* Glowing border */
.animate-rotate3d       /* 3D rotation */
.animate-bounce         /* Bouncing */
.animate-wiggle         /* Wiggle/shake */
.animate-gradient       /* Animated gradient */

/* Effects */
.card-3d                /* 3D card hover */
.neon-glow              /* Neon text glow */
.holographic            /* Rainbow gradient */
.hover-lift             /* Lift on hover */
.glass                  /* Glassmorphism */
.gradient-text          /* Gradient text */
.perspective-1000       /* 3D perspective */
.preserve-3d            /* 3D transforms */
```

---

## 🎯 Component Props Reference

### BreathingExercise
```typescript
interface Props {
  onClose: () => void
}
```

### MoodTracker
```typescript
// No props required
```

### FocusTimer
```typescript
// No props required
```

### AchievementBadges
```typescript
interface Props {
  totalSessions?: number
  streak?: number
  totalLoops?: number
}
```

### ProgressVisualization
```typescript
interface Props {
  sessions?: Session[]
}
```

### NotificationToast
```typescript
interface Props {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
}
```

### StreakFireworks
```typescript
interface Props {
  streak: number
  onClose: () => void
}
```

### AnimatedLoader
```typescript
interface Props {
  message?: string
  type?: 'spinner' | 'dots' | 'pulse' | 'ritual'
}
```

---

## 🎨 Color Reference

### Gradients
```css
/* Primary */
from-purple-600 to-cyan-600

/* Features */
from-blue-500 to-indigo-600      /* Breathing */
from-pink-500 to-rose-600        /* Mood */
from-orange-500 to-red-600       /* Timer */
from-yellow-500 to-amber-600     /* Achievements */
from-green-500 to-teal-600       /* Progress */

/* States */
from-green-500 to-emerald-600    /* Success */
from-red-500 to-rose-600         /* Error */
from-yellow-500 to-orange-600    /* Warning */
from-blue-500 to-cyan-600        /* Info */
```

### Shadows & Glows
```css
/* Purple glow */
box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);

/* Cyan glow */
box-shadow: 0 10px 30px rgba(34, 211, 238, 0.4);

/* Success glow */
box-shadow: 0 10px 30px rgba(5, 150, 105, 0.4);

/* 3D card shadow */
box-shadow: 0 25px 50px rgba(147, 51, 234, 0.4);
```

---

## 📱 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close any modal |
| `Space` | Pause/Resume (in Focus Timer) |
| `Enter` | Confirm action |

---

## 🎭 Framer Motion Variants

### Common Patterns

```typescript
// Fade in from bottom
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Scale entrance
const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

// Hover lift
const hoverLift = {
  whileHover: { 
    y: -8, 
    scale: 1.02,
    transition: { duration: 0.2 }
  }
}

// Tap feedback
const tapScale = {
  whileTap: { scale: 0.95 }
}
```

---

## 🔔 Notification Examples

```typescript
// Success notification
addNotification('Ritual completed! 🎉', 'success')

// Error notification
addNotification('Something went wrong', 'error')

// Info notification
addNotification('New achievement unlocked!', 'info')

// Warning notification
addNotification('Don't forget your daily ritual!', 'warning')
```

---

## 📊 Chart Data Format

### Weekly Activity
```typescript
[
  { day: 'Mon', rituals: 3 },
  { day: 'Tue', rituals: 5 },
  // ...
]
```

### Category Distribution
```typescript
[
  { category: 'Focus', count: 12 },
  { category: 'Energy', count: 8 },
  // ...
]
```

### Wellness Radar
```typescript
[
  { category: 'Focus', score: 85 },
  { category: 'Energy', score: 90 },
  // ...
]
```

---

## 🎯 Achievement Milestones

| Badge | Requirement | Rarity |
|-------|-------------|--------|
| 🌱 First Steps | 1 ritual | Common |
| ⭐ Ritual Apprentice | 10 rituals | Common |
| 🏆 Ritual Master | 50 rituals | Rare |
| 👑 Ritual Legend | 100 rituals | Epic |
| 🔥 Week Warrior | 7-day streak | Rare |
| 💎 Month Master | 30-day streak | Epic |
| 🌟 Eternal Flame | 100-day streak | Legendary |
| 🔄 Loop Creator | 5 loops | Rare |
| 🏗️ Loop Architect | 15 loops | Epic |

---

## ⏱️ Focus Timer Presets

| Duration | Best For |
|----------|----------|
| 5 min | Quick break meditation |
| 10 min | Short task completion |
| 15 min | Email batch processing |
| 25 min | Classic Pomodoro |
| 45 min | Deep work session |
| 60 min | Extended focus time |

---

## 🎵 Ambient Sounds

| Sound | Icon | Best For |
|-------|------|----------|
| Rain | 🌧️ | Relaxation, Reading |
| Ocean Waves | 🌊 | Meditation, Sleep |
| Forest | 🌲 | Nature connection |
| Campfire | 🔥 | Cozy work |
| Café | ☕ | Writing, Creative work |
| White Noise | 📻 | Deep focus |
| Birds | 🐦 | Morning rituals |
| Silence | 🤫 | Pure focus |

---

## 😊 Mood Categories

| Mood | Emoji | Color | Use Case |
|------|-------|-------|----------|
| Amazing | 🤩 | Yellow | Peak moments |
| Happy | 😊 | Green | Good vibes |
| Calm | 😌 | Blue | Peaceful state |
| Neutral | 😐 | Gray | Normal day |
| Anxious | 😰 | Orange | Pre-event stress |
| Sad | 😢 | Blue | Down moments |
| Angry | 😠 | Red | Frustration |
| Tired | 😴 | Purple | Low energy |

---

## 🧘 Breathing Patterns

| Pattern | Timing | Best For |
|---------|--------|----------|
| Box Breathing | 4-4-4-4 | Anxiety relief |
| 4-7-8 Technique | 4-7-8-2 | Sleep, Relaxation |
| Calm Breathing | 4-4-6-2 | General calm |
| Energizing | 3-3-3-1 | Morning boost |

---

## 🚀 Performance Tips

1. **Animations** - Use GPU-accelerated properties (transform, opacity)
2. **Charts** - Lazy load with dynamic imports
3. **Modals** - Use AnimatePresence for smooth exits
4. **Images** - Optimize and use Next.js Image component
5. **State** - Minimize re-renders with React.memo

---

## 🐛 Troubleshooting

### Common Issues

**Animations not working?**
- Check if framer-motion is installed
- Ensure component is client-side ('use client')

**Charts not showing?**
- Verify recharts is installed
- Check data format matches expected structure

**Modal not closing?**
- Ensure onClick handlers are properly set
- Check z-index conflicts

**Gradients not visible?**
- Verify Tailwind CSS is configured
- Check gradient syntax

---

## 📚 Resources

### Documentation
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Recharts Docs](https://recharts.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

### Inspiration
- [Motion One](https://motion.dev/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Magic UI](https://magicui.design/)

---

## 🎉 Quick Tips

💡 **Pro Tips:**
1. Use breathing exercise before important tasks
2. Track mood daily for pattern insights
3. Set ambient sounds for deep work
4. Check achievements for motivation
5. Review progress weekly
6. Visit `/demo` to explore all features

🚀 **Developer Tips:**
1. All components are in `components/app/`
2. Global animations in `app/globals.css`
3. Use AnimatedLoader for loading states
4. ToastContainer for notifications
5. Check demo page for integration examples

---

**Happy Ritualing! ✨**

*Built with 💜 for an amazing user experience*




