import React from 'react';
import { 
  Sprout, 
  Building2, 
  ShoppingCart, 
  ShieldCheck, 
  Globe, 
  Volume2, 
  VolumeX,
  Music,
  Bell, 
  PlayCircle, 
  RotateCcw,
  Sparkles,
  Eye
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function Navbar({
  currentRole,
  onRoleChange,
  currentLang,
  onLangChange,
  onOpenDemoTour,
  onOpenVoiceAssist,
  onOpenAlerts,
  unreadAlertsCount = 0,
  onResetSeed,
  accessibilityMode,
  onToggleAccessibility,
  isMusicPlaying = false,
  onToggleMusic
}) {
  const t = translations[currentLang] || translations.en;

  const roles = [
    { id: 'Farmer', label: t.farmerRole, icon: Sprout },
    { id: 'FPO', label: t.fpoRole, icon: Building2 },
    { id: 'Buyer', label: t.buyerRole, icon: ShoppingCart },
    { id: 'Admin', label: t.adminRole, icon: ShieldCheck }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' }
  ];

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-brand" onClick={() => onRoleChange('Farmer')}>
        <div className="brand-icon">
          <Sprout size={22} />
        </div>
        <div className="brand-title">
          <span>{t.appName}</span>
          <span className="brand-tagline">Direct Farmgate-to-Buyer AI Coordination</span>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="role-switcher">
        {roles.map(r => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              className={`role-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onRoleChange(r.id)}
            >
              <Icon size={16} />
              <span>{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="nav-actions">
        {/* Background Music & Audio Toggle */}
        <button
          className={`btn btn-sm ${isMusicPlaying ? 'btn-primary pulse-glow' : 'btn-secondary'}`}
          onClick={onToggleMusic}
          title={isMusicPlaying ? 'Mute Background Audio & Music' : 'Play Background Music & Farm Audio'}
          style={isMusicPlaying ? { background: 'linear-gradient(135deg, #3F7D4A, #5E9F5B)', borderColor: '#76B947' } : {}}
        >
          {isMusicPlaying ? (
            <>
              <Music size={15} style={{ color: '#F7F5EF' }} />
              <span className="hide-mobile">Music: ON</span>
              <div className="audio-equalizer">
                <span />
                <span />
                <span />
              </div>
            </>
          ) : (
            <>
              <VolumeX size={15} style={{ color: 'var(--text-secondary)' }} />
              <span className="hide-mobile">Music: OFF</span>
            </>
          )}
        </button>

        {/* Interactive 10-Step Scenario Tour Button */}
        <button 
          className="btn btn-primary btn-sm"
          onClick={onOpenDemoTour}
          title="Run 1-Click Interactive Demo Tour"
        >
          <PlayCircle size={16} />
          <span>Demo Tour</span>
        </button>

        {/* Vernacular Voice Assist Simulation */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onOpenVoiceAssist}
          title="AI Voice Assistant for Vernacular Farmers"
          style={{ borderColor: 'rgba(118, 185, 71, 0.4)', color: '#76B947' }}
        >
          <Volume2 size={16} />
          <span className="hide-mobile">{t.voiceAssist}</span>
        </button>

        {/* High Accessibility Toggle */}
        <button
          className={`btn btn-secondary btn-sm ${accessibilityMode ? 'btn-gold' : ''}`}
          onClick={onToggleAccessibility}
          title="Toggle High Accessibility / Easy Read Mode"
        >
          <Eye size={16} />
        </button>

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={16} style={{ color: 'var(--text-secondary)' }} />
          <select 
            className="form-select" 
            style={{ padding: '4px 8px', fontSize: '13px', borderRadius: 'var(--radius-sm)', background: '#142019', color: '#F7F5EF' }}
            value={currentLang} 
            onChange={(e) => onLangChange(e.target.value)}
          >
            {languages.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#142019', color: '#F7F5EF' }}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Alerts Bell */}
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ position: 'relative', padding: '8px 10px' }}
          onClick={onOpenAlerts}
          title="View Notifications & Price-Risk Alerts"
        >
          <Bell size={16} />
          {unreadAlertsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#DC2626',
              color: '#fff',
              fontSize: '10px',
              fontWeight: '800',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Reset Database */}
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onResetSeed}
          title="Reset database to initial demo state"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </nav>
  );
}
