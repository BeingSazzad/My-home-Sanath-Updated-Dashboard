import React from "react";

import AgentTableRow from "./AgentTableRow";
import type { Agent } from "../../../data/agentsData";

const HEADERS = ["AGENT", "AGENCY", "PLAN", "LISTINGS", "REVENUE", "STATUS", "JOINED", "ACTIONS"];

interface Props { agents: Agent[]; total: number }

const AgentTable: React.FC<Props> = ({ agents, total }) => (
  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50/70 border-b border-slate-100">
            {HEADERS.map(h => (
              <th key={h} className="text-left text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-4 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agents.map(a => <AgentTableRow key={a._id || a.id} agent={a} />)}
        </tbody>
      </table>
    </div>
    <div className="flex justify-between items-center px-5 py-3.5 border-t border-slate-100">
      <span className="text-sm text-gray-400">Showing {agents.length} of {total} agents</span>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Previous</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm bg-blue-600 text-white">1</button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-100">2</button>
        <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Next</button>
      </div>
    </div>
  </div>
);

export default AgentTable;