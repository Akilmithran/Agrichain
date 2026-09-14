import React, { useState, useEffect, useRef } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import FarmerDashboard from './components/FarmerDashboard';
import FpoDashboard from './components/FpoDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import AdminDashboard from './components/AdminDashboard';
import CropDeclarationWizard from './components/CropDeclarationWizard';
import DemandRequestModal from './components/DemandRequestModal';
import PricingWaterfallModal from './components/PricingWaterfallModal';
import DigitalPassportModal from './components/DigitalPassportModal';
import InteractiveDemoWizard from './components/InteractiveDemoWizard';
import VoiceAssistModal from './components/VoiceAssistModal';
import AlertsDrawer from './components/AlertsDrawer';
import { translations } from './utils/translations';
import { ambientSound } from './utils/ambientMusic';
import { PlayCircle, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Global State
  const [currentRole, setCurrentRole] = useState('Farmer');
  const [currentLang, setCurrentLang] = useState('en');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const videoRef = useRef(null);

  // Platform Data
  const [platformSummary, setPlatformSummary] = useState(null);
  const [commodities, setCommodities] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [fpos, setFpos] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [demands, setDemands] = useState([]);
  const [matches, setMatches] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [lots, setLots] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [demoStep, setDemoStep] = useState(1);

  // Modals Visibility
  const [isDeclareOpen, setIsDeclareOpen] = useState(false);
  const [isDemandOpen, setIsDemandOpen] = useState(false);
  const [isWaterfallOpen, setIsWaterfallOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isVoiceAssistOpen, setIsVoiceAssistOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  // Modal Context Data
  const [selectedLotForPassport, setSelectedLotForPassport] = useState(null);
  const [waterfallModalProps, setWaterfallModalProps] = useState({
    buyerPrice: 28.00,
    cultivationCost: 12.00,
    mnrFloor: 16.00,
    commodity: 'Tomato'
  });

  // Load platform state from API
  const refreshPlatformData = async () => {
    try {
      setLoading(true);
      const [sum, comms, frms, fpoList, byrs, sups, dems, matchData, lotsList, commts, alrts] = await Promise.all([
        api.getPlatformSummary().catch(() => null),
        api.getCommodities().catch(() => []),
        api.getFarmers().catch(() => []),
        api.getFpos().catch(() => []),
        api.getBuyers().catch(() => []),
        api.getSupplies().catch(() => []),
        api.getDemands().catch(() => []),
        api.getAutoMatches().catch(() => ({ matches: [] })),
        api.getLots().catch(() => []),
        api.getCommitments().catch(() => []),
        api.getAlerts().catch(() => [])
      ]);

      setPlatformSummary(sum);
      setCommodities(comms);
      setFarmers(frms);
      setFpos(fpoList);
      setBuyers(byrs);
      setSupplies(sups);
      setDemands(dems);
      setMatches(matchData.matches || []);
      setLots(lotsList);
      setCommitments(commts);
      setAlerts(alrts);

      if (lotsList.length > 0 && !selectedLotForPassport) {
        setSelectedLotForPassport(lotsList[0]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPlatformData();
  }, []);

  // Toggle Accessibility Mode
  const handleToggleAccessibility = () => {
    setAccessibilityMode(!accessibilityMode);
    document.body.classList.toggle('accessibility-mode');
  };

  // Open Waterfall Modal with custom parameters
  const handleOpenWaterfall = (buyerPrice = 28.00, cultivationCost = 12.00, mnrFloor = 16.00, commodity = 'Tomato') => {
    setWaterfallModalProps({ buyerPrice, cultivationCost, mnrFloor, commodity });
    setIsWaterfallOpen(true);
  };

  // Open Passport Modal
  const handleOpenPassport = (lot = null) => {
    if (lot) {
      setSelectedLotForPassport(lot);
    } else if (lots.length > 0) {
      setSelectedLotForPassport(lots[0]);
    }
    setIsPassportOpen(true);
  };

  // Create Supply Declaration
  const handleCreateSupply = async (supplyData) => {
    try {
      await api.createSupply(supplyData);
      await refreshPlatformData();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
    }
  };

  // Create Demand Request
  const handleCreateDemand = async (demandData) => {
    try {
      await api.createDemand(demandData);
      await refreshPlatformData();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
    }
  };

  // Aggregate Lot (FPO)
  const handleAggregateLot = async (lotData) => {
    try {
      const createdLot = await api.aggregateLot(lotData);
      await refreshPlatformData();
      setSelectedLotForPassport(createdLot);
      setIsPassportOpen(true);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
    }
  };

  // Accept Commitment
  const handleAcceptCommitment = async (match) => {
    try {
      await api.createCommitment({
        demandRequestId: match.demandId,
        fpoId: 'fpo-1',
        supplyDeclarationIds: ['sup-1', 'sup-2', 'sup-3'],
        agreedBuyerPrice: match.demand?.maxPricePerKg || 28.00
      });
      await refreshPlatformData();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
    }
  };

  // Accept Delivery (Buyer)
  const handleAcceptDelivery = async (lotId) => {
    try {
      await api.acceptDelivery(lotId, {
        acceptedQtyKg: 1500,
        buyerSignature: 'Chef Vikram Malhotra (Exec Chef / Head of Procurement)',
        feedbackNotes: 'All 75 crates verified. Zero transit bruising, outstanding firmness and uniform color.'
      });
      await refreshPlatformData();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    } catch (err) {
      console.error(err);
    }
  };

  // Execute Step in Demo Wizard
  const handleExecuteDemoStep = async (stepNumber) => {
    setDemoStep(stepNumber);
    const result = await api.executeDemoStep(stepNumber);
    await refreshPlatformData();
    return result;
  };

  // Toggle Background Music & Video Audio
  const handleToggleMusic = () => {
    const nextState = !isMusicPlaying;
    setIsMusicPlaying(nextState);
    if (videoRef.current) {
      videoRef.current.muted = !nextState;
      videoRef.current.volume = nextState ? 0.8 : 0;
      if (nextState) {
        videoRef.current.play().catch(e => console.log('Video audio play:', e));
        ambientSound.start();
      } else {
        ambientSound.stop();
      }
    }
  };

  // Reset Demo Database
  const handleResetSeed = async () => {
    await api.resetSeed();
    setDemoStep(1);
    await refreshPlatformData();
  };

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  return (
    <>
      {/* Full Layout Ambient Background Video */}
      <div className="layout-bg-video-container">
        <video
          ref={videoRef}
          autoPlay
          muted={!isMusicPlaying}
          loop
          playsInline
          className="layout-bg-video"
          src="/videos/farmer-guide.mp4"
        />
        <div className="layout-bg-overlay" />
      </div>

      <div className="app-container">
        {/* Top Navigation */}
      <Navbar 
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        onOpenDemoTour={() => setIsDemoTourOpen(true)}
        onOpenVoiceAssist={() => setIsVoiceAssistOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        onResetSeed={handleResetSeed}
        accessibilityMode={accessibilityMode}
        onToggleAccessibility={handleToggleAccessibility}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
      />

      {/* Guided Tour Quick Banner */}
      <div className="demo-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
            <PlayCircle size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '15px' }}>
                Interactive MVP Demonstration Scenario:
              </span>
              <span className="demo-step-badge">Step {demoStep} of 10</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Experience the complete pre-harvest lifecycle: 3 Tomato Farmers → FPO Aggregation → Hotel Matching → Pricing Waterfall & MNR → Digital QR Passport → Delivery & Escrow Payout.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setIsDemoTourOpen(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          <span>Launch 1-Click Tour</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Role-Based Dashboard Views */}
      <main>
        {currentRole === 'Farmer' && (
          <FarmerDashboard 
            farmer={farmers[0]}
            supplies={supplies}
            matches={matches}
            lots={lots}
            transactions={platformSummary?.transactions || []}
            onOpenDeclareModal={() => setIsDeclareOpen(true)}
            onOpenWaterfallModal={handleOpenWaterfall}
            onOpenPassportModal={handleOpenPassport}
            onAcceptCommitment={handleAcceptCommitment}
            currentLang={currentLang}
          />
        )}

        {currentRole === 'FPO' && (
          <FpoDashboard 
            fpo={fpos[0]}
            farmers={farmers}
            supplies={supplies}
            demands={demands}
            lots={lots}
            commitments={commitments}
            transactions={platformSummary?.transactions || []}
            onOpenPassportModal={handleOpenPassport}
            onOpenWaterfallModal={handleOpenWaterfall}
            onAggregateLot={handleAggregateLot}
            currentLang={currentLang}
          />
        )}

        {currentRole === 'Buyer' && (
          <BuyerDashboard 
            buyer={buyers[0]}
            demands={demands}
            matches={matches}
            lots={lots}
            commitments={commitments}
            onOpenDemandModal={() => setIsDemandOpen(true)}
            onOpenWaterfallModal={handleOpenWaterfall}
            onOpenPassportModal={handleOpenPassport}
            onAcceptDelivery={handleAcceptDelivery}
            currentLang={currentLang}
          />
        )}

        {currentRole === 'Admin' && (
          <AdminDashboard 
            summary={platformSummary}
            commodities={commodities}
            transactions={platformSummary?.transactions || []}
            lots={lots}
            onOpenWaterfallModal={handleOpenWaterfall}
          />
        )}
      </main>

      {/* Modals & Slide-overs */}
      <CropDeclarationWizard 
        isOpen={isDeclareOpen}
        onClose={() => setIsDeclareOpen(false)}
        onSubmit={handleCreateSupply}
        commodities={commodities}
      />

      <DemandRequestModal 
        isOpen={isDemandOpen}
        onClose={() => setIsDemandOpen(false)}
        onSubmit={handleCreateDemand}
        buyers={buyers}
      />

      <PricingWaterfallModal 
        isOpen={isWaterfallOpen}
        onClose={() => setIsWaterfallOpen(false)}
        initialBuyerPrice={waterfallModalProps.buyerPrice}
        cultivationCost={waterfallModalProps.cultivationCost}
        mnrFloor={waterfallModalProps.mnrFloor}
        commodity={waterfallModalProps.commodity}
      />

      <DigitalPassportModal 
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        lot={selectedLotForPassport || lots[0]}
      />

      <InteractiveDemoWizard 
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        currentStep={demoStep}
        onExecuteStep={handleExecuteDemoStep}
        onResetSeed={handleResetSeed}
        onSwitchRole={setCurrentRole}
        onOpenPassport={() => handleOpenPassport()}
        onOpenWaterfall={handleOpenWaterfall}
      />

      <VoiceAssistModal 
        isOpen={isVoiceAssistOpen}
        onClose={() => setIsVoiceAssistOpen(false)}
        currentLang={currentLang}
        farmerName={farmers[0]?.name || 'Ramesh Gowda'}
      />

      <AlertsDrawer 
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onMarkRead={id => api.markAlertRead(id)}
        onOpenWaterfall={handleOpenWaterfall}
        onOpenPassport={handleOpenPassport}
      />
    </div>
    </>
  );
}
