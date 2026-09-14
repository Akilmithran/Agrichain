// AI Supply-Demand Matching Engine and Alternative Buyer Recommender

const { evaluatePriceAgainstMNR } = require('./pricingService');

/**
 * Calculate multi-factor compatibility score between a Demand Request and Supply Declarations/FPO Lots
 */
function calculateMatchScore({ supply, demand, buyer, farmerOrFpo }) {
  let score = 0;
  let breakdown = {
    commodityMatch: 0,
    gradeMatch: 0,
    windowMatch: 0,
    quantityFit: 0,
    proximityFit: 0,
    buyerReliability: 0,
    priceFeasibility: 0
  };

  // 1. Commodity & Variety match (Weight: 25)
  if (supply.commodity.toLowerCase() === demand.commodity.toLowerCase()) {
    breakdown.commodityMatch = 20;
    if (supply.variety && demand.variety && supply.variety.toLowerCase() === demand.variety.toLowerCase()) {
      breakdown.commodityMatch += 5;
    } else if (!demand.variety || demand.variety === 'Any') {
      breakdown.commodityMatch += 5;
    }
  } else {
    return { score: 0, breakdown, isCompatible: false, reason: 'Commodity mismatch' };
  }

  // 2. Grade Compatibility (Weight: 15)
  if (supply.expectedGrade === demand.qualityGrade || supply.grade === demand.qualityGrade) {
    breakdown.gradeMatch = 15;
  } else if ((supply.expectedGrade === 'Grade A' || supply.grade === 'Grade A') && demand.qualityGrade === 'Grade B') {
    breakdown.gradeMatch = 13; // Higher grade accepted
  } else if (demand.qualityGrade === 'Any' || !demand.qualityGrade) {
    breakdown.gradeMatch = 15;
  } else {
    breakdown.gradeMatch = 5;
  }

  // 3. Harvest Window vs Delivery Date Window (Weight: 20)
  const supplyStart = new Date(supply.harvestWindowStart || supply.collectionDate || Date.now()).getTime();
  const supplyEnd = new Date(supply.harvestWindowEnd || supply.collectionDate || Date.now() + 7 * 86400000).getTime();
  const demandDelivery = new Date(demand.deliveryDate || Date.now() + 3 * 86400000).getTime();

  // If delivery date falls within or immediately following (within 3 days) the harvest window
  if (demandDelivery >= supplyStart - 86400000 && demandDelivery <= supplyEnd + (3 * 86400000)) {
    breakdown.windowMatch = 20;
  } else {
    const diffDays = Math.abs(demandDelivery - supplyStart) / (1000 * 3600 * 24);
    if (diffDays <= 7) {
      breakdown.windowMatch = 12;
    } else {
      breakdown.windowMatch = 4;
    }
  }

  // 4. Quantity Fit / Aggregation Compatibility (Weight: 15)
  const supplyQty = Number(supply.marketableQuantityKg || supply.totalQuantityKg || supply.expectedYieldKg || 0);
  const demandQty = Number(demand.requiredQuantityKg || 0);

  if (supplyQty >= demandQty && supplyQty <= demandQty * 1.3) {
    breakdown.quantityFit = 15; // Exact or near-exact fit
  } else if (supplyQty >= demandQty) {
    breakdown.quantityFit = 12; // Surplus available for other buyers
  } else if (supplyQty >= demandQty * 0.4) {
    breakdown.quantityFit = 10; // Suitable for FPO aggregation combination
  } else {
    breakdown.quantityFit = 5;
  }

  // 5. Geographic Proximity Fit (Weight: 10)
  const buyerLoc = (demand.deliveryLocation || buyer?.location || '').toLowerCase();
  const farmLoc = (supply.farmLocation || supply.collectionCentre || '').toLowerCase();
  if (buyerLoc && farmLoc && (buyerLoc.includes(farmLoc) || farmLoc.includes(buyerLoc) || farmLoc.includes('bengaluru') && buyerLoc.includes('bengaluru') || farmLoc.includes('kolar') && buyerLoc.includes('bengaluru'))) {
    breakdown.proximityFit = 10;
  } else {
    breakdown.proximityFit = 7;
  }

  // 6. Buyer Reliability Scoring (Weight: 15)
  const reliability = Number(buyer?.reliabilityScore || 85);
  breakdown.buyerReliability = Number(((reliability / 100) * 15).toFixed(1));

  // Total initial score
  score = breakdown.commodityMatch + breakdown.gradeMatch + breakdown.windowMatch + breakdown.quantityFit + breakdown.proximityFit + breakdown.buyerReliability;

  // Evaluate Price & MNR protection feasibility
  const buyerMaxPrice = Number(demand.maxPricePerKg || 0);
  const cultivationCost = Number(supply.cultivationCostPerKg || 12);
  const mnrFloor = Number(supply.minAcceptableNetPrice || (cultivationCost * 1.2));

  const mnrEval = evaluatePriceAgainstMNR({
    buyerPricePerKg: buyerMaxPrice,
    verifiedCultivationCost: cultivationCost,
    mspFloor: 14,
    minimumMarginPercent: 20,
    negotiatedContractFloor: mnrFloor,
    commodityCategory: supply.category || 'highly_perishable'
  });

  const isCompatible = score >= 55 && mnrEval.isProtected;

  return {
    score: Math.min(100, Math.round(score)),
    breakdown,
    isCompatible,
    mnrEvaluation: mnrEval,
    confidenceGrade: score >= 90 ? 'A+ (Optimal Match)' : (score >= 75 ? 'A (Strong Match)' : (score >= 60 ? 'B (Acceptable Match)' : 'C (Sub-optimal)')),
    aiRecommendationReason: `${demand.buyerName || 'Buyer'} needs ${demand.requiredQuantityKg}kg ${demand.commodity} (${demand.qualityGrade || 'Grade A'}) around ${demand.deliveryDate}. Supply matches variety and timeline with ${score}% compatibility and passes farmer net realization safety.`
  };
}

/**
 * Recommend alternative buyers if primary buyer cancels or price fails MNR
 */
function findAlternativeBuyers({ supply, availableBuyers, allDemands }) {
  const alternatives = [];

  for (const demand of allDemands) {
    if (demand.status === 'Open' || demand.status === 'Matched') {
      if (demand.commodity.toLowerCase() === supply.commodity.toLowerCase()) {
        const buyer = availableBuyers.find(b => b.id === demand.buyerId) || { name: demand.buyerName, reliabilityScore: 90 };
        const match = calculateMatchScore({ supply, demand, buyer, farmerOrFpo: null });

        if (match.mnrEvaluation.isProtected) {
          alternatives.push({
            demandId: demand.id,
            buyerId: demand.buyerId,
            buyerName: demand.buyerName,
            buyerType: demand.buyerType,
            requiredQuantityKg: demand.requiredQuantityKg,
            offeredPricePerKg: demand.maxPricePerKg,
            deliveryDate: demand.deliveryDate,
            matchScore: match.score,
            farmerNetRealization: match.mnrEvaluation.waterfall.farmerNetRealization,
            confidenceGrade: match.confidenceGrade,
            reliabilityScore: buyer.reliabilityScore || 90,
            recommendedAction: `Instantly allocate supply to ${demand.buyerName} at ₹${demand.maxPricePerKg}/kg (Net: ₹${match.mnrEvaluation.waterfall.farmerNetRealization}/kg, +₹${(match.mnrEvaluation.waterfall.farmerNetRealization - (supply.cultivationCostPerKg || 12)).toFixed(2)}/kg profit)`
          });
        }
      }
    }
  }

  return alternatives.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  calculateMatchScore,
  findAlternativeBuyers
};
