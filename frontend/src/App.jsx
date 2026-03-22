import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ThreeBackground from './components/ThreeBackground'
import CursorGlow from './components/CursorGlow'
import Navbar from './components/Navbar'
import { ToastContainer } from './components/NotificationToast'
import Dashboard from './pages/Dashboard'
import Track from './pages/Track'
import Compare from './pages/Compare'
import Predict from './pages/Predict'
import Discover from './pages/Discover'
import SettingsPage from './pages/Settings'
import Auth from './pages/Auth'
import { NOTIFICATIONS_DATA } from './data/mockData'
import { ProductProvider } from './context/ProductContext'
import { Bell } from 'lucide-react'

const pageVariants = {
  initial: { opacity: 0, filter: 'blur(8px)', y: 10 },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  exit:    { opacity: 0, filter: 'blur(8px)', y: -10 },
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Dashboard />} />
          <Route path="/track"    element={<Track />} />
          <Route path="/compare"  element={<Compare />} />
          <Route path="/predict"  element={<Predict />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [toasts, setToasts] = useState([])
  const [consentChoice, setConsentChoice] = useState(localStorage.getItem('notificationConsent'))

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    if (consentChoice !== 'accepted') return
    // Dispatch dummy notifications randomly every 15-30s if accepted
    const interval = setInterval(() => {
      const randomNotif = NOTIFICATIONS_DATA[Math.floor(Math.random() * NOTIFICATIONS_DATA.length)]
      const newToast = { ...randomNotif, id: Date.now() }
      setToasts(prev => [...prev, newToast])
    }, Math.floor(Math.random() * 15000) + 15000)
    
    // Send one immediately after accepting
    setTimeout(() => {
        setToasts([ { ...NOTIFICATIONS_DATA[0], id: Date.now() } ])
    }, 2000)

    return () => clearInterval(interval)
  }, [consentChoice])

  const handleConsent = (choice) => {
    setConsentChoice(choice)
    localStorage.setItem('notificationConsent', choice)
  }

  return (
    <ProductProvider>
      <BrowserRouter>
        <ThreeBackground />
        <CursorGlow />
        <Navbar notifications={toasts.length} />
        <AnimatedRoutes />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />

        {/* Notification Consent Modal */}
        {!consentChoice && (
          <div style={{
             position: 'fixed', inset: 0, zIndex: 9999,
             background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
             display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="glass-card" style={{ padding: 'var(--space-xl)', maxWidth: 400, textAlign: 'center' }}>
                 <div style={{ background: 'rgba(6, 182, 212, 0.1)', width: 64, height: 64, borderRadius: '50%', 
                               display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Bell size={32} color="var(--accent-cyan)" />
                 </div>
                 <h2 style={{ fontSize: 20, marginBottom: 12 }}>Site needs to send notifications</h2>
                 <p className="body-medium" style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                   We use notifications to instantly alert you when tracked products see major price drops or come back in stock. 
                 </p>
                 <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => handleConsent('accepted')} className="btn btn-cyan" style={{ flex: 1, justifyContent: 'center' }}>
                      Accept
                    </button>
                    <button onClick={() => handleConsent('declined')} className="btn btn-glass" style={{ flex: 1, justifyContent: 'center' }}>
                      Decline
                    </button>
                 </div>
             </motion.div>
          </div>
        )}
      </BrowserRouter>
    </ProductProvider>
  )
}
