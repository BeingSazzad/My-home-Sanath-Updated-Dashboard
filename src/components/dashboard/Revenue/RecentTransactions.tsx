import React from "react";
import { useGetRecentTransactionsQuery } from "../../../redux/features/revenue/revenueApi";
import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";


const AgentIcon = () => (
  <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalizedStatus = status?.toLowerCase() || '';
  let bgClass = "bg-gray-50 text-gray-700";
  
  if (normalizedStatus === "active") {
    bgClass = "bg-green-50 text-green-700";
  } else if (normalizedStatus === "trialing") {
    bgClass = "bg-blue-50 text-blue-700";
  } else if (normalizedStatus === "canceled" || normalizedStatus === "deactivated") {
    bgClass = "bg-red-50 text-red-700";
  }

  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${bgClass} capitalize`}>
      {status || 'Unknown'}
    </span>
  );
};

const RecentTransactions: React.FC = () => {
  const { data, isLoading } = useGetRecentTransactionsQuery(5);
  const transactions = Array.isArray(data) ? data : data?.data || [];
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/transactions");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-lg font-medium text-gray-900">Recent Transactions</p>
          <p className="text-xs text-gray-400">Latest revenue transactions</p>
        </div>
        <Button variant="ghost" className="text-[13px] " onClick={handleViewAll}>View all →</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["TRANSACTION ID","AGENT","AMOUNT","DATE","STATUS"].map((h) => (
                <th key={h} className="text-left text-[11px] font-normal text-gray-400 tracking-wider pb-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">No transactions found</td>
              </tr>
            ) : (
              transactions.map((txn: any) => (
                <tr key={txn._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-900">{txn.trxId || txn._id}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <AgentIcon />
                      <span className="text-gray-700">{txn.userId?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-900">£{txn.amountPaid}</td>
                  <td className="py-3 pr-4 text-gray-400">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td className="py-3"><StatusBadge status={txn.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;