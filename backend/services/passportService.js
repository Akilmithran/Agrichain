// Digital Lot Passport Service with QR Code Generation and Traceability Data

const QRCode = require('qrcode');

/**
 * Generate Digital Lot Passport with QR Code
 */
async function generateDigitalPassport(lotData) {
  const passportId = `PASSPORT-${lotData.lotNumber || 'LOT-' + Date.now()}`;
  
  // Traceability Payload for QR code & verify URL
  const qrPayload = JSON.stringify({
    passportId,
    lotNumber: lotData.lotNumber,
    fpo: lotData.fpoName,
    commodity: lotData.commodity,
    variety: lotData.variety,
    grade: lotData.grade,
    quantityKg: lotData.totalQuantityKg,
    collectionDate: lotData.collectionDate,
    collectionCentre: lotData.collectionCentre,
    verifiedFarmersCount: lotData.constituentFarmers?.length || 0,
    qualityScore: lotData.qualityMetrics?.inspectionScorePercent || 94,
    buyer: lotData.buyerName || 'Allocated Institutional Buyer',
    dispatchStatus: lotData.dispatchStatus || 'Graded & Quality Certified',
    verificationUrl: `https://agrichaindirect.in/verify/${passportId}`
  });

  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 280,
      color: {
        dark: '#064e3b', // Deep emerald green
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    qrCodeDataUrl = '';
  }

  const passport = {
    passportId,
    lotNumber: lotData.lotNumber,
    fpoId: lotData.fpoId,
    fpoName: lotData.fpoName,
    collectionCentre: lotData.collectionCentre,
    commodity: lotData.commodity,
    variety: lotData.variety,
    category: lotData.category || 'highly_perishable',
    totalQuantityKg: lotData.totalQuantityKg,
    grade: lotData.grade || 'Grade A (Export / Institutional)',
    collectionDate: lotData.collectionDate || new Date().toISOString().split('T')[0],
    
    // Constituent Farmer Traceability Breakdown
    constituentFarmers: (lotData.constituentFarmers || []).map(f => ({
      farmerId: f.farmerId,
      farmerName: f.farmerName,
      location: f.location || 'Kolar Agri Cluster, Karnataka',
      quantityKg: f.quantityKg,
      percentageOfLot: Number(((f.quantityKg / lotData.totalQuantityKg) * 100).toFixed(1)),
      intakeDate: f.intakeDate || lotData.collectionDate,
      harvestWindow: f.harvestWindow || 'Nov 10 - Nov 18',
      gpsCoordinates: f.gpsCoordinates || '13.1367° N, 78.1291° E',
      verifiedCultivationCostPerKg: f.cultivationCostPerKg || 12.50,
      payoutDue: Number(((f.quantityKg) * (f.netRealizationPerKg || 21.80)).toFixed(2))
    })),

    // Quality Inspection Certificate
    qualityMetrics: {
      brix: lotData.qualityMetrics?.brix || 5.2, // sweetness/solids for tomatoes/fruits
      firmness: lotData.qualityMetrics?.firmness || '4.8 kg/cm²',
      sizeRange: lotData.qualityMetrics?.sizeRange || '55 - 65 mm (Uniform)',
      defectRatePercent: lotData.qualityMetrics?.defectRatePercent || 1.2,
      moisturePercent: lotData.qualityMetrics?.moisturePercent || 91.5,
      pesticideResidueFree: lotData.qualityMetrics?.pesticideResidueFree !== undefined ? lotData.qualityMetrics.pesticideResidueFree : true,
      colorSpectrum: lotData.qualityMetrics?.colorSpectrum || 'Deep Vine Red (Stage 5)',
      inspectionScorePercent: lotData.qualityMetrics?.inspectionScorePercent || 96,
      inspectorName: lotData.qualityMetrics?.inspectorName || 'Dr. H. Anand (Chief Quality Agronomist)',
      inspectorNotes: lotData.qualityMetrics?.inspectorNotes || 'Exceptional batch with zero mechanical bruising. Optimal for high-end hospitality culinary prep.',
      inspectionPhotos: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=500&auto=format&fit=crop&q=60'
      ]
    },

    // Cold-Chain & Storage Pedigree
    storageDetails: {
      facilityType: lotData.storageDetails?.facilityType || 'FPO Controlled Cold Pre-Cooling Hub',
      temperatureCelsius: lotData.storageDetails?.temperatureCelsius || '12.5°C (Maintained)',
      humidityPercent: lotData.storageDetails?.humidityPercent || '88% RH',
      entryDate: lotData.storageDetails?.entryDate || lotData.collectionDate,
      maxSafeShelfLifeDays: lotData.storageDetails?.maxSafeShelfLifeDays || 14,
      transitTrackingId: `TRK-REEFER-${Math.floor(1000 + Math.random() * 9000)}`
    },

    // Buyer & Dispatch Assignment
    buyerId: lotData.buyerId,
    buyerName: lotData.buyerName || 'Grand Hyatt Regency & Luxury Cafeterias',
    commitmentId: lotData.commitmentId,
    dispatchStatus: lotData.dispatchStatus || 'Aggregated & Cold Pre-Cooled',
    
    // Delivery & Quality Acceptance Confirmation
    deliveryConfirmation: lotData.deliveryConfirmation || {
      receivedAt: null,
      acceptedQtyKg: null,
      inspectionPass: null,
      buyerSignature: null,
      feedbackNotes: null
    },

    paymentStatus: lotData.paymentStatus || 'Escrow_Funded',
    qrCodeDataUrl,
    issuedAt: new Date().toISOString()
  };

  return passport;
}

module.exports = {
  generateDigitalPassport
};
