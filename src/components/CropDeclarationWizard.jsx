import React, { useState } from 'react';
import { X, Sprout, Calendar, MapPin, DollarSign, ShieldCheck, Check } from 'lucide-react';

export default function CropDeclarationWizard({ isOpen, onClose, onSubmit, commodities = [] }) {
  const [formData, setFormData] = useState({
    farmerId: 'farmer-1',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid',
    cultivatedAreaAcres: 1.0,
    expectedYieldKg: 1000,
    marketableQuantityKg: 850,
    harvestWindowStart: '2026-11-10',
    harvestWindowEnd: '2026-11-20',
    farmLocation: 'Hoskote, Kolar Cluster',
    expectedGrade: 'Grade A',
    cultivationCostPerKg: 12.00,
    minAcceptableNetPrice: 16.00,
    fpoId: 'fpo-1'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const selectedComm = commodities.find(c => c.name.toLowerCase() === formData.commodity.toLowerCase()) || {
    mspFloor: 14.00,
    defaultCultivationCostPerKg: 12.00,
    categoryLabel: 'Highly Perishable'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={22} style={{ color: 'var(--emerald-400)' }} />
              Declare Planned Cultivation (Pre-Harvest)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--slate-400)' }}>
              Lock in buyers before harvest. Enables AI matching with institutional demands.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Commodity & Variety */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Crop / Commodity</label>
              <select 
                className="form-select"
                value={formData.commodity}
                onChange={e => {
                  const val = e.target.value;
                  const c = commodities.find(item => item.name === val);
                  setFormData({
                    ...formData,
                    commodity: val,
                    cultivationCostPerKg: c ? c.defaultCultivationCostPerKg : 12.00,
                    minAcceptableNetPrice: c ? Number((c.defaultCultivationCostPerKg * 1.25).toFixed(2)) : 15.00
                  });
                }}
              >
                <option value="Tomato">Tomato (Highly Perishable)</option>
                <option value="Palak / Spinach">Palak / Spinach (Ultra Perishable)</option>
                <option value="Onion">Onion (Moderately Perishable)</option>
                <option value="Basmati Rice (Paddy)">Basmati Rice (Storable)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Variety</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.variety}
                onChange={e => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. Shivam Hybrid, Roma, Pusa"
                required
              />
            </div>
          </div>

          {/* Area & Yield */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cultivated Land (Acres)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                className="form-input"
                value={formData.cultivatedAreaAcres}
                onChange={e => setFormData({ ...formData, cultivatedAreaAcres: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Marketable Quantity (kg)</label>
              <input 
                type="number" 
                min="50"
                className="form-input"
                value={formData.marketableQuantityKg}
                onChange={e => setFormData({ ...formData, marketableQuantityKg: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Expected Harvest Dates */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Harvest Window Start</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.harvestWindowStart}
                onChange={e => setFormData({ ...formData, harvestWindowStart: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Harvest Window End</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.harvestWindowEnd}
                onChange={e => setFormData({ ...formData, harvestWindowEnd: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Location & Expected Grade */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Farm Location / Collection Point</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.farmLocation}
                onChange={e => setFormData({ ...formData, farmLocation: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Quality / Grade</label>
              <select 
                className="form-select"
                value={formData.expectedGrade}
                onChange={e => setFormData({ ...formData, expectedGrade: e.target.value })}
              >
                <option value="Grade A">Grade A (Export / Institutional Quality)</option>
                <option value="Grade B">Grade B (Standard Market)</option>
                <option value="Grade C">Grade C (Processing / Pulp)</option>
              </select>
            </div>
          </div>

          {/* Cultivation Cost & Min Acceptable Price (MNR basis) */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Verified Cultivation Cost (₹/kg)</label>
              <input 
                type="number" 
                step="0.5"
                className="form-input"
                value={formData.cultivationCostPerKg}
                onChange={e => setFormData({ ...formData, cultivationCostPerKg: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Acceptable Net Price (₹/kg)</label>
              <input 
                type="number" 
                step="0.5"
                className="form-input"
                value={formData.minAcceptableNetPrice}
                onChange={e => setFormData({ ...formData, minAcceptableNetPrice: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* MNR Information Banner */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid var(--border-emerald)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={20} style={{ color: 'var(--emerald-400)', flexShrink: 0 }} />
            <div style={{ fontSize: '12px', color: 'var(--emerald-200)' }}>
              <strong>Automated Minimum Net Realization (MNR) Shield:</strong> System will protect you by calculating MNR = max(MSP ₹{selectedComm.mspFloor || 14}, Cost ₹{formData.cultivationCostPerKg} + 20% margin, Floor ₹{formData.minAcceptableNetPrice}). Transactions below this will be blocked.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              Submit Declaration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
