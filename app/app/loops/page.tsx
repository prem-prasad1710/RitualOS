'use client'

/**
 * Ritual Loops Page
 * 
 * Create and manage ritual loops with drag-and-drop reordering
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/lib/store'
import { getCategoryColor, formatDuration } from '@/lib/utils'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableRitualItem({ ritual, onRemove }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: ritual.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`p-4 bg-gradient-to-r ${getCategoryColor(ritual.category)} rounded-lg cursor-move mb-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">{ritual.name}</h3>
            <p className="text-white/80 text-sm">{formatDuration(ritual.durationMinutes)}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(ritual.id)
            }}
            className="text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoopsPage() {
  const token = useAuthStore((state) => state.token)
  const [rituals, setRituals] = useState<any[]>([])
  const [loops, setLoops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedRituals: [] as any[]
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    try {
      const [ritualsRes, loopsRes] = await Promise.all([
        fetch('/api/rituals', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/loops', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const ritualsData = await ritualsRes.json()
      const loopsData = await loopsRes.json()

      setRituals(ritualsData.rituals || [])
      setLoops(loopsData.loops || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setFormData(prev => {
        const oldIndex = prev.selectedRituals.findIndex(r => r.id === active.id)
        const newIndex = prev.selectedRituals.findIndex(r => r.id === over.id)

        return {
          ...prev,
          selectedRituals: arrayMove(prev.selectedRituals, oldIndex, newIndex)
        }
      })
    }
  }

  const addRitualToLoop = (ritual: any) => {
    if (!formData.selectedRituals.find(r => r.id === ritual.id)) {
      setFormData({
        ...formData,
        selectedRituals: [...formData.selectedRituals, ritual]
      })
    }
  }

  const removeRitualFromLoop = (ritualId: string) => {
    setFormData({
      ...formData,
      selectedRituals: formData.selectedRituals.filter(r => r.id !== ritualId)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('/api/loops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          steps: formData.selectedRituals.map(r => r.id)
        })
      })

      if (response.ok) {
        setFormData({
          name: '',
          description: '',
          selectedRituals: []
        })
        fetchData()
      }
    } catch (error) {
      console.error('Failed to create loop:', error)
    } finally {
      setCreating(false)
    }
  }

  const totalDuration = formData.selectedRituals.reduce((acc, r) => acc + r.durationMinutes, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-400 text-xl">Loading loops...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Ritual Loops</h1>
        <p className="text-gray-400">Chain rituals into powerful sequences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Loop Builder */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create New Loop</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loop Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Morning Focus Ritual"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this loop for?"
                rows={2}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Add Rituals (drag to reorder)
              </label>
              
              {formData.selectedRituals.length > 0 ? (
                <div className="mb-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formData.selectedRituals}
                      strategy={verticalListSortingStrategy}
                    >
                      {formData.selectedRituals.map((ritual) => (
                        <SortableRitualItem
                          key={ritual.id}
                          ritual={ritual}
                          onRemove={removeRitualFromLoop}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                  <div className="text-purple-400 text-sm mt-2">
                    Total duration: {formatDuration(totalDuration)}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm mb-4 p-4 bg-gray-900 rounded-lg border border-dashed border-gray-700">
                  Select rituals from below to add to your loop
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={creating || !formData.name || formData.selectedRituals.length === 0}
              whileHover={{ scale: creating ? 1 : 1.02 }}
              whileTap={{ scale: creating ? 1 : 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Loop'}
            </motion.button>
          </form>
        </motion.div>

        {/* Available Rituals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Available Rituals</h2>
          
          {rituals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-4">No rituals yet</p>
              <Link href="/app/rituals">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg"
                >
                  Create Your First Ritual
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rituals.map((ritual) => (
                <motion.div
                  key={ritual.id}
                  whileHover={{ x: 4 }}
                  onClick={() => addRitualToLoop(ritual)}
                  className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm">{ritual.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className={`px-2 py-0.5 rounded bg-gradient-to-r ${getCategoryColor(ritual.category)}`}>
                          {ritual.category}
                        </span>
                        <span>{formatDuration(ritual.durationMinutes)}</span>
                      </div>
                    </div>
                    <span className="text-purple-400 text-xl">+</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Your Loops */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Your Loops ({loops.length})</h2>

        {loops.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No loops yet. Create your first one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loops.map((loop) => (
              <Link key={loop.id} href={`/app/loops/${loop.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border border-purple-500/30 rounded-xl cursor-pointer"
                >
                  <h3 className="text-white font-bold text-lg mb-2">{loop.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{loop.description}</p>
                  <div className="space-y-1 mb-3">
                    {loop.steps?.slice(0, 3).map((step: any, index: number) => (
                      <div key={step.id} className="text-gray-300 text-sm flex items-center gap-2">
                        <span className="text-purple-400">{index + 1}.</span>
                        <span>{step.ritual.name}</span>
                      </div>
                    ))}
                    {loop.steps?.length > 3 && (
                      <div className="text-gray-500 text-sm">
                        +{loop.steps.length - 3} more
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{loop.steps?.length || 0} steps</span>
                    <span className="text-purple-400">
                      {formatDuration(
                        loop.steps?.reduce((acc: number, step: any) => acc + step.ritual.durationMinutes, 0) || 0
                      )}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

