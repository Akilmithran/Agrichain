// API service for AgriChain Direct frontend

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

export const api = {
  // Health & Summary
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async resetSeed() {
    const res = await fetch(`${API_BASE}/seed/reset`);
    return res.json();
  },

  async getPlatformSummary() {
    const res = await fetch(`${API_BASE}/analytics/platform-summary`);
    return res.json();
  },

  // Commodities
  async getCommodities() {
    const res = await fetch(`${API_BASE}/commodities`);
    return res.json();
  },

  // Farmers
  async getFarmers() {
    const res = await fetch(`${API_BASE}/farmers`);
    return res.json();
  },

  async getFarmerById(id) {
    const res = await fetch(`${API_BASE}/farmers/${id}`);
    return res.json();
  },

  // FPOs
  async getFpos() {
    const res = await fetch(`${API_BASE}/fpos`);
    return res.json();
  },

  async getFpoById(id) {
    const res = await fetch(`${API_BASE}/fpos/${id}`);
    return res.json();
  },

  // Buyers
  async getBuyers() {
    const res = await fetch(`${API_BASE}/buyers`);
    return res.json();
  },

  async getBuyerById(id) {
    const res = await fetch(`${API_BASE}/buyers/${id}`);
    return res.json();
  },

  // Supply Declarations
  async getSupplies() {
    const res = await fetch(`${API_BASE}/supply`);
    return res.json();
  },

  async createSupply(supplyData) {
    const res = await fetch(`${API_BASE}/supply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplyData)
    });
    return res.json();
  },

  // Demand Requests
  async getDemands() {
    const res = await fetch(`${API_BASE}/demand`);
    return res.json();
  },

  async createDemand(demandData) {
    const res = await fetch(`${API_BASE}/demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demandData)
    });
    return res.json();
  },

  // AI Matching
  async getAutoMatches() {
    const res = await fetch(`${API_BASE}/matching/auto-match`);
    return res.json();
  },

  async findAlternatives(payload) {
    const res = await fetch(`${API_BASE}/matching/find-alternatives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Pricing Waterfall & MNR
  async calculateWaterfall(payload) {
    const res = await fetch(`${API_BASE}/pricing/calculate-waterfall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async evaluateMnr(payload) {
    const res = await fetch(`${API_BASE}/pricing/evaluate-mnr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Commitments
  async getCommitments() {
    const res = await fetch(`${API_BASE}/commitments`);
    return res.json();
  },

  async createCommitment(commitmentData) {
    const res = await fetch(`${API_BASE}/commitments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commitmentData)
    });
    return res.json();
  },

  // FPO Lots & Digital Passports
  async getLots() {
    const res = await fetch(`${API_BASE}/lots`);
    return res.json();
  },

  async aggregateLot(lotData) {
    const res = await fetch(`${API_BASE}/lots/aggregate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lotData)
    });
    return res.json();
  },

  async acceptDelivery(lotId, confirmationData) {
    const res = await fetch(`${API_BASE}/lots/${lotId}/accept-delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(confirmationData)
    });
    return res.json();
  },

  // Alerts
  async getAlerts(role, id) {
    const url = new URL(`${API_BASE}/alerts`);
    if (role) url.searchParams.append('role', role);
    if (id) url.searchParams.append('id', id);
    const res = await fetch(url.toString());
    return res.json();
  },

  async markAlertRead(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/read`, { method: 'PATCH' });
    return res.json();
  },

  // Demo Wizard Step Controller
  async executeDemoStep(stepIndex) {
    const res = await fetch(`${API_BASE}/demo/step/${stepIndex}`, {
      method: 'POST'
    });
    return res.json();
  }
};
