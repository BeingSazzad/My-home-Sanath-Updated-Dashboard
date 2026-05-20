import React from "react";
import type { Listing } from "../../../data/listingsData";


interface Props { 
  listings?: Listing[];
  stats?: {
    total?: number;
    published?: number;
    pendingApproval?: number;
    rejected?: number;
  };
}

const infoMap: Record<string, { badge: string; style: string }> = {
  "Total Listings": { badge: "All properties", style: "text-blue-600 bg-blue-50/70 border-blue-100" },
  "Active": { badge: "Live on site", style: "text-green-600 bg-green-50/70 border-green-100" },
  "Pending": { badge: "Awaiting review", style: "text-amber-600 bg-amber-50/70 border-amber-100" },
  "Rejected": { badge: "Declined", style: "text-red-600 bg-red-50/70 border-red-100" },
};

const ListingStatCards: React.FC<Props> = ({ stats }) => {
  

  const cards = [
    { label:"Total Listings", value: stats?.total ?? 0 },
    { label:"Active",          value: stats?.published ?? 0 },
    { label:"Pending",         value: stats?.pendingApproval ?? 0 },
    { label:"Rejected",        value: stats?.rejected ?? 0 },
  ];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(c => {
        const info = infoMap[c.label] || { badge: "", style: "" };
        return (
          <div key={c.label} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col justify-between min-h-[105px]">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{c.label}</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{c.value}</p>
            </div>
            <div className="mt-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 border rounded-full ${info.style}`}>
                {info.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListingStatCards;