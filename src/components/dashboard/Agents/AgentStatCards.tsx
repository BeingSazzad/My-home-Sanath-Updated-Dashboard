import React from "react";
import type { Agent } from "../../../data/agentsData";
import { useGetAgentStatsQuery } from "../../../redux/features/user/userApi";

interface Props { agents: Agent[] }

const AgentStatCards: React.FC<Props> = () => {
  const { data: stats } = useGetAgentStatsQuery(undefined);

  const totalAgents = stats?.totalAgents || 0;
  const activeAgents = stats?.activeAgents || 0;
  const inactiveAgents = stats?.inactiveAgents || 0;
  const totalRevenue = stats?.totalRevenue || 0;

  const cards = [
    { label: "Total Agents", value: totalAgents, cls: "text-gray-900" },
    { label: "Active", value: activeAgents, cls: "text-green-600" },
    { label: "Inactive", value: inactiveAgents, cls: "text-orange-500" },
    { label: "Total Revenue", value: `£${totalRevenue.toLocaleString()}`, cls: "text-blue-600" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map(c => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
          <p className="text-xs text-gray-400 mb-2">{c.label}</p>
          <p className={`text-3xl font-medium ${c.cls}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AgentStatCards;