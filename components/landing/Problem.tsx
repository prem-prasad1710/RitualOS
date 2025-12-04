'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const problems = [
  {
    icon: '📱',
    title: 'Infinite Scroll Trap',
    description: 'Hours lost to mindless social media, leaving you drained and guilty.',
  },
  {
    icon: '🔔',
    title: 'Constant Context Switching',
    description: 'Notifications fragment your attention. Focus feels impossible.',
  },
  {
    icon: '😰',
    title: 'Productivity Anxiety',
    description: 'The pressure to be "always on" leads to burnout and irregular routines.',
  },
  {
    icon: '🌪️',
    title: 'Mental Overwhelm',
    description: 'Too many tasks, too many thoughts. Where do you even start?',
  },
]

export default function Problem() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The <span className="text-red-400">Gen Z Attention Crisis</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Research shows Gen Z faces unprecedented challenges with focus, anxiety, and digital overwhelm.
            Traditional productivity tools don't address the root cause.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-colors"
            >
              <div className="text-4xl mb-4">{problem.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{problem.title}</h3>
              <p className="text-gray-400">{problem.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-red-400 font-medium">
              The solution isn't just another to-do list or meditation app.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

