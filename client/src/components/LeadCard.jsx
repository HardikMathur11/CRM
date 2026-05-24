import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor, getScoreColor } from '../utils/helpers';

const LeadCard = ({ lead }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/leads/${lead._id}`);
  };

  // Helper for priority color accents
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'Low':
        return 'text-blue-600 bg-blue-50 border-blue-100';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 space-y-3.5 group"
    >
      {/* Company Name & Score Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Building2 size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
          <h4 className="font-bold text-gray-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
            {lead.companyName}
          </h4>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(lead.score)}`}>
          {lead.score === 'Hot' ? '🔥 Hot' : lead.score === 'Warm' ? '🌡️ Warm' : '🧊 Cold'}
        </span>
      </div>

      {/* Contact Person */}
      <div>
        <p className="text-xs text-gray-400">Contact Person</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{lead.contactName}</p>
      </div>

      {/* Value & Expected Close Date */}
      <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-gray-50 text-xs">
        <div>
          <span className="text-gray-400 block">Est. Value</span>
          <span className="font-bold text-gray-800 flex items-center gap-0.5 mt-0.5">
            {formatCurrency(lead.estimatedValue)}
          </span>
        </div>
        <div>
          <span className="text-gray-400 block">Close Date</span>
          <span className="font-semibold text-gray-600 flex items-center gap-1 mt-0.5">
            <Calendar size={12} className="text-gray-400" />
            {lead.expectedCloseDate ? formatDate(lead.expectedCloseDate) : 'N/A'}
          </span>
        </div>
      </div>

      {/* Status & Priority Badge Footer */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50">
        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getPriorityStyle(lead.priority)}`}>
          {lead.priority} Priority
        </span>
      </div>
    </div>
  );
};

export default LeadCard;
