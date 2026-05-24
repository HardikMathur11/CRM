import React from 'react';
import KanbanColumn from '../../components/KanbanColumn';

const LeadKanban = ({ leads }) => {
  const stages = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-200">
      {stages.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.status === stage);
        return <KanbanColumn key={stage} title={stage} leads={stageLeads} />;
      })}
    </div>
  );
};

export default LeadKanban;
