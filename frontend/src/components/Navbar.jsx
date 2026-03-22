import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, User, Zap, LayoutDashboard, Radio, BarChart2, TrendingUp, Compass, Settings } from 'lucide-react'
import './Navbar.css'

const NAV_ITEMS = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard },
  { to: '/track',    label: 'Track',     icon: Radio },
  { to: '/compare',  label: 'Compare',   icon: BarChart2 },
  { to: '/predict',  label: 'Predict',   icon: TrendingUp },
  { to: '/discover', label: 'Discover',  icon: Compass },
  { to: '/settings', label: 'Settings',  icon: Settings },
]

export default function Navbar({ notifications = 3 }) {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const indicatorRef = useRef(null)
  const navRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Slide indicator under active tab
  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return
    const activeEl = navRef.current.querySelector('.nav-tab.active')
    if (!activeEl) return
    const rect = activeEl.getBoundingClientRect()
    const navRect = navRef.current.getBoundingClientRect()
    indicatorRef.current.style.width = rect.width + 'px'
    indicatorRef.current.style.left = (rect.left - navRect.left) + 'px'
  }, [location.pathname])

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`} role="banner">
      {/* Logo */}
      <div className="navbar-logo">
        <span className="logo-orb" aria-hidden="true" />
        <span className="logo-text">BrowseMind</span>
      </div>

      {/* Nav Tabs */}
      <nav ref={navRef} className="navbar-tabs" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}
            aria-current={location.pathname === to ? 'page' : undefined}
          >
            <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
        <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
      </nav>

      {/* Right cluster */}
      <div className="navbar-right">
        <button className="nav-icon-btn tooltip" data-tip="Notifications" aria-label={`Notifications (${notifications} unread)`} onClick={() => navigate('/#alerts')}>
          <Bell size={18} strokeWidth={1.5} />
          {notifications > 0 && (
            <span className="notif-badge" aria-label={`${notifications} unread`}>{notifications}</span>
          )}
        </button>
        <button className="nav-icon-btn tooltip" data-tip="Profile" aria-label="User profile" onClick={() => navigate('/auth')}>
          <User size={18} strokeWidth={1.5} />
        </button>
        <button className="btn btn-primary upgrade-btn" aria-label="Upgrade to Pro" onClick={() => navigate('/settings#subscription')}>
          <Zap size={14} strokeWidth={1.5} aria-hidden="true" />
          Upgrade to Pro
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
