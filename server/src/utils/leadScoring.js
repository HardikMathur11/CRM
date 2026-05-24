const calculateLeadScore = (priority, status) => {
  if (priority === 'High' && (status === 'Proposal Sent' || status === 'Negotiation' || status === 'Won')) {
    return 'Hot';
  } else if (priority === 'Medium' || status === 'Contacted' || status === 'Qualified') {
    return 'Warm';
  } else {
    return 'Cold';
  }
};

module.exports = calculateLeadScore;
