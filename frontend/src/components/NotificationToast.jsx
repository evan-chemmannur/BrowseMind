import { useState, useEffect } from 'react'
import { X, TrendingDown, TrendingUp, AlertTriangle, Info } from 'lucide-react'
import './NotificationToast.css'

const ICONS = {
  drop: TrendingDown,
  prediction: TrendingUp,
  stock: AlertTriangle,
  general: Info,
}

const COLORS = {
  drop: '#10B981',
  prediction: '#F59E0B',
  stock: '#EF4444',
  general: '#06B6D4',
}

export function NotificationToast({ id, type = 'drop', title, body, onDismiss, duration = 6000 }) {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(false)
  const Icon = ICONS[type] || Info
  const color = COLORS[type] || COLORS.general

  useEffect(() => {
    // Slide in
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining === 0) {
        clearInterval(interval)
        handleDismiss()
      }
    }, 50)
    return () => clearInterval(interval)
  }, [duration])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => onDismiss?.(id), 300)
  }

  return (
    <div className={`toast-card glass-card${visible ? ' visible' : ''}`} role="alert" aria-live="assertive">
      <div className="toast-accent" style={{ background: color }} />
      <div className="toast-icon" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
        <Icon size={18} color={color} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="toast-body">
        <p className="toast-title">{title}</p>
        {body && <p className="toast-desc">{body}</p>}
        <div className="toast-actions">
          <button className="toast-action-btn" onClick={handleDismiss}>View Product</button>
          <button className="toast-action-btn muted" onClick={handleDismiss}>Dismiss</button>
        </div>
      </div>
      <button className="toast-close" onClick={handleDismiss} aria-label="Dismiss notification">
        <X size={14} strokeWidth={1.5} />
      </button>
      <div className="toast-progress">
        <div className="toast-progress-bar" style={{ width: progress + '%', background: color }} />
      </div>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-area" aria-label="Notifications">
      {toasts.map(t => (
        <NotificationToast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
