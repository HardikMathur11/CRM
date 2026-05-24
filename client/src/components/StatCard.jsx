import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', description }) => {
  // Tailwind mapping for dynamic background/text colors
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color] || 'bg-indigo-50 text-indigo-600'}`}>
        <Icon size={22} />
      </div>
    </div>
  );
};

export default StatCard;
