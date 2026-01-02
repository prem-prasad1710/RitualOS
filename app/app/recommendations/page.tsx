'use client'

/**
 * Smart Recommendations Page
 */

import SmartRecommendations from '@/components/app/SmartRecommendations'

export default function RecommendationsPage() {
  const hour = new Date().getHours()
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  return (
    <div className="p-8">
      <SmartRecommendations timeOfDay={timeOfDay} />
    </div>
  )
}





