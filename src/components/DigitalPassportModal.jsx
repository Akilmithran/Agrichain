import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  ShieldCheck, 
  Thermometer, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  ExternalLink,
  MapPin,
  Calendar,
  Award,
  Layers,
  FileCheck2,
  Printer
} from 'lucide-react';

export default function DigitalPassportModal({ isOpen, onClose, lot }) {
  if (!isOpen || !lot) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg passport-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--emerald-500), var(--emerald-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <QrCode size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '20px' }}>Digital Lot Passport</h3>
                <span className="badge badge-emerald">Verified On-Chain Pedigree</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--emerald-300)' }}>
                Lot ID: <strong>{lot.lotNumber || 'AGRI-LOT-9021'}</strong> • Passport: {lot.passportId}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handlePrint} title="Print QR Traceability Certificate">
              <Printer size={16} />
              <span className="hide-mobile">Print</span>
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Top Highlight Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '24px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px',
          alignItems: 'center'
        }}>
          {/* Live QR Code Box */}
          <div style={{ textAlign: 'center' }}>
            <div className="qr-box">
              {lot.qrCodeDataUrl ? (
                <img 
                  src={lot.qrCodeDataUrl} 
                  alt={`QR code for ${lot.lotNumber}`} 
                  style={{ width: '160px', height: '160px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#064e3b' }}>
                  <QrCode size={120} />
                </div>
              )}
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--emerald-400)', marginTop: '6px', fontWeight: '700' }}>
              SCAN FOR AUDIT PROOF
            </span>
          </div>

          {/* Quick Specifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '6px' }}>{lot.categoryLabel || 'Highly Perishable'}</span>
                <h4 style={{ fontSize: '22px', color: '#fff' }}>{lot.commodity} ({lot.variety || 'Shivam Hybrid'})</h4>
                <p style={{ fontSize: '13px', color: 'var(--slate-300)' }}>
                  Aggregated & Certified by <strong>{lot.fpoName || 'GreenHarvest Farmers Producer Co. Ltd.'}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '26px', fontWeight: '800', color: 'var(--emerald-400)', fontFamily: 'var(--font-heading)' }}>
                  {Number(lot.totalQuantityKg).toLocaleString()} kg
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--slate-400)' }}>
                  {lot.grade || 'Grade A (Export / Institutional)'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '6px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Harvest Intake</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{lot.collectionDate || '2026-11-17'}</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Quality Score</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--emerald-400)' }}>
                  {lot.qualityMetrics?.inspectionScorePercent || 97}% (Passed)
                </span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Assigned Buyer</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{lot.buyerName ? lot.buyerName.split('&')[0] : 'Grand Hyatt'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Constituent Farmers Traceability */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--emerald-300)' }}>
            <Users size={18} />
            Constituent Farmgate Origins (Multi-Farmer Aggregation)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {(lot.constituentFarmers || []).map((farmer, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{farmer.farmerName}</span>
                  <span className="badge badge-emerald">{farmer.percentageOfLot || ((farmer.quantityKg/lot.totalQuantityKg)*100).toFixed(0)}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--slate-400)' }}>
                  <MapPin size={13} style={{ color: 'var(--emerald-400)' }} />
                  <span>{farmer.location || 'Kolar Cluster, Karnataka'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Contributed:</span>
                  <span style={{ fontWeight: '700', color: '#fff' }}>{farmer.quantityKg} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Payout Credited:</span>
                  <span style={{ fontWeight: '700', color: 'var(--emerald-400)' }}>
                    ₹{Number(farmer.payoutDue || farmer.quantityKg * 22.16).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Quality Inspection Certificate & Parameters */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--emerald-300)' }}>
            <Award size={18} />
            Agronomist Quality Inspection & Certification
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Brix Sweetness</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{lot.qualityMetrics?.brix || 5.4} °Bx</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Firmness</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{lot.qualityMetrics?.firmness || '4.9 kg/cm²'}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Defect Rate</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--emerald-400)' }}>{lot.qualityMetrics?.defectRatePercent || 0.8}%</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11px', color: 'var(--slate-400)', display: 'block' }}>Pesticide Residue</span>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--emerald-400)' }}>Nil (Residue Free)</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--slate-300)', fontStyle: 'italic' }}>
            "{lot.qualityMetrics?.inspectorNotes || 'Graded and pre-cooled within 2 hours. Optimal firmness for high-end culinary prep.'}"
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '12px', color: 'var(--slate-400)' }}>
            <span>Certified by: <strong>{lot.qualityMetrics?.inspectorName || 'Dr. H. Anand (Chief Quality Agronomist)'}</strong></span>
            <span className="badge badge-emerald">ISO-22000 Certified Protocol</span>
          </div>
        </div>

        {/* Section 3: Cold Chain & Delivery Verification */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Cold Chain */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h5 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--agri-green-soft)', marginBottom: '8px' }}>
              <Thermometer size={16} />
              Cold Chain & Transit Telemetry
            </h5>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Facility: <strong>{lot.storageDetails?.facilityType || 'Kolar Cold Pre-Cooling Hub'}</strong></div>
              <div>Temp Maintained: <strong>{lot.storageDetails?.temperatureCelsius || '12.0°C'}</strong> (RH: 88%)</div>
              <div>Reefer Tracking: <strong>{lot.storageDetails?.transitTrackingId || 'TRK-REEFER-9021'}</strong></div>
            </div>
          </div>

          {/* Delivery & Escrow Release */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h5 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--agri-green-bright)', marginBottom: '8px' }}>
              <CheckCircle2 size={16} />
              Buyer Digital Acceptance
            </h5>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>Status: <span className="badge badge-emerald">{lot.dispatchStatus || 'Accepted & Settled'}</span></div>
              <div>Accepted by: <strong>{lot.deliveryConfirmation?.buyerSignature || 'Chef Vikram Malhotra'}</strong></div>
              <div>Escrow Payout: <strong style={{ color: 'var(--agri-green-bright)' }}>100% Released (T+0)</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
