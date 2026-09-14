import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Layers, 
  QrCode, 
  TrendingUp, 
  Warehouse, 
  Thermometer, 
  ShieldCheck, 
  CheckCircle2, 
  Plus, 
  Truck, 
  Clock, 
  FileCheck2,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { translations } from '../utils/translations';

export default function FpoDashboard({
  fpo,
  farmers = [],
  supplies = [],
  demands = [],
  lots = [],
  commitments = [],
  transactions = [],
  onOpenPassportModal,
  onOpenWaterfallModal,
  onAggregateLot,
  currentLang = 'en'
}) {
  const t = translations[currentLang] || translations.en;

  // Selected farmers for aggregation workbench
  const [selectedSupplyIds, setSelectedSupplyIds] = useState(['sup-1', 'sup-2', 'sup-3']);
  const [selectedBuyerDemandId, setSelectedBuyerDemandId] = useState('dem-1');
  const [targetCollectionCentre, setTargetCollectionCentre] = useState('Kolar Central Aggregation Hub');
  const [opticalGrading, setOpticalGrading] = useState('Grade A');

  const selectedSupplies = supplies.filter(s => selectedSupplyIds.includes(s.id));
  const totalAggregatedKg = selectedSupplies.reduce((acc, curr) => acc + Number(curr.marketableQuantityKg || 0), 0);

  const toggleSelectSupply = (id) => {
    if (selectedSupplyIds.includes(id)) {
      setSelectedSupplyIds(selectedSupplyIds.filter(item => item !== id));
    } else {
      setSelectedSupplyIds([...selectedSupplyIds, id]);
    }
  };

  const handleCreateLot = () => {
    const demand = demands.find(d => d.id === selectedBuyerDemandId) || demands[0];
    const constituentFarmers = selectedSupplies.map(s => ({
      farmerId: s.farmerId,
      farmerName: s.farmerName,
      quantityKg: s.marketableQuantityKg,
      cultivationCostPerKg: s.cultivationCostPerKg,
      netRealizationPerKg: 22.16,
      intakeDate: new Date().toISOString().split('T')[0]
    }));

    onAggregateLot({
      fpoId: fpo?.id || 'fpo-1',
      collectionCentre: targetCollectionCentre,
      commodity: selectedSupplies[0]?.commodity || 'Tomato',
      variety: selectedSupplies[0]?.variety || 'Shivam Hybrid',
      grade: opticalGrading,
      constituentFarmers,
      buyerId: demand?.buyerId || 'buyer-1',
      buyerName: demand?.buyerName || 'Grand Hyatt Regency & Luxury Cafeterias',
      commitmentId: 'com-1'
    });
  };

  return (
    <div>
      {/* FPO Header */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--amber-500), var(--amber-700))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow-amber)'
          }}>
            <Building2 size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '24px' }}>{fpo?.name || 'GreenHarvest Farmers Producer Co. Ltd.'}</h2>
              <span className="badge badge-amber">{fpo?.code || 'FPO-KA-KOLAR-09'}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--slate-400)', marginTop: '2px' }}>
              {fpo?.district || 'Kolar & Chikkaballapur Cluster'} • <strong>{fpo?.totalMembers || 480} Member Farmers</strong> • Lead Agronomist: M. Chennappa
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="badge badge-emerald" style={{ padding: '8px 14px' }}>
            <Warehouse size={16} />
            <span>Cold Storage: 25,000 kg (14,200 kg Active)</span>
          </div>
        </div>
      </div>

      {/* 4 Large KPI Cards */}
      <div className="stat-grid">
        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Farmer Supply</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">1,850 kg</div>
          <div className="stat-delta positive">
            <CheckCircle2 size={14} />
            <span>4 Member Farmers Active</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Aggregated Lots</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--amber-400)' }}>
              <Layers size={20} />
            </div>
          </div>
          <div className="stat-value">{lots.length > 0 ? lots.length : 1} Lots</div>
          <div className="stat-delta positive">
            <QrCode size={14} />
            <span>Digital Passports Issued</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Buyer Demand Pipeline</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--indigo-400)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">4,500 kg</div>
          <div className="stat-delta positive">
            <span>3 Institutional Demands</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-header">
            <span className="stat-label">Settlement Volume</span>
            <div className="stat-icon-wrapper" style={{ color: 'var(--emerald-400)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className="stat-value">₹42,000</div>
          <div className="stat-delta positive">
            <CheckCircle2 size={14} />
            <span>100% Escrow Funded</span>
          </div>
        </div>
      </div>

      {/* Multi-Farmer Lot Aggregation Workbench */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', border: '1px solid var(--border-amber)' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Layers size={22} style={{ color: 'var(--amber-400)' }} />
              Multi-Farmer Pre-Harvest Supply Aggregation Workbench
            </h3>
            <p className="section-subtitle">
              Combine smaller individual farmer declarations into unified institutional Grade A lots (e.g. 300kg + 500kg + 700kg = 1,500 kg)
            </p>
          </div>
          <div className="badge badge-amber" style={{ fontSize: '14px', padding: '6px 14px' }}>
            Selected Aggregation: <strong>{totalAggregatedKg.toLocaleString()} kg</strong>
          </div>
        </div>

        {/* Member Farmer Selection Table */}
        <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Select</th>
                <th>Farmer Name</th>
                <th>Commodity & Variety</th>
                <th>Available Quantity</th>
                <th>Harvest Window</th>
                <th>Cultivation Cost</th>
                <th>Farmer Net Floor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map(sup => {
                const isSelected = selectedSupplyIds.includes(sup.id);
                return (
                  <tr key={sup.id} style={{ background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'transparent' }}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectSupply(sup.id)}
                        style={{ accentColor: 'var(--amber-500)', cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{sup.farmerName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{sup.farmLocation}</div>
                    </td>
                    <td>
                      <span style={{ color: '#fff', fontWeight: '600' }}>{sup.commodity}</span>
                      <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{sup.variety}</div>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--emerald-400)', fontSize: '15px' }}>
                      {sup.marketableQuantityKg} kg
                    </td>
                    <td>{sup.harvestWindowStart} to {sup.harvestWindowEnd}</td>
                    <td>₹{Number(sup.cultivationCostPerKg).toFixed(2)}/kg</td>
                    <td style={{ color: 'var(--amber-400)', fontWeight: '600' }}>₹{Number(sup.minAcceptableNetPrice).toFixed(2)}/kg</td>
                    <td>
                      <span className="badge badge-emerald">{sup.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Aggregation Formulation Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div>
            <label className="form-label">Target Collection Hub</label>
            <select 
              className="form-select"
              value={targetCollectionCentre}
              onChange={e => setTargetCollectionCentre(e.target.value)}
            >
              <option value="Kolar Central Aggregation Hub">Kolar Central Hub (Cold Chain Ready)</option>
              <option value="Malur Rural Collection Point">Malur Rural Collection Point</option>
            </select>
          </div>

          <div>
            <label className="form-label">Optical Grading Target</label>
            <select 
              className="form-select"
              value={opticalGrading}
              onChange={e => setOpticalGrading(e.target.value)}
            >
              <option value="Grade A (Export / Institutional)">Grade A (Institutional Uniform)</option>
              <option value="Grade B (Commercial Supermarket)">Grade B (Commercial)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Assign to Matched Demand</label>
            <select 
              className="form-select"
              value={selectedBuyerDemandId}
              onChange={e => setSelectedBuyerDemandId(e.target.value)}
            >
              {demands.map(d => (
                <option key={d.id} value={d.id}>
                  {d.buyerName} ({d.requiredQuantityKg} kg @ ₹{d.maxPricePerKg}/kg)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <button 
              className="btn btn-amber btn-lg"
              disabled={selectedSupplies.length === 0}
              onClick={handleCreateLot}
            >
              <QrCode size={18} />
              <span>Aggregate & Generate QR Passport</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Aggregated Lots & Digital Passports */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <QrCode size={20} style={{ color: 'var(--emerald-400)' }} />
              Active Aggregated Lots & Digital Passports
            </h3>
            <p className="section-subtitle">
              Live farm-to-fork traceable lots with QR passports, agronomist grading, and delivery status
            </p>
          </div>
        </div>

        <div className="card-grid">
          {(lots.length > 0 ? lots : [{
            id: 'lot-demo-1',
            lotNumber: 'AGRI-LOT-9021',
            passportId: 'PASSPORT-AGRI-LOT-9021',
            commodity: 'Tomato',
            variety: 'Shivam Hybrid',
            totalQuantityKg: 1500,
            grade: 'Grade A (Export / Institutional)',
            collectionCentre: 'Kolar Central Aggregation Hub',
            collectionDate: '2026-11-17',
            buyerName: 'Grand Hyatt Regency & Luxury Cafeterias',
            dispatchStatus: 'Graded & Cold Pre-Cooled',
            paymentStatus: 'Escrow_Funded',
            qualityMetrics: { inspectionScorePercent: 97, brix: 5.4, defectRatePercent: 0.8 },
            constituentFarmers: [
              { farmerName: 'Ramesh Gowda', quantityKg: 300, payoutDue: 6648 },
              { farmerName: 'Suresh Patil', quantityKg: 500, payoutDue: 11080 },
              { farmerName: 'Lakshmi Devi', quantityKg: 700, payoutDue: 15512 }
            ]
          }]).map(lot => (
            <div key={lot.id} className="glass-panel item-card" style={{ border: '1px solid var(--border-emerald)' }}>
              <div className="item-card-header">
                <div>
                  <span className="badge badge-emerald" style={{ marginBottom: '4px' }}>
                    {lot.lotNumber}
                  </span>
                  <h4 style={{ fontSize: '18px' }}>{lot.commodity} ({lot.variety})</h4>
                  <p style={{ fontSize: '12px', color: 'var(--slate-400)' }}>
                    Aggregated from <strong>{lot.constituentFarmers?.length || 3} Farmers</strong>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--emerald-400)', fontFamily: 'var(--font-heading)' }}>
                    {lot.totalQuantityKg} kg
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--slate-400)' }}>
                    {lot.grade?.split('(')[0] || 'Grade A'}
                  </span>
                </div>
              </div>

              {/* Quality & Cold Chain summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Quality Score:</span>
                  <span style={{ fontWeight: '700', color: 'var(--emerald-400)' }}>{lot.qualityMetrics?.inspectionScorePercent || 97}% Passed</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Brix Sweetness:</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{lot.qualityMetrics?.brix || 5.4} °Bx</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Assigned Buyer:</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{lot.buyerName ? lot.buyerName.split('&')[0] : 'Grand Hyatt'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block' }}>Dispatch Status:</span>
                  <span className="badge badge-indigo" style={{ padding: '2px 6px', fontSize: '10px' }}>{lot.dispatchStatus || 'In-Transit'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => onOpenPassportModal(lot)}
                >
                  <QrCode size={14} />
                  <span>View Digital Lot Passport & QR</span>
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => onOpenWaterfallModal(28.00, 12.00, 16.00, lot.commodity)}
                >
                  <TrendingUp size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmer Payout & Settlement Distribution */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <DollarSign size={20} style={{ color: 'var(--emerald-400)' }} />
              Farmer Payout Settlements (Transparent Escrow Breakdown)
            </h3>
            <p className="section-subtitle">
              Constituent farmer realization calculated with zero intermediary leakage
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Farmer Name</th>
                <th>Lot ID</th>
                <th>Delivered Quantity</th>
                <th>Buyer Price</th>
                <th>Total Deductions</th>
                <th>Net Price (₹/kg)</th>
                <th>Total Payout Credited</th>
                <th>Escrow Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: '700', color: '#fff' }}>Ramesh Gowda</td>
                <td><span className="badge badge-slate">AGRI-LOT-9021</span></td>
                <td>300 kg (20.0%)</td>
                <td>₹28.00</td>
                <td style={{ color: '#fb7185' }}>- ₹5.84</td>
                <td style={{ fontWeight: '700', color: 'var(--emerald-400)' }}>₹22.16</td>
                <td style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>₹6,648.00</td>
                <td><span className="badge badge-emerald">Direct Bank Settled</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: '#fff' }}>Suresh Patil</td>
                <td><span className="badge badge-slate">AGRI-LOT-9021</span></td>
                <td>500 kg (33.3%)</td>
                <td>₹28.00</td>
                <td style={{ color: '#fb7185' }}>- ₹5.84</td>
                <td style={{ fontWeight: '700', color: 'var(--emerald-400)' }}>₹22.16</td>
                <td style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>₹11,080.00</td>
                <td><span className="badge badge-emerald">Direct Bank Settled</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700', color: '#fff' }}>Lakshmi Devi</td>
                <td><span className="badge badge-slate">AGRI-LOT-9021</span></td>
                <td>700 kg (46.7%)</td>
                <td>₹28.00</td>
                <td style={{ color: '#fb7185' }}>- ₹5.84</td>
                <td style={{ fontWeight: '700', color: 'var(--emerald-400)' }}>₹22.16</td>
                <td style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>₹15,512.00</td>
                <td><span className="badge badge-emerald">Direct Bank Settled</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
