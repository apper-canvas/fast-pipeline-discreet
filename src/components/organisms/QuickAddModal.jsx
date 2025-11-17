import React, { useState } from "react";
import Modal from "@/components/molecules/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const QuickAddModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const tabs = [
    { id: "contact", label: "Contact", icon: "User" },
    { id: "deal", label: "Deal", icon: "DollarSign" },
    { id: "task", label: "Task", icon: "CheckSquare" },
    { id: "activity", label: "Activity", icon: "MessageCircle" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      switch (activeTab) {
        case "contact": {
          result = await contactService.create({
            firstName: formData.firstName || "",
            lastName: formData.lastName || "",
            email: formData.email || "",
            phone: formData.phone || "",
            company: formData.company || "",
            position: formData.position || "",
            tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : []
          });
          toast.success("Contact created successfully!");
          break;
        }
        case "deal": {
          result = await dealService.create({
            title: formData.title || "",
            contactId: formData.contactId || "",
            value: parseFloat(formData.value) || 0,
            stage: formData.stage || "lead",
            probability: parseFloat(formData.probability) || 0,
            expectedCloseDate: formData.expectedCloseDate || ""
          });
          toast.success("Deal created successfully!");
          break;
        }
        case "task": {
          result = await taskService.create({
            title: formData.title || "",
            description: formData.description || "",
            dueDate: formData.dueDate || "",
            priority: formData.priority || "medium",
            contactId: formData.contactId || "",
            dealId: formData.dealId || ""
          });
          toast.success("Task created successfully!");
          break;
        }
        case "activity": {
          result = await activityService.create({
            type: formData.type || "note",
            subject: formData.subject || "",
            content: formData.content || "",
            contactId: formData.contactId || "",
            dealId: formData.dealId || ""
          });
          toast.success("Activity logged successfully!");
          break;
        }
      }
      
      setFormData({});
      onClose();
    } catch (error) {
      toast.error("Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContactForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <Input
            value={formData.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <Input
            value={formData.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <Input
          type="email"
          value={formData.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="john@example.com"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <Input
            value={formData.company || ""}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Acme Corp"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position
        </label>
        <Input
          value={formData.position || ""}
          onChange={(e) => handleInputChange("position", e.target.value)}
          placeholder="Sales Manager"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <Input
          value={formData.tags || ""}
          onChange={(e) => handleInputChange("tags", e.target.value)}
          placeholder="lead, enterprise, hot"
        />
      </div>
    </div>
  );

  const renderDealForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deal Title *
        </label>
        <Input
          value={formData.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Q1 Enterprise License"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value *
          </label>
          <Input
            type="number"
            value={formData.value || ""}
            onChange={(e) => handleInputChange("value", e.target.value)}
            placeholder="50000"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stage
          </label>
          <Select
            value={formData.stage || "lead"}
            onChange={(e) => handleInputChange("stage", e.target.value)}
          >
            <option value="lead">Lead</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Probability (%)
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.probability || ""}
            onChange={(e) => handleInputChange("probability", e.target.value)}
            placeholder="75"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Close Date
          </label>
          <Input
            type="date"
            value={formData.expectedCloseDate || ""}
            onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderTaskForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <Input
          value={formData.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Follow up with client"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows="3"
          value={formData.description || ""}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Send follow-up email with proposal details"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date *
          </label>
          <Input
            type="date"
            value={formData.dueDate || ""}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            value={formData.priority || "medium"}
            onChange={(e) => handleInputChange("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderActivityForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Activity Type *
          </label>
          <Select
            value={formData.type || "note"}
            onChange={(e) => handleInputChange("type", e.target.value)}
            required
          >
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="meeting">Meeting</option>
            <option value="note">Note</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject *
          </label>
          <Input
            value={formData.subject || ""}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            placeholder="Follow-up call"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content *
        </label>
        <textarea
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          rows="4"
          value={formData.content || ""}
          onChange={(e) => handleInputChange("content", e.target.value)}
          placeholder="Discussed project requirements and timeline..."
          required
        />
      </div>
    </div>
  );

  const renderForm = () => {
    switch (activeTab) {
      case "contact":
        return renderContactForm();
      case "deal":
        return renderDealForm();
      case "task":
        return renderTaskForm();
      case "activity":
        return renderActivityForm();
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Add"
      size="lg"
    >
      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {renderForm()}

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="Plus"
            >
              Create {tabs.find(t => t.id === activeTab)?.label}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default QuickAddModal;