import React, { useState } from 'react';
import { X, ShoppingBag, Calendar, MapPin, DollarSign, Clock, Check, Repeat } from 'lucide-react';

export default function DemandRequestModal({ isOpen, onClose, onSubmit, buyers = [] }) {
  const [formData, setFormData] = useState({
    buyerId: 'buyer-1',
    commodity: 'Tomato',
    variety: 'Shivam Hybrid / Roma',
    requiredQuantityKg: 1500,
    qualityGrade: 'Grade A',
    maxPricePerKg: 28.00,
    deliveryLocation: 'Grand Hyatt Central Receiving Bay, Outer Ring Road, Bengaluru',
    deliveryDate: '2026-11-18',
    isRecurring: true,
    recurrencePattern: 'Weekly on Wednesdays for 3 Months',
    packagingRequirements: 'Ventilated 20kg food-grade plastic crates, sanitized',
    paymentTerms: 'Instant Escrow Settlement on Digital Acceptance (T+0)',
    cancellationTerms: '72 hours notice; 15% cancellation fee applies if produce already harvested',
    acceptedSubstitutes: 'Roma Vine Tomatoes Grade A accepted if Brix >5.0'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={22} style={{ color: 'var(--indigo-400)' }} />
              Post Pre-Harvest Demand Request / Forecast
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--slate-400)' }}>
              Specify forward procurement requirements for automated AI matching with FPO clusters.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Buyer & Commodity */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Procuring Buyer Account</label>
              <select 
                className="form-select"
                value={formData.buyerId}
                onChange={e => {
                  const bId = e.target.value;
                  const b = buyers.find(item => item.id === bId);
                  setFormData({
                    ...formData,
                    buyerId: bId,
                    deliveryLocation: b ? b.location : formData.deliveryLocation
                  });
                }}
              >
                {buyers.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Commodity / Crop</label>
              <select 
                className="form-select"
                value={formData.commodity}
                onChange={e => setFormData({ ...formData, commodity: e.target.value })}
              >
                <option value="Tomato">Tomato (Highly Perishable)</option>
                <option value="Palak / Spinach">Palak / Spinach (Ultra Perishable)</option>
                <option value="Onion">Onion (Moderately Perishable)</option>
                <option value="Basmati Rice (Paddy)">Basmati Rice (Storable)</option>
              </select>
            </div>
          </div>

          {/* Variety & Grade */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Required Variety Specification</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.variety}
                onChange={e => setFormData({ ...formData, variety: e.target.value })}
                placeholder="e.g. Shivam Hybrid, Roma, Any Grade A"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Required Quality Grade</label>
              <select 
                className="form-select"
                value={formData.qualityGrade}
                onChange={e => setFormData({ ...formData, qualityGrade: e.target.value })}
              >
                <option value="Grade A">Grade A (Uniform size, Brix &gt;5.0, &lt;1% defect)</option>
                <option value="Grade B">Grade B (Commercial Supermarket)</option>
                <option value="Grade C">Grade C (Pulp / Processing)</option>
              </select>
            </div>
          </div>

          {/* Quantity & Max Price */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Batch Quantity (kg)</label>
              <input 
                type="number" 
                min="100"
                step="50"
                className="form-input"
                value={formData.requiredQuantityKg}
                onChange={e => setFormData({ ...formData, requiredQuantityKg: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Procuring Price (₹/kg)</label>
              <input 
                type="number" 
                min="5"
                step="0.5"
                className="form-input"
                value={formData.maxPricePerKg}
                onChange={e => setFormData({ ...formData, maxPricePerKg: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          {/* Delivery Date & Recurring Pattern */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First / Target Delivery Date</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.deliveryDate}
                onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Demand Frequency</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <input 
                  type="checkbox" 
                  id="isRecurringCheck"
                  checked={formData.isRecurring}
                  onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
                  style={{ accentColor: 'var(--indigo-500)', cursor: 'pointer' }}
                />
                <label htmlFor="isRecurringCheck" style={{ fontSize: '13px', color: 'var(--slate-300)', cursor: 'pointer' }}>
                  Recurring Demand Schedule
                </label>
              </div>
              {formData.isRecurring && (
                <input 
                  type="text"
                  className="form-input"
                  style={{ marginTop: '6px' }}
                  value={formData.recurrencePattern}
                  onChange={e => setFormData({ ...formData, recurrencePattern: e.target.value })}
                  placeholder="e.g. Weekly on Wednesdays for 3 Months"
                />
              )}
            </div>
          </div>

          {/* Delivery Location */}
          <div className="form-group">
            <label className="form-label">Delivery Location & Receiving Bay</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.deliveryLocation}
              onChange={e => setFormData({ ...formData, deliveryLocation: e.target.value })}
              required
            />
          </div>

          {/* Packaging & Payment Terms */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Packaging Specifications</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.packagingRequirements}
                onChange={e => setFormData({ ...formData, packagingRequirements: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.paymentTerms}
                onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
              />
            </div>
          </div>

          {/* Cancellation Terms & Substitutes */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cancellation Terms</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.cancellationTerms}
                onChange={e => setFormData({ ...formData, cancellationTerms: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accepted Substitutes</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.acceptedSubstitutes}
                onChange={e => setFormData({ ...formData, acceptedSubstitutes: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--indigo-500), var(--indigo-700))' }}>
              <Check size={16} />
              Publish Demand Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
