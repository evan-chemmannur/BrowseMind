import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import PriceChart from '../components/PriceChart'
import DealScoreRing from '../components/DealScoreRing'
import { SALE_EVENTS } from '../data/mockData'
import { useProducts } from '../context/ProductContext'
import './Predict.css'

const stagger = { animate: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

function getSaleStatus(dateStr) {
  const saleDate = new Date(dateStr)
  const now = new Date('2025-03-21')
  const diffDays = Math.ceil((saleDate - now) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return { label: 'Passed', color: 'var(--text-muted)', icon: XCircle }
  if (diffDays <= 7) return { label: `In ${diffDays}d`, color: 'var(--alert)', icon: Clock }
  if (diffDays <= 30) return { label: `${diffDays} days`, color: 'var(--warning)', icon: Clock }
  return { label: `${diffDays} days`, color: 'var(--success)', icon: Calendar }
}

export default function Predict() {
  const { products } = useProducts()
  const tracked = products.filter(p => p.isTracked)
  const [activeProduct, setActiveProduct] = useState(tracked[0])
  const [recommendation] = useState('wait')

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="page-header">
          <h1><TrendingUp size={32} style={{ color: 'var(--accent-cyan)', verticalAlign: 'middle', marginRight: 10 }} />Predict</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            AI-powered price forecasting based on historical data and sale events.
          </p>
        </div>

        {/* Product Selector */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
          {tracked.map(p => (
            <button key={p.id}
              onClick={() => setActiveProduct(p)}
              className={`btn ${activeProduct?.id === p.id ? 'btn-primary' : 'btn-glass'}`}
              style={{ fontSize: 13 }}>
              {p.name.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>

        {activeProduct && (
          <motion.div key={activeProduct.id} variants={stagger} initial="initial" animate="animate">
            {/* Main chart card */}
            <motion.div className="glass-card predict-chart-card" variants={fadeUp}>
              <div className="predict-chart-header">
                <div>
                  <span className="caption">{activeProduct.category}</span>
                  <h2 style={{ marginTop: 4 }}>{activeProduct.name}</h2>
                  <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                    <div>
                      <div className="caption">Current Price</div>
                      <div className="mono price-value" style={{ fontSize: 22 }}>₹{activeProduct.currentPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="caption">Lowest Ever</div>
                      <div className="mono" style={{ fontSize: 22, color: 'var(--success)', fontWeight: 700 }}>₹{activeProduct.lowestEver.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="caption">Predicted Low</div>
                      <div className="mono" style={{ fontSize: 22, color: 'var(--accent-cyan)', fontWeight: 700 }}>₹{activeProduct.prediction.expectedPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <DealScoreRing score={activeProduct.dealScore} size={96} />
              </div>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <p className="caption" style={{ marginBottom: 8 }}>12-Month Price History</p>
                <PriceChart prices={activeProduct.priceHistory} lowestIdx={activeProduct.lowestIdx} />
              </div>
            </motion.div>

            {/* Buy vs Wait */}
            <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', margin: 'var(--space-lg) 0' }}>
              <div className={`glass-card rec-card ${recommendation === 'buy' ? 'rec-buy' : ''}`}>
                <CheckCircle size={28} color="var(--success)" strokeWidth={1.5} />
                <h3>Buy Now</h3>
                <p className="caption" style={{ lineHeight: 1.6 }}>
                  Current price is <span style={{ color: 'var(--success)' }}>
                    {Math.round((1 - activeProduct.currentPrice / activeProduct.originalPrice) * 100)}% below MRP
                  </span>. Stock may be limited at this price.
                </p>
                <div className="caption" style={{ color: 'var(--success)', fontWeight: 600, marginTop: 8 }}>
                  Confidence: 68%
                </div>
              </div>
              <div className={`glass-card rec-card ${recommendation === 'wait' ? 'rec-wait' : ''}`}>
                <Clock size={28} color="var(--warning)" strokeWidth={1.5} />
                <h3>Wait for Sale</h3>
                <p className="caption" style={{ lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--warning)' }}>{activeProduct.prediction.event}</span> is approaching.
                  We predict a drop to <strong>₹{activeProduct.prediction.expectedPrice.toLocaleString()}</strong>.
                </p>
                <div className="caption" style={{ color: 'var(--warning)', fontWeight: 600, marginTop: 8 }}>
                  Confidence: 82%
                </div>
              </div>
            </motion.div>

            {/* Stock trend */}
            <motion.div className="glass-card" variants={fadeUp}
              style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
              <h3 style={{ marginBottom: 12 }}>Stock Trend Analysis</h3>
              <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                {activeProduct.platforms.map(pl => (
                  <div key={pl.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="platform-avatar"
                        style={{ background: pl.color + '22', color: pl.color, fontSize: 9, fontWeight: 700 }}>
                        {pl.logo}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{pl.name}</span>
                    </div>
                    <span className={`badge ${pl.stock === 'Limited' ? 'badge-alert' : 'badge-success'}`}>{pl.stock}</span>
                    <span className="mono" style={{ fontSize: 13 }}>₹{pl.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Sale Events Timeline */}
        <section>
          <div className="section-title"><Calendar size={16} style={{ color: 'var(--accent-cyan)' }} /> Upcoming Sale Events</div>
          <div className="glass-card" style={{ padding: 'var(--space-lg)' }}>
            <div className="timeline">
              {SALE_EVENTS.map((evt, i) => {
                const status = getSaleStatus(evt.date)
                const StatusIcon = status.icon
                return (
                  <div key={evt.name} className="timeline-item">
                    <div className="timeline-line" style={{ background: i < SALE_EVENTS.length - 1 ? 'var(--glass-border)' : 'transparent' }} />
                    <div className="timeline-dot" style={{ background: evt.color, boxShadow: `0 0 10px ${evt.color}80` }} />
                    <div className="timeline-content glass-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h3 style={{ fontSize: 15, fontWeight: 600 }}>{evt.name}</h3>
                          <p className="caption" style={{ marginTop: 3 }}>
                            {new Date(evt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                            {evt.platforms.map(p => <span key={p} className="badge badge-purple">{p}</span>)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <StatusIcon size={16} color={status.color} />
                          <p className="caption" style={{ color: status.color, fontWeight: 600, marginTop: 4 }}>{status.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
