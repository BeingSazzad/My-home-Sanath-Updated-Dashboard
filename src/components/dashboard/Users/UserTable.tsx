import React from "react";
    
import UserTableRow from "./UserTableRow";
import type { User } from "../../../data/usersData";

const HEADERS = ["USER","CONTACT","LOCATION","SAVED","ENQUIRIES","JOIN DATE","LAST ACTIVE","STATUS","ACTIONS"];

interface Props {
  users: User[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const UserTable: React.FC<Props> = ({ users, total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit) || 1;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);

      if (start === 1) {
        end = maxVisible;
      } else if (end === totalPages) {
        start = totalPages - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-[15px] font-medium text-gray-900">All Users</h2>
        <p className="text-xs text-gray-400 mt-0.5">{users.length} users found</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100">
              {HEADERS.map((h) => (
                <th key={h} className="text-left text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-4 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => <UserTableRow key={u._id || u.id} user={u} index={i} />)}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 flex-wrap gap-2">
        <span className="text-sm text-gray-400">Showing {users.length} of {total} users</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            Previous
          </button>
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer ${
                page === p
                  ? "bg-[#0B3C6D] text-white font-medium shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {p}
            </button>
          ))}
          <button 
            onClick={handleNext}
            disabled={page === totalPages || totalPages === 0}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;