// Helper function to format date nicely
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status badge colors based on requirements
export const getStatusColor = (status) => {
  switch (status) {
    case 'New':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Contacted':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Qualified':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Proposal Sent':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Negotiation':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Won':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Lost':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get score badge colors based on requirements
export const getScoreColor = (score) => {
  switch (score) {
    case 'Hot':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Warm':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Cold':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
