import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Search, Plus, ExternalLink, Star, Check } from 'lucide-react'
import DealScoreRing from '../components/DealScoreRing'
import { useProducts } from '../context/ProductContext'
import './Compare.css'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

export default function Compare() {
  const { products, toggleTrack } = useProducts()
  const [selectedIds, setSelectedIds] = useState([1, 4])
  const [searchMode, setSearchMode] = useState(false)
  const [specs, setSpecs] = useState('')

  const selected = products.filter(p => selectedIds.includes(p.id))

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="page-header-row">
          <div className="page-header">
            <h1><BarChart2 size={32} style={{ color: 'var(--accent-cyan)', verticalAlign: 'middle', marginRight: 10 }} />Compare</h1>
            <p className="body-large" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              AI-curated side-by-side price comparison across all platforms.
            </p>
          </div>
          <button className="btn btn-glass" onClick={() => setSearchMode(s => !s)}>
            <Search size={16} /> Manual Spec Search
          </button>
        </div>

        {/* Manual Spec Search */}
        {searchMode && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: 12 }}>Search by Specifications</h3>
            <p className="caption" style={{ marginBottom: 16 }}>Describe what you want and our AI will find matching products across platforms.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input className="glass-input" style={{ flex: 1 }} placeholder='e.g. "Wireless headphones with ANC, 30hr battery, under ₹25,000"'
                value={specs} onChange={e => setSpecs(e.target.value)} />
              <button className="btn btn-primary"><Search size={14} /> Find Products</button>
            </div>
            {specs && (
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Wireless', 'ANC', '30hr Battery', 'Under ₹25K'].map(t => (
                  <span key={t} className="badge badge-cyan">{t}</span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Product Selector */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="section-title">Select Products to Compare</div>
          <div className="scroll-x">
            <div style={{ display: 'flex', gap: 10, width: 'max-content', paddingBottom: 8 }}>
              {products.map(p => {
                const active = selectedIds.includes(p.id)
                return (
                  <button key={p.id}
                    onClick={() => setSelectedIds(prev => active ? prev.filter(i => i !== p.id) : [...prev, p.id])}
                    className={`glass-card selector-chip ${active ? 'active' : ''}`}>
                    <img src={p.image} alt={p.name} style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 6 }} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</span>
                    {active && <span className="badge badge-cyan" style={{ fontSize: 9, padding: '2px 6px' }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        {selected.length > 0 ? (
          <motion.div className="compare-grid" variants={stagger} initial="initial" animate="animate"
            style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
            {selected.map(p => (
              <motion.div key={p.id} className="glass-card compare-card" variants={fadeUp}>
                {/* Image & name */}
                <img src={p.image} alt={p.name} className="compare-img" />
                <div className="compare-top">
                  <span className="caption">{p.category}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '4px 0' }}>{p.name}</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                    <DealScoreRing score={p.dealScore} size={64} strokeWidth={6} />
                    <div>
                      <div className="price-value mono" style={{ fontSize: 20 }}>₹{p.currentPrice.toLocaleString()}</div>
                      <div className="caption" style={{ marginTop: 2, textDecoration: 'line-through' }}>₹{p.originalPrice.toLocaleString()}</div>
                      <div className="caption" style={{ color: 'var(--success)', marginTop: 2 }}>
                        Save ₹{(p.originalPrice - p.currentPrice).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Score & Rating */}
                <div style={{ display: 'flex', gap: 10, margin: '12px 0' }}>
                  <div className="stat-pill">
                    <Star size={11} color="#F59E0B" />
                    <span>{p.rating}/5</span>
                    <span className="caption">({(p.reviewCount / 1000).toFixed(1)}K)</span>
                  </div>
                  <div className="stat-pill badge-cyan">
                    Trust: {p.trustScore}/100
                  </div>
                </div>

                {/* Specs */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {p.specs.map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                </div>

                {/* Platform listings */}
                <div className="compare-platforms">
                  {p.platforms.map((pl, idx) => (
                    <div key={pl.name}
                      className={`compare-platform ${idx === 0 ? 'best-price' : ''}`}>
                      <span className="platform-avatar"
                        style={{ background: pl.color + '22', color: pl.color, fontSize: 9, fontWeight: 700 }}>
                        {pl.logo}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{pl.name}</span>
                      <span className="mono" style={{ fontWeight: 700 }}>₹{pl.price.toLocaleString()}</span>
                      <span className={`badge ${pl.stock === 'Limited' ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: 9 }}>
                        {pl.stock}
                      </span>
                      <a href={pl.url} className="track-link"><ExternalLink size={12} /></a>
                    </div>
                  ))}
                </div>

                {/* Review summary */}
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, marginTop: 14, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Star size={14} color="var(--accent-cyan)" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)' }}>AI Review Analysis</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{p.reviewSummary}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, paddingBottom: 6 }}>
                    <span className="caption" style={{ marginRight: 4, fontWeight: 600 }}>Sources:</span>
                    <span className="badge badge-glass" style={{ fontSize: 9 }}>Reddit</span>
                    <span className="badge badge-glass" style={{ fontSize: 9 }}>Amazon</span>
                    <span className="badge badge-glass" style={{ fontSize: 9 }}>Flipkart</span>
                    <span className="badge badge-glass" style={{ fontSize: 9 }}>Official</span>
                  </div>
                  <p className="caption" style={{ color: 'var(--text-muted)', marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}>Analyzed successfully from {p.reviewCount.toLocaleString()} reviews</p>
                </div>

                {/* Prediction */}
                {p.prediction.dropLikely && (
                  <div className="predict-badge">
                    🔮 Expected drop to <strong>₹{p.prediction.expectedPrice.toLocaleString()}</strong> during {p.prediction.event}
                  </div>
                )}

                <button 
                  className={`btn ${p.isTracked ? 'btn-glass' : 'btn-primary'}`} 
                  style={{ width: '100%', justifyContent: 'center', marginTop: 12, color: p.isTracked ? 'var(--accent-cyan)' : undefined }}
                  onClick={() => toggleTrack(p.id)}
                >
                  {p.isTracked ? <Check size={14} /> : <Plus size={14} />} 
                  {p.isTracked ? 'Added to Tracks' : 'Add to Tracked'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Select products to compare</h3>
            <p className="caption">Choose 2 or more products from the selector above</p>
          </div>
        )}
      </div>
    </div>
  )
}
