import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import { Download, TrendingUp, BarChart3, PieChartIcon, Loader2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const SalesReport = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/reports/summary');
        setStats(response.data);
      } catch (error) {
        console.log('Error fetching report stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await axiosInstance.get('/reports/export-csv');
      // Create CSV file blob stream and click trigger to download
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clients-database-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Clients CSV Exported Successfully!');
    } catch (error) {
      console.log('Error exporting CSV:', error);
      toast.error('Failed to export client data to CSV.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Sales Reports" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Pre-process charts data
  const barData = stats?.statusDistribution?.map(item => ({
    stage: item._id,
    Count: item.count
  })) || [];

  const pieData = stats?.scoreDistribution?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const SCORE_COLORS = {
    Hot: '#EF4444',
    Warm: '#F59E0B',
    Cold: '#3B82F6'
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Sales & Performance Reports" />

        {/* Action Header bar */}
        <div className="bg-white border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Review pipeline statistics and download client registry reports
          </p>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-55 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all"
          >
            <Download size={16} />
            <span>{exporting ? 'Exporting...' : 'Export Clients CSV'}</span>
          </button>
        </div>

        {/* Main Dashboard Summary & Charts */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Sales Revenue</span>
              <h4 className="text-2xl font-bold text-indigo-600">{formatCurrency(stats?.totalRevenue || 0)}</h4>
            </div>
            <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deals Won / Converted</span>
              <h4 className="text-2xl font-bold text-gray-800">{stats?.totalConversions || 0} Deals</h4>
            </div>
            <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Overall Win Rate</span>
              <h4 className="text-2xl font-bold text-gray-800">
                {stats?.totalLeads ? Math.round((stats.totalConversions / stats.totalLeads) * 100) : 0}%
              </h4>
            </div>
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Chart */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm h-96 flex flex-col">
              <h3 className="text-xs font-bold text-gray-700 tracking-wide uppercase mb-6 flex items-center gap-1.5">
                <BarChart3 size={15} className="text-indigo-500" />
                <span>Leads Status Distribution</span>
              </h3>
              <div className="flex-1">
                {barData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">No leads data</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="stage" fontSize={11} stroke="#9CA3AF" tickLine={false} />
                      <YAxis fontSize={11} stroke="#9CA3AF" tickLine={false} />
                      <Tooltip cursor={{ fill: '#F3F4F6' }} />
                      <Bar dataKey="Count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Score Chart */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm h-96 flex flex-col">
              <h3 className="text-xs font-bold text-gray-700 tracking-wide uppercase mb-6 flex items-center gap-1.5">
                <PieChartIcon size={15} className="text-indigo-500" />
                <span>Lead Score Distribution</span>
              </h3>
              <div className="flex-1">
                {pieData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">No score data</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={SCORE_COLORS[entry.name] || '#4F46E5'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesReport;
