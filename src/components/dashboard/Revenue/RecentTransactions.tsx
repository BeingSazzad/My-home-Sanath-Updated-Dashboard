import React from "react";
import { transactions } from "../../../data/revenueData";
import { Button } from "../../ui/button";


const AgentIcon = () => (
  <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
      status === "Completed"
        ? "bg-green-50 text-green-700"
        : "bg-amber-50 text-amber-700"
    }`}
  >
    {status}
  </span>
);

const RecentTransactions: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5">
    <div className="flex justify-between items-start mb-5">
      <div>
        <p className="text-lg font-medium text-gray-900">Recent Transactions</p>
        <p className="text-xs text-gray-400">Latest revenue transactions</p>
      </div>
      <Button variant="ghost" className="text-[13px] ">View all →</Button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-100">
            {["TRANSACTION ID","AGENT","TYPE","AMOUNT","DATE","STATUS"].map((h) => (
              <th key={h} className="text-left text-[11px] font-normal text-gray-400 tracking-wider pb-3 pr-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id} className="border-b border-gray-50 last:border-0">
              <td className="py-3 pr-4 font-medium text-gray-900">{txn.id}</td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <AgentIcon />
                  <span className="text-gray-700">{txn.agent}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-gray-500">{txn.type}</td>
              <td className="py-3 pr-4 font-medium text-gray-900">{txn.amount}</td>
              <td className="py-3 pr-4 text-gray-400">{txn.date}</td>
              <td className="py-3"><StatusBadge status={txn.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentTransactions;