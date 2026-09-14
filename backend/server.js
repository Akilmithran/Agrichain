const express = require('express');
const cors = require('cors');
const {
  initialCommodities,
  initialFarmers,
  initialFpos,
  initialBuyers,
  initialSupplyDeclarations,
  initialDemandRequests,
  initialAlerts
} = require('./data/seedData');
const { calculateWaterfall, calculateMNR, evaluatePriceAgainstMNR } = require('./services/pricingService');
const { calculateMatchScore, findAlternativeBuyers } = require('./services/matchingService');
const { generateDigitalPassport } = require('./services/passportService');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-Memory Database Store with state resetting
let db = {
  commodities: [],
  farmers: [],
  fpos: [],
  buyers: [],
  supplyDeclarations: [],
  demandRequests: [],
  commitments: [],
  lots: [],
  transactions: [],
  alerts: [],
  demoStep: 0
};

// Reset database to initial state
async function resetDatabase() {
  db.commodities = JSON.parse(JSON.stringify(initialCommodities));
  db.farmers = JSON.parse(JSON.stringify(initialFarmers));
  db.fpos = JSON.parse(JSON.stringify(initialFpos));
  db.buyers = JSON.parse(JSON.stringify(initialBuyers));
  db.supplyDeclarations = JSON.parse(JSON.stringify(initialSupplyDeclarations));
  db.demandRequests = JSON.parse(JSON.stringify(initialDemandRequests));
  db.commitments = [];
  db.lots = [];
  db.transactions = [];
  db.alerts = JSON.parse(JSON.stringify(initialAlerts));
  db.demoStep = 0;

  console.log('Database initialized to default state.');
}

resetDatabase();

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AgriChain Direct API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      farmers: db.farmers.length,
      fpos: db.fpos.length,
      buyers: db.buyers.length,
      activeSupply: db.supplyDeclarations.length,
      activeDemand: db.demandRequests.length,
      lots: db.lots.length,
      demoStep: db.demoStep
    }
  });
});

// --- Reset / Seed Endpoint ---
app.get('/api/seed/reset', async (req, res) => {
  await resetDatabase();
  res.json({ success: true, message: 'Database state reset to default seed successfully', demoStep: db.demoStep });
});

// --- Commodities ---
app.get('/api/commodities', (req, res) => {
  res.json(db.commodities);
});

// --- Farmers ---
app.get('/api/farmers', (req, res) => {
  res.json(db.farmers);
});

app.get('/api/farmers/:id', (req, res) => {
  const farmer = db.farmers.find(f => f.id === req.params.id);
  if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
  
  const supply = db.supplyDeclarations.filter(s => s.farmerId === req.params.id);
  const lots = db.lots.filter(l => l.constituentFarmers?.some(cf => cf.farmerId === req.params.id));
  const alerts = db.alerts.filter(a => a.targetRole === 'Farmer' && (a.targetId === req.params.id || a.targetId === 'all'));

  res.json({ ...farmer, supply, lots, alerts });
});

// --- FPOs ---
app.get('/api/fpos', (req, res) => {
  res.json(db.fpos);
});

app.get('/api/fpos/:id', (req, res) => {
  const fpo = db.fpos.find(f => f.id === req.params.id);
  if (!fpo) return res.status(404).json({ error: 'FPO not found' });

  const members = db.farmers.filter(farmer => farmer.fpoId === req.params.id);
  const supply = db.supplyDeclarations.filter(s => s.fpoId === req.params.id);
  const lots = db.lots.filter(l => l.fpoId === req.params.id);
  const commitments = db.commitments.filter(c => c.fpoId === req.params.id);

  res.json({ ...fpo, members, supply, lots, commitments });
});

// --- Buyers ---
app.get('/api/buyers', (req, res) => {
  res.json(db.buyers);
});

app.get('/api/buyers/:id', (req, res) => {
  const buyer = db.buyers.find(b => b.id === req.params.id);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });

  const demand = db.demandRequests.filter(d => d.buyerId === req.params.id);
  const commitments = db.commitments.filter(c => c.buyerId === req.params.id);
  const lots = db.lots.filter(l => l.buyerId === req.params.id);

  res.json({ ...buyer, demand, commitments, lots });
});

// --- Supply Declarations ---
app.get('/api/supply', (req, res) => {
  res.json(db.supplyDeclarations);
});

app.post('/api/supply', (req, res) => {
  const {
    farmerId,
    commodity,
    variety,
    cultivatedAreaAcres,
    expectedYieldKg,
    marketableQuantityKg,
    harvestWindowStart,
    harvestWindowEnd,
    farmLocation,
    expectedGrade,
    cultivationCostPerKg,
    minAcceptableNetPrice,
    fpoId
  } = req.body;

  const farmer = db.farmers.find(f => f.id === farmerId) || { name: 'Registered Farmer' };
  const comm = db.commodities.find(c => c.name.toLowerCase() === (commodity || '').toLowerCase()) || { category: 'highly_perishable' };

  const newSupply = {
    id: `sup-${Date.now()}`,
    farmerId: farmerId || 'farmer-1',
    farmerName: farmer.name,
    commodity: commodity || 'Tomato',
    variety: variety || 'Standard Hybrid',
    category: comm.category,
    cultivatedAreaAcres: Number(cultivatedAreaAcres) || 1.0,
    expectedYieldKg: Number(expectedYieldKg) || 1000,
    marketableQuantityKg: Number(marketableQuantityKg) || Number(expectedYieldKg) || 1000,
    harvestWindowStart: harvestWindowStart || '2026-11-10',
    harvestWindowEnd: harvestWindowEnd || '2026-11-20',
    farmLocation: farmLocation || farmer.village || 'Kolar Cluster',
    expectedGrade: expectedGrade || 'Grade A',
    cultivationCostPerKg: Number(cultivationCostPerKg) || 12.00,
    minAcceptableNetPrice: Number(minAcceptableNetPrice) || 16.00,
    status: 'Planned Supply',
    fpoId: fpoId || 'fpo-1',
    createdAt: new Date().toISOString()
  };

  db.supplyDeclarations.unshift(newSupply);

  // Trigger matching check
  db.alerts.unshift({
    id: `alt-${Date.now()}`,
    targetRole: 'Farmer',
    targetId: newSupply.farmerId,
    type: 'NEW_MATCH',
    title: `Pre-Harvest Declaration Logged (${newSupply.commodity})`,
    message: `Declared ${newSupply.marketableQuantityKg}kg ${newSupply.commodity} for harvest ${newSupply.harvestWindowStart}. AI matching actively scanning buyer requests.`,
    severity: 'info',
    isRead: false,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newSupply);
});

// --- Demand Requests ---
app.get('/api/demand', (req, res) => {
  res.json(db.demandRequests);
});

app.post('/api/demand', (req, res) => {
  const {
    buyerId,
    commodity,
    variety,
    requiredQuantityKg,
    qualityGrade,
    maxPricePerKg,
    deliveryLocation,
    deliveryDate,
    isRecurring,
    recurrencePattern,
    packagingRequirements,
    paymentTerms,
    cancellationTerms,
    acceptedSubstitutes
  } = req.body;

  const buyer = db.buyers.find(b => b.id === buyerId) || { name: 'Institutional Buyer', type: 'Supermarket' };

  const newDemand = {
    id: `dem-${Date.now()}`,
    buyerId: buyerId || 'buyer-1',
    buyerName: buyer.name,
    buyerType: buyer.type,
    commodity: commodity || 'Tomato',
    variety: variety || 'Any Grade A',
    requiredQuantityKg: Number(requiredQuantityKg) || 1000,
    qualityGrade: qualityGrade || 'Grade A',
    maxPricePerKg: Number(maxPricePerKg) || 28.00,
    deliveryLocation: deliveryLocation || buyer.location || 'Bengaluru',
    deliveryDate: deliveryDate || '2026-11-18',
    isRecurring: Boolean(isRecurring),
    recurrencePattern: recurrencePattern || 'Weekly',
    packagingRequirements: packagingRequirements || 'Ventilated 20kg crates',
    paymentTerms: paymentTerms || 'Instant Escrow Settlement on Digital Acceptance (T+0)',
    cancellationTerms: cancellationTerms || '48h notice prior to harvest dispatch',
    acceptedSubstitutes: acceptedSubstitutes || 'None',
    status: 'Open',
    createdAt: new Date().toISOString()
  };

  db.demandRequests.unshift(newDemand);

  res.status(201).json(newDemand);
});

// --- AI Supply-Demand Matching Engine ---
app.get('/api/matching/auto-match', (req, res) => {
  const matches = [];

  for (const demand of db.demandRequests) {
    if (demand.status === 'Cancelled' || demand.status === 'Fulfilled') continue;

    const buyer = db.buyers.find(b => b.id === demand.buyerId) || { reliabilityScore: 90 };

    // Check individual supplies
    const compatibleSupplies = db.supplyDeclarations.filter(
      s => s.commodity.toLowerCase() === demand.commodity.toLowerCase() && s.status !== 'Delivered Quantity'
    );

    // Also check combined FPO aggregation feasibility
    const totalAvailableTomatoQty = compatibleSupplies.reduce((acc, curr) => acc + curr.marketableQuantityKg, 0);

    for (const supply of compatibleSupplies) {
      const match = calculateMatchScore({ supply, demand, buyer, farmerOrFpo: null });
      if (match.score >= 50) {
        matches.push({
          demandId: demand.id,
          demand,
          supplyId: supply.id,
          supply,
          buyer,
          matchScore: match.score,
          breakdown: match.breakdown,
          confidenceGrade: match.confidenceGrade,
          isCompatible: match.isCompatible,
          mnrEvaluation: match.mnrEvaluation,
          aiRecommendationReason: match.aiRecommendationReason
        });
      }
    }

    // Check FPO Aggregation Fit for full demand
    if (totalAvailableTomatoQty >= demand.requiredQuantityKg && compatibleSupplies.length > 1) {
      const fpo = db.fpos[0];
      const aggregatedSupplyMock = {
        commodity: demand.commodity,
        variety: demand.variety,
        category: 'highly_perishable',
        totalQuantityKg: demand.requiredQuantityKg,
        marketableQuantityKg: demand.requiredQuantityKg,
        expectedGrade: demand.qualityGrade,
        harvestWindowStart: compatibleSupplies[0].harvestWindowStart,
        harvestWindowEnd: compatibleSupplies[0].harvestWindowEnd,
        farmLocation: 'Kolar FPO Cluster Hub',
        cultivationCostPerKg: 12.10,
        minAcceptableNetPrice: 16.10
      };

      const aggMatch = calculateMatchScore({ supply: aggregatedSupplyMock, demand, buyer, farmerOrFpo: fpo });
      matches.unshift({
        isAggregatedFpoMatch: true,
        fpoId: fpo.id,
        fpoName: fpo.name,
        demandId: demand.id,
        demand,
        constituentSupplies: compatibleSupplies,
        totalAggregatedQty: totalAvailableTomatoQty,
        matchScore: aggMatch.score,
        breakdown: aggMatch.breakdown,
        confidenceGrade: aggMatch.confidenceGrade,
        isCompatible: aggMatch.isCompatible,
        mnrEvaluation: aggMatch.mnrEvaluation,
        aiRecommendationReason: `Optimal 3-Farmer FPO Aggregation: Farmers Ramesh (300kg) + Suresh (500kg) + Lakshmi (700kg) perfectly satisfy ${demand.buyerName}'s ${demand.requiredQuantityKg}kg weekly requirement with ${aggMatch.score}% AI match score.`
      });
    }
  }

  res.json({
    totalMatches: matches.length,
    matches: matches.sort((a, b) => b.matchScore - a.matchScore)
  });
});

// --- Find Alternative Buyers Fallback ---
app.post('/api/matching/find-alternatives', (req, res) => {
  const { supplyDeclarationId, lotId } = req.body;
  let supply = null;

  if (supplyDeclarationId) {
    supply = db.supplyDeclarations.find(s => s.id === supplyDeclarationId);
  } else if (lotId) {
    const lot = db.lots.find(l => l.id === lotId);
    if (lot) {
      supply = {
        commodity: lot.commodity,
        variety: lot.variety,
        category: lot.category,
        marketableQuantityKg: lot.totalQuantityKg,
        expectedGrade: lot.grade,
        harvestWindowStart: lot.collectionDate,
        harvestWindowEnd: lot.collectionDate,
        farmLocation: lot.collectionCentre,
        cultivationCostPerKg: 12.10,
        minAcceptableNetPrice: 16.10
      };
    }
  }

  if (!supply) {
    supply = db.supplyDeclarations[0];
  }

  const alternatives = findAlternativeBuyers({
    supply,
    availableBuyers: db.buyers,
    allDemands: db.demandRequests
  });

  res.json({
    supplyEvaluated: supply,
    alternativesFound: alternatives.length,
    alternatives
  });
});

// --- Pricing Waterfall & MNR Evaluation Endpoints ---
app.post('/api/pricing/calculate-waterfall', (req, res) => {
  const { buyerPricePerKg, commodityCategory, isColdStorageUsed, customDeductions } = req.body;
  const result = calculateWaterfall({
    buyerPricePerKg,
    commodityCategory,
    isColdStorageUsed,
    customDeductions
  });
  res.json(result);
});

app.post('/api/pricing/evaluate-mnr', (req, res) => {
  const {
    buyerPricePerKg,
    verifiedCultivationCost,
    mspFloor,
    minimumMarginPercent,
    negotiatedContractFloor,
    commodityCategory,
    isColdStorageUsed
  } = req.body;

  const result = evaluatePriceAgainstMNR({
    buyerPricePerKg,
    verifiedCultivationCost,
    mspFloor,
    minimumMarginPercent,
    negotiatedContractFloor,
    commodityCategory,
    isColdStorageUsed
  });

  res.json(result);
});

// --- Commitments ---
app.get('/api/commitments', (req, res) => {
  res.json(db.commitments);
});

app.post('/api/commitments/create', async (req, res) => {
  const { demandRequestId, fpoId, supplyDeclarationIds, agreedBuyerPrice } = req.body;

  const demand = db.demandRequests.find(d => d.id === demandRequestId) || db.demandRequests[0];
  const fpo = db.fpos.find(f => f.id === fpoId) || db.fpos[0];
  const supplies = db.supplyDeclarations.filter(s => supplyDeclarationIds?.includes(s.id) || ['sup-1', 'sup-2', 'sup-3'].includes(s.id));

  const totalQuantityKg = supplies.reduce((acc, curr) => acc + curr.marketableQuantityKg, 0);
  const buyerPrice = Number(agreedBuyerPrice || demand.maxPricePerKg || 28.00);

  const waterfall = calculateWaterfall({ buyerPricePerKg: buyerPrice, commodityCategory: 'highly_perishable' });

  const farmerContributions = supplies.map(s => {
    const mnrEval = evaluatePriceAgainstMNR({
      buyerPricePerKg: buyerPrice,
      verifiedCultivationCost: s.cultivationCostPerKg,
      mspFloor: 14.00,
      minimumMarginPercent: 20,
      negotiatedContractFloor: s.minAcceptableNetPrice
    });

    return {
      farmerId: s.farmerId,
      farmerName: s.farmerName,
      quantityKg: s.marketableQuantityKg,
      cultivationCostPerKg: s.cultivationCostPerKg,
      minAcceptableNetPrice: s.minAcceptableNetPrice,
      netRealizationPerKg: waterfall.farmerNetRealization,
      payoutDue: Number((s.marketableQuantityKg * waterfall.farmerNetRealization).toFixed(2)),
      mnrFloor: mnrEval.mnrData.mnr,
      mnrPassed: mnrEval.isProtected
    };
  });

  const commitment = {
    id: `com-${Date.now()}`,
    commitmentNumber: `AGRI-CC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    demandRequestId: demand.id,
    buyerId: demand.buyerId,
    buyerName: demand.buyerName,
    fpoId: fpo.id,
    fpoName: fpo.name,
    commodity: demand.commodity,
    variety: demand.variety,
    grade: demand.qualityGrade,
    totalQuantityKg,
    agreedBuyerPrice: buyerPrice,
    waterfall,
    farmerContributions,
    status: 'Signed',
    deliveryDate: demand.deliveryDate,
    createdAt: new Date().toISOString()
  };

  db.commitments.unshift(commitment);
  demand.status = 'Committed';

  // Update supply status to Confirmed Supply
  supplies.forEach(s => {
    s.status = 'Confirmed Supply';
    s.commitmentId = commitment.id;
  });

  // Alert all parties
  supplies.forEach(s => {
    db.alerts.unshift({
      id: `alt-${Date.now()}-${s.id}`,
      targetRole: 'Farmer',
      targetId: s.farmerId,
      type: 'NEW_MATCH',
      title: 'Conditional Supply Commitment Signed!',
      message: `Your ${s.marketableQuantityKg}kg ${s.commodity} has been locked with ${demand.buyerName} at ₹${buyerPrice}/kg (Net Realization: ₹${waterfall.farmerNetRealization}/kg).`,
      severity: 'success',
      isRead: false,
      timestamp: new Date().toISOString()
    });
  });

  res.status(201).json(commitment);
});

// --- FPO Lot Aggregation & Digital Lot Passports ---
app.get('/api/lots', (req, res) => {
  res.json(db.lots);
});

app.post('/api/lots/aggregate', async (req, res) => {
  const {
    fpoId,
    collectionCentre,
    commodity,
    variety,
    grade,
    constituentFarmers, // array of { farmerId, farmerName, quantityKg, intakeDate, weighedKg }
    commitmentId,
    buyerId,
    buyerName,
    qualityMetrics,
    storageDetails
  } = req.body;

  const fpo = db.fpos.find(f => f.id === fpoId) || db.fpos[0];
  const lotNumber = `AGRI-LOT-${Math.floor(1000 + Math.random() * 9000)}`;

  const totalQuantityKg = (constituentFarmers || []).reduce((acc, curr) => acc + Number(curr.quantityKg || 0), 0);

  const lotDraft = {
    lotNumber,
    fpoId: fpo.id,
    fpoName: fpo.name,
    collectionCentre: collectionCentre || 'Kolar Central Aggregation Hub',
    commodity: commodity || 'Tomato',
    variety: variety || 'Shivam Hybrid',
    grade: grade || 'Grade A (Export / Institutional)',
    category: 'highly_perishable',
    totalQuantityKg: totalQuantityKg || 1500,
    constituentFarmers: constituentFarmers || [
      { farmerId: 'farmer-1', farmerName: 'Ramesh Gowda', quantityKg: 300, cultivationCostPerKg: 12.00, netRealizationPerKg: 22.16 },
      { farmerId: 'farmer-2', farmerName: 'Suresh Patil', quantityKg: 500, cultivationCostPerKg: 12.50, netRealizationPerKg: 22.16 },
      { farmerId: 'farmer-3', farmerName: 'Lakshmi Devi', quantityKg: 700, cultivationCostPerKg: 11.80, netRealizationPerKg: 22.16 }
    ],
    collectionDate: new Date().toISOString().split('T')[0],
    buyerId: buyerId || 'buyer-1',
    buyerName: buyerName || 'Grand Hyatt Regency & Luxury Cafeterias',
    commitmentId: commitmentId || 'com-1',
    qualityMetrics: qualityMetrics || {
      brix: 5.4,
      firmness: '4.9 kg/cm²',
      sizeRange: '55 - 65 mm (Uniform)',
      defectRatePercent: 0.8,
      moisturePercent: 91.2,
      pesticideResidueFree: true,
      inspectionScorePercent: 97,
      inspectorName: 'Dr. H. Anand (Chief Quality Agronomist)',
      inspectorNotes: 'High-grade uniform harvesting with cold pre-cooling completed within 2 hours of gate intake.'
    },
    storageDetails: storageDetails || {
      facilityType: 'FPO Cold Pre-Cooling Hub (Reefer Staging)',
      temperatureCelsius: '12.0°C',
      humidityPercent: '88% RH',
      entryDate: new Date().toISOString().split('T')[0],
      maxSafeShelfLifeDays: 12
    },
    dispatchStatus: 'Aggregated & Graded',
    paymentStatus: 'Escrow_Funded'
  };

  const digitalPassport = await generateDigitalPassport(lotDraft);
  const lot = { id: `lot-${Date.now()}`, ...digitalPassport };

  db.lots.unshift(lot);

  // Update corresponding supplies to Harvested Supply / Available Inventory
  if (constituentFarmers && constituentFarmers.length > 0) {
    constituentFarmers.forEach(cf => {
      const sup = db.supplyDeclarations.find(s => s.farmerId === cf.farmerId && s.commodity.toLowerCase() === lot.commodity.toLowerCase());
      if (sup) {
        sup.status = 'Harvested Supply';
        sup.lotId = lot.id;
      }
    });
  }

  // Add notification
  db.alerts.unshift({
    id: `alt-${Date.now()}`,
    targetRole: 'FPO',
    targetId: fpo.id,
    type: 'NEW_MATCH',
    title: `Digital Lot Passport Generated: ${lot.lotNumber}`,
    message: `Aggregated ${lot.totalQuantityKg}kg ${lot.commodity} from 3 farmers. Quality Score: ${lot.qualityMetrics.inspectionScorePercent}%. QR Code active.`,
    severity: 'success',
    isRead: false,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(lot);
});

// --- Delivery & Escrow Settlement ---
app.post('/api/lots/:id/accept-delivery', (req, res) => {
  const lot = db.lots.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ error: 'Lot not found' });

  const { buyerSignature, feedbackNotes, acceptedQtyKg } = req.body;

  lot.dispatchStatus = 'Accepted';
  lot.paymentStatus = 'Settled';
  lot.deliveryConfirmation = {
    receivedAt: new Date().toISOString(),
    acceptedQtyKg: Number(acceptedQtyKg || lot.totalQuantityKg),
    inspectionPass: true,
    buyerSignature: buyerSignature || 'Vikram Malhotra (Exec Chef / Procurement Lead)',
    feedbackNotes: feedbackNotes || 'Produce inspected and accepted in pristine condition. Brix and freshness exceeded expectations.'
  };

  // Create financial transaction & escrow release
  const buyerPrice = 28.00;
  const waterfall = calculateWaterfall({ buyerPricePerKg: buyerPrice, commodityCategory: lot.category });
  const totalAmount = Number((lot.totalQuantityKg * buyerPrice).toFixed(2));

  const transaction = {
    id: `tx-${Date.now()}`,
    orderId: `ORD-${lot.lotNumber}`,
    lotId: lot.id,
    lotNumber: lot.lotNumber,
    buyerId: lot.buyerId,
    buyerName: lot.buyerName,
    fpoId: lot.fpoId,
    totalGrossAmount: totalAmount,
    priceWaterfall: waterfall,
    farmerPayouts: lot.constituentFarmers.map(cf => ({
      farmerId: cf.farmerId,
      farmerName: cf.farmerName,
      quantityKg: cf.quantityKg,
      netPricePerKg: waterfall.farmerNetRealization,
      payoutAmount: Number((cf.quantityKg * waterfall.farmerNetRealization).toFixed(2)),
      payoutStatus: 'Transferred_Direct_To_Bank_Account'
    })),
    platformFeeCollected: Number((lot.totalQuantityKg * waterfall.platformFee).toFixed(2)),
    settlementStatus: 'Settled',
    settlementTimestamp: new Date().toISOString(),
    escrowTxHash: `0x${Math.random().toString(16).substr(2, 32)}`
  };

  db.transactions.unshift(transaction);

  // Update supply status to Delivered Quantity
  lot.constituentFarmers.forEach(cf => {
    const sup = db.supplyDeclarations.find(s => s.farmerId === cf.farmerId);
    if (sup) sup.status = 'Delivered Quantity';

    db.alerts.unshift({
      id: `alt-${Date.now()}-${cf.farmerId}`,
      targetRole: 'Farmer',
      targetId: cf.farmerId,
      type: 'PAYMENT_RELEASED',
      title: 'Payment Released to Bank Account!',
      message: `Buyer accepted delivery for Lot ${lot.lotNumber}. ₹${Number((cf.quantityKg * waterfall.farmerNetRealization).toFixed(2)).toLocaleString()} credited at ₹${waterfall.farmerNetRealization}/kg.`,
      severity: 'success',
      isRead: false,
      timestamp: new Date().toISOString()
    });
  });

  res.json({ success: true, lot, transaction });
});

// --- Alerts ---
app.get('/api/alerts', (req, res) => {
  const { role, id } = req.query;
  let filtered = db.alerts;

  if (role) {
    filtered = filtered.filter(a => a.targetRole === role || a.targetRole === 'All');
  }
  if (id) {
    filtered = filtered.filter(a => a.targetId === id || a.targetId === 'all' || !a.targetId);
  }

  res.json(filtered);
});

app.patch('/api/alerts/:id/read', (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  if (alert) alert.isRead = true;
  res.json({ success: true, alert });
});

// --- Platform Analytics Summary ---
app.get('/api/analytics/platform-summary', (req, res) => {
  const totalSupplyKg = db.supplyDeclarations.reduce((acc, curr) => acc + curr.marketableQuantityKg, 0);
  const totalDemandKg = db.demandRequests.reduce((acc, curr) => acc + curr.requiredQuantityKg, 0);
  const totalVolumeSettled = db.transactions.reduce((acc, curr) => acc + curr.totalGrossAmount, 0);
  const platformRevenue = db.transactions.reduce((acc, curr) => acc + curr.platformFeeCollected, 0);

  res.json({
    totalFarmers: db.farmers.length,
    totalFpos: db.fpos.length,
    totalBuyers: db.buyers.length,
    totalSupplyKg,
    totalDemandKg,
    activeCommitments: db.commitments.length,
    activeLots: db.lots.length,
    totalVolumeSettled,
    platformRevenue,
    mnrProtectionRate: '100%',
    averageFarmerRealizationIncreasePercent: 22.4, // Compared to traditional uncoordinated mandi spot sales
    wastageReductionPercent: 31.8
  });
});

// --- Step-by-Step Interactive Demo Scenario Engine ---
app.post('/api/demo/step/:stepIndex', async (req, res) => {
  const stepIndex = parseInt(req.params.stepIndex, 10);
  db.demoStep = stepIndex;

  let stepDescription = '';
  let activeStateSummary = {};

  switch (stepIndex) {
    case 1:
      // Step 1: Farmers Ramesh, Suresh, Lakshmi declare tomato cultivation
      await resetDatabase();
      db.demoStep = 1;
      stepDescription = '3 Farmers (Ramesh 300kg, Suresh 500kg, Lakshmi 700kg) declared planned Tomato cultivation for Nov 10-20.';
      activeStateSummary = {
        declaredFarmers: ['Ramesh Gowda (300 kg)', 'Suresh Patil (500 kg)', 'Lakshmi Devi (700 kg)'],
        totalPlannedSupplyKg: 1500,
        status: 'Planned Supply'
      };
      break;

    case 2:
      // Step 2: Buyer Grand Hyatt Regency submits weekly 1,500kg tomato demand
      stepDescription = 'Buyer Grand Hyatt Regency posted a demand for 1,500 kg/week Grade A Tomatoes at max ₹28.00/kg.';
      activeStateSummary = {
        buyer: 'Grand Hyatt Regency & Luxury Cafeterias',
        requiredQuantityKg: 1500,
        maxPricePerKg: 28.00,
        deliveryDate: '2026-11-18'
      };
      break;

    case 3:
      // Step 3: AI Matching Engine executes multi-factor compatibility
      stepDescription = 'AI Supply-Demand Matching Engine identified 96% compatibility between Kolar FPO 3-farmer cluster and Grand Hyatt Regency.';
      activeStateSummary = {
        matchScore: 96,
        confidence: 'A+ (Optimal Match)',
        factors: {
          commodityMatch: '25/25 (Shivam Hybrid)',
          gradeMatch: '15/15 (Grade A)',
          windowMatch: '20/20 (Harvest Nov 10-20 vs Delivery Nov 18)',
          quantityFit: '15/15 (300+500+700 = exactly 1,500 kg)',
          buyerReliability: '14.7/15 (98% Reliability Score)',
          proximity: '10/10 (Kolar to Outer Ring Road)'
        }
      };
      break;

    case 4:
      // Step 4: Transparent Pricing Waterfall & MNR Protection Evaluation
      stepDescription = 'Pricing engine calculated full waterfall deductions. Farmer Net Realization = ₹22.16/kg. Checked against MNR floor (₹16.50/kg) -> PASSED.';
      activeStateSummary = {
        buyerPrice: 28.00,
        mandiBenchmark: 22.96,
        deductions: {
          collectionCost: 1.20,
          gradingPacking: 1.80,
          storageCost: 0.00,
          platformFee: 0.84,
          riskReserve: 0.56,
          totalDeductions: 5.84
        },
        farmerNetRealization: 22.16,
        mnrFloor: 16.50,
        mnrStatus: 'PASSED_PROTECTION (+₹5.66/kg above farmer cost+margin floor)'
      };
      break;

    case 5:
      // Step 5: Conditional Supply Commitment Signed
      const supplies = db.supplyDeclarations.slice(0, 3);
      const waterfall = calculateWaterfall({ buyerPricePerKg: 28.00 });
      const commitment = {
        id: 'com-demo-1',
        commitmentNumber: 'AGRI-CC-2026-9021',
        demandRequestId: 'dem-1',
        buyerId: 'buyer-1',
        buyerName: 'Grand Hyatt Regency & Luxury Cafeterias',
        fpoId: 'fpo-1',
        fpoName: 'GreenHarvest Farmers Producer Co. Ltd.',
        commodity: 'Tomato',
        variety: 'Shivam Hybrid',
        grade: 'Grade A',
        totalQuantityKg: 1500,
        agreedBuyerPrice: 28.00,
        waterfall,
        farmerContributions: supplies.map(s => ({
          farmerId: s.farmerId,
          farmerName: s.farmerName,
          quantityKg: s.marketableQuantityKg,
          cultivationCostPerKg: s.cultivationCostPerKg,
          netRealizationPerKg: waterfall.farmerNetRealization,
          payoutDue: s.marketableQuantityKg * waterfall.farmerNetRealization,
          mnrFloor: s.minAcceptableNetPrice,
          mnrPassed: true
        })),
        status: 'Signed',
        deliveryDate: '2026-11-18',
        createdAt: new Date().toISOString()
      };
      db.commitments = [commitment];
      supplies.forEach(s => { s.status = 'Confirmed Supply'; s.commitmentId = commitment.id; });
      stepDescription = 'Conditional Supply Commitment AGRI-CC-2026-9021 signed by Buyer and FPO. Supplies locked in Confirmed state.';
      activeStateSummary = { commitmentNumber: commitment.commitmentNumber, totalKg: 1500, lockedNetPrice: 22.16 };
      break;

    case 6:
      // Step 6: Harvest Logged & FPO Aggregation Lot Created
      const lotDraft = {
        lotNumber: 'AGRI-LOT-9021',
        fpoId: 'fpo-1',
        fpoName: 'GreenHarvest Farmers Producer Co. Ltd.',
        collectionCentre: 'Kolar Central Aggregation Hub',
        commodity: 'Tomato',
        variety: 'Shivam Hybrid',
        grade: 'Grade A (Export / Institutional)',
        category: 'highly_perishable',
        totalQuantityKg: 1500,
        constituentFarmers: [
          { farmerId: 'farmer-1', farmerName: 'Ramesh Gowda', quantityKg: 300, intakeDate: '2026-11-17', cultivationCostPerKg: 12.00, netRealizationPerKg: 22.16 },
          { farmerId: 'farmer-2', farmerName: 'Suresh Patil', quantityKg: 500, intakeDate: '2026-11-17', cultivationCostPerKg: 12.50, netRealizationPerKg: 22.16 },
          { farmerId: 'farmer-3', farmerName: 'Lakshmi Devi', quantityKg: 700, intakeDate: '2026-11-17', cultivationCostPerKg: 11.80, netRealizationPerKg: 22.16 }
        ],
        collectionDate: '2026-11-17',
        buyerId: 'buyer-1',
        buyerName: 'Grand Hyatt Regency & Luxury Cafeterias',
        commitmentId: 'com-demo-1',
        dispatchStatus: 'Aggregated & Cold Pre-Cooled',
        paymentStatus: 'Escrow_Funded'
      };
      const lot = await generateDigitalPassport(lotDraft);
      lot.id = 'lot-demo-1';
      db.lots = [lot];
      db.supplyDeclarations.slice(0, 3).forEach(s => { s.status = 'Harvested Supply'; s.lotId = lot.id; });
      stepDescription = 'Harvest logged. FPO aggregated 300kg + 500kg + 700kg into Lot AGRI-LOT-9021. Digital Lot Passport with live QR code generated.';
      activeStateSummary = { lotNumber: lot.lotNumber, qrReady: true, passportId: lot.passportId, qualityScore: 96 };
      break;

    case 7:
      // Step 7: Grading & Quality Inspection Verified
      if (db.lots[0]) {
        db.lots[0].dispatchStatus = 'Graded & Quality Certified (In-Transit)';
        db.lots[0].qualityMetrics.inspectionScorePercent = 97;
      }
      stepDescription = 'Agronomist inspection passed with 97% score (Brix 5.4, Firmness 4.9 kg/cm²). Lot dispatched in cold reefer truck.';
      activeStateSummary = { status: 'In-Transit to Grand Hyatt Regency', coldChainTemp: '12.0°C Maintained' };
      break;

    case 8:
      // Step 8: Buyer Receiving & Quality Confirmation
      if (db.lots[0]) {
        db.lots[0].dispatchStatus = 'Accepted';
        db.lots[0].paymentStatus = 'Settled';
        db.lots[0].deliveryConfirmation = {
          receivedAt: '2026-11-18T07:15:00Z',
          acceptedQtyKg: 1500,
          inspectionPass: true,
          buyerSignature: 'Chef Vikram Malhotra (Exec Chef / Culinary Procurement)',
          feedbackNotes: 'All 75 crates verified. Zero transit damage, exceptional firmness and uniform color.'
        };
      }
      const wf = calculateWaterfall({ buyerPricePerKg: 28.00 });
      const tx = {
        id: 'tx-demo-1',
        orderId: 'ORD-AGRI-LOT-9021',
        lotId: db.lots[0]?.id || 'lot-demo-1',
        lotNumber: 'AGRI-LOT-9021',
        buyerId: 'buyer-1',
        buyerName: 'Grand Hyatt Regency & Luxury Cafeterias',
        fpoId: 'fpo-1',
        totalGrossAmount: 42000.00,
        priceWaterfall: wf,
        farmerPayouts: [
          { farmerId: 'farmer-1', farmerName: 'Ramesh Gowda', quantityKg: 300, netPricePerKg: 22.16, payoutAmount: 6648.00, payoutStatus: 'Direct_Bank_Credit_Settled' },
          { farmerId: 'farmer-2', farmerName: 'Suresh Patil', quantityKg: 500, netPricePerKg: 22.16, payoutAmount: 11080.00, payoutStatus: 'Direct_Bank_Credit_Settled' },
          { farmerId: 'farmer-3', farmerName: 'Lakshmi Devi', quantityKg: 700, netPricePerKg: 22.16, payoutAmount: 15512.00, payoutStatus: 'Direct_Bank_Credit_Settled' }
        ],
        platformFeeCollected: 1260.00,
        settlementStatus: 'Settled',
        settlementTimestamp: new Date().toISOString(),
        escrowTxHash: '0x9a8f2e14bc7839d0124567ef890123456789abcd'
      };
      db.transactions = [tx];
      db.supplyDeclarations.slice(0, 3).forEach(s => { s.status = 'Delivered Quantity'; });
      stepDescription = 'Buyer Chef Vikram Malhotra scanned QR code, confirmed digital acceptance. Escrow automatically released ₹33,240 directly to the 3 constituent farmers.';
      activeStateSummary = { totalSettled: 42000, farmerPayoutTotal: 33240, status: 'Settled via Instant Escrow' };
      break;

    case 9:
      // Step 9: Cancellation & Price Drop Resilience Simulation
      // Simulate buyer cancellation or price drop, triggering AI Fallback
      stepDescription = 'Resilience Test: Simulated primary buyer cancellation. AI Fallback Engine instantly activated, discovering Metro Cash & Carry at ₹28.50/kg (+₹0.50/kg higher!).';
      const fallbackList = findAlternativeBuyers({
        supply: db.supplyDeclarations[0],
        availableBuyers: db.buyers,
        allDemands: db.demandRequests
      });
      activeStateSummary = {
        event: 'Primary Buyer Cancellation Triggered',
        fallbackEngineActivated: true,
        recommendedBuyer: 'Metro Cash & Carry Wholesale',
        fallbackOfferPrice: 28.50,
        alternativeNetRealization: 22.66,
        recoveryTimeSec: 0.4
      };
      break;

    case 10:
      // Step 10: Full Cycle Completed & Summary Review
      stepDescription = 'Complete end-to-end AgriChain Direct workflow validated with 100% transparency, zero middlemen distress sales, and full traceability.';
      activeStateSummary = {
        workflowCompleted: true,
        farmerNetGainVsMandi: '+₹4,980 (+22.4%)',
        foodWastageRecorded: '0 kg (100% pre-harvest matched)',
        transparencyRating: '100% On-Chain Escrow & QR Pedigree'
      };
      break;

    default:
      stepDescription = 'Standard platform operation.';
  }

  res.json({
    success: true,
    demoStep: db.demoStep,
    stepDescription,
    activeStateSummary,
    currentState: {
      supplies: db.supplyDeclarations,
      commitments: db.commitments,
      lots: db.lots,
      transactions: db.transactions,
      alerts: db.alerts
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AgriChain Direct Backend running on port ${PORT}`);
  });
}

module.exports = app;
