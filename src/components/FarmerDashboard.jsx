import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  QrCode, 
  ArrowUpRight, 
  Sparkles,
  Layers,
  ChevronRight,
  AlertCircle,
  Clock
} from 'lucide-react';
import { translations } from '../utils/translations';
import FarmerHeroVideo from './FarmerHeroVideo';

export default function FarmerDashboard({
  farmer,
  supplies = [],
  matches = [],
  lots = [],
  transactions = [],
  onOpenDeclareModal,
  onOpenWaterfallModal,
  onOpenPassportModal,
  onAcceptCommitment,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;

  // Filter supplies belonging to active farmer (or all if demo viewing)
  const farmerSupplies = supplies.filter(s => !farmer || s.farmerId === farmer.id || s.farmerName === farmer?.name);
  const displaySupplies = farmerSupplies.length > 0 ? farmerSupplies : supplies;

  // Calculate totals
  const totalMarketableQty = displaySupplies.reduce((acc, curr) => acc + Number(curr.marketableQuantityKg || 0), 0);
  const avgCost = displaySupplies.length > 0 ? (displaySupplies.reduce((acc, curr) => acc + Number(curr.cultivationCostPerKg || 0), 0) / displaySupplies.length).toFixed(2) : '12.00';
  const expectedNetPrice = '22.16';

  const getStatusClass = (status) => {
    switch (status) {
      case 'Planned Supply': return 'status-planned';
      case 'Expected Supply': return 'status-expected';
      case 'Confirmed Supply': return 'status-confirmed';
      case 'Harvested Supply': return 'status-harvested';
      case 'Available Inventory': return 'status-inventory';
      case 'Delivered Quantity': return 'status-delivered';
      default: return 'status-planned';
    }
  };

  return (
    <div>
      {/* Farmer Welcome & Profile Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img 
            src={farmer?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=60'} 
            alt="Farmer Profile" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--agri-green-mid)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '24px', color: 'var(--text-main)' }}>{t.welcomeFarmer}</h2>
              <span className="badge badge-green">Verified Producer</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: 'var(--agri-green-bright)' }} />
              <span>{t.farmCluster}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onOpenDeclareModal}>
            <Sprout size={18} />
            <span>{t.declareNewCrop}</span>
          </button>
        </div>
      </div>

      {/* Unified Full-Width Farmer Agriculture Hero Card */}
      <FarmerHeroVideo 
        onOpenDeclareModal={onOpenDeclareModal}
        onScrollToMatches={() => {
          const el = document.getElementById('farmer-matches-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4 Large Visual KPI Cards */}
      <div className="stat-grid">
        {/* Card 1: Total Marketable Supply */}
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Pre-Harvest Supply</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--agri-green-bright)' }}>
              <Sprout size={20} />
            </div>
          </div>
          <div className="stat-value">{totalMarketableQty.toLocaleString()} kg</div>
          <div className="stat-delta positive">
            <Sparkles size={14} />
            <span>100% Pre-Harvest Committed</span>
          </div>
        </div>

        {/* Card 2: Expected Net Realization */}
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">{t.expectedNetRealization}</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--agri-green-bright)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">₹{expectedNetPrice} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>/ kg</span></div>
          <div className="stat-delta positive">
            <ArrowUpRight size={14} />
            <span>+22.4% above traditional Mandi</span>
          </div>
        </div>

        {/* Card 3: MNR Protection Shield */}
        <div className="glass-panel stat-card" style={{ borderColor: 'var(--border-green)' }}>
          <div className="stat-header">
            <span className="stat-label">MNR Protection Floor</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--agri-green-bright)' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="stat-value">₹16.50 <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>/ kg</span></div>
          <div className="stat-delta positive">
            <CheckCircle2 size={14} />
            <span>Cost (₹{avgCost}) + 20% Margin Protected</span>
          </div>
        </div>

        {/* Card 4: Payments & Settlements */}
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Direct Bank Payouts</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--agri-gold-light)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value" style={{ color: 'var(--agri-gold-light)' }}>
            ₹{transactions.length > 0 ? (transactions[0].farmerPayouts?.find(fp => fp.farmerId === (farmer?.id || 'farmer-1'))?.payoutAmount || 6648).toLocaleString() : '6,648'}
          </div>
          <div className="stat-delta positive">
            <CheckCircle2 size={14} />
            <span>T+0 Escrow Instant Credit</span>
          </div>
        </div>
      </div>

      {/* Pre-Harvest Supply Declarations & Lifecycle Tracker */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Layers size={20} style={{ color: 'var(--agri-green-bright)' }} />
              {t.activeDeclarations}
            </h3>
            <p className="section-subtitle">
              Declared cultivation timeline and transparent supply lifecycle states
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onOpenDeclareModal}>
            + Add Another Crop
          </button>
        </div>

        <div className="card-grid">
          {displaySupplies.map(item => (
            <div key={item.id} className="glass-panel item-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
              <div className="item-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-gold">{item.category?.replace('_', ' ') || 'Highly Perishable'}</span>
                    <span className={`lifecycle-pill ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '18px', color: 'var(--text-main)' }}>{item.commodity}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Variety: {item.variety}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--agri-green-bright)', fontFamily: 'var(--font-heading)' }}>
                    {item.marketableQuantityKg} kg
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Area: {item.cultivatedAreaAcres} Acre
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Harvest Window:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.harvestWindowStart} to {item.harvestWindowEnd}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Quality Grade:</span>
                  <span style={{ fontWeight: '600', color: 'var(--agri-green-bright)' }}>{item.expectedGrade}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Cultivation Cost:</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{Number(item.cultivationCostPerKg).toFixed(2)}/kg</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block' }}>Farmer Net Floor (MNR):</span>
                  <span style={{ fontWeight: '600', color: 'var(--agri-gold-light)' }}>₹{Number(item.minAcceptableNetPrice).toFixed(2)}/kg</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={() => onOpenWaterfallModal(28.00, item.cultivationCostPerKg, item.minAcceptableNetPrice, item.commodity)}
                >
                  <TrendingUp size={14} />
                  <span>{t.viewPricingWaterfall}</span>
                </button>

                {lots.length > 0 && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenPassportModal(lots[0])}
                    title="View Digital Lot Passport & QR"
                  >
                    <QrCode size={14} />
                    <span>QR Passport</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Pre-Harvest Matched Institutional Buyers */}
      <div id="farmer-matches-section" className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Sparkles size={20} style={{ color: 'var(--agri-green-bright)' }} />
              {t.matchedBuyersCount} & Pre-Harvest Commitments
            </h3>
            <p className="section-subtitle">
              AI-matched buyers offering forward contracts before harvest
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {matches.slice(0, 3).map((match, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(63,125,74,0.35), rgba(94,159,91,0.2))',
                  border: '1px solid rgba(118,185,71,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--agri-green-bright)',
                  fontWeight: '800',
                  fontSize: '18px'
                }}>
                  {match.matchScore}%
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '16px' }}>{match.demand?.buyerName || match.buyer?.name || 'Grand Hyatt Regency'}</h4>
                    <span className="badge badge-green">{match.confidenceGrade || 'A+ (Optimal Match)'}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Requires <strong>{match.demand?.requiredQuantityKg || 1500} kg</strong> {match.demand?.commodity || 'Tomato'} ({match.demand?.qualityGrade || 'Grade A'}) • Delivery by {match.demand?.deliveryDate || '2026-11-18'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--agri-green-bright)', marginTop: '4px' }}>
                    {match.aiRecommendationReason || 'Matches your variety, harvest window, and guarantees healthy net realization.'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>Expected Net Realization</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--agri-green-bright)', fontFamily: 'var(--font-heading)' }}>
                    ₹{match.mnrEvaluation?.waterfall?.farmerNetRealization || '22.16'} / kg
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--agri-green-soft)', display: 'block' }}>
                    Gross Buyer Price: ₹{match.demand?.maxPricePerKg || '28.00'}/kg
                  </span>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={() => onAcceptCommitment(match)}
                >
                  <CheckCircle2 size={16} />
                  <span>{t.acceptCommitment}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
