'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  ritualType: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'College Student',
    avatar: '👨‍🎓',
    content: "RitualOS changed how I handle exam stress. The 5-minute breathing ritual before studying helps me focus like never before. My grades improved and I feel less anxious!",
    rating: 5,
    ritualType: 'Morning Focus',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    role: 'Software Engineer',
    avatar: '👩‍💻',
    content: "I used to doom-scroll for hours. Now I have a 2-minute 'phone check' ritual that keeps me mindful. My productivity shot up 3x!",
    rating: 5,
    ritualType: 'Digital Detox',
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    role: 'High School Senior',
    avatar: '🎓',
    content: "The quick rituals are perfect for my busy schedule. I do a 3-minute gratitude practice every night and sleep so much better now.",
    rating: 5,
    ritualType: 'Night Wind-down',
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    role: 'Content Creator',
    avatar: '🎨',
    content: "As someone with ADHD, RitualOS is a game-changer. The micro-rituals don't feel overwhelming, and the streaks keep me motivated!",
    rating: 5,
    ritualType: 'Creative Flow',
  },
  {
    id: 5,
    name: 'Jake Peterson',
    role: 'Athlete',
    avatar: '⚽',
    content: "I use the pre-game ritual to get in the zone. It's like having a personal sports psychologist in my pocket. Total focus.",
    rating: 5,
    ritualType: 'Performance Prep',
  },
  {
    id: 6,
    name: 'Lily Chang',
    role: 'Startup Founder',
    avatar: '🚀',
    content: "The AI coach helped me design rituals for decision fatigue. Now I start every day with clarity. Best productivity tool I've found!",
    rating: 5,
    ritualType: 'CEO Morning',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900" />
      
      {/* Floating orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-medium mb-4"
          >
            ⭐ Loved by Gen Z
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real Stories from Real Users
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of students, creators, and young professionals who transformed their lives
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredId(testimonial.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="relative group"
            >
              {/* Card */}
              <div className="relative h-full p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === testimonial.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="text-yellow-400 text-lg"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={hoveredId === testimonial.id ? {
                        rotate: [0, -10, 10, -10, 10, 0],
                      } : {}}
                      transition={{ duration: 0.5 }}
                      className="text-4xl"
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Ritual type badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-xs font-medium text-white"
                  >
                    {testimonial.ritualType}
                  </motion.div>
                </div>

                {/* Animated border on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(90deg, #667eea, #22d3ee, #667eea)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={hoveredId === testimonial.id ? {
                    backgroundPosition: ['0% 0%', '100% 0%'],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '4.9/5', label: 'Average Rating' },
            { value: '100K+', label: 'Rituals Completed' },
            { value: '95%', label: 'Recommend Us' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}








