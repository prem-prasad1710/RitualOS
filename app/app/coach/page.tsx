'use client'

/**
 * AI Coach Page
 * 
 * Conversational interface for getting personalized ritual suggestions and support
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/lib/store'

type Message = {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  "I can't stop scrolling social media before bed",
  "I feel anxious before meetings",
  "I'm feeling scattered and can't focus",
  "I'm burnt out and need a reset",
  "Help me build a morning routine",
  "I want to reduce my phone addiction"
]

export default function CoachPage() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey ${user?.name || 'there'}! 👋 I'm your RitualOS AI Coach. I'm here to help you design rituals that actually work for your life.\n\nTell me what you're struggling with, and I'll suggest a personalized ritual loop with clear reasoning for each step.`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (in production, this would call your AI API)
    setTimeout(() => {
      const response = generateAIResponse(messageContent)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase()

    if (lower.includes('scroll') || lower.includes('social media') || lower.includes('phone')) {
      return `I hear you. The scroll trap is real. Here's a ritual loop I'd suggest:

**"Digital Sunset Ritual"** (10 minutes total)

1. **Screen Time Check** (2min)
   - Review your screen time for today
   - Notice how you feel about it
   *Why: Awareness without judgment is the first step*

2. **Device Distance** (1min)
   - Place phone in another room
   - Set it to Do Not Disturb
   *Why: Physical distance breaks the automatic reach*

3. **Gratitude Reframe** (3min)
   - Write 3 things from today you're grateful for
   *Why: Shifts your brain from dopamine-seeking to appreciation*

4. **Tomorrow's One Thing** (2min)
   - Identify your most important task tomorrow
   *Why: Reduces morning decision fatigue*

5. **Body Scan** (2min)
   - Close your eyes, notice sensations in your body
   *Why: Grounds you in present moment, signals sleep readiness*

Try this tonight, starting 30 minutes before bed. Want me to create this loop for you?`
    }

    if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('meeting')) {
      return `Anxiety before meetings is super common. Let me help you prep:

**"Pre-Meeting Grounding Ritual"** (7 minutes)

1. **Breathing Reset** (3min)
   - Box breathing: 4 in, 4 hold, 4 out, 4 hold
   - Repeat 5 times
   *Why: Activates parasympathetic nervous system, calms fight-or-flight*

2. **Power Posing** (2min)
   - Stand with arms wide, shoulders back
   - Hold for 2 minutes
   *Why: Research shows this reduces cortisol and increases confidence*

3. **Prepared Questions** (2min)
   - Write down 2 questions you could ask
   *Why: Shifts focus from being judged to being curious*

Do this 10 minutes before your meeting. The power pose one is underrated—it really works!

Want me to save this as a ritual loop?`
    }

    if (lower.includes('focus') || lower.includes('scattered') || lower.includes('distract')) {
      return `Scattered focus is the #1 Gen Z struggle. Here's what works:

**"Focus Activation Protocol"** (8 minutes)

1. **Context Switch** (2min)
   - Close ALL tabs except one
   - Turn phone face down
   *Why: Reduces cognitive load from background tasks*

2. **Intention Anchor** (3min)
   - Write: "What am I working on?"
   - Write: "Why does it matter to me?"
   - Write: "What does success look like?"
   *Why: Clear intention = stronger focus pull*

3. **Energy Check** (1min)
   - Drink water
   - Quick stretch
   *Why: Physical readiness supports mental focus*

4. **Timer Set** (1min)
   - Set 25-minute timer
   - Promise yourself: just 25 minutes
   *Why: Commitment reduces startup resistance*

5. **Begin Immediately** (1min)
   - Don't think, just start
   *Why: Action creates momentum*

This works best in the morning. Should I add this to your loops?`
    }

    if (lower.includes('burnout') || lower.includes('tired') || lower.includes('exhausted')) {
      return `Burnout needs gentle, restorative rituals. Here's my suggestion:

**"Energy Restoration Ritual"** (15 minutes)

1. **Permission to Rest** (2min)
   - Set a timer for 15 minutes
   - Tell yourself: "This is productive"
   *Why: Reduces guilt, which drains more energy*

2. **Nature Connection** (5min)
   - Go outside or look at greenery
   - Just observe, don't scroll
   *Why: Nature reduces cortisol by 21% in 10 minutes*

3. **Gentle Movement** (3min)
   - Slow stretches or walk
   - No intensity, just flow
   *Why: Movement without pushing releases stagnant energy*

4. **Sensory Reset** (3min)
   - Notice 5 things you see
   - 4 things you touch
   - 3 sounds, 2 smells, 1 taste
   *Why: Grounds you in present, interrupts burnout spiral*

5. **One Small Win** (2min)
   - Do ONE tiny task
   - Celebrate it
   *Why: Restores sense of agency*

Do this mid-afternoon when energy dips. Ready to create this loop?`
    }

    // Default response
    return `I can help you with that. To give you the best ritual suggestion, tell me more:

• What time of day does this happen?
• What triggers this feeling?
• What have you already tried?
• How much time do you have for a ritual?

The more specific you are, the better I can help! 

Or try one of these quick prompts:
${suggestedPrompts.slice(0, 3).map(p => `• "${p}"`).join('\n')}`
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Ritual Coach</h1>
              <p className="text-gray-400 text-sm">Get personalized ritual suggestions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🤖</span>
                      <span className="text-sm font-semibold text-purple-400">AI Coach</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/60' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-2xl px-6 py-4 rounded-2xl bg-gray-800">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-500 rounded-full"
                  />
                  <span className="text-gray-400 text-sm ml-2">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompts (show when messages is just 1) */}
      {messages.length === 1 && (
        <div className="p-6 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-400 text-sm mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage(prompt)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-gray-800 border-t border-gray-700 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Tell me what you're struggling with..."
              className="flex-1 px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

