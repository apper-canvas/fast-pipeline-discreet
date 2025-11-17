import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

export const contactService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...contacts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newContact = {
      Id: Math.max(...contacts.map(c => c.Id), 0) + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts[index] = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...contacts[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts.splice(index, 1);
    return { success: true };
  },

  async search(query, filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    let filteredContacts = [...contacts];
    
    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredContacts = filteredContacts.filter(contact =>
        contact.firstName.toLowerCase().includes(searchTerm) ||
        contact.lastName.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm) ||
        contact.company.toLowerCase().includes(searchTerm) ||
        contact.position.toLowerCase().includes(searchTerm) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Company filter
    if (filters.company && filters.company.length > 0) {
      filteredContacts = filteredContacts.filter(contact =>
        filters.company.includes(contact.company)
      );
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredContacts = filteredContacts.filter(contact =>
        filters.tags.some(tag => contact.tags.includes(tag))
      );
    }
    
    return filteredContacts;
  }
};