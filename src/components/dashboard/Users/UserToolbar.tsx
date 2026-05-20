import React from "react";


interface Props {
  search: string;
  status: string;
  onSearch: (v: string) => void;
  onStatus: (v: string) => void;
}

const UserToolbar: React.FC<Props> = ({ search, status, onSearch, onStatus }) => (
  <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3 mb-4 flex-wrap">
    <div className="flex-grow flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-9">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="flex-shrink-0">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name, email, or location..."
        className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
      />
    </div>
    
  
    <select
      value={status}
      onChange={(e) => onStatus(e.target.value)}
      className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer"
    >
      <option value="">All Statuses</option>
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
    </select>

    {/* Clear Filters Button */}
    {(search || status) && (
      <button
        onClick={() => {
          onSearch("");
          onStatus("");
        }}
        className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer px-2 py-1"
      >
        Clear Filters
      </button>
    )}
  </div>
);

export default UserToolbar;