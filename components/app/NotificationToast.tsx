'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationToastProps {
  message: string
  type?: NotificationType
  duration?: number
  onClose: () => void
}

const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        gradient: 'from-green-500 to-emerald-600',
        icon: '✅',
        shadow: 'shadow-green-500/50',
      }
    case 'error':
      return {
        gradient: 'from-red-500 to-rose-600',
        icon: '❌',
        shadow: 'shadow-red-500/50',
      }
    case 'warning':
      return {
        gradient: 'from-yellow-500 to-orange-600',
        icon: '⚠️',
        shadow: 'shadow-yellow-500/50',
      }
    case 'info':
    default:
      return {
        gradient: 'from-blue-500 to-cyan-600',
        icon: 'ℹ️',
        shadow: 'shadow-blue-500/50',
      }
  }
}

export default function NotificationToast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: NotificationToastProps) {
  const style = getNotificationStyle(type)

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`bg-gradient-to-r ${style.gradient} ${style.shadow} shadow-lg rounded-xl p-4 min-w-[300px] max-w-md`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.5 }}
          className="text-2xl"
        >
          {style.icon}
        </motion.div>
        <p className="text-white font-medium flex-1">{message}</p>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white/80 hover:text-white w-6 h-6 flex items-center justify-center"
        >
          ✕
        </motion.button>
      </div>

      {/* Progress bar */}
      <motion.div
        className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  notifications: Array<{
    id: string
    message: string
    type: NotificationType
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ notifications, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationToast
              message={notification.message}
              type={notification.type}
              onClose={() => onRemove(notification.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}








