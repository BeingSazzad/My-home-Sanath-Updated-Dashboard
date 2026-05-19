import React from "react";

type Tab = "all" | "pending";

interface Props {
  active: Tab;
  allCount: number;
  pendingCount: number;
  onChange: (tab: Tab) => void;
}

const ListingTabs: React.FC<Props> = ({ active, allCount, pendingCount, onChange }) => (
  <div className="flex items-center gap-0 border-b border-gray-200 mb-4">
    {([
      { key:"all",     label:"All Listings",     count:allCount,     icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
      { key:"pending", label:"Pending Approval", count:pendingCount, icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    ] as const).map(t => (
      <button
        key={t.key}
        onClick={() => onChange(t.key)}
        className={`flex items-center gap-2 px-4 py-2.5 text-[13.5px] border-b-2 -mb-px mr-2 transition-colors ${
          active === t.key
            ? "border-slate-800 text-slate-900 font-semibold"
            : "border-transparent text-slate-400 hover:text-slate-700"
        }`}
      >
        {t.icon}
        {t.label}
        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold ${
          active === t.key ? "bg-slate-100 text-slate-800" : "bg-slate-50 text-slate-500"
        }`}>
          {t.count}
        </span>
      </button>
    ))}

    
  </div>
);

export default ListingTabs;