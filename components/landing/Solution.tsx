'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: '⚡',
    title: 'Micro-Rituals',
    description: 'Tiny 2-10 minute intentional actions. Not overwhelming habits—just meaningful moments.',
    gradient: 'from-yellow-400 to-orange-400',
  },
  {
    icon: '🔄',
    title: 'Ritual Loops',
    description: 'Chain micro-rituals into powerful sequences. Like a playlist for your mental state.',
    gradient: 'from-green-400 to-cyan-400',
  },
  {
    icon: '🤖',
    title: 'AI Ritual Coach',
    description: 'Describe your struggle. Get personalized ritual suggestions with clear reasoning.',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    icon: '📊',
    title: 'Pattern Insights',
    description: 'Discover when and why your rituals work. Build self-awareness, not just streaks.',
    gradient: 'from-blue-400 to-purple-400',
  },
]

export default function Solution() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">RitualOS</span> Approach
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A personal operating system that transforms scattered energy into focused, intentional action.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-purple-500/50 transition-all group"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
              
              <div className="relative z-10">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Example ritual loop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Example: "Deep Focus Activation"</h3>
            <p className="text-gray-300">A ritual loop to combat distraction</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              { step: '1', name: 'Attention Reset', time: '3min', desc: 'Box breathing' },
              { step: '2', name: 'Intention Setting', time: '2min', desc: 'Write your focus' },
              { step: '3', name: 'Focus Sprint', time: '25min', desc: 'Deep work' },
            ].map((ritual, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-gray-800 border border-purple-500/50 rounded-lg p-4 min-w-[200px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full text-white text-sm font-bold">
                      {ritual.step}
                    </span>
                    <span className="text-white font-semibold">{ritual.name}</span>
                  </div>
                  <div className="text-gray-400 text-sm">{ritual.desc}</div>
                  <div className="text-purple-400 text-xs mt-1">{ritual.time}</div>
                </motion.div>
                
                {index < 2 && (
                  <div className="hidden md:block mx-2 text-purple-400">→</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

