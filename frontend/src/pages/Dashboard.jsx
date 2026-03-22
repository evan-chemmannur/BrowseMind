import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingDown, Bell, Star, Zap, ShoppingBag, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import DealScoreRing from '../components/DealScoreRing'
import { TRENDING_PRODUCTS, NOTIFICATIONS_DATA } from '../data/mockData'
import { useProducts } from '../context/ProductContext'
import './Dashboard.css'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Dashboard() {
  const { products } = useProducts()
  const tracked = products.filter(p => p.isTracked)
  const [activeDropper] = useState(products[0])
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#alerts') {
      const el = document.getElementById('alerts')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="page-root">
      <div className="page-content">
        {/* Hero */}
        <motion.section className="hero-section" variants={stagger} initial="initial" animate="animate">
          <motion.div variants={fadeUp} className="hero-eyebrow">
            <span className="badge badge-cyan"><Zap size={10} /> AI-Powered</span>
            <span className="caption">Real-time price intelligence across 50+ platforms</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="display gradient-text">
            Smarter Decisions Start Here.
          </motion.h1>
          <motion.p variants={fadeUp} className="body-large hero-sub">
            Never overpay again. BrowseMind tracks prices, predicts drops, and alerts you at the perfect moment.
          </motion.p>
          <motion.div variants={fadeUp} className="hero-actions">
            <Link to="/track" className="btn btn-primary">
              <ShoppingBag size={16} strokeWidth={1.5} /> Start Tracking
            </Link>
            <Link to="/discover" className="btn btn-glass">
              Explore Deals <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          </motion.div>
        </motion.section>

        {/* Stats strip */}
        <motion.div className="stats-strip glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {[
            { label: 'Products Tracked', value: '12,840+', icon: '📦' },
            { label: 'Avg. Savings', value: '₹4,200', icon: '💰' },
            { label: 'Price Alerts Sent', value: '98K', icon: '🔔' },
            { label: 'Platforms Monitored', value: '50+', icon: '🌐' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value mono">{s.value}</span>
              <span className="caption">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Continue Where You Left Off */}
        <section>
          <div className="section-title"><Clock size={16} style={{ color: 'var(--accent-cyan)' }} /> Continue Where You Left Off</div>
          <div className="glass-card resume-card">
            <img src={activeDropper.image} alt={activeDropper.name} className="resume-img" />
            <div className="resume-info">
              <span className="caption">{activeDropper.category}</span>
              <h3>{activeDropper.name}</h3>
              <div className="resume-price">
                <span className="price-value drop mono">₹{activeDropper.currentPrice.toLocaleString()}</span>
                <span className="badge badge-success"><TrendingDown size={10} /> {Math.abs(activeDropper.change24h)}% today</span>
              </div>
              <p className="caption" style={{ marginTop: 6 }}>Comparing across {activeDropper.platforms.length} platforms</p>
            </div>
            <div className="resume-score">
              <DealScoreRing score={activeDropper.dealScore} size={80} />
            </div>
            <Link to="/compare" className="btn btn-primary">View Comparison <ArrowRight size={14} /></Link>
          </div>
        </section>

        {/* Tracked Products Grid */}
        <section>
          <div className="section-title"><Bell size={16} style={{ color: 'var(--accent-cyan)' }} /> Tracked Products</div>
          <motion.div className="grid-3" variants={stagger} initial="initial" animate="animate">
            {tracked.map((p, i) => (
              <motion.div key={p.id} className="glass-card product-card" variants={fadeUp}
                style={{ animationDelay: i * 0.1 + 's' }}>
                <img src={p.image} alt={p.name} className="product-img" />
                <div className="product-info">
                  <span className="caption">{p.category}</span>
                  <h3 className="product-name">{p.name}</h3>
                  <div className="product-specs">
                    {p.specs.slice(0, 2).map(s => <span key={s} className="badge badge-purple">{s}</span>)}
                  </div>
                  <div className="product-price-row">
                    <div>
                      <div className="price-value mono">₹{p.currentPrice.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                        <span className="caption line-through">₹{p.originalPrice.toLocaleString()}</span>
                        <span className={`badge ${p.change24h < 0 ? 'badge-success' : 'badge-warning'}`}>
                          {p.change24h < 0 ? <TrendingDown size={9} /> : null}
                          {p.change24h}% 24h
                        </span>
                      </div>
                    </div>
                    <DealScoreRing score={p.dealScore} size={64} strokeWidth={6} />
                  </div>
                  <div className="platform-row">
                    {p.platforms.slice(0, 3).map(pl => (
                      <span key={pl.name} className="platform-avatar tooltip" data-tip={pl.name}
                        style={{ background: pl.color + '22', border: `1px solid ${pl.color}44`, color: pl.color, fontSize: 10, fontWeight: 700 }}>
                        {pl.logo}
                      </span>
                    ))}
                    {p.platforms.length > 3 && <span className="caption">+{p.platforms.length - 3}</span>}
                  </div>
                  <Link to="/compare" className="btn btn-glass" style={{ width: '100%', justifyContent: 'center', marginTop: 8, fontSize: 12 }}>
                    Compare Prices
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Recent Alerts */}
        <section id="alerts">
          <div className="section-title"><Bell size={16} style={{ color: 'var(--accent-cyan)' }} /> Recent Alerts</div>
          <div className="alerts-list">
            {NOTIFICATIONS_DATA.map(n => (
              <div key={n.id} className={`glass-card alert-item alert-${n.type}`}>
                <div className="alert-dot" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</p>
                  <p className="caption" style={{ marginTop: 3 }}>{n.body}</p>
                </div>
                <span className="caption" style={{ marginLeft: 'auto', flexShrink: 0 }}>{n.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Now */}
        <section>
          <div className="section-title"><Star size={16} style={{ color: 'var(--accent-cyan)' }} /> Trending Now</div>
          <div className="scroll-x">
            <div className="trending-row">
              {TRENDING_PRODUCTS.map(p => (
                <div key={p.id} className="glass-card trending-card">
                  <div className="trending-score">
                    <DealScoreRing score={p.dealScore} size={52} strokeWidth={5} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</p>
                    <p className="caption">{p.category}</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                      <span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>₹{p.price.toLocaleString()}</span>
                      <span className="badge badge-success"><TrendingDown size={9} /> {Math.abs(p.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
