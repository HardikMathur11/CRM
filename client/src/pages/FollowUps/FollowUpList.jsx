import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import FollowUpItem from '../../components/FollowUpItem';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-hot-toast';
import { CheckCircle2, X, Loader2 } from 'lucide-react';

const FollowUpList = () => {
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All', 'Pending', 'Done', 'Overdue'

  // Completion modal state
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
  const [outcomeText, setOutcomeText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFollowUps = async () => {
    try {
      const response = await axiosInstance.get('/followups');
      setFollowups(response.data);
    } catch (error) {
      console.log('Error fetching followups:', error);
      toast.error('Failed to load follow-ups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleMarkDoneClick = (followup) => {
    setSelectedFollowUp(followup);
    setOutcomeText('');
  };

  const handleSubmitOutcome = async (e) => {
    e.preventDefault();
    if (!outcomeText.trim()) {
      toast.error('Please record the followup outcome notes.');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.put(`/followups/${selectedFollowUp._id}`, {
        status: 'Done',
        outcome: outcomeText
      });
      toast.success('Follow-up completed successfully!');
      setSelectedFollowUp(null);
      fetchFollowUps();
    } catch (error) {
      console.log('Error updating followup:', error);
      toast.error('Failed to complete follow-up.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter list matching active status button selection
  const filteredFollowUps = followups.filter(item => {
    const isOverdue = item.status === 'Pending' && new Date(item.scheduledAt) < new Date();

    if (filter === 'Pending') return item.status === 'Pending' && !isOverdue;
    if (filter === 'Done') return item.status === 'Done';
    if (filter === 'Overdue') return isOverdue;
    return true; // 'All'
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Interaction Follow-ups" />

        {/* Filters Banner */}
        <div className="bg-white border-b border-gray-100 p-6 flex items-center gap-2">
          {['All', 'Pending', 'Overdue', 'Done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === f
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f} ({
                f === 'All' ? followups.length :
                f === 'Pending' ? followups.filter(i => i.status === 'Pending' && new Date(i.scheduledAt) >= new Date()).length :
                f === 'Overdue' ? followups.filter(i => i.status === 'Pending' && new Date(i.scheduledAt) < new Date()).length :
                followups.filter(i => i.status === 'Done').length
              })
            </button>
          ))}
        </div>

        {/* Main List */}
        <main className="flex-1 overflow-y-auto p-8 space-y-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : filteredFollowUps.length === 0 ? (
            <div className="h-48 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-xs text-gray-400 font-medium bg-white p-6 shadow-sm">
              No follow-ups recorded in this filter category.
            </div>
          ) : (
            filteredFollowUps.map(item => (
              <FollowUpItem 
                key={item._id} 
                followup={item} 
                onComplete={handleMarkDoneClick} 
              />
            ))
          )}
        </main>
      </div>

      {/* Outcome Entry Modal */}
      {selectedFollowUp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-base">Record Follow-up Outcome</h3>
              <button 
                onClick={() => setSelectedFollowUp(null)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmitOutcome} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Outcome / Resolution Notes *
                </label>
                <textarea
                  rows="3"
                  required
                  value={outcomeText}
                  onChange={(e) => setOutcomeText(e.target.value)}
                  placeholder="e.g. Spoke with client. They signed the contract copy and requested onboarding scheduled next week."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFollowUp(null)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>{submitting ? 'Saving...' : 'Submit Resolution'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpList;
