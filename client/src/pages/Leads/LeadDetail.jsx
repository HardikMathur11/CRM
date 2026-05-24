import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { getStatusColor, getScoreColor, formatCurrency, formatDate } from '../../utils/helpers';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Tag, 
  User, 
  MessageSquare, 
  CheckSquare, 
  Clock, 
  Plus, 
  CheckCircle,
  Loader2
} from 'lucide-react';

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertForm, setConvertForm] = useState({ gstNumber: '', city: '', state: '' });
  
  // state for the followup scheduler modal
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followupForm, setFollowupForm] = useState({
    type: 'Call',
    scheduledAt: '',
    notes: ''
  });

  const fetchLeadDetails = async () => {
    try {
      const response = await axiosInstance.get(`/leads/${id}`);
      setLead(response.data);
    } catch (error) {
      console.log('Error fetching lead detail:', error);
      toast.error('Failed to load lead details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      const response = await axiosInstance.post(`/leads/${id}/notes`, { text: noteText });
      setLead(response.data);
      setNoteText('');
      toast.success('Note added!');
    } catch (error) {
      toast.error('Failed to add note.');
    }
  };

  const handleCreateFollowUp = async (e) => {
    e.preventDefault();
    if (!followupForm.scheduledAt) {
      toast.error('Please specify a schedule date and time.');
      return;
    }

    try {
      await axiosInstance.post('/followups', {
        lead: lead._id,
        assignedTo: lead.assignedTo?._id || user._id,
        ...followupForm
      });
      toast.success('Follow-up scheduled successfully!');
      setShowFollowUpForm(false);
      setFollowupForm({ type: 'Call', scheduledAt: '', notes: '' });
      // grab updated lead info
      fetchLeadDetails();
    } catch (error) {
      toast.error('Failed to schedule follow-up.');
    }
  };

  const handleConvertLead = async (e) => {
    e.preventDefault();
    if (!convertForm.gstNumber || !convertForm.city || !convertForm.state) {
      toast.error('Please fill in all conversion fields.');
      return;
    }

    try {
      await axiosInstance.post(`/leads/${id}/convert`, convertForm);
      toast.success('Lead successfully converted to Client!');
      setShowConvertModal(false);
      fetchLeadDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to convert lead.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Lead Details" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Lead Workspace" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {/* header section */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-gray-800">{lead.companyName}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${getScoreColor(lead.score)}`}>
                  {lead.score} Score
                </span>
              </div>
            </div>

            {/* button to convert lead to client */}
            {!lead.isConverted && lead.status !== 'Lost' && (
              <button
                onClick={() => setShowConvertModal(true)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-green-600/10 transition-all self-start md:self-center"
              >
                <CheckCircle size={16} />
                <span>Convert to Client</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* details column */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-800 text-sm border-b border-gray-50 pb-3">Lead Information</h3>

              <div className="space-y-3.5 text-xs text-gray-600 font-semibold">
                <div className="flex items-center gap-2.5">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Contact Name</span>
                    {lead.contactName}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Phone</span>
                    {lead.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Email</span>
                    {lead.email}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Estimated Deal Value</span>
                    {formatCurrency(lead.estimatedValue)}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Tag size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Lead Source</span>
                    {lead.leadSource}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Location</span>
                    {lead.location || 'Not Specified'}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Created Date</span>
                    {formatDate(lead.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <CheckSquare size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Assigned Owner</span>
                    {lead.assignedTo?.name || 'Unassigned'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Notes & Interactions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Notes Container */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
                <h3 className="font-bold text-gray-800 text-sm border-b border-gray-50 pb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span>Notes history</span>
                </h3>

                <form onSubmit={handleAddNote} className="space-y-3">
                  <textarea
                    rows="3"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Type details of latest interaction or updates here..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-indigo-500 transition-all"
                  />
                  <div className="text-right">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all"
                    >
                      Post Note
                    </button>
                  </div>
                </form>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {lead.notes?.length === 0 ? (
                    <p className="text-xs text-gray-400 font-medium text-center py-4">No notes recorded yet.</p>
                  ) : (
                    lead.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50/75 border border-gray-100 rounded-xl space-y-1">
                        <p className="text-xs text-gray-700 font-semibold">{note.text}</p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                          <span>By {note.addedBy}</span>
                          <span>•</span>
                          <span>{new Date(note.addedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Followups Scheduler Form Trigger */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>Followups Scheduler</span>
                  </h3>
                  <button
                    onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Schedule</span>
                  </button>
                </div>

                {showFollowUpForm && (
                  <form onSubmit={handleCreateFollowUp} className="bg-gray-50/75 p-4 rounded-xl border border-gray-100 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold block mb-1">Type</label>
                        <select
                          value={followupForm.type}
                          onChange={(e) => setFollowupForm({ ...followupForm, type: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                        >
                          <option value="Call">Call</option>
                          <option value="Email">Email</option>
                          <option value="Meeting">Meeting</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Site Visit">Site Visit</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold block mb-1">Time</label>
                        <input
                          type="datetime-local"
                          value={followupForm.scheduledAt}
                          onChange={(e) => setFollowupForm({ ...followupForm, scheduledAt: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Agenda Notes</label>
                      <input
                        type="text"
                        value={followupForm.notes}
                        onChange={(e) => setFollowupForm({ ...followupForm, notes: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-semibold outline-none"
                        placeholder="e.g. Call to discuss commercial invoice copy..."
                      />
                    </div>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold"
                      >
                        Add Task
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Convert to Client Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-base">Client Onboarding Details</h3>
            </div>
            <form onSubmit={handleConvertLead} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  GST Registration Number *
                </label>
                <input
                  type="text"
                  required
                  value={convertForm.gstNumber}
                  onChange={(e) => setConvertForm({ ...convertForm, gstNumber: e.target.value })}
                  placeholder="09AAACN8374D1Z2"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={convertForm.city}
                    onChange={(e) => setConvertForm({ ...convertForm, city: e.target.value })}
                    placeholder="Noida"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={convertForm.state}
                    onChange={(e) => setConvertForm({ ...convertForm, state: e.target.value })}
                    placeholder="Uttar Pradesh"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                >
                  Confirm Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
