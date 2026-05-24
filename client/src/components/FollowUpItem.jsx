import React from 'react';
import { Calendar, CheckCircle2, AlertCircle, Phone, Mail, Users, MessageSquare, MapPin } from 'lucide-react';

const FollowUpItem = ({ followup, onComplete }) => {
  const isOverdue = followup.status === 'Pending' && new Date(followup.scheduledAt) < new Date();

  // Pick type-specific icons
  const getIcon = (type) => {
    switch (type) {
      case 'Call':
        return <Phone size={14} />;
      case 'Email':
        return <Mail size={14} />;
      case 'Meeting':
        return <Users size={14} />;
      case 'WhatsApp':
        return <MessageSquare size={14} />;
      case 'Site Visit':
        return <MapPin size={14} />;
      default:
        return <Calendar size={14} />;
    }
  };

  return (
    <div className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 ${
      isOverdue ? 'border-red-200 bg-red-50/10' : 'border-gray-100'
    }`}>
      {/* Reminders main detail */}
      <div className="space-y-1.5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className={`p-1.5 rounded-lg flex items-center justify-center ${
            isOverdue ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
          }`}>
            {getIcon(followup.type)}
          </div>
          <span className="font-semibold text-gray-800 text-sm">
            {followup.type} - {followup.lead?.companyName || 'N/A'}
          </span>

          {followup.status === 'Done' ? (
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100 flex items-center gap-1">
              <CheckCircle2 size={10} /> Completed
            </span>
          ) : isOverdue ? (
            <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 flex items-center gap-1 animate-pulse">
              <AlertCircle size={10} /> Overdue
            </span>
          ) : (
            <span className="text-[10px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
              Pending
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 font-medium">
          Scheduled: {new Date(followup.scheduledAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>

        {followup.notes && <p className="text-xs text-gray-600 mt-1">{followup.notes}</p>}
        
        {followup.outcome && (
          <div className="text-xs text-green-700 bg-green-50/50 p-2 rounded-lg mt-2 border border-green-50">
            <strong>Outcome:</strong> {followup.outcome}
          </div>
        )}
      </div>

      {/* Complete CTA */}
      {followup.status === 'Pending' && (
        <button
          onClick={() => onComplete(followup)}
          className="flex items-center gap-1.5 self-start md:self-center bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          <CheckCircle2 size={13} />
          <span>Mark Done</span>
        </button>
      )}
    </div>
  );
};

export default FollowUpItem;
