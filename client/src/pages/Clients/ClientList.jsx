import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/helpers';
import { Search, Eye, Loader2 } from 'lucide-react';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosInstance.get('/clients');
        setClients(response.data);
      } catch (error) {
        console.log('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Clients Registry" />

        {/* Filter controls header */}
        <div className="bg-white border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Table View */}
        <main className="flex-1 overflow-auto p-8">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Company Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">GST Number</th>
                      <th className="px-6 py-4">City, State</th>
                      <th className="px-6 py-4">Total Revenue</th>
                      <th className="px-6 py-4">Account Owner</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-medium">
                          No clients onboarded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map(client => (
                        <tr key={client._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{client.companyName}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-gray-700">{client.contactName}</p>
                              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{client.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 uppercase font-mono">{client.gstNumber}</td>
                          <td className="px-6 py-4">{client.city}, {client.state}</td>
                          <td className="px-6 py-4 font-bold text-indigo-600">
                            {formatCurrency(client.totalRevenue)}
                          </td>
                          <td className="px-6 py-4">{client.assignedTo?.name || 'Unassigned'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => navigate(`/clients/${client._id}`)}
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
    </div>
  );
};

export default ClientList;
