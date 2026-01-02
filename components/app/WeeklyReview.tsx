'use client'

/**
 * Weekly Review & Planning System
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WeeklyGoal {
  id: string
  goal: string
  completed: boolean
}

interface Reflection {
  wins: string[]
  challenges: string[]
  learnings: string[]
  nextWeekGoals: string[]
}

export default function WeeklyReview() {
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [reflection, setReflection] = useState<Reflection>({
    wins: [''],
    challenges: [''],
    learnings: [''],
    nextWeekGoals: ['']
  })
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([])

  const reviewSteps = [
    {
      title: '🎉 Celebrate Wins',
      question: 'What went well this week?',
      placeholder: 'E.g., Completed 5 meditation sessions, felt more focused...',
      field: 'wins' as keyof Reflection
    },
    {
      title: '⚡ Acknowledge Challenges',
      question: 'What was difficult or didn\'t go as planned?',
      placeholder: 'E.g., Struggled with morning routine on busy days...',
      field: 'challenges' as keyof Reflection
    },
    {
      title: '💡 Capture Learnings',
      question: 'What did you learn about yourself?',
      placeholder: 'E.g., I need shorter rituals when stressed...',
      field: 'learnings' as keyof Reflection
    },
    {
      title: '🎯 Set Next Week Goals',
      question: 'What will you focus on next week?',
      placeholder: 'E.g., Practice morning ritual 5 days...',
      field: 'nextWeekGoals' as keyof Reflection
    }
  ]

  const currentReviewStep = reviewSteps[currentStep]

  const addEntry = (field: keyof Reflection) => {
    setReflection({
      ...reflection,
      [field]: [...reflection[field] as string[], '']
    })
  }

  const updateEntry = (field: keyof Reflection, index: number, value: string) => {
    const updated = [...reflection[field] as string[]]
    updated[index] = value
    setReflection({
      ...reflection,
      [field]: updated
    })
  }

  const removeEntry = (field: keyof Reflection, index: number) => {
    const updated = (reflection[field] as string[]).filter((_, i) => i !== index)
    setReflection({
      ...reflection,
      [field]: updated.length === 0 ? [''] : updated
    })
  }

  const completeReview = () => {
    // Create goals for next week from reflection
    const goals: WeeklyGoal[] = reflection.nextWeekGoals
      .filter(g => g.trim())
      .map((goal, i) => ({
        id: `goal-${Date.now()}-${i}`,
        goal,
        completed: false
      }))
    
    setWeeklyGoals(goals)
    setShowReviewModal(false)
    setCurrentStep(0)
    
    // Reset reflection for next week
    setReflection({
      wins: [''],
      challenges: [''],
      learnings: [''],
      nextWeekGoals: ['']
    })
  }

  const getWeekDates = () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    return {
      start: startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const weekDates = getWeekDates()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Weekly Review</h2>
          <p className="text-gray-400">Reflect on your week and plan ahead</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReviewModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
        >
          Start Weekly Review
        </motion.button>
      </div>

      {/* Current Week Goals */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">This Week's Goals</h3>
          <span className="text-sm text-gray-400">{weekDates.start} - {weekDates.end}</span>
        </div>

        {weeklyGoals.length > 0 ? (
          <div className="space-y-3">
            {weeklyGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg"
              >
                <button
                  onClick={() => {
                    setWeeklyGoals(weeklyGoals.map(g => 
                      g.id === goal.id ? { ...g, completed: !g.completed } : g
                    ))
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    goal.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-500 hover:border-green-500'
                  }`}
                >
                  {goal.completed && <span className="text-white text-sm">✓</span>}
                </button>
                <p className={`flex-1 ${goal.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {goal.goal}
                </p>
              </motion.div>
            ))}
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-semibold">
                  {weeklyGoals.filter(g => g.completed).length} / {weeklyGoals.length}
                </span>
              </div>
              <div className="mt-2 bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(weeklyGoals.filter(g => g.completed).length / weeklyGoals.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400 mb-4">No goals set for this week</p>
            <p className="text-gray-500 text-sm">Start a weekly review to set your goals</p>
          </div>
        )}
      </div>

      {/* Weekly Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full my-8"
            >
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Step {currentStep + 1} of {reviewSteps.length}</span>
                  <span className="text-gray-400 text-sm">{Math.round(((currentStep + 1) / reviewSteps.length) * 100)}%</span>
                </div>
                <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / reviewSteps.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-white mb-2">{currentReviewStep.title}</h3>
                <p className="text-gray-300 text-lg">{currentReviewStep.question}</p>
              </div>

              {/* Input Fields */}
              <div className="space-y-3 mb-6">
                {(reflection[currentReviewStep.field] as string[]).map((entry, index) => (
                  <div key={index} className="flex gap-2">
                    <textarea
                      value={entry}
                      onChange={(e) => updateEntry(currentReviewStep.field, index, e.target.value)}
                      placeholder={currentReviewStep.placeholder}
                      rows={2}
                      className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                    {(reflection[currentReviewStep.field] as string[]).length > 1 && (
                      <button
                        onClick={() => removeEntry(currentReviewStep.field, index)}
                        className="w-10 h-10 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => addEntry(currentReviewStep.field)}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors mb-6 text-sm"
              >
                + Add Another
              </button>

              {/* Navigation */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg"
                  >
                    ← Previous
                  </motion.button>
                )}

                {currentStep < reviewSteps.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold"
                  >
                    Next →
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={completeReview}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold"
                  >
                    Complete Review ✓
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-3">💡 Review Tips</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Best done on Sunday evening or Monday morning</li>
          <li>• Be honest and specific about challenges</li>
          <li>• Celebrate small wins - they compound over time</li>
          <li>• Set 3-5 realistic goals for the upcoming week</li>
          <li>• Review previous weeks to see your growth</li>
        </ul>
      </div>
    </div>
  )
}





