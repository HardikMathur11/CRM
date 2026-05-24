import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import LeadKanban from './LeadKanban';
import LeadForm from './LeadForm';
import axiosInstance from '../../api/axiosInstance';
import { getStatusColor, getScoreColor, formatCurrency } from '../../utils/helpers';
import { AuthContext } from '../../context/AuthContext';
import { 
  Plus, 
  List, 
  Kanban, 
  Search, 
  Eye, 
  Loader2 
} from 'lucide-react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const response = await axiosInstance.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.log('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads based on search term and dropdown filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Leads Management" />

        {/* Filters and Controls */}
        <div className="bg-white border-b border-gray-100 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs font-semibold text-gray-600 outline-none focus:bg-white focus:border-indigo-500 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl py-2 px-3.5 text-xs font-semibold text-gray-600 outline-none focus:bg-white focus:border-indigo-500 transition-all"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* View Toggles & Add Button */}
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-0.5 rounded-xl flex">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Kanban size={16} />
              </button>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : viewMode === 'kanban' ? (
            <LeadKanban leads={filteredLeads} />
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Est. Value</th>
                      <th className="px-6 py-4">Assigned To</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-400 font-medium">
                          No leads matched the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map(lead => (
                        <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{lead.companyName}</td>
                          <td className="px-6 py-4">{lead.contactName}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-md border text-[10px] ${getStatusColor(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded border text-[10px] ${
                              lead.priority === 'High' ? 'text-red-600 bg-red-50 border-red-100' :
                              lead.priority === 'Medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-100' :
                              'text-blue-600 bg-blue-50 border-blue-100'
                            }`}>
                              {lead.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full border text-[10px] ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </span>
                          </td>
                          <td className="px-6 py-4">{formatCurrency(lead.estimatedValue)}</td>
                          <td className="px-6 py-4">{lead.assignedTo?.name || 'Unassigned'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => navigate(`/leads/${lead._id}`)}
                              className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-all inline-flex items-center gap-1.5"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Lead Modal Form */}
      {showAddForm && (
        <LeadForm 
          onClose={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            fetchLeads();
          }} 
        />
      )}
    </div>
  );
};

export default LeadList;
