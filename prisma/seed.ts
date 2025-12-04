import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Seed Challenges
  const challenges = [
    {
      name: 'Morning Momentum',
      description: 'Start every day with a 5-minute focus ritual',
      duration: 7,
      difficulty: 'Easy',
      points: 100,
      icon: '🌅',
      color: 'from-orange-500 to-yellow-500',
      goal: 'Complete a morning ritual 7 days in a row',
      benefits: [
        'Build consistent morning routine',
        'Improve focus throughout the day',
        'Reduce morning anxiety'
      ]
    },
    {
      name: 'Digital Detox',
      description: 'Replace evening scrolling with a wind-down ritual',
      duration: 14,
      difficulty: 'Medium',
      points: 250,
      icon: '📵',
      color: 'from-blue-500 to-purple-500',
      goal: 'Complete a screen-free evening ritual for 14 days',
      benefits: [
        'Better sleep quality',
        'Reduced phone dependency',
        'More present evenings'
      ]
    },
    {
      name: 'Focus Mastery',
      description: 'Complete a deep focus loop every workday',
      duration: 21,
      difficulty: 'Medium',
      points: 350,
      icon: '🎯',
      color: 'from-purple-500 to-pink-500',
      goal: 'Do a focus ritual before work for 21 days',
      benefits: [
        'Dramatically improve concentration',
        'Reduce context-switching',
        'Build deep work capacity'
      ]
    },
    {
      name: 'Anxiety Reset',
      description: 'Practice anxiety-relief rituals when triggered',
      duration: 14,
      difficulty: 'Hard',
      points: 300,
      icon: '🌊',
      color: 'from-cyan-500 to-blue-500',
      goal: 'Use quick rituals during anxiety spikes for 14 days',
      benefits: [
        'Better emotional regulation',
        'Reduced anxiety intensity',
        'Build coping toolkit'
      ]
    },
    {
      name: '30-Day Ritual Lifestyle',
      description: 'Complete at least one ritual every single day',
      duration: 30,
      difficulty: 'Hard',
      points: 500,
      icon: '⚡',
      color: 'from-green-500 to-teal-500',
      goal: 'Maintain a daily ritual practice for 30 days',
      benefits: [
        'Transform rituals into lifestyle',
        'Significant mental health improvement',
        'Unlock ultimate achievement'
      ]
    }
  ]

  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: { name: challenge.name },
      update: {},
      create: challenge
    })
  }

  console.log(`✅ Created ${challenges.length} challenges`)

  // Create a demo user for community rituals
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ritualos.com' },
    update: {},
    create: {
      email: 'demo@ritualos.com',
      name: 'RitualOS Community',
      passwordHash: '$2a$10$demohashedpasswordnotreal',
      focusGoal: 'Share amazing rituals',
      streakCount: 0,
      totalPoints: 0,
      level: 1
    }
  })

  // Seed Community Rituals
  const communityRituals = [
    {
      name: 'The 2-Minute Power Start',
      authorId: demoUser.id,
      authorAvatar: '👩‍💻',
      description: 'Quick morning ritual for busy professionals',
      category: 'Focus',
      duration: 2,
      steps: [
        { name: 'Intention Setting', duration: 1 },
        { name: 'Energy Boost', duration: 1 }
      ],
      usesCount: 1247,
      rating: 4.9
    },
    {
      name: 'Digital Sunset Protocol',
      authorId: demoUser.id,
      authorAvatar: '👨‍💼',
      description: 'Break the doomscroll habit before bed',
      category: 'Sleep',
      duration: 10,
      steps: [
        { name: 'Phone Distance', duration: 1 },
        { name: 'Gratitude Journal', duration: 3 },
        { name: 'Tomorrow Planning', duration: 2 },
        { name: 'Body Scan', duration: 4 }
      ],
      usesCount: 2891,
      rating: 5.0
    },
    {
      name: 'Anxiety SOS',
      authorId: demoUser.id,
      authorAvatar: '👩‍⚕️',
      description: 'Emergency ritual for panic attacks',
      category: 'Reset',
      duration: 5,
      steps: [
        { name: '5-4-3-2-1 Grounding', duration: 2 },
        { name: 'Box Breathing', duration: 3 }
      ],
      usesCount: 3456,
      rating: 4.8
    },
    {
      name: 'Deep Work Activation',
      authorId: demoUser.id,
      authorAvatar: '👨‍🎨',
      description: 'Enter flow state in 8 minutes',
      category: 'Focus',
      duration: 8,
      steps: [
        { name: 'Context Clear', duration: 2 },
        { name: 'Intention Anchor', duration: 3 },
        { name: 'Energy Check', duration: 1 },
        { name: 'Timer Set', duration: 2 }
      ],
      usesCount: 1876,
      rating: 4.7
    },
    {
      name: 'Social Confidence Boost',
      authorId: demoUser.id,
      authorAvatar: '👩‍🦰',
      description: 'Prep for meetings and social events',
      category: 'Social',
      duration: 7,
      steps: [
        { name: 'Breathing Reset', duration: 3 },
        { name: 'Power Pose', duration: 2 },
        { name: 'Prepared Questions', duration: 2 }
      ],
      usesCount: 892,
      rating: 4.6
    },
    {
      name: 'Midday Energy Reset',
      authorId: demoUser.id,
      authorAvatar: '👨‍🔬',
      description: 'Beat the afternoon slump',
      category: 'Reset',
      duration: 6,
      steps: [
        { name: 'Movement Break', duration: 2 },
        { name: 'Hydration Check', duration: 1 },
        { name: 'Quick Meditation', duration: 3 }
      ],
      usesCount: 1543,
      rating: 4.5
    }
  ]

  for (const ritual of communityRituals) {
    await prisma.communityRitual.create({
      data: ritual
    })
  }

  console.log(`✅ Created ${communityRituals.length} community rituals`)
  console.log('✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

