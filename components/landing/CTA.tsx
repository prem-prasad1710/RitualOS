'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(34, 211, 238, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Take Back Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Attention
            </span>
            ?
          </h2>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the movement of Gen Z turning distraction into intention, one micro-ritual at a time.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-lg font-semibold rounded-lg shadow-2xl hover:shadow-purple-500/50 transition-all"
              >
                Start Your First Ritual — Free
              </motion.button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-sm mt-6"
          >
            No credit card required. Build your first ritual loop in under 2 minutes.
          </motion.p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>No tracking ads</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            <span>Your data stays yours</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

