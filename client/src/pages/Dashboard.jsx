import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import axiosInstance from '../api/axiosInstance';
import { formatCurrency } from '../utils/helpers';
import { 
  Target, 
  Briefcase, 
  DollarSign, 
  Award, 
  Loader2,
  Clock
} from 'lucide-react';
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/reports/summary');
        setStats(response.data);
      } catch (error) {
        console.log('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar title="Dashboard" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Pre-process distributions for chart inputs
  const barData = stats?.statusDistribution?.map(item => ({
    status: item._id,
    Leads: item.count
  })) || [];

  const pieData = stats?.scoreDistribution?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  // Colors for score cells: Hot (Red), Warm (Yellow/Amber), Cold (Blue)
  const SCORE_COLORS = {
    Hot: '#EF4444',
    Warm: '#F59E0B',
    Cold: '#3B82F6'
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Dashboard Overview" />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* 5 Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <StatCard 
              title="Total Leads" 
              value={stats?.totalLeads || 0} 
              icon={Target} 
              color="blue" 
            />
            <StatCard 
              title="Converted Deals" 
              value={stats?.totalConversions || 0} 
              icon={Award} 
              color="yellow" 
            />
            <StatCard 
              title="Active Clients" 
              value={stats?.totalClients || 0} 
              icon={Briefcase} 
              color="green" 
            />
            <StatCard 
              title="Total Revenue" 
              value={formatCurrency(stats?.totalRevenue || 0)} 
              icon={DollarSign} 
              color="indigo" 
            />
            <StatCard 
              title="Overdue Followups" 
              value={stats?.overdueFollowUps || 0} 
              icon={Clock} 
              color="red" 
            />
          </div>

          {/* Monthly Target vs Achieved Progress Bar */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase">
                  Monthly Sales Target Progress
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Track your monthly revenue achievements against your set target
                </p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Target / Achieved</span>
                <span className="text-sm font-bold text-indigo-600">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </span>
                <span className="text-xs text-gray-400 font-semibold mx-1">/</span>
                <span className="text-xs text-gray-500 font-semibold">
                  {formatCurrency(stats?.monthlyTarget || 0)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${Math.min(
                      100, 
                      stats?.monthlyTarget > 0 
                        ? Math.round((stats.totalRevenue / stats.monthlyTarget) * 100) 
                        : 0
                    )}%` 
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">
                <span>0%</span>
                <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                  {stats?.monthlyTarget > 0 
                    ? `${Math.round((stats.totalRevenue / stats.monthlyTarget) * 100)}% Completed`
                    : 'No Target Set'}
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-96">
              <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase mb-6">
                Leads by Status Pipeline
              </h3>
              <div className="flex-1">
                {barData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    No leads data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="status" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <Tooltip cursor={{ fill: '#F3F4F6' }} />
                      <Bar dataKey="Leads" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Pie Chart card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col h-96">
              <h3 className="text-sm font-bold text-gray-700 tracking-wide uppercase mb-6">
                Lead Scores Distribution
              </h3>
              <div className="flex-1">
                {pieData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    No score data available
                  </div>
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
                          <Cell key={`cell-${index}`} fill={SCORE_COLORS[entry.name] || '#6366F1'} />
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

export default Dashboard;
