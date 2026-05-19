import React from "react";
import type { Agent } from "../../../data/agentsData";

const planStyles: Record<string, string> = {
  Professional: "bg-purple-100 text-purple-800",
  Enterprise:   "bg-indigo-100 text-indigo-800",
  Basic:        "bg-gray-100 text-gray-700",
};

const statusStyles: Record<string, string> = {
  active:    "bg-green-50 text-green-700",
  pending:   "bg-orange-50 text-orange-600",
  suspended: "bg-red-50 text-red-700",
};

interface Props { agent: Agent }

const AgentTableRow: React.FC<Props> = ({ agent: a }) => (
  <tr className="border-b border-gray-100/60 hover:bg-gray-50/60 last:border-0 transition-colors">
    <td className="py-4.5 px-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-[13px] font-medium flex-shrink-0">
          {a.initials}
        </div>
        <div>
          <p className="text-[13px] font-medium text-gray-900">{a.name}</p>
          <p className="text-[11.5px] text-gray-400">{a.email}</p>
        </div>
      </div>
    </td>
    <td className="py-4.5 px-5">
      <p className="text-[13px] text-gray-800">{a.agency}</p>
      <p className="text-[11.5px] text-gray-400">{a.phone}</p>
    </td>
    <td className="py-4.5 px-5">
      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${planStyles[a.plan]}`}>
        {a.plan}
      </span>
    </td>
    <td className="py-4.5 px-5 text-[13px] font-medium text-gray-900">{a.listings}</td>
    <td className="py-4.5 px-5 text-[13px] font-medium text-green-600">
      £{a.revenue.toLocaleString()}
    </td>
    <td className="py-4.5 px-5">
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wide uppercase ${statusStyles[a.status]}`}>
        {a.status}
      </span>
    </td>
    <td className="py-4.5 px-5 text-[12.5px] text-gray-500">{a.joined}</td>
    <td className="py-4.5 px-5">
      <button className="text-gray-400 hover:text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 text-lg">⋮</button>
    </td>
  </tr>
);

export default AgentTableRow;