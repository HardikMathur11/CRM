import React from 'react';
import LeadCard from './LeadCard';

const KanbanColumn = ({ title, leads = [] }) => {
  // Calculate total estimated value of leads in this stage
  const totalValue = leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

  // Mapped colors matching status badges
  const getHeaderColor = (status) => {
    switch (status) {
      case 'New':
        return 'border-t-gray-400 bg-gray-50/60 text-gray-700';
      case 'Contacted':
        return 'border-t-blue-500 bg-blue-50/60 text-blue-700';
      case 'Qualified':
        return 'border-t-yellow-500 bg-yellow-50/60 text-yellow-700';
      case 'Proposal Sent':
        return 'border-t-purple-500 bg-purple-50/60 text-purple-700';
      case 'Negotiation':
        return 'border-t-orange-500 bg-orange-50/60 text-orange-700';
      case 'Won':
        return 'border-t-green-500 bg-green-50/60 text-green-700';
      case 'Lost':
        return 'border-t-red-500 bg-red-50/60 text-red-700';
      default:
        return 'border-t-indigo-500 bg-indigo-50/60 text-indigo-700';
    }
  };

  return (
    <div className="flex flex-col w-72 min-w-[18rem] bg-gray-50/40 border border-gray-100 rounded-xl overflow-hidden h-[calc(100vh-230px)] shadow-sm">
      {/* Column Header banner */}
      <div className={`p-4 border-t-4 border-b border-gray-100 flex flex-col ${getHeaderColor(title)}`}>
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm tracking-wide">{title}</span>
          <span className="text-[11px] font-bold bg-white text-gray-800 border border-gray-200/50 px-2 py-0.5 rounded-full shadow-sm">
            {leads.length}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1.5 block">
          Est. Sum: ${totalValue.toLocaleString()}
        </span>
      </div>

      {/* Cards Scrollable body */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {leads.length === 0 ? (
          <div className="h-24 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium">
            Empty Stage
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead._id} lead={lead} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
