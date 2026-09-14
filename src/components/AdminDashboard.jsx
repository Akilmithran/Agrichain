import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Layers, 
  Sliders, 
  Sparkles,
  AlertTriangle,
  FileText,
  Activity
} from 'lucide-react';

export default function AdminDashboard({
  summary,
  commodities = [],
  transactions = [],
  lots = [],
  onOpenWaterfallModal
}) {
  const [platformFeePercent, setPlatformFeePercent] = useState(3.0);
  const [riskReservePercent, setRiskReservePercent] = useState(2.0);

  return (
    <div>
      {/* Admin Title Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '24px' }}>Platform Governance & System Intelligence</h2>
            <p style={{ fontSize: '13px', color: 'var(--slate-400)', marginTop: '2px' }}>
              AgriChain Direct Platform Overview • AI Matching Weights • Perishability Protocols • Escrow Analytics
            </p>
          </div>
        </div>

        <div className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '13px' }}>
          <Activity size={16} />
          <span>System Health: 100% Operational</span>
        </div>
      </div>

      {/* Global KPI Metrics */}
      <div className="stat-grid">
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Farmers & FPOs</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{summary?.totalFarmers || 4} Farmers / {summary?.totalFpos || 2} FPOs</div>
          <div className="stat-delta positive">
            <span>480 Member Reach</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Settled Escrow Volume</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--amber-400)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">₹{(summary?.totalVolumeSettled || 42000).toLocaleString()}</div>
          <div className="stat-delta positive">
            <span>Direct T+0 Payouts</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Farmer Net Realization Gain</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">+{summary?.averageFarmerRealizationIncreasePercent || 22.4}%</div>
          <div className="stat-delta positive">
            <span>vs Uncoordinated Mandi</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Food Wastage Reduction</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <Leaf size={20} />
            </div>
          </div>
          <div className="stat-value">-{summary?.wastageReductionPercent || 31.8}%</div>
          <div className="stat-delta positive">
            <span>Pre-Harvest Supply Locked</span>
          </div>
        </div>
      </div>

      {/* Commodity Perishability & Market Handling Classification */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Layers size={20} style={{ color: 'var(--emerald-400)' }} />
              Commodity Perishability & Market Handling Classification Matrix
            </h3>
            <p className="section-subtitle">
              Dynamic storage, grading speed, and priority dispatch rules calibrated by perishability tier
            </p>
          </div>
        </div>

        <div className="card-grid">
          {commodities.map(c => {
            const getCategoryBadge = (cat) => {
              switch (cat) {
                case 'ultra_perishable': return { class: 'badge-rose', label: 'Ultra Perishable (Immediate Sale)' };
                case 'highly_perishable': return { class: 'badge-amber', label: 'Highly Perishable (Rapid Cold Grading)' };
                case 'moderately_perishable': return { class: 'badge-indigo', label: 'Moderately Perishable (Storage Selling)' };
                case 'storable': return { class: 'badge-emerald', label: 'Storable Grain (Planned Long-term)' };
                default: return { class: 'badge-slate', label: 'Standard' };
              }
            };
            const catInfo = getCategoryBadge(c.category);

            return (
              <div key={c.id} className="glass-panel item-card" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                <div className="item-card-header">
                  <div>
                    <span className={`badge ${catInfo.class}`} style={{ marginBottom: '6px' }}>
                      {catInfo.label}
                    </span>
                    <h4 style={{ fontSize: '18px' }}>{c.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--slate-400)' }}>Variety: {c.variety}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--emerald-400)' }}>
                      MSP: ₹{c.mspFloor}/kg
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--slate-300)', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div><strong>Shelf Life:</strong> {c.shelfLifeDays} Days</div>
                  <div><strong>Handling:</strong> {c.storageRequirement}</div>
                  <div><strong>Quality Standards:</strong> {c.qualityParameters?.join(', ')}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Supply-Demand Matching Engine Parameters */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Sparkles size={20} style={{ color: 'var(--indigo-400)' }} />
              AI Matching Engine Weights & MNR Protection Thresholds
            </h3>
            <p className="section-subtitle">
              Multi-factor algorithmic parameters governing pre-harvest matchmaking and farmer protection
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--indigo-300)' }}>Algorithmic Factor Weights</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-300)' }}>1. Commodity & Variety Fit:</span>
                <strong style={{ color: 'var(--emerald-400)' }}>25%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-300)' }}>2. Harvest Window Overlap:</span>
                <strong style={{ color: 'var(--emerald-400)' }}>20%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-300)' }}>3. Grade Specification Match:</span>
                <strong style={{ color: 'var(--emerald-400)' }}>15%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-300)' }}>4. FPO Lot Aggregation Fit:</span>
                <strong style={{ color: 'var(--emerald-400)' }}>15%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-300)' }}>5. Buyer Reliability Score:</span>
                <strong style={{ color: 'var(--emerald-400)' }}>15%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-300)' }}>6. Geographic Proximity:</span>
                <strong style={{ color: 'var(--emerald-400)' }}>10%</strong>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-emerald)' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--emerald-400)' }}>MNR Protection Policy</h4>
            <p style={{ fontSize: '13px', color: 'var(--slate-300)', marginBottom: '12px' }}>
              Every transaction evaluates:
              <br />
              <code style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 6px', borderRadius: '4px', color: 'var(--emerald-300)', display: 'block', margin: '6px 0' }}>
                MNR = max(MSP, Cost + 20%, Negotiated Floor)
              </code>
              If Net Realization &lt; MNR, the platform automatically flags risk and identifies alternative buyers.
            </p>
            <button className="btn btn-secondary btn-sm" onClick={() => onOpenWaterfallModal(28.00, 12.00, 16.00, 'Tomato')}>
              <Sliders size={14} />
              <span>Launch Price Waterfall Simulator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
