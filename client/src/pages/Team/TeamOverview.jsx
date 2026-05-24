import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import { Plus, X, UserPlus, Loader2 } from 'lucide-react';

const TeamOverview = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'bda',
    phone: '',
    monthlyTarget: 50000
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      const response = await axiosInstance.get('/auth/users');
      setTeam(response.data);
    } catch (error) {
      console.log('Error fetching team:', error);
      toast.error('Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monthlyTarget' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/auth/create-user', formData);
      toast.success('Team member onboarded successfully!');
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'bda', phone: '', monthlyTarget: 50000 });
      fetchTeam();
    } catch (error) {
      console.log('Create team member error:', error);
      toast.error(error.response?.data?.message || 'Failed to onboard team member.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Team Workspace" />

        {/* Action Header bar */}
        <div className="bg-white border-b border-gray-100 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Manage roles & monthly revenue targets
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all self-start sm:self-center"
          >
            <Plus size={16} />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Team Members List */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
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
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Monthly Target</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                    {team.map(member => (
                      <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">
                          <div>
                            <p>{member.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">{member.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${member.role === 'admin' ? 'text-purple-600 bg-purple-50 border-purple-100' :
                            member.role === 'manager' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                              'text-indigo-600 bg-indigo-50 border-indigo-100'
                            }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">99*******99</td>
                        <td className="px-6 py-4 font-bold text-gray-700">
                          {formatCurrency("10000000")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shadow-sm shadow-green-500/20" title="Active"></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Team Member Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-base">Onboard Team Member</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Initial Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Portal Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-600 outline-none"
                  >
                    <option value="bda">BDA</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Monthly Target ($)</label>
                <input
                  type="number"
                  name="monthlyTarget"
                  value={formData.monthlyTarget}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <UserPlus size={14} />
                  <span>{submitting ? 'Creating...' : 'Onboard'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamOverview;
