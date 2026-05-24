import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const LeadForm = ({ onClose, onSuccess }) => {
  const { user: currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    contactName: '',
    companyName: '',
    phone: '',
    email: '',
    status: 'New',
    priority: 'Medium',
    estimatedValue: 0,
    leadSource: 'Direct',
    location: '',
    assignedTo: currentUser?._id || ''
  });

  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch team members list for assignments
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        console.log('Error fetching team members:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimatedValue' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.companyName || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/leads', formData);
      toast.success('Lead created successfully!');
      onSuccess();
    } catch (error) {
      console.log('Error creating lead:', error);
      toast.error(error.response?.data?.message || 'Failed to create lead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">Create New Lead</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Contact Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Apex Steel Industries"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@apexsteel.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Pipeline Stage
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Estimated Value */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Estimated Deal Value ($)
              </label>
              <input
                type="number"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Lead Source */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Lead Source
              </label>
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Direct">Direct</option>
                <option value="Event">Event</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Geographic Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mumbai, MH"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Assigned To */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Assigned Owner
              </label>
              {currentUser?.role === 'bda' ? (
                <input
                  type="text"
                  disabled
                  value={currentUser?.name}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-500 outline-none cursor-not-allowed"
                />
              ) : (
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-xs font-semibold text-gray-600 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                >
                  <option value="">Select Team Member</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Save Lead'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LeadForm;
