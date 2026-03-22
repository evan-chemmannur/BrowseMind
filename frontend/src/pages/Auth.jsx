import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import './Auth.css'

const fadeUp = { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -10 } }

export default function Auth() {
  const [view, setView] = useState('signin') // signin, signup, forgot, reset
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '', resetCode: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const validatePassword = (pass) => {
    // Check if password has at least 8 characters consisting of letters or digits
    const regex = /^[a-zA-Z0-9]{8,}$/
    return regex.test(pass)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (view === 'signup') {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
        return setError("All fields are required")
      }
      if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match")
      }
      if (!validatePassword(formData.password)) {
        return setError("Password must be at least 8 characters long and contain only letters or numbers")
      }
      setSuccess("Account created successfully! You can now sign in.")
      setTimeout(() => setView('signin'), 2000)
    } 
    
    else if (view === 'signin') {
      if (!formData.email || !formData.password) {
        return setError("Email and Password are required")
      }
      if (!validatePassword(formData.password)) {
        return setError("Password must be at least 8 characters long")
      }
      setSuccess("Signed in successfully! Redirecting...")
      setTimeout(() => window.location.href = '/', 1500)
    }

    else if (view === 'forgot') {
      if (!formData.email) return setError("Enter your email address to reset password")
      setSuccess("Reset code sent to your email!")
      setTimeout(() => setView('reset'), 2000)
    }

    else if (view === 'reset') {
      if (!formData.resetCode || !formData.password) return setError("All fields are required")
      if (formData.password !== formData.confirmPassword) return setError("Passwords do not match")
      if (!validatePassword(formData.password)) return setError("Password must be at least 8 characters long")
      setSuccess("Password reset successfully! You can now sign in.")
      setTimeout(() => setView('signin'), 2000)
    }
  }

  return (
    <div className="page-root auth-page">
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={view} 
            variants={fadeUp} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.2 }}
            className="glass-card auth-card"
          >
            <div className="auth-header">
              <div className="auth-icon-wrap">
                {view === 'signin' && <Lock size={28} color="var(--accent-cyan)" />}
                {view === 'signup' && <User size={28} color="var(--accent-cyan)" />}
                {(view === 'forgot' || view === 'reset') && <ShieldCheck size={28} color="var(--accent-cyan)" />}
              </div>
              <h2 className="auth-title">
                {view === 'signin' && 'Welcome Back'}
                {view === 'signup' && 'Create Account'}
                {view === 'forgot' && 'Reset Password'}
                {view === 'reset' && 'Set New Password'}
              </h2>
              <p className="caption" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                {view === 'signin' && 'Sign in to access your tracking dashboard'}
                {view === 'signup' && 'Join BrowseMind to track prices across the web'}
                {view === 'forgot' && 'Enter your email to receive a recovery code'}
                {view === 'reset' && 'Enter the 6-digit code and your new password'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="auth-alert error">{error}</div>}
              {success && <div className="auth-alert success">{success}</div>}

              {view === 'signup' && (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div className="input-group">
                    <User className="input-icon" size={16} />
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="glass-input" />
                  </div>
                  <div className="input-group">
                    <User className="input-icon" size={16} />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="glass-input" />
                  </div>
                </div>
              )}

              {view === 'signup' && (
                <div className="input-group">
                  <Phone className="input-icon" size={16} />
                  <input type="tel" name="phone" placeholder="Contact No (e.g. 9876543210)" value={formData.phone} onChange={handleChange} className="glass-input" />
                </div>
              )}

              {(view === 'signin' || view === 'signup' || view === 'forgot') && (
                <div className="input-group">
                  <Mail className="input-icon" size={16} />
                  <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="glass-input" />
                </div>
              )}

              {view === 'reset' && (
                <div className="input-group">
                  <ShieldCheck className="input-icon" size={16} />
                  <input type="text" name="resetCode" placeholder="6-Digit Reset Code" value={formData.resetCode} onChange={handleChange} className="glass-input" />
                </div>
              )}

              {(view === 'signin' || view === 'signup' || view === 'reset') && (
                <div className="input-group">
                  <Lock className="input-icon" size={16} />
                  <input type="password" name="password" placeholder={view === 'reset' ? 'New Password (Min 8 Chars)' : 'Password (Min 8 Chars)'} value={formData.password} onChange={handleChange} className="glass-input" />
                </div>
              )}

              {(view === 'signup' || view === 'reset') && (
                <div className="input-group">
                  <Lock className="input-icon" size={16} />
                  <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="glass-input" />
                </div>
              )}

              {view === 'signin' && (
                <div className="auth-options">
                  <button type="button" onClick={() => setView('forgot')} className="text-btn">Forgot Password?</button>
                </div>
              )}

              <button type="submit" className="btn btn-primary auth-submit">
                {view === 'signin' && 'Sign In'}
                {view === 'signup' && 'Register'}
                {view === 'forgot' && 'Send Code'}
                {view === 'reset' && 'Reset Password'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-footer">
              {view === 'signin' && (
                <p className="caption">Don't have an account? <button onClick={() => setView('signup')} className="text-btn highlight">Sign Up</button></p>
              )}
              {view === 'signup' && (
                <p className="caption">Already have an account? <button onClick={() => setView('signin')} className="text-btn highlight">Sign In</button></p>
              )}
              {(view === 'forgot' || view === 'reset') && (
                <p className="caption">Remembered your password? <button onClick={() => setView('signin')} className="text-btn highlight">Back to Sign In</button></p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
