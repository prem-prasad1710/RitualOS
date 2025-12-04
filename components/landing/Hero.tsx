'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    setMounted(true)
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, #667eea 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, #764ba2 0%, transparent 50%)',
              'radial-gradient(circle at 0% 100%, #667eea 0%, transparent 50%)',
              'radial-gradient(circle at 100% 0%, #764ba2 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, #667eea 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating particles */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full mb-8"
          >
            <span className="text-purple-300 text-sm font-medium">
              The Micro-Ritual OS for Focused Gen Z
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Turn{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Distracted Time
            </span>
            <br />
            Into Meaningful Rituals
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Combat digital overwhelm with tiny, intentional actions. Not another habit tracker—
            a personal operating system for your attention, anxiety, and energy.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Start Your First Ritual
              </motion.button>
            </Link>
            <Link href="#how-it-works">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                See How It Works
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: '2-10min', label: 'Per Ritual' },
              { value: '4x', label: 'More Focus' },
              { value: '0', label: 'Overwhelm' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute right-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-3 bg-purple-400 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

