import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Truck, 
  Sparkles, 
  Clock, 
  DollarSign, 
  FileCheck2,
  Layers,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function BuyerDashboard({
  buyer,
  demands = [],
  matches = [],
  lots = [],
  commitments = [],
  onOpenDemandModal,
  onOpenWaterfallModal,
  onOpenPassportModal,
  onAcceptDelivery,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;

  const [inspectingLotId, setInspectingLotId] = useState(null);

  const activeDemands = demands.filter(d => !buyer || d.buyerId === buyer.id || d.buyerName === buyer?.name);
  const displayDemands = activeDemands.length > 0 ? activeDemands : demands;

  return (
    <div>
      {/* Buyer Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img 
            src={buyer?.avatar || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=60'} 
            alt="Buyer Logo" 
            style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--indigo-500)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '24px' }}>{buyer?.name || 'Grand Hyatt Regency & Luxury Cafeterias'}</h2>
              <span className="badge badge-indigo">{buyer?.type || 'Hotel & Hospitality'}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--slate-400)', marginTop: '2px' }}>
              {buyer?.contactPerson || 'Chef Vikram Malhotra (Head of Culinary Procurement)'} • Reliability: <strong>{buyer?.reliabilityScore || 98}%</strong> • AAA Credit
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-indigo" onClick={onOpenDemandModal}>
            <Plus size={18} />
            <span>{t.postDemand}</span>
          </button>
        </div>
      </div>

      {/* 4 Large KPI Cards */}
      <div className="stat-grid">
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Forward Demand</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--indigo-400)' }}>
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="stat-value">1,500 kg/wk</div>
          <div className="stat-delta positive">
            <span>3-Month Forward Requirement</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Pre-Harvest Matched</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <Sparkles size={20} />
            </div>
          </div>
          <div className="stat-value">100%</div>
          <div className="stat-delta positive">
            <CheckCircle2 size={14} />
            <span>GreenHarvest FPO Cluster</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Price Stability</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--amber-400)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">₹28.00 <span style={{ fontSize: '14px', color: 'var(--slate-400)' }}>/ kg</span></div>
          <div className="stat-delta positive">
            <span>Zero Middlemen Markups</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Traceability Index</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <QrCode size={20} />
            </div>
          </div>
          <div className="stat-value">100%</div>
          <div className="stat-delta positive">
            <ShieldCheck size={14} />
            <span>Digital Lot Passports Verified</span>
          </div>
        </div>
      </div>

      {/* Active Forward Demand Forecasts */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Calendar size={20} style={{ color: 'var(--indigo-400)' }} />
              Active Pre-Harvest Demand Forecasts
            </h3>
            <p className="section-subtitle">
              Your forward requirements matched directly with farmer production cycles
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenDemandModal}>
            + Create New Demand
          </button>
        </div>

        <div className="card-grid">
          {displayDemands.map(demand => (
            <div key={demand.id} className="glass-panel item-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="item-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-indigo">{demand.qualityGrade || 'Grade A'}</span>
                    <span className="badge badge-emerald">{demand.status}</span>
                  </div>
                  <h4 style={{ fontSize: '18px' }}>{demand.commodity}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--slate-400)' }}>Variety: {demand.variety}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--indigo-400)', fontFamily: 'var(--font-heading)' }}>
                    {demand.requiredQuantityKg} kg
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--slate-400)' }}>
                    Max: ₹{demand.maxPricePerKg}/kg
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Delivery Schedule:</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{demand.deliveryDate}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Recurrence:</span>
                  <span style={{ fontWeight: '600', color: 'var(--amber-400)' }}>{demand.isRecurring ? 'Weekly (3 Mo)' : 'One-time'}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Receiving Hub:</span>
                  <span style={{ fontWeight: '600', color: '#fff' }}>{demand.deliveryLocation}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={() => onOpenWaterfallModal(demand.maxPricePerKg, 12.00, 16.00, demand.commodity)}
                >
                  <TrendingUp size={14} />
                  <span>View Ethical Price Waterfall</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming Shipments & Digital Inspection Receiving */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', border: '1px solid var(--border-indigo)' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <PackageCheck size={22} style={{ color: 'var(--indigo-400)' }} />
              Incoming Shipments & Digital Quality Inspection (T+0 Escrow Settlement)
            </h3>
            <p className="section-subtitle">
              Verify optical grading, Brix, and constituent farmgate traceability before digital acceptance
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(lots.length > 0 ? lots : [{
            id: 'lot-demo-1',
            lotNumber: 'AGRI-LOT-9021',
            commodity: 'Tomato',
            variety: 'Shivam Hybrid',
            totalQuantityKg: 1500,
            grade: 'Grade A',
            fpoName: 'GreenHarvest Farmers Producer Co. Ltd.',
            collectionDate: '2026-11-17',
            dispatchStatus: 'In-Transit to Grand Hyatt Regency',
            qualityMetrics: { inspectionScorePercent: 97, brix: 5.4, defectRatePercent: 0.8 },
            deliveryConfirmation: { receivedAt: null }
          }]).map(lot => {
            const isDelivered = lot.dispatchStatus === 'Accepted' || lot.deliveryConfirmation?.receivedAt;

            return (
              <div key={lot.id} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--indigo-600), var(--emerald-600))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    <Truck size={28} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '17px' }}>Lot {lot.lotNumber} ({lot.commodity})</h4>
                      <span className="badge badge-emerald">{lot.grade || 'Grade A'}</span>
                      <span className="badge badge-indigo">{lot.dispatchStatus || 'In-Transit'}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--slate-400)', marginTop: '2px' }}>
                      Aggregated by <strong>{lot.fpoName}</strong> • {lot.totalQuantityKg} kg (75 Food-grade Crates)
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--emerald-400)', marginTop: '4px' }}>
                      Quality Score: <strong>{lot.qualityMetrics?.inspectionScorePercent || 97}%</strong> • Brix: <strong>{lot.qualityMetrics?.brix || 5.4} °Bx</strong> (100% Pesticide Residue-Free)
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onOpenPassportModal(lot)}
                  >
                    <QrCode size={16} />
                    <span>Scan Digital QR Passport</span>
                  </button>

                  {!isDelivered ? (
                    <button 
                      className="btn btn-primary"
                      onClick={() => onAcceptDelivery(lot.id || 'lot-demo-1')}
                    >
                      <PackageCheck size={16} />
                      <span>Accept Delivery & Release Escrow</span>
                    </button>
                  ) : (
                    <div className="badge badge-emerald" style={{ padding: '8px 14px', fontSize: '13px' }}>
                      <CheckCircle2 size={16} />
                      <span>Accepted & Escrow Settled (T+0)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
