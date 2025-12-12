'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AmbientSound {
  id: string
  name: string
  icon: string
  color: string
}

const ambientSounds: AmbientSound[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️', color: 'from-blue-600 to-blue-700' },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊', color: 'from-cyan-600 to-blue-600' },
  { id: 'forest', name: 'Forest', icon: '🌲', color: 'from-green-600 to-teal-600' },
  { id: 'fire', name: 'Campfire', icon: '🔥', color: 'from-orange-600 to-red-600' },
  { id: 'cafe', name: 'Café', icon: '☕', color: 'from-amber-600 to-orange-600' },
  { id: 'white-noise', name: 'White Noise', icon: '📻', color: 'from-gray-600 to-gray-700' },
  { id: 'birds', name: 'Birds', icon: '🐦', color: 'from-yellow-600 to-green-600' },
  { id: 'none', name: 'Silence', icon: '🤫', color: 'from-purple-600 to-indigo-600' },
]

// All sounds are now generated procedurally - no external files needed!

const presetTimes = [
  { label: '5 min', minutes: 5 },
  { label: '10 min', minutes: 10 },
  { label: '15 min', minutes: 15 },
  { label: '25 min', minutes: 25 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
]

export default function FocusTimer() {
  const [duration, setDuration] = useState(25) // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [selectedSound, setSelectedSound] = useState<string>('rain')
  const [volume, setVolume] = useState(50)
  const [isComplete, setIsComplete] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const soundNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Generate procedural audio using Web Audio API - ALL sounds generated locally!
  const generateProceduralSound = (type: string) => {
    if (typeof window === 'undefined') return null
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const bufferSize = 2 * audioContext.sampleRate
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const output = buffer.getChannelData(0)

      switch (type) {
        case 'white-noise':
          // Pure white noise - perfect for concentration
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1
          }
          break
        
        case 'rain':
          // Rain-like noise (filtered white noise with varying intensity)
          for (let i = 0; i < bufferSize; i++) {
            const intensity = Math.sin(2 * Math.PI * 0.3 * i / audioContext.sampleRate) * 0.3 + 0.7
            output[i] = (Math.random() * 2 - 1) * intensity
          }
          break
        
        case 'ocean':
          // Ocean waves (multiple sine waves + noise for realistic waves)
          for (let i = 0; i < bufferSize; i++) {
            const wave1 = Math.sin(2 * Math.PI * 0.08 * i / audioContext.sampleRate)
            const wave2 = Math.sin(2 * Math.PI * 0.13 * i / audioContext.sampleRate) * 0.5
            const noise = Math.random() * 0.2 - 0.1
            output[i] = (wave1 * 0.6 + wave2 * 0.3 + noise) * 0.8
          }
          break
        
        case 'fire':
          // Fire crackling (brown noise with random pops and crackles)
          let brownNoise = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            brownNoise = (brownNoise + white * 0.02) / 1.02
            const crackle = Math.random() < 0.002 ? (Math.random() * 0.6 - 0.3) : 0
            output[i] = brownNoise * 0.7 + crackle
          }
          break
        
        case 'cafe':
          // Café ambience (pink noise with occasional variations)
          let pinkNoise = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            pinkNoise = (pinkNoise + white) / 2
            const variation = Math.random() < 0.0005 ? (Math.random() * 0.3 - 0.15) : 0
            output[i] = pinkNoise * 0.6 + variation
          }
          break
        
        case 'forest':
          // Forest ambience (filtered noise with gentle variations)
          let forestNoise = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            forestNoise = (forestNoise * 0.98 + white * 0.02)
            const breeze = Math.sin(2 * Math.PI * 0.05 * i / audioContext.sampleRate) * 0.2
            output[i] = (forestNoise + breeze) * 0.5
          }
          break
        
        case 'birds':
          // Birds chirping (high-frequency modulated noise)
          for (let i = 0; i < bufferSize; i++) {
            const chirp = Math.sin(2 * Math.PI * 2000 * i / audioContext.sampleRate)
            const modulation = Math.random() < 0.001 ? Math.random() : 0
            const background = Math.random() * 0.1 - 0.05
            output[i] = (chirp * modulation * 0.3 + background) * 0.8
          }
          break
        
        default:
          // Default to white noise
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1
          }
      }

      return buffer
    } catch (err) {
      console.error('Failed to generate sound:', err)
      return null
    }
  }

  // Play procedural audio with appropriate filtering
  const playProceduralSound = (type: string) => {
    if (!audioContextRef.current) return

    try {
      stopSound()

      const audioContext = audioContextRef.current
      const buffer = generateProceduralSound(type)
      if (!buffer) return

      soundNodeRef.current = audioContext.createBufferSource()
      soundNodeRef.current.buffer = buffer
      soundNodeRef.current.loop = true

      gainNodeRef.current = audioContext.createGain()
      gainNodeRef.current.gain.value = volume / 100

      // Add appropriate filters for each sound type
      const filter = audioContext.createBiquadFilter()
      
      switch (type) {
        case 'rain':
          filter.type = 'bandpass'
          filter.frequency.value = 2000
          filter.Q.value = 0.5
          break
        case 'ocean':
          filter.type = 'lowpass'
          filter.frequency.value = 600
          filter.Q.value = 1
          break
        case 'fire':
          filter.type = 'lowpass'
          filter.frequency.value = 1200
          filter.Q.value = 0.7
          break
        case 'cafe':
          filter.type = 'bandpass'
          filter.frequency.value = 800
          filter.Q.value = 0.8
          break
        case 'forest':
          filter.type = 'lowpass'
          filter.frequency.value = 1500
          filter.Q.value = 0.6
          break
        case 'birds':
          filter.type = 'highpass'
          filter.frequency.value = 1000
          filter.Q.value = 0.5
          break
        default:
          filter.type = 'lowpass'
          filter.frequency.value = 4000
      }

      soundNodeRef.current.connect(filter)
      filter.connect(gainNodeRef.current)
      gainNodeRef.current.connect(audioContext.destination)

      soundNodeRef.current.start()
    } catch (err) {
      console.error('Failed to play procedural sound:', err)
      setAudioError('Failed to start audio. Please try again.')
    }
  }

  // Stop any playing sound
  const stopSound = () => {
    if (soundNodeRef.current) {
      try {
        soundNodeRef.current.stop()
      } catch (err) {
        // Already stopped
      }
      soundNodeRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Update audio when sound selection changes
  useEffect(() => {
    setAudioError(null)
    stopSound()
    
    if (selectedSound === 'none') {
      return
    }
    
    // ALL sounds are now generated procedurally - 100% reliable!
    if (isRunning) {
      playProceduralSound(selectedSound)
    }
  }, [selectedSound])

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100
    }
  }, [volume])

  // Play/pause audio based on timer state
  useEffect(() => {
    if (selectedSound !== 'none') {
      if (isRunning) {
        // All sounds are procedurally generated
        playProceduralSound(selectedSound)
      } else {
        stopSound()
      }
    }
  }, [isRunning, selectedSound])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsComplete(true)
            playCompletionSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (!isRunning && interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const playCompletionSound = () => {
    // Stop ambient sound when timer completes
    stopSound()
    console.log('Timer complete!')
  }

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60)
    }
    setIsRunning(true)
    setIsComplete(false)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(duration * 60)
    setIsComplete(false)
    stopSound()
  }

  const handleDurationChange = (minutes: number) => {
    setDuration(minutes)
    if (!isRunning) {
      setTimeLeft(minutes * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  return (
    <div className="space-y-6">
      {/* Timer display */}
      <div className="relative bg-gray-800 rounded-2xl p-8 overflow-hidden">
        {/* Animated background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${
            ambientSounds.find((s) => s.id === selectedSound)?.color
          } opacity-10`}
          animate={{
            scale: isRunning ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: isRunning ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Progress circle */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-64 h-64 mb-6">
            {/* Background circle */}
            <svg className="absolute inset-0 transform -rotate-90" width="100%" height="100%">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 115}
                initial={{ strokeDashoffset: 2 * Math.PI * 115 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 115 * (1 - progress / 100),
                }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>

            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                key={timeLeft}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-6xl font-bold text-white mb-2"
              >
                {formatTime(timeLeft)}
              </motion.div>
              <p className="text-gray-400 text-sm">
                {isRunning ? 'Focus time' : isComplete ? 'Complete!' : 'Ready to start'}
              </p>
            </div>

            {/* Pulsing effect when running */}
            {isRunning && (
              <motion.div
                className="absolute inset-0 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {!isRunning ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg"
              >
                {timeLeft === duration * 60 ? 'Start Focus' : 'Resume'}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl shadow-lg"
              >
                Pause
              </motion.button>
            )}
            
            {timeLeft !== duration * 60 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl"
              >
                Reset
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Duration presets */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Duration</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {presetTimes.map((preset) => (
            <motion.button
              key={preset.minutes}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDurationChange(preset.minutes)}
              disabled={isRunning}
              className={`px-4 py-3 rounded-lg font-medium transition-all ${
                duration === preset.minutes
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {preset.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Ambient sounds */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Ambient Sound</h3>
        {audioError && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg text-yellow-200 text-sm">
            ⚠️ {audioError}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {ambientSounds.map((sound) => (
            <motion.button
              key={sound.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSound(sound.id)}
              className={`p-4 rounded-xl transition-all relative ${
                selectedSound === sound.id
                  ? `bg-gradient-to-br ${sound.color} text-white shadow-lg`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isRunning && selectedSound === sound.id && sound.id !== 'none' && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full"
                />
              )}
              <div className="text-3xl mb-2">{sound.icon}</div>
              <p className="text-sm font-medium">{sound.name}</p>
            </motion.button>
          ))}
        </div>

        {/* Volume control */}
        {selectedSound !== 'none' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Volume</span>
              <span>{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </motion.div>
        )}
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsComplete(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl p-12 text-center max-w-md"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Focus Complete!</h2>
              <p className="text-white/80 mb-6">
                You've completed {duration} minutes of focused time. Great work!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsComplete(false)}
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg"
              >
                Awesome!
              </motion.button>
            </motion.div>

            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                  initial={{
                    x: '50vw',
                    y: '50vh',
                  }}
                  animate={{
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


