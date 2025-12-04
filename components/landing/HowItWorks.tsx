'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Tell Us What You\'re Struggling With',
    description: 'Describe your challenge in plain language: "I can\'t stop doomscrolling" or "I feel scattered before meetings."',
    icon: '💬',
  },
  {
    number: '02',
    title: 'Get Personalized Ritual Suggestions',
    description: 'Our AI coach suggests a ritual loop tailored to your situation, with clear reasoning for each step.',
    icon: '🎯',
  },
  {
    number: '03',
    title: 'Experience Playful Ritual Flows',
    description: 'Full-screen ritual player guides you through each step with smooth animations and breathing exercises.',
    icon: '✨',
  },
  {
    number: '04',
    title: 'Build Self-Awareness & Iterate',
    description: 'Reflect after each ritual. Discover your patterns. Refine what works for you.',
    icon: '📈',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-gray-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simple, intuitive, and designed for the way you actually think and feel.
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Step number and icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-xl">
                      <span className="text-4xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 border-2 border-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-purple-400 text-xs font-bold">{step.number}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-lg">{step.description}</p>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-12 top-24 w-0.5 h-16 bg-gradient-to-b from-purple-500 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

