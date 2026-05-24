import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Building, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  ArrowLeft,
  Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axiosInstance.get(`/clients/${id}`);
        setClient(response.data);
      } catch (error) {
        console.log('Error fetching client details:', error);
        toast.error('Failed to load client details.');
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Client Details" />
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
        <Navbar title="Client File" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <button
              onClick={() => navigate('/clients')}
              className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-800">{client.companyName}</h2>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                <CheckCircle size={10} /> Active Client
              </span>
            </div>
          </div>

          {/* Details Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Account Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-800 text-sm border-b border-gray-50 pb-3">Corporate Information</h3>
              
              <div className="space-y-3.5 text-xs text-gray-600 font-semibold">
                <div className="flex items-center gap-2.5">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Contact Person</span>
                    {client.contactName}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Phone Number</span>
                    {client.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Email Address</span>
                    {client.email}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">GST Number</span>
                    <span className="uppercase font-mono">{client.gstNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial and Account Admin details */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-800 text-sm border-b border-gray-50 pb-3">Account & Location</h3>

              <div className="space-y-3.5 text-xs text-gray-600 font-semibold">
                <div className="flex items-center gap-2.5">
                  <DollarSign size={16} className="text-indigo-500" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Total Revenue Accounted</span>
                    <span className="text-sm font-bold text-indigo-600">{formatCurrency(client.totalRevenue)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Shipping / Billing Address</span>
                    {client.city}, {client.state}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Assigned Account Owner</span>
                    {client.assignedTo?.name || 'Unassigned'}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Converted From Lead Date</span>
                    {formatDate(client.createdAt)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDetail;
