import React from "react";
import type { Agent } from "../../../data/agentsData";

interface Props { agents: Agent[] }

const AgentStatCards: React.FC<Props> = ({ agents }) => {
  const active  = agents.filter(a => a.status === "active").length;
  const pending = agents.filter(a => a.status === "pending").length;
  const revenue = agents.reduce((s, a) => s + (a.revenue || 0), 0);

  const cards = [
    { label: "Total Agents",  value: agents.length,               cls: "text-gray-900" },
    { label: "Active",        value: active,                       cls: "text-green-600" },
    { label: "Pending",       value: pending,                      cls: "text-orange-500" },
    { label: "Total Revenue", value: `£${revenue.toLocaleString()}`, cls: "text-blue-600" },
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