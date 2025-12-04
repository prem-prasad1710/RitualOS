/**
 * AI Client Abstraction Layer
 * 
 * This module provides a clean interface for AI-powered features in RitualOS.
 * It's designed to work with any LLM API (OpenAI, Anthropic, etc.)
 * 
 * TO USE: Add your AI_API_KEY to .env file and this will work out of the box.
 * Currently configured for OpenAI-compatible APIs, but easily adaptable.
 */

import { AIRitualSuggestion, AIReflectionQuestion, RitualCategory } from '@/types'

type UserPreferences = {
  focusGoal?: string
  availableTime?: number
  primaryChallenges?: string[]
}

/**
 * Generates a ritual loop suggestion based on user's problem description
 * 
 * @param problemDescription - User's description of what they're struggling with
 * @param userPreferences - Optional user preferences and context
 * @returns A suggested ritual loop with steps and reasoning
 */
export async function generateRitualLoop(
  problemDescription: string,
  userPreferences?: UserPreferences
): Promise<AIRitualSuggestion> {
  // Check if AI is configured
  const apiKey = process.env.AI_API_KEY
  
  if (!apiKey || apiKey === '') {
    // Return a smart default suggestion based on problem keywords
    return generateDefaultSuggestion(problemDescription, userPreferences)
  }

  try {
    const prompt = buildRitualLoopPrompt(problemDescription, userPreferences)
    
    const response = await fetch(process.env.AI_API_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a thoughtful wellness coach specializing in helping Gen Z professionals combat digital overwhelm through micro-rituals. Suggest 2-4 step ritual loops that are practical, quick, and emotionally supportive.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    const suggestion = JSON.parse(data.choices[0].message.content)
    return suggestion
  } catch (error) {
    console.error('AI API call failed, using default suggestion:', error)
    return generateDefaultSuggestion(problemDescription, userPreferences)
  }
}

/**
 * Generates thoughtful reflection questions based on ritual context
 * 
 * @param context - Context about what ritual was just completed
 * @returns Array of reflection questions
 */
export async function generateReflectionQuestions(
  context: {
    ritualName: string
    category: RitualCategory
    duration: number
  }
): Promise<AIReflectionQuestion[]> {
  const apiKey = process.env.AI_API_KEY
  
  if (!apiKey || apiKey === '') {
    return generateDefaultReflections(context)
  }

  try {
    const prompt = `Generate 2 thoughtful reflection questions for someone who just completed a "${context.ritualName}" ritual (${context.category} category, ${context.duration} minutes). Make them introspective but not overwhelming.`
    
    const response = await fetch(process.env.AI_API_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a thoughtful wellness coach. Generate brief, meaningful reflection questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' }
      })
    })

    const data = await response.json()
    const questions = JSON.parse(data.choices[0].message.content)
    return questions
  } catch (error) {
    console.error('AI API call failed, using default reflections:', error)
    return generateDefaultReflections(context)
  }
}

/**
 * Explains the benefits of a specific ritual loop
 * 
 * @param ritualLoop - The ritual loop to explain
 * @returns Explanation of benefits and science behind it
 */
export async function explainRitualBenefits(
  ritualLoop: { name: string; steps: any[] }
): Promise<string> {
  const apiKey = process.env.AI_API_KEY
  
  if (!apiKey || apiKey === '') {
    return generateDefaultExplanation(ritualLoop)
  }

  try {
    const prompt = `Explain in 2-3 sentences why this ritual loop would be beneficial: ${JSON.stringify(ritualLoop)}. Focus on psychological and neurological benefits.`
    
    const response = await fetch(process.env.AI_API_ENDPOINT || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI API call failed, using default explanation:', error)
    return generateDefaultExplanation(ritualLoop)
  }
}

// Helper Functions

function buildRitualLoopPrompt(problem: string, prefs?: UserPreferences): string {
  let prompt = `A user is struggling with: "${problem}"`
  
  if (prefs?.focusGoal) {
    prompt += `\nTheir focus goal is: ${prefs.focusGoal}`
  }
  
  if (prefs?.availableTime) {
    prompt += `\nThey have about ${prefs.availableTime} minutes available`
  }
  
  prompt += `\n\nSuggest a ritual loop with 2-4 micro-rituals. Return JSON in this format:
{
  "name": "Loop name",
  "steps": [
    {
      "name": "Step name",
      "category": "Focus|Reset|Social|Sleep|Custom",
      "durationMinutes": number,
      "description": "What to do",
      "benefits": "Why this helps"
    }
  ],
  "reasoning": "Why this loop works for their situation",
  "scheduleSuggestion": "When to do this"
}`

  return prompt
}

function generateDefaultSuggestion(
  problem: string,
  prefs?: UserPreferences
): AIRitualSuggestion {
  // Smart default based on keywords in the problem
  const lowerProblem = problem.toLowerCase()
  
  if (lowerProblem.includes('sleep') || lowerProblem.includes('night') || lowerProblem.includes('doomscroll')) {
    return {
      name: 'Night Shutdown Ritual',
      steps: [
        {
          name: 'Digital Sunset',
          category: 'Reset',
          durationMinutes: 2,
          description: 'Close all social media apps and place phone face-down',
          benefits: 'Breaks the scroll reflex and signals to your brain that it\'s time to wind down'
        },
        {
          name: 'Three Gratitudes',
          category: 'Reset',
          durationMinutes: 3,
          description: 'Write down three specific things from today you\'re grateful for',
          benefits: 'Shifts focus from anxiety to appreciation, improving sleep quality'
        },
        {
          name: 'Tomorrow\'s One Thing',
          category: 'Focus',
          durationMinutes: 2,
          description: 'Identify the single most important task for tomorrow',
          benefits: 'Reduces morning decision fatigue and anxiety about the next day'
        }
      ],
      reasoning: 'This loop helps break the doomscrolling habit by replacing it with intentional activities that prepare your mind for rest.',
      scheduleSuggestion: '30 minutes before your desired sleep time'
    }
  }
  
  if (lowerProblem.includes('focus') || lowerProblem.includes('distract') || lowerProblem.includes('concentrate')) {
    return {
      name: 'Deep Focus Activation',
      steps: [
        {
          name: 'Attention Reset',
          category: 'Reset',
          durationMinutes: 3,
          description: 'Box breathing: inhale 4, hold 4, exhale 4, hold 4. Repeat 5 times.',
          benefits: 'Activates your parasympathetic nervous system and clears mental clutter'
        },
        {
          name: 'Intention Setting',
          category: 'Focus',
          durationMinutes: 2,
          description: 'Write down: What am I focusing on? Why does it matter?',
          benefits: 'Creates clear purpose and activates goal-oriented neural pathways'
        },
        {
          name: 'Focus Sprint',
          category: 'Focus',
          durationMinutes: 25,
          description: 'Work on your chosen task without any interruptions',
          benefits: 'Builds sustained attention capacity through deliberate practice'
        }
      ],
      reasoning: 'This loop uses breathwork to calm your nervous system before directing attention with clear intention, making focus feel effortless.',
      scheduleSuggestion: 'Start of your work block, ideally in the morning when willpower is highest'
    }
  }
  
  if (lowerProblem.includes('anxiety') || lowerProblem.includes('stress') || lowerProblem.includes('overwhelm')) {
    return {
      name: 'Anxiety Interrupt Ritual',
      steps: [
        {
          name: 'Body Scan',
          category: 'Reset',
          durationMinutes: 3,
          description: 'Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste',
          benefits: 'Grounds you in the present moment and interrupts anxious thought spirals'
        },
        {
          name: 'Energy Release',
          category: 'Reset',
          durationMinutes: 5,
          description: 'Gentle stretching or a quick walk outside',
          benefits: 'Releases physical tension and stress hormones trapped in your body'
        },
        {
          name: 'Perspective Shift',
          category: 'Reset',
          durationMinutes: 3,
          description: 'Journal: What\'s one thing I can control right now?',
          benefits: 'Redirects focus from what you can\'t control to actionable steps'
        }
      ],
      reasoning: 'This loop combines sensory grounding with physical movement to regulate your nervous system when anxiety strikes.',
      scheduleSuggestion: 'Whenever you notice anxiety rising, or preventatively during known stress periods'
    }
  }
  
  // Default general ritual
  return {
    name: 'Daily Reset Ritual',
    steps: [
      {
        name: 'Mindful Breathing',
        category: 'Reset',
        durationMinutes: 3,
        description: 'Deep breathing exercise to center yourself',
        benefits: 'Calms your nervous system and improves mental clarity'
      },
      {
        name: 'Intention Setting',
        category: 'Focus',
        durationMinutes: 5,
        description: 'Write down your main focus for the next hour',
        benefits: 'Creates clarity and direction for your energy'
      }
    ],
    reasoning: 'This simple loop helps you reset and refocus, combating digital distraction with intentional action.',
    scheduleSuggestion: 'Whenever you feel scattered or need to transition between tasks'
  }
}

function generateDefaultReflections(context: { ritualName: string; category: RitualCategory }): AIReflectionQuestion[] {
  const reflectionMap: Record<RitualCategory, AIReflectionQuestion[]> = {
    Focus: [
      {
        question: 'What felt different about your focus during this ritual?',
        purpose: 'Builds awareness of focus states'
      },
      {
        question: 'What would make this ritual even more effective for you?',
        purpose: 'Encourages personalization and iteration'
      }
    ],
    Reset: [
      {
        question: 'How grounded do you feel right now, from 1-5?',
        purpose: 'Quantifies emotional state shift'
      },
      {
        question: 'What shifted in your body or mind during this reset?',
        purpose: 'Builds somatic awareness'
      }
    ],
    Social: [
      {
        question: 'What felt most helpful in preparing for social interaction?',
        purpose: 'Identifies effective social prep strategies'
      },
      {
        question: 'How confident do you feel about the upcoming interaction?',
        purpose: 'Measures readiness'
      }
    ],
    Sleep: [
      {
        question: 'How ready for rest do you feel, from 1-5?',
        purpose: 'Tracks sleep preparation effectiveness'
      },
      {
        question: 'What thoughts are still active that you can release?',
        purpose: 'Helps identify lingering mental activity'
      }
    ],
    Custom: [
      {
        question: 'How do you feel after completing this ritual?',
        purpose: 'General emotional check-in'
      },
      {
        question: 'What would you change about this ritual?',
        purpose: 'Iterative improvement'
      }
    ]
  }
  
  return reflectionMap[context.category] || reflectionMap.Custom
}

function generateDefaultExplanation(ritualLoop: { name: string; steps: any[] }): string {
  return `This ritual loop combines ${ritualLoop.steps.length} complementary practices that work together to shift your mental state. Each step builds on the previous one, creating a compound effect that's more powerful than any single practice alone. The sequence is designed to meet you where you are and gently guide you toward a more focused, grounded state.`
}

