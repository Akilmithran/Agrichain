import React from 'react';
import { 
  X, 
  Bell, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function AlertsDrawer({
  isOpen,
  onClose,
  alerts = [],
  onMarkRead,
  onOpenWaterfall,
  onOpenPassport
}) {
  if (!isOpen) return null;

  const getAlertIcon = (type, severity) => {
    if (type === 'PRICE_BELOW_MNR' || severity === 'danger') {
      return <ShieldAlert size={20} style={{ color: '#fb7185' }} />;
    }
    if (type === 'NEW_MATCH' || severity === 'success') {
      return <Sparkles size={20} style={{ color: 'var(--emerald-400)' }} />;
    }
    if (type === 'PAYMENT_RELEASED') {
      return <DollarSign size={20} style={{ color: 'var(--emerald-400)' }} />;
    }
    return <AlertTriangle size={20} style={{ color: 'var(--amber-400)' }} />;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '460px',
          background: '#0f172a',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          padding: '24px',
          overflowY: 'auto',
          zIndex: 110,
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px' }}>Platform Notifications</h3>
              <p style={{ fontSize: '12px', color: 'var(--slate-400)' }}>
                {alerts.length} Active Real-Time Alerts
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          {alerts.map(alert => (
            <div 
              key={alert.id}
              style={{
                background: alert.isRead ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${alert.severity === 'danger' ? '#ef4444' : (alert.severity === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)')}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '2px' }}>
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: '700' }}>{alert.title}</h4>
                    {!alert.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-400)', display: 'inline-block' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--slate-300)', marginTop: '4px', lineHeight: '1.4' }}>
                    {alert.message}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11px', color: 'var(--slate-500)' }}>
                    <span>Target: {alert.targetRole}</span>
                    <span>{new Date(alert.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
