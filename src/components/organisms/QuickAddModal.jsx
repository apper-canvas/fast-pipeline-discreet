import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import { contactService } from '@/services/api/contactService';
import { dealService } from '@/services/api/dealService';

const QuickAddModal = ({ isOpen, onClose, onSuccess, type = 'contact' }) => {
  const [formData, setFormData] = useState({
    // Contact fields
    name: '',
    email: '',
    phone: '',
    company: '',
    // Deal fields
    title: '',
    value: '',
    stage: 'prospect',
    contactId: ''
  });
const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (type === 'deal' && isOpen) {
      loadContacts();
    }
  }, [type, isOpen]);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

const validateForm = () => {
    const newErrors = {};
    
    if (type === 'contact') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (type === 'deal') {
      if (!formData.title.trim()) {
        newErrors.title = 'Deal title is required';
      }
      
      if (!formData.value.trim()) {
        newErrors.value = 'Deal value is required';
      } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
        newErrors.value = 'Please enter a valid positive number';
      }
      
      if (!formData.contactId) {
        newErrors.contactId = 'Please select a contact';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (type === 'contact') {
        const contactData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          status: 'active',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await contactService.create(contactData);
        toast.success('Contact added successfully!');
      } else if (type === 'deal') {
        const dealData = {
          title: formData.title,
          value: Number(formData.value),
          stage: formData.stage,
          contactId: Number(formData.contactId),
          probability: formData.stage === 'prospect' ? 10 : 
                      formData.stage === 'qualified' ? 25 :
                      formData.stage === 'proposal' ? 50 :
                      formData.stage === 'negotiation' ? 75 : 90,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await dealService.create(dealData);
        toast.success('Deal added successfully!');
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        value: '',
        stage: 'prospect',
        contactId: ''
      });
      setErrors({});
      
      // Call success callback and close modal
      if (onSuccess) {
        onSuccess();
      }
      onClose();
      
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      toast.error(`Failed to add ${type}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        title: '',
        value: '',
        stage: 'prospect',
        contactId: ''
      });
      setErrors({});
      onClose();
    }
  };

const stageOptions = [
    { value: 'prospect', label: 'Prospect' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' }
  ];

  const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.name} - ${contact.company || 'No Company'}`
  }));

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={`Add New ${type === 'contact' ? 'Contact' : 'Deal'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {type === 'contact' ? (
            <>
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="Enter contact name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  disabled={isSubmitting}
                  className="w-full"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  disabled={isSubmitting}
                  className="w-full"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <Input
                  id="contact-company"
                  type="text"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="deal-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Title *
                </label>
                <Input
                  id="deal-title"
                  type="text"
                  placeholder="Enter deal title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                  disabled={isSubmitting}
                  className="w-full"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="deal-value" className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Value *
                </label>
                <Input
                  id="deal-value"
                  type="number"
                  placeholder="Enter deal value"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  error={errors.value}
                  disabled={isSubmitting}
                  className="w-full"
                  min="0"
                  step="0.01"
                />
                {errors.value && (
                  <p className="mt-1 text-sm text-error">{errors.value}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="deal-stage" className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <Select
                  id="deal-stage"
                  value={formData.stage}
                  onChange={(value) => handleInputChange('stage', value)}
                  options={stageOptions}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="deal-contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact *
                </label>
                <Select
                  id="deal-contact"
                  value={formData.contactId}
                  onChange={(value) => handleInputChange('contactId', value)}
                  options={contactOptions}
                  placeholder="Select a contact"
                  error={errors.contactId}
                  disabled={isSubmitting}
                  className="w-full"
                />
                {errors.contactId && (
                  <p className="mt-1 text-sm text-error">{errors.contactId}</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
<Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            icon={isSubmitting ? "Loader2" : "Plus"}
            className={isSubmitting ? "animate-spin" : ""}
          >
            {isSubmitting ? 'Adding...' : `Add ${type === 'contact' ? 'Contact' : 'Deal'}`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickAddModal;