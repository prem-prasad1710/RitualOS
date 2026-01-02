'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

type Circle = {
  id: string
  name: string
  description: string | null
  inviteCode: string
  members: {
    id: string
    role: string
    user: {
      name: string
      email: string
      streakCount: number
    }
  }[]
}

export default function CirclesPage() {
  const { user, isLoading } = useStore()
  const router = useRouter()
  const [circles, setCircles] = useState<Circle[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [newCircleName, setNewCircleName] = useState('')
  const [newCircleDescription, setNewCircleDescription] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchCircles()
    }
  }, [user])

  const fetchCircles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/circles', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setCircles(data.circles)
      }
    } catch (error) {
      console.error('Error fetching circles:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCircle = async () => {
    if (!newCircleName.trim()) {
      setError('Circle name is required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/circles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newCircleName,
          description: newCircleDescription
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCircles([...circles, data.circle])
        setNewCircleName('')
        setNewCircleDescription('')
        setShowCreateModal(false)
        setSuccess('Circle created successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create circle')
      }
    } catch (error) {
      setError('Failed to create circle')
    }
  }

  const joinCircle = async () => {
    if (!inviteCode.trim()) {
      setError('Invite code is required')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/circles/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode })
      })

      if (response.ok) {
        const data = await response.json()
        setCircles([...circles, data.circle])
        setInviteCode('')
        setShowJoinModal(false)
        setSuccess('Joined circle successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to join circle')
      }
    } catch (error) {
      setError('Failed to join circle')
    }
  }

  const leaveCircle = async (circleId: string) => {
    if (!confirm('Are you sure you want to leave this circle?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/circles/${circleId}/leave`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        setCircles(circles.filter(c => c.id !== circleId))
        setSuccess('Left circle successfully')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError('Failed to leave circle')
    }
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setSuccess('Invite code copied!')
    setTimeout(() => setSuccess(''), 2000)
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🤝 Accountability Circles
          </h1>
          <p className="text-gray-300 text-lg">
            Join forces with friends for mutual support and motivation
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 text-center"
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center"
            >
              {error}
              <button onClick={() => setError('')} className="ml-4 underline">
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8 justify-center"
        >
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            ➕ Create Circle
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
          >
            🔗 Join Circle
          </button>
        </motion.div>

        {/* Circles Grid */}
        {circles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-20"
          >
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-2xl font-semibold mb-2">No circles yet</h3>
            <p>Create or join a circle to start your accountability journey!</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {circles.map((circle, index) => (
              <motion.div
                key={circle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {circle.name}
                    </h3>
                    {circle.description && (
                      <p className="text-gray-300 text-sm">{circle.description}</p>
                    )}
                  </div>
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-purple-300 text-sm">
                    {circle.members.length} member{circle.members.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Members List */}
                <div className="space-y-2 mb-4">
                  {circle.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                    >
                      <div>
                        <div className="text-white font-semibold">
                          {member.user.name}
                          {member.role === 'owner' && (
                            <span className="ml-2 text-xs text-yellow-400">👑 Owner</span>
                          )}
                        </div>
                        <div className="text-gray-400 text-xs">{member.user.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-400 font-bold">
                          🔥 {member.user.streakCount}
                        </div>
                        <div className="text-gray-400 text-xs">day streak</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => copyInviteCode(circle.inviteCode)}
                    className="flex-1 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg text-blue-300 text-sm transition"
                  >
                    📋 Copy Invite Code
                  </button>
                  <button
                    onClick={() => leaveCircle(circle.id)}
                    className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 rounded-lg text-red-300 text-sm transition"
                  >
                    🚪 Leave
                  </button>
                </div>

                <div className="mt-2 text-center">
                  <code className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                    {circle.inviteCode}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Circle Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-purple-500/30"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Create New Circle</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Circle Name *</label>
                    <input
                      type="text"
                      value={newCircleName}
                      onChange={(e) => setNewCircleName(e.target.value)}
                      placeholder="My Awesome Circle"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Description (optional)</label>
                    <textarea
                      value={newCircleDescription}
                      onChange={(e) => setNewCircleDescription(e.target.value)}
                      placeholder="What's this circle about?"
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createCircle}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition"
                  >
                    Create
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Join Circle Modal */}
        <AnimatePresence>
          {showJoinModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowJoinModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full border border-blue-500/30"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Join a Circle</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Invite Code *</label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 uppercase"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Ask the circle owner for the invite code
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={joinCircle}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
                  >
                    Join
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


