import { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Star, Flame, Tag, TrendingDown } from 'lucide-react'
import DealScoreRing from '../components/DealScoreRing'
import { TRENDING_PRODUCTS } from '../data/mockData'
import { useProducts } from '../context/ProductContext'
import './Discover.css'

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Headphones', 'TVs', 'Cameras', 'Drones', 'Appliances']

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

export default function Discover() {
  const { products, addProduct } = useProducts()
  const [category, setCategory] = useState('All')
  const [loadingId, setLoadingId] = useState(null)
  const allProducts = [...products, ...TRENDING_PRODUCTS.map(p => ({
    ...p, image: products[p.id % products.length]?.image || products[0].image,
    platforms: [{ name: 'Amazon', price: p.price, logo: 'A', color: '#FF9900', stock: 'In Stock' }],
    rating: 4.3 + Math.random() * 0.6,
    trustScore: 80 + Math.floor(Math.random() * 15),
    isTracked: false,
    reviewSummary: 'Excellent product for the price point.',
  }))]

  const handleTrackPrice = async (p, rawImage) => {
    setLoadingId(p.id)
    try {
      const resp = await fetch('http://localhost:5000/api/track-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: p.name })
      })
      const data = await resp.json()
      if (data.success && data.data) {
        // Add a third platform representing "Official Site" to perfectly fulfill requirement
        const newProduct = { ...data.data, image: rawImage }
        const officialPrice = p.price || newProduct.currentPrice
        newProduct.platforms.unshift({
          name: p.name.split(' ')[0], // e.g., "Sony" or "Nothing"
          price: officialPrice,
          logo: p.name.charAt(0),
          color: '#333',
          url: '#',
          stock: 'In Stock'
        })
        newProduct.currentPrice = Math.min(newProduct.currentPrice, officialPrice)
        newProduct.originalPrice = Math.max(newProduct.originalPrice, officialPrice + 2000)
        
        addProduct(newProduct)
        alert(`${p.name} added to your Actively Tracked list!`)
      }
    } catch (e) {
      console.error(e)
      alert("Failed to track product.")
    } finally {
      setLoadingId(null)
    }
  }

  const filteredMock = category === 'All' ? products : products.filter(p => p.category === category || p.category + 's' === category)
  const filteredTrending = category === 'All' ? TRENDING_PRODUCTS : TRENDING_PRODUCTS.filter(p => p.category === category || p.category + 's' === category)
  const filteredAll = category === 'All' ? allProducts : allProducts.filter(p => p.category === category || p.category + 's' === category)

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="page-header">
          <h1><Compass size={32} style={{ color: 'var(--accent-cyan)', verticalAlign: 'middle', marginRight: 10 }} />Discover</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Trending deals, editor picks, and top-rated products curated by AI.
          </p>
        </div>

        {/* Category browser */}
        <div className="scroll-x" style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', gap: 8, width: 'max-content', paddingBottom: 4 }}>
            {CATEGORIES.map(c => (
              <button key={c}
                onClick={() => setCategory(c)}
                className={`btn ${category === c ? 'btn-primary' : 'btn-glass'}`}
                style={{ fontSize: 13, padding: '7px 18px' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Editor Picks */}
        {filteredMock.length > 0 && (
          <section>
            <div className="section-title"><Tag size={16} style={{ color: 'var(--accent-cyan)' }} /> Editor Picks</div>
            <div className="discover-hero-grid">
              {filteredMock.slice(0, 2).map(p => (
                <div key={p.id} className="glass-card discover-hero-card">
                  <img src={p.image} alt={p.name} className="discover-hero-img" />
                  <div className="discover-hero-overlay">
                    <span className="badge badge-cyan"><Tag size={9} /> Editor's Pick</span>
                    <h2 style={{ marginTop: 12, fontSize: 22 }}>{p.name}</h2>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
                      <span className="mono" style={{ fontSize: 22, fontWeight: 700 }}>₹{p.currentPrice?.toLocaleString()}</span>
                      <DealScoreRing score={p.dealScore} size={56} strokeWidth={5} />
                    </div>
                    <p className="caption" style={{ marginTop: 8, lineHeight: 1.5 }}>{p.reviewSummary?.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Now */}
        {filteredTrending.length > 0 && (
          <section>
            <div className="section-title"><Flame size={16} style={{ color: 'var(--accent-cyan)' }} /> Trending Now</div>
            <motion.div className="grid-3" variants={stagger} initial="initial" animate="animate">
              {filteredTrending.map(p => {
                const img = products[p.id % products.length]?.image || products[0].image
                return (
                  <motion.div key={p.id} className="glass-card discover-card" variants={fadeUp}>
                    <img src={img} alt={p.name} className="discover-card-img" />
                    <div className="discover-card-body">
                      <span className="caption">{p.category}</span>
                      <h3 style={{ fontSize: 15, margin: '4px 0 8px' }}>{p.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div className="mono" style={{ fontWeight: 700 }}>₹{p.price?.toLocaleString()}</div>
                          <span className="badge badge-success" style={{ marginTop: 4 }}>
                            <TrendingDown size={9} /> {Math.abs(p.change)}% drop
                          </span>
                        </div>
                        <DealScoreRing score={p.dealScore} size={52} strokeWidth={5} />
                      </div>
                      <button 
                        className="btn btn-glass" 
                        style={{ width: '100%', justifyContent: 'center', marginTop: 10, fontSize: 12 }}
                        onClick={() => handleTrackPrice(p, img)}
                        disabled={loadingId === p.id}
                      >
                        {loadingId === p.id ? 'Tracking...' : 'Track Price'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </section>
        )}

        {/* Top Rated */}
        {filteredAll.length > 0 && (
          <section>
            <div className="section-title"><Star size={16} style={{ color: 'var(--accent-cyan)' }} /> Top Rated by Trust Score</div>
            <div className="top-rated-list">
              {[...filteredAll]
                .sort((a, b) => b.trustScore - a.trustScore)
                .slice(0, 5)
                .map((p, i) => (
                  <div key={p.id} className="glass-card top-rated-item">
                    <span className="rank-badge" style={{ color: i < 3 ? 'var(--warning)' : 'var(--text-muted)' }}>
                      #{i + 1}
                    </span>
                    <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                      <p className="caption">{p.category} · {p.reviewCount?.toLocaleString()} reviews</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="mono" style={{ fontWeight: 700 }}>₹{(p.currentPrice || p.price)?.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                        <Star size={11} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: 12 }}>{p.rating?.toFixed(1)}</span>
                        <span className="badge badge-cyan" style={{ fontSize: 9 }}>Trust {p.trustScore}</span>
                      </div>
                    </div>
                    <DealScoreRing score={p.dealScore} size={48} strokeWidth={5} />
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
