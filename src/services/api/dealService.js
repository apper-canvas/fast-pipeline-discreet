import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

export const dealService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...deals];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async getByContactId(contactId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return deals.filter(d => d.contactId === contactId.toString());
  },

  async getByStage(stage) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return deals.filter(d => d.stage === stage);
  },

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newDeal = {
      Id: Math.max(...deals.map(d => d.Id), 0) + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals[index] = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...deals[index] };
  },

  async updateStage(id, newStage) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals[index] = {
      ...deals[index],
      stage: newStage,
      updatedAt: new Date().toISOString()
    };
    
    return { ...deals[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals.splice(index, 1);
    return { success: true };
  },

  async getPipelineStats() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stats = {
      lead: { count: 0, value: 0 },
      qualified: { count: 0, value: 0 },
      proposal: { count: 0, value: 0 },
      negotiation: { count: 0, value: 0 },
      "closed-won": { count: 0, value: 0 },
      "closed-lost": { count: 0, value: 0 }
    };
    
    deals.forEach(deal => {
      if (stats[deal.stage]) {
        stats[deal.stage].count++;
        stats[deal.stage].value += deal.value;
      }
    });
    
    return stats;
  }
};