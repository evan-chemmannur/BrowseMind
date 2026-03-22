import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Settings, User, Bell, Shield, Smartphone, CreditCard, Trash2, RefreshCw, Globe, X } from 'lucide-react'
import './Settings.css'

const SECTIONS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Tracking', icon: Shield },
  { id: 'sync', label: 'Device Sync', icon: Smartphone },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
]

function Toggle({ checked, onChange, label }) {
  return (
    <label className="setting-row" style={{ cursor: 'pointer' }}>
      <span>{label}</span>
      <label className="switch" aria-label={label}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className="switch-track" />
        <div className="switch-thumb" />
      </label>
    </label>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')
  const [notifSettings, setNotifSettings] = useState({
    priceDrop: true, predictions: true, stockAlert: true, weeklyReport: false,
    browserPush: true, email: false,
  })
  const [privacySettings, setPrivacySettings] = useState({
    tracking: true, amazon: true, flipkart: true, croma: true, vijay: false,
    storeHistory: true, personalizedAlerts: true,
  })
  const [syncSettings, setSyncSettings] = useState({
    crossDevice: true, mobileSync: true, desktopSync: true,
  })
  
  const [profile, setProfile] = useState({ name: 'John Doe', email: 'john.doe@example.com' })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  
  const [platforms, setPlatforms] = useState(['Amazon', 'Flipkart', 'Croma', 'Vijay Sales', 'Reliance Digital'])
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#subscription') setActiveSection('subscription')
    if (location.hash === '#privacy') setActiveSection('privacy')
  }, [location])

  const addPlatform = () => {
    const newPlatform = prompt('Enter platform name:')
    if (newPlatform && !platforms.includes(newPlatform)) {
      setPlatforms([...platforms, newPlatform])
    }
  }

  const removePlatform = (pl) => {
    setPlatforms(platforms.filter(p => p !== pl))
  }

  const setNotif = (key) => (val) => setNotifSettings(p => ({ ...p, [key]: val }))
  const setPrivacy = (key) => (val) => setPrivacySettings(p => ({ ...p, [key]: val }))
  const setSync = (key) => (val) => setSyncSettings(p => ({ ...p, [key]: val }))

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="settings-content">
            <h2 className="settings-section-title">Account</h2>
            <div className="glass-card settings-card">
              <div className="avatar-row">
                <div className="avatar-circle">{profile.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  {isEditingProfile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <input className="glass-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={{ padding: '4px 8px', fontSize: 13 }} />
                      <input className="glass-input" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={{ padding: '4px 8px', fontSize: 13 }} />
                    </div>
                  ) : (
                    <>
                      <p style={{ fontWeight: 600 }}>{profile.name}</p>
                      <p className="caption">{profile.email}</p>
                    </>
                  )}
                  <p className="caption" style={{ color: 'var(--accent-cyan)', marginTop: 4 }}>Pro Member</p>
                </div>
                <button className="btn btn-glass" style={{ marginLeft: 'auto', fontSize: 12 }} onClick={() => setIsEditingProfile(!isEditingProfile)}>
                  {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>
            </div>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Platform Integrations</h3>
              {platforms.map(pl => (
                <div key={pl} className="setting-row">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Globe size={16} color="var(--accent-cyan)" />
                    <span>{pl}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="badge badge-success">Connected</span>
                    <button onClick={() => removePlatform(pl)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="btn btn-glass" style={{ marginTop: 12, fontSize: 12 }} align="left" onClick={addPlatform}>
                <Globe size={14} /> Add Platform
              </button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="settings-content">
            <h2 className="settings-section-title">Notifications</h2>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Alert Types</h3>
              <Toggle checked={notifSettings.priceDrop} onChange={setNotif('priceDrop')} label="Price Drop Alerts" />
              <Toggle checked={notifSettings.predictions} onChange={setNotif('predictions')} label="Sale Event Predictions" />
              <Toggle checked={notifSettings.stockAlert} onChange={setNotif('stockAlert')} label="Low Stock Alerts" />
              <Toggle checked={notifSettings.weeklyReport} onChange={setNotif('weeklyReport')} label="Weekly Deal Report" />
            </div>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Delivery Channels</h3>
              <Toggle checked={notifSettings.browserPush} onChange={setNotif('browserPush')} label="Browser Push Notifications" />
              <Toggle checked={notifSettings.email} onChange={setNotif('email')} label="Email Notifications" />
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="settings-content">
            <h2 className="settings-section-title">Privacy & Tracking</h2>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Tracking Control</h3>
              <Toggle checked={privacySettings.tracking} onChange={setPrivacy('tracking')} label="Enable Activity Tracking" />
              <Toggle checked={privacySettings.storeHistory} onChange={setPrivacy('storeHistory')} label="Store Browsing History" />
              <Toggle checked={privacySettings.personalizedAlerts} onChange={setPrivacy('personalizedAlerts')} label="Personalized Recommendations" />
            </div>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Tracked Platforms</h3>
              {['Amazon', 'Flipkart', 'Croma', 'Vijay Sales'].map(pl => (
                <Toggle key={pl} checked={privacySettings[pl.toLowerCase().replace(' ', '')] ?? true}
                  onChange={setPrivacy(pl.toLowerCase().replace(' ', ''))} label={pl} />
              ))}
            </div>
            <div className="glass-card settings-card danger-zone">
              <h3 className="settings-group-title" style={{ color: 'var(--alert)' }}>Danger Zone</h3>
              <div className="setting-row">
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>Delete Browsing History</p>
                  <p className="caption">Permanently remove all tracked history</p>
                </div>
                <button className="btn btn-glass" style={{ color: 'var(--alert)', fontSize: 12 }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>Stop All Tracking</p>
                  <p className="caption">Disable tracking across all platforms</p>
                </div>
                <button className="btn btn-glass" style={{ color: 'var(--alert)', fontSize: 12 }}>
                  Stop
                </button>
              </div>
            </div>
          </div>
        )

      case 'sync':
        return (
          <div className="settings-content">
            <h2 className="settings-section-title">Device Sync</h2>
            <div className="glass-card settings-card">
              <Toggle checked={syncSettings.crossDevice} onChange={setSync('crossDevice')} label="Cross-Device Sync" />
              <Toggle checked={syncSettings.mobileSync} onChange={setSync('mobileSync')} label="Mobile Sync" />
              <Toggle checked={syncSettings.desktopSync} onChange={setSync('desktopSync')} label="Desktop Sync" />
            </div>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Connected Devices</h3>
              {[
                { name: 'Chrome on Windows', icon: '💻', status: 'Active now' },
                { name: 'BrowseMind App · Android', icon: '📱', status: '2 hr ago' },
                { name: 'Safari on iPhone', icon: '📱', status: '1 day ago' },
              ].map(d => (
                <div key={d.name} className="setting-row">
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{d.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</p>
                      <p className="caption">{d.status}</p>
                    </div>
                  </div>
                  <button className="btn btn-glass" style={{ fontSize: 11 }}>
                    <RefreshCw size={11} /> Sync
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'subscription':
        return (
          <div className="settings-content">
            <h2 className="settings-section-title">Subscription</h2>
            <div className="glass-card settings-card">
              <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⚡</div>
                <h2 className="gradient-text">BrowseMind Pro</h2>
                <p className="body-large" style={{ color: 'var(--text-secondary)', margin: '12px 0 20px' }}>
                  Unlock unlimited tracking, advanced analytics, and priority alerts.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div className="price-tier glass-card">
                    <p className="caption">Monthly</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700 }}>₹199</p>
                    <button className="btn btn-glass" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Choose</button>
                  </div>
                  <div className="price-tier glass-card" style={{ border: '1px solid var(--accent-cyan)' }}>
                    <span className="badge badge-cyan" style={{ marginBottom: 8 }}>Best Value</span>
                    <p className="caption">Annual</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent-cyan)' }}>₹999</p>
                    <p className="caption">₹83/month</p>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Choose</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card settings-card">
              <h3 className="settings-group-title">Pro Features</h3>
              {[
                'Unlimited product tracking',
                'Priority price alerts (instant)',
                'Advanced AI predictions',
                'All platform integrations',
                'Collaborative shopping sessions',
                'Budget optimizer tool',
                'Cross-device sync',
              ].map(f => (
                <div key={f} className="setting-row" style={{ padding: '8px 0' }}>
                  <span style={{ fontSize: 14 }}>✅ {f}</span>
                </div>
              ))}
            </div>
          </div>
        )

      default: return null
    }
  }

  return (
    <div className="page-root">
      <div className="page-content">
        <div className="page-header">
          <h1><Settings size={32} style={{ color: 'var(--accent-cyan)', verticalAlign: 'middle', marginRight: 10 }} />Settings</h1>
          <p className="body-large" style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Manage your account, privacy, notifications, and preferences.
          </p>
        </div>
        <div className="settings-layout">
          {/* Sidebar */}
          <nav className="settings-sidebar glass-card" aria-label="Settings navigation">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button key={id}
                onClick={() => setActiveSection(id)}
                className={`settings-nav-item${activeSection === id ? ' active' : ''}`}>
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </nav>
          {/* Content */}
          <div style={{ flex: 1 }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
