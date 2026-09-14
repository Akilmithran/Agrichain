import React, { useState } from 'react';
import { 
  X, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  QrCode, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractiveDemoWizard({
  isOpen,
  onClose,
  currentStep = 1,
  onExecuteStep,
  onResetSeed,
  onSwitchRole,
  onOpenPassport,
  onOpenWaterfall
}) {
  const [loading, setLoading] = useState(false);
  const [activeStepData, setActiveStepData] = useState(null);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: "Step 1: 3 Farmers Declare Planned Tomato Cultivation",
      role: "Farmer",
      description: "Farmers Ramesh Gowda (300 kg), Suresh Patil (500 kg), and Lakshmi Devi (700 kg) in Kolar cluster declare expected tomato harvests for Nov 10–20 with verified cultivation costs.",
      actionLabel: "Declare & Register 3 Farmers",
      stateChange: "Status: 'Planned Supply' • Total: 1,500 kg Tomatoes"
    },
    {
      step: 2,
      title: "Step 2: Grand Hyatt Regency Submits Forward Demand",
      role: "Buyer",
      description: "Buyer 'Grand Hyatt Regency & Luxury Cafeterias' creates a forward demand for 1,500 kg Grade A Tomatoes/week at a maximum price of ₹28.00/kg.",
      actionLabel: "Post Buyer Demand Forecast",
      stateChange: "Status: 'Open Demand' • Batch: 1,500 kg weekly"
    },
    {
      step: 3,
      title: "Step 3: AI Matching Engine Identifies 96% Compatibility",
      role: "Admin",
      description: "The AI matching engine evaluates harvest window vs delivery date, variety, grade, FPO aggregation fit, and buyer reliability index (98%), giving a 96% compatibility score.",
      actionLabel: "Run AI Multi-Factor Matching",
      stateChange: "AI Score: 96% (A+ Optimal Match) • FPO Aggregation Fit Verified"
    },
    {
      step: 4,
      title: "Step 4: Price Waterfall & MNR Protection Evaluation",
      role: "Admin",
      description: "System computes full deductions: Collection (₹1.20) + Packing (₹1.80) + Platform (₹0.84) + Risk (₹0.56) = ₹5.84/kg. Farmer Net Realization = ₹22.16/kg. Checked against MNR (₹16.50/kg) -> PASSED!",
      actionLabel: "Evaluate Waterfall & MNR Shield",
      stateChange: "Farmer Net: ₹22.16/kg (+₹5.66/kg above MNR floor)"
    },
    {
      step: 5,
      title: "Step 5: Conditional Supply Commitment Signed",
      role: "FPO",
      description: "Pre-harvest forward contract AGRI-CC-2026-9021 is locked between Grand Hyatt Regency and GreenHarvest FPO. Farmer supplies are marked as 'Confirmed Supply'.",
      actionLabel: "Sign Conditional Commitment",
      stateChange: "Status: 'Confirmed Supply' • Contract Locked"
    },
    {
      step: 6,
      title: "Step 6: Harvest Logged & FPO Lot Aggregated (1,500 kg)",
      role: "FPO",
      description: "Produce is harvested. GreenHarvest FPO aggregates 300kg + 500kg + 700kg = 1,500 kg Lot #AGRI-LOT-9021 and generates the Digital Lot Passport with live QR code.",
      actionLabel: "Aggregate Lot & Generate QR Passport",
      stateChange: "Status: 'Harvested Supply' • Digital Lot Passport Issued"
    },
    {
      step: 7,
      title: "Step 7: Optical Quality Grading & Cold Reefer Dispatch",
      role: "FPO",
      description: "Agronomist inspection gives 97% quality rating (Brix 5.4, Firmness 4.9 kg/cm², zero pesticide residue). Produce is dispatched in cold reefer truck.",
      actionLabel: "Certify Quality & Dispatch Shipment",
      stateChange: "Quality: 97% Passed • Cold Chain: 12.0°C Maintained"
    },
    {
      step: 8,
      title: "Step 8: Buyer Receiving, QR Scan & T+0 Escrow Settlement",
      role: "Buyer",
      description: "Buyer Chef Vikram Malhotra scans the QR passport, confirms gate inspection. The escrow contract instantly releases ₹33,240 directly to the 3 constituent farmers' bank accounts.",
      actionLabel: "Scan QR & Release Instant Escrow",
      stateChange: "Status: 'Delivered Quantity' • ₹33,240 Credited to 3 Farmers"
    },
    {
      step: 9,
      title: "Step 9: Buyer Cancellation & AI Fallback Resilience Simulation",
      role: "Admin",
      description: "Resilience Test: Simulates primary buyer cancellation. The AI Fallback Engine instantly routes the lot to alternative buyer 'Metro Cash & Carry' at ₹28.50/kg (+₹0.50/kg higher!).",
      actionLabel: "Simulate Cancellation & Test Fallback",
      stateChange: "Fallback Activated: Metro Cash & Carry Matched at ₹28.50/kg"
    },
    {
      step: 10,
      title: "Step 10: Complete AgriChain Direct End-to-End Summary",
      role: "Admin",
      description: "The complete cycle demonstrated zero distress sales, 100% pre-harvest price visibility, +22.4% farmer net realization gain, 0kg wastage, and full farm-to-fork QR traceability.",
      actionLabel: "Complete & Celebrate!",
      stateChange: "100% Transparent Supply Chain Executed"
    }
  ];

  const currentStepInfo = steps.find(s => s.step === currentStep) || steps[0];

  const handleStepClick = async (stepNumber) => {
    setLoading(true);
    try {
      const res = await onExecuteStep(stepNumber);
      setActiveStepData(res);
      const s = steps.find(item => item.step === stepNumber);
      if (s?.role) {
        onSwitchRole(s.role);
      }
      if (stepNumber === 8 || stepNumber === 10) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" style={{ border: '1px solid var(--border-green)', boxShadow: 'var(--shadow-lg)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--agri-green-dark), var(--agri-green-mid))',
              border: '1px solid rgba(118, 185, 71, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F7F5EF'
            }}>
              <Play size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px' }}>AgriChain Direct - Guided 10-Step Interactive Tour</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Demonstrates full pre-harvest matching, pricing waterfall, FPO aggregation, QR passport, and cancellation fallback
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '6px' }}>
          {steps.map(s => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <button
                key={s.step}
                onClick={() => handleStepClick(s.step)}
                style={{
                  flex: 1,
                  minWidth: '32px',
                  padding: '8px 4px',
                  borderRadius: 'var(--radius-sm)',
                  border: isCurrent ? '1.5px solid var(--agri-green-bright)' : '1px solid var(--border-subtle)',
                  background: isCurrent ? 'var(--agri-green-dark)' : (isCompleted ? 'rgba(94, 159, 91, 0.2)' : 'rgba(255, 255, 255, 0.04)'),
                  color: isCurrent ? '#F7F5EF' : (isCompleted ? 'var(--agri-green-bright)' : 'var(--text-secondary)'),
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                title={s.title}
              >
                {s.step}
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(22, 48, 32, 0.9), rgba(18, 22, 20, 0.85))',
          border: '1px solid var(--border-green)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="demo-step-badge">
              Step {currentStepInfo.step} of 10 • {currentStepInfo.role} Perspective
            </span>
            <span className="badge badge-emerald">
              {currentStepInfo.stateChange}
            </span>
          </div>

          <h4 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '10px' }}>
            {currentStepInfo.title}
          </h4>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
            {currentStepInfo.description}
          </p>

          {/* Action Trigger */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary btn-sm"
                disabled={currentStep <= 1 || loading}
                onClick={() => handleStepClick(currentStep - 1)}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={onResetSeed}
                title="Reset scenario to step 1"
              >
                <RotateCcw size={14} />
                <span>Reset Demo</span>
              </button>
            </div>

            <button 
              className="btn btn-primary btn-lg pulse-glow"
              disabled={loading}
              onClick={() => handleStepClick(currentStep >= 10 ? 1 : currentStep + 1)}
            >
              {loading ? (
                <span>Simulating...</span>
              ) : (
                <>
                  <span>{currentStep >= 10 ? 'Restart Tour (Step 1)' : `Execute ${currentStepInfo.actionLabel}`}</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Modal Deep Links */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenWaterfall(28.00, 12.00, 16.00, 'Tomato')}>
            <TrendingUp size={14} />
            <span>Open Price Waterfall</span>
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => onOpenPassport()}>
            <QrCode size={14} />
            <span>View Digital Lot QR Passport</span>
          </button>
        </div>
      </div>
    </div>
  );
}
