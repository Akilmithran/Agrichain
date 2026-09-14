import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Percent, 
  Truck, 
  Package, 
  Warehouse, 
  Cpu, 
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';

export default function PricingWaterfallModal({ isOpen, onClose, initialBuyerPrice = 28.00, cultivationCost = 12.00, mnrFloor = 16.00, commodity = 'Tomato' }) {
  const [buyerPrice, setBuyerPrice] = useState(initialBuyerPrice);
  const [coldStorageUsed, setColdStorageUsed] = useState(false);

  useEffect(() => {
    setBuyerPrice(initialBuyerPrice);
  }, [initialBuyerPrice]);

  if (!isOpen) return null;

  // Dynamic calculations
  const collectionCost = 1.20;
  const gradingPackingCost = 1.80;
  const storageCost = coldStorageUsed ? 0.80 : 0.00;
  const platformFee = Number((buyerPrice * 0.03).toFixed(2));
  const riskReserve = Number((buyerPrice * 0.02).toFixed(2));

  const totalDeductions = Number((collectionCost + gradingPackingCost + storageCost + platformFee + riskReserve).toFixed(2));
  const farmerNetRealization = Number((buyerPrice - totalDeductions).toFixed(2));

  const msp = 14.00;
  const costPlus20 = Number((cultivationCost * 1.2).toFixed(2));
  const effectiveMNR = Math.max(msp, costPlus20, Number(mnrFloor));

  const isProtected = farmerNetRealization >= effectiveMNR;
  const difference = Number((farmerNetRealization - effectiveMNR).toFixed(2));
  const mandiSpotBenchmark = Number((buyerPrice * 0.82).toFixed(2));
  const gainVsMandi = Number((farmerNetRealization - mandiSpotBenchmark).toFixed(2));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={22} style={{ color: 'var(--agri-green-bright)' }} />
              Transparent Price Waterfall Engine
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--slate-400)' }}>
              100% itemized cost breakdown from Buyer Procurement to Farmer Net Bank Credit for {commodity}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Interactive Simulation Controls */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--slate-300)' }}>
              Simulate Buyer Price (₹/kg):
            </span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--agri-green-bright)', fontFamily: 'var(--font-heading)' }}>
              ₹{Number(buyerPrice).toFixed(2)} / kg
            </span>
          </div>
          <input 
            type="range" 
            min="12" 
            max="45" 
            step="0.50" 
            value={buyerPrice} 
            onChange={e => setBuyerPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--emerald-500)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px' }}>
            <span>₹12.00 (Distress floor)</span>
            <span>₹28.00 (Agreed Institutional)</span>
            <span>₹45.00 (Peak Premium)</span>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="checkbox" 
              id="coldStorageCheck"
              checked={coldStorageUsed}
              onChange={e => setColdStorageUsed(e.target.checked)}
              style={{ accentColor: 'var(--emerald-500)', cursor: 'pointer' }}
            />
            <label htmlFor="coldStorageCheck" style={{ fontSize: '13px', color: 'var(--slate-300)', cursor: 'pointer' }}>
              Include FPO Controlled Cold Storage Pre-Cooling (+₹0.80/kg)
            </label>
          </div>
        </div>

        {/* Price Waterfall Breakdown */}
        <div className="waterfall-container">
          {/* Step 1: Buyer Price */}
          <div className="waterfall-row positive">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-emerald">GROSS BUYER PRICE</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Hospitality / Supermarket Agreed Price</span>
            </div>
            <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--agri-green-bright)' }}>
              + ₹{buyerPrice.toFixed(2)} / kg
            </span>
          </div>

          {/* Deductions Container */}
          <div style={{ paddingLeft: '16px', borderLeft: '2px dashed var(--slate-700)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Collection */}
            <div className="waterfall-row deduction">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} style={{ color: '#fb7185' }} />
                <span style={{ fontSize: '13px', color: 'var(--slate-300)' }}>Farmgate-to-Hub Collection & Reefer Transport</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fb7185' }}>- ₹{collectionCost.toFixed(2)}</span>
            </div>

            {/* Grading & Packaging */}
            <div className="waterfall-row deduction">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={16} style={{ color: '#fb7185' }} />
                <span style={{ fontSize: '13px', color: 'var(--slate-300)' }}>Automated Sorting, Optical Grading & Food-Grade Crates</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fb7185' }}>- ₹{gradingPackingCost.toFixed(2)}</span>
            </div>

            {/* Storage (if applied) */}
            {coldStorageUsed && (
              <div className="waterfall-row deduction">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Warehouse size={16} style={{ color: '#fb7185' }} />
                  <span style={{ fontSize: '13px', color: 'var(--slate-300)' }}>FPO Cold Room Staging & Pre-Cooling</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#fb7185' }}>- ₹{storageCost.toFixed(2)}</span>
              </div>
            )}

            {/* Platform Fee */}
            <div className="waterfall-row deduction">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} style={{ color: '#fb7185' }} />
                <span style={{ fontSize: '13px', color: 'var(--slate-300)' }}>AgriChain Transparent Coordination Fee (3.0%)</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fb7185' }}>- ₹{platformFee.toFixed(2)}</span>
            </div>

            {/* Risk Reserve */}
            <div className="waterfall-row deduction">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} style={{ color: '#fb7185' }} />
                <span style={{ fontSize: '13px', color: 'var(--slate-300)' }}>Transit Shrinkage & Cancellation Risk Reserve (2.0%)</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#fb7185' }}>- ₹{riskReserve.toFixed(2)}</span>
            </div>
          </div>

          {/* Step 3: Net Realization */}
          <div className="waterfall-row highlight">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-emerald" style={{ background: 'var(--emerald-500)', color: '#000', fontWeight: '800' }}>
                  FINAL FARMER NET REALIZATION
                </span>
                <span style={{ fontSize: '13px', color: 'var(--emerald-200)' }}>
                  Total Deductions: ₹{totalDeductions.toFixed(2)}/kg ({((totalDeductions/buyerPrice)*100).toFixed(1)}%)
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--emerald-300)', marginTop: '4px' }}>
                Formula: Buyer Price (₹{buyerPrice}) - Logistics (₹{collectionCost}) - Packing (₹{gradingPackingCost}) - Platform (₹{platformFee}) - Risk (₹{riskReserve})
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
                ₹{farmerNetRealization.toFixed(2)} / kg
              </div>
              <div style={{ fontSize: '12px', color: 'var(--agri-green-bright)', fontWeight: '700' }}>
                Direct T+0 Bank Credit
              </div>
            </div>
          </div>
        </div>

        {/* Minimum Net Realization (MNR) Safety Evaluation */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: isProtected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isProtected ? 'var(--emerald-500)' : '#ef4444'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isProtected ? (
                <ShieldCheck size={20} style={{ color: 'var(--agri-green-bright)' }} />
              ) : (
                <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              )}
              <span style={{ fontSize: '14px', fontWeight: '700', color: isProtected ? 'var(--agri-green-bright)' : '#ef4444' }}>
                {isProtected ? 'MNR PROTECTION: PASSED & SAFE' : 'PRICE-RISK WARNING: BELOW MINIMUM NET REALIZATION'}
              </span>
            </div>
            <span className={`badge ${isProtected ? 'badge-emerald' : 'badge-rose'}`}>
              MNR Floor: ₹{effectiveMNR.toFixed(2)}/kg
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--slate-300)' }}>
            {isProtected ? (
              <>
                Farmer net realization (<strong>₹{farmerNetRealization.toFixed(2)}/kg</strong>) is <strong>+₹{difference.toFixed(2)}/kg</strong> above the Minimum Net Realization floor (max of MSP ₹{msp}, Verified Cost + 20% margin ₹{costPlus20}, and farmer floor ₹{mnrFloor}).
              </>
            ) : (
              <>
                Net realization (<strong>₹{farmerNetRealization.toFixed(2)}/kg</strong>) is <strong>₹{Math.abs(difference).toFixed(2)}/kg BELOW</strong> the farmer's safety floor. The platform will block automatic signing and route supply to alternative institutional buyers.
              </>
            )}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px', fontSize: '12px', color: 'var(--slate-400)' }}>
            <span>Traditional Mandi Spot Benchmark: ₹{mandiSpotBenchmark.toFixed(2)}/kg</span>
            <span style={{ color: gainVsMandi >= 0 ? 'var(--agri-green-bright)' : '#ef4444', fontWeight: '700' }}>
              Farmer Net Gain vs Uncoordinated Middlemen: {gainVsMandi >= 0 ? `+₹${gainVsMandi.toFixed(2)}/kg (+${((gainVsMandi/mandiSpotBenchmark)*100).toFixed(1)}%)` : `-₹${Math.abs(gainVsMandi).toFixed(2)}/kg`}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
