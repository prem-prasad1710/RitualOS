'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const comparisons = [
  {
    category: 'Habit Trackers',
    their: 'Generic checkboxes and streaks',
    ours: 'Context-aware ritual loops with emotional understanding',
    icon: '📋',
  },
  {
    category: 'Pomodoro Timers',
    their: 'Just a timer counting down',
    ours: 'Full ritual experience with breathing, intention, and reflection',
    icon: '⏱️',
  },
  {
    category: 'Meditation Apps',
    their: 'One-size-fits-all guided audio',
    ours: 'Personalized micro-rituals for specific situations (anxiety, focus, social prep)',
    icon: '🧘',
  },
  {
    category: 'Todo Lists',
    their: 'Tasks pile up, anxiety increases',
    ours: 'Rituals reset your mental state before tackling tasks',
    icon: '✅',
  },
]

export default function WhyDifferent() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Why RitualOS is{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Different
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We're not another productivity tool. We're a new category: a ritual operating system.
          </p>
        </motion.div>

        <div className="space-y-6">
          {comparisons.map((comp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{comp.icon}</span>
                  <h3 className="text-xl font-bold text-white">{comp.category}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Others */}
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="text-red-400 text-sm font-semibold mb-2">Other Tools</div>
                    <p className="text-gray-300">{comp.their}</p>
                  </div>

                  {/* RitualOS */}
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <div className="text-cyan-400 text-sm font-semibold mb-2">RitualOS</div>
                    <p className="text-gray-300">{comp.ours}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key differentiator callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            The Core Difference
          </h3>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            RitualOS meets you in your emotional state—anxious, scattered, overwhelmed—and gives you
            a precise ritual loop to shift that state. It's not about tracking what you did. It's about
            transforming how you feel and focus, in real-time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

