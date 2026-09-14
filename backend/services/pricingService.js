// Pricing Engine and Minimum Net Realization (MNR) Protection Engine

/**
 * Calculate Price Waterfall
 * Formula: Farmer Net Realization = Buyer Price - Collection - Grading/Packing - Storage - Platform Fee - Risk Reserve
 */
function calculateWaterfall({
  buyerPricePerKg,
  commodityCategory = 'highly_perishable',
  isColdStorageUsed = false,
  customDeductions = {}
}) {
  const buyerPrice = Number(buyerPricePerKg) || 0;

  // Standardized dynamic deduction benchmarks per kg based on commodity type & logistics
  let collectionCost = 1.20; // ₹/kg default for farmgate-to-FPO collection
  let gradingPackingCost = 1.80; // ₹/kg standard automated grading and crates
  let storageCost = 0.00; // ₹/kg storage if storable / cold chain
  let platformFeeRate = 0.03; // 3% transparent platform coordination fee
  let riskReserveRate = 0.02; // 2% buffer against transit shrinkage / cancellation risk

  if (commodityCategory === 'ultra_perishable') {
    collectionCost = 1.50; // fast-transit cold reefer
    gradingPackingCost = 2.00; // modified atmosphere / ventilated packaging
    storageCost = 0.00; // direct to market
    riskReserveRate = 0.03;
  } else if (commodityCategory === 'highly_perishable') {
    collectionCost = 1.20;
    gradingPackingCost = 1.80;
    storageCost = isColdStorageUsed ? 0.80 : 0.00;
    riskReserveRate = 0.02;
  } else if (commodityCategory === 'moderately_perishable') {
    collectionCost = 0.90;
    gradingPackingCost = 1.20;
    storageCost = isColdStorageUsed ? 0.60 : 0.20;
    riskReserveRate = 0.015;
  } else if (commodityCategory === 'storable') {
    collectionCost = 0.60;
    gradingPackingCost = 0.80;
    storageCost = isColdStorageUsed ? 0.50 : 0.30;
    riskReserveRate = 0.01;
  }

  // Override with custom deductions if specified
  if (customDeductions.collectionCost !== undefined) collectionCost = Number(customDeductions.collectionCost);
  if (customDeductions.gradingCost !== undefined) gradingPackingCost = Number(customDeductions.gradingCost);
  if (customDeductions.storageCost !== undefined) storageCost = Number(customDeductions.storageCost);

  const platformFee = Number((buyerPrice * platformFeeRate).toFixed(2));
  const riskReserve = Number((buyerPrice * riskReserveRate).toFixed(2));

  const totalDeductions = Number((collectionCost + gradingPackingCost + storageCost + platformFee + riskReserve).toFixed(2));
  const farmerNetRealization = Number((buyerPrice - totalDeductions).toFixed(2));

  return {
    buyerPrice,
    mandiBenchmark: Number((buyerPrice * 0.82).toFixed(2)), // Traditional mandi spot benchmark (typically ~18% lower farmer realization due to uncoordinated middlemen)
    collectionCost,
    gradingPackingCost,
    storageCost,
    platformFee,
    riskReserve,
    totalDeductions,
    farmerNetRealization,
    deductionBreakdownPercent: {
      collection: Number(((collectionCost / buyerPrice) * 100).toFixed(1)),
      gradingPacking: Number(((gradingPackingCost / buyerPrice) * 100).toFixed(1)),
      storage: Number(((storageCost / buyerPrice) * 100).toFixed(1)),
      platformFee: Number(((platformFee / buyerPrice) * 100).toFixed(1)),
      riskReserve: Number(((riskReserve / buyerPrice) * 100).toFixed(1)),
      netRealization: Number(((farmerNetRealization / buyerPrice) * 100).toFixed(1))
    }
  };
}

/**
 * Calculate Minimum Net Realization (MNR)
 * Formula: MNR = max(Applicable Support Price (MSP), Verified Cultivation Cost + Minimum Margin, Negotiated Contract Floor)
 */
function calculateMNR({
  mspFloor = 0,
  verifiedCultivationCost = 0,
  minimumMarginPercent = 20, // default 20% cost-plus margin protection
  negotiatedContractFloor = 0
}) {
  const msp = Number(mspFloor) || 0;
  const cost = Number(verifiedCultivationCost) || 0;
  const marginAmt = cost * (Number(minimumMarginPercent) / 100);
  const costPlusMargin = Number((cost + marginAmt).toFixed(2));
  const negotiatedFloor = Number(negotiatedContractFloor) || 0;

  const mnr = Math.max(msp, costPlusMargin, negotiatedFloor);

  return {
    mnr,
    msp,
    costPlusMargin,
    negotiatedFloor,
    breakdown: {
      verifiedCultivationCost: cost,
      minimumMarginPercent,
      minimumMarginAmount: Number(marginAmt.toFixed(2)),
      governingFactor: mnr === msp ? 'MSP Floor' : (mnr === costPlusMargin ? 'Cost + Margin Protection' : 'Negotiated Floor')
    }
  };
}

/**
 * Evaluate Price & Net Realization against MNR
 */
function evaluatePriceAgainstMNR({
  buyerPricePerKg,
  verifiedCultivationCost,
  mspFloor = 0,
  minimumMarginPercent = 20,
  negotiatedContractFloor = 0,
  commodityCategory = 'highly_perishable',
  isColdStorageUsed = false
}) {
  const waterfall = calculateWaterfall({
    buyerPricePerKg,
    commodityCategory,
    isColdStorageUsed
  });

  const mnrData = calculateMNR({
    mspFloor,
    verifiedCultivationCost,
    minimumMarginPercent,
    negotiatedContractFloor
  });

  const isProtected = waterfall.farmerNetRealization >= mnrData.mnr;
  const deficitPerKg = isProtected ? 0 : Number((mnrData.mnr - waterfall.farmerNetRealization).toFixed(2));

  return {
    waterfall,
    mnrData,
    isProtected,
    deficitPerKg,
    status: isProtected ? 'PASSED_MNR_PROTECTION' : 'PRICE_BELOW_MNR_FLAGGED',
    alertMessage: isProtected
      ? `Farmer Net Realization (₹${waterfall.farmerNetRealization}/kg) is healthy and exceeds Minimum Net Realization (₹${mnrData.mnr}/kg).`
      : `PRICE RISK ALERT: Expected Net Realization (₹${waterfall.farmerNetRealization}/kg) is below Minimum Net Realization (₹${mnrData.mnr}/kg) by ₹${deficitPerKg}/kg. System will flag and route to alternative premium buyers.`
  };
}

module.exports = {
  calculateWaterfall,
  calculateMNR,
  evaluatePriceAgainstMNR
};
