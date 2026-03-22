import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radio, Plus, Bell, BellOff, Trash2, Shield, TrendingDown, TrendingUp, ExternalLink } from 'lucide-react'
import DealScoreRing from '../components/DealScoreRing'
import { useProducts } from '../context/ProductContext'
import './Track.css'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

function Sparkline({ prices }) {
  if (!prices || prices.length < 2) return null
  const w = 80, h = 30, pad = 4
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const pts = prices.map((p, i) => {
    const x = pad + (i / (prices.length - 1)) * (w - pad * 2)
    const y = pad + (1 - (p - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')
  const last = parseFloat(pts.split(' ').at(-1).split(',')[1])
  const first = parseFloat(pts.split(' ')[0].split(',')[1])
  const color = last <= first ? '#10B981' : '#F59E0B'
  return (
    <svg width={w} height={h} className="sparkline">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export default function Track() {
  const { products, toggleTrack: globalToggleTrack, addProduct } = useProducts()
  const [alertsEnabled, setAlertsEnabled] = useState({})
  const [paused, setPaused] = useState({})
  const navigate = useNavigate()

  const handleToggleTracking = (id) => {
    // Show 'Tracking Paused' label for 800ms, then move it
    setPaused(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      globalToggleTrack(id)
      setPaused(prev => ({ ...prev, [id]: false }))
    }, 800)
  }

  const handleStartTracking = (id) => {
    globalToggleTrack(id)
  }

  const toggleAlert = (id) => {
    setAlertsEnabled(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddNewProduct = async () => {
    const productName = prompt('Enter the name of the product you want to track from Amazon/Flipkart:')
    if (!productName || productName.trim() === '') return

    try {
      const resp = await fetch('http://localhost:5000/api/track-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: productName })
      })

      const data = await resp.json()
      if (data.success && data.data) {
        addProduct(data.data)
      } else {
        alert('Failed to search or parse products. Please try again.')
      }
    } catch (e) {
      console.error(e)
      alert('Could not reach backend. Ensure your backend is running.')
    }
  }

  const tracked = products.filter(p => p.isTracked)
  const untracked = products.filter(p => !p.isTracked)

  return (
    <div className="page-root">
      <div className="page-content">
        {/* Header */}
        <div className="page-header-row">
          <div className="page-header">
            <h1><Radio size={32} style={{ color: 'var(--accent-cyan)', verticalAlign: 'middle', marginRight: 10 }} />Track</h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              Manage your tracked products and price alerts.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleAddNewProduct}>
            <Plus size={16} strokeWidth={1.5} /> Start Tracking New Product
          </button>
        </div>

        {/* Privacy Console */}
        <div className="glass-card privacy-banner">
          <Shield size={20} color="var(--accent-cyan)" strokeWidth={1.5} />
          <div>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Privacy & Tracking Console</p>
            <p className="caption">Tracking active for 3 products. Your data is encrypted end-to-end.</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn btn-glass" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => navigate('/settings#privacy')}>Manage Privacy</button>
            <button className="btn btn-glass" style={{ fontSize: 12, padding: '6px 14px', color: 'var(--alert)' }}>Stop All Tracking</button>
          </div>
        </div>

        {/* Tracked Products */}
        <section>
          <div className="section-title">
            <Radio size={16} style={{ color: 'var(--accent-cyan)' }} />
            Actively Tracked ({tracked.length})
          </div>
          <motion.div className="track-list" variants={stagger} initial="initial" animate="animate">
            {tracked.map(p => {
              const alerts = alertsEnabled[p.id] !== false
              const isPaused = paused[p.id]
              return (
                <motion.div key={p.id} className="glass-card track-item" variants={fadeUp}>
                  <img src={p.image} alt={p.name} className="track-img" />
                  <div className="track-main">
                    <div className="track-top">
                      <div>
                        <span className="caption">{p.category}</span>
                        <h3 className="track-name">{p.name}</h3>
                        <div className="product-specs" style={{ marginTop: 4 }}>
                          {p.specs.slice(0, 3).map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                        </div>
                      </div>
                      <DealScoreRing score={p.dealScore} size={64} strokeWidth={6} />
                    </div>
                    <div className="track-prices">
                      {p.platforms.map(pl => (
                        <div key={pl.name} className="track-platform">
                          <span className="platform-avatar"
                            style={{ background: pl.color + '22', color: pl.color, fontSize: 9, fontWeight: 700 }}>
                            {pl.logo}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{pl.name}</span>
                          <span className="mono" style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700 }}>
                            ₹{pl.price.toLocaleString()}
                          </span>
                          <span className={`badge ${pl.stock === 'Limited' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: 9 }}>
                            {pl.stock}
                          </span>
                          <a href={pl.url} className="track-link" aria-label={`View on ${pl.name}`}>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                    <div className="track-bottom">
                      <Sparkline prices={p.priceHistory} />
                      <span className={`badge ${p.change24h < 0 ? 'badge-success' : 'badge-warning'}`}>
                        {p.change24h < 0 ? <TrendingDown size={9} /> : <TrendingUp size={9} />}
                        {p.change24h}% 24h
                      </span>
                      <span className="caption">Lowest ever: <strong className="mono" style={{ color: 'var(--success)' }}>₹{p.lowestEver.toLocaleString()}</strong></span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => toggleAlert(p.id)}
                          className={`btn ${alerts ? 'btn-glass' : 'btn-glass'}`}
                          style={{ fontSize: 12, padding: '6px 12px', color: alerts ? 'var(--accent-cyan)' : 'var(--text-muted)' }}
                          aria-label={alerts ? 'Disable alerts' : 'Enable alerts'}
                        >
                          {alerts ? <Bell size={13} /> : <BellOff size={13} />}
                          {alerts ? 'Alerts On' : 'Alerts Off'}
                        </button>
                        <button
                          onClick={() => handleToggleTracking(p.id)}
                          className="btn btn-glass"
                          style={{ fontSize: 12, padding: '6px 12px', color: isPaused ? 'var(--warning)' : 'var(--alert)' }}
                          aria-label={isPaused ? "Tracking paused" : "Stop tracking"}
                          disabled={isPaused}
                        >
                          <Trash2 size={13} /> {isPaused ? 'Tracking Paused' : 'Stop Tracking'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Available to Track */}
        {untracked.length > 0 && (
          <section>
            <div className="section-title">Discover More to Track</div>
            <div className="grid-3">
              {untracked.map(p => (
                <div key={p.id} className="glass-card" style={{ padding: 'var(--space-md)' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 10 }} />
                  <span className="caption">{p.category}</span>
                  <h3 style={{ fontSize: 14, margin: '4px 0' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span className="mono" style={{ fontWeight: 700 }}>₹{p.currentPrice.toLocaleString()}</span>
                    <button onClick={() => handleStartTracking(p.id)} className="btn btn-cyan" style={{ fontSize: 11, padding: '5px 12px' }}>
                      <Plus size={12} /> Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
