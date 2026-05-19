import React, { useState, useMemo } from "react";
import { listingsData } from "../../../data/listingsData";
import ListingStatCards from "./ListingStatCards";
import ListingTabs from "./ListingTabs";
import ListingTable from "./ListingTable";

type Tab = "all" | "pending";

const ListingsManagement: React.FC = () => {
  const [tab, setTab]       = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bedsFilter, setBedsFilter] = useState("");

  const filtered = useMemo(() => {
    const q    = search.toLowerCase();
    const base = tab === "pending"
      ? listingsData.filter(l => l.status === "pending")
      : listingsData;
    return base.filter(l => {
      const matchQ = !q ||
        l.title.toLowerCase().includes(q)   ||
        l.address.toLowerCase().includes(q) ||      
        l.agency.toLowerCase().includes(q);
      const matchType = !typeFilter || l.type === typeFilter;
      const matchBeds = !bedsFilter || 
        (bedsFilter === "4+" ? l.beds >= 4 : l.beds === parseInt(bedsFilter));
      return matchQ && matchType && matchBeds;
    });
  }, [tab, search, typeFilter, bedsFilter]);

  const pendingCount = listingsData.filter(l => l.status === "pending").length;

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
        <div>
          <h1 className="title">Listings Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all property listings on the platform</p>
        </div>
        <div className="flex gap-2">
          {["Export","Import"].map(label => (
            <button key={label} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {label === "Export"
                  ? <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>
                  : <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>}
              </svg>
              {label}
            </button>
          ))}
        </div>
      </div>

      <ListingStatCards listings={listingsData} />

      <ListingTabs
        active={tab}
        allCount={listingsData.length}
        pendingCount={pendingCount}
        onChange={(t) => { setTab(t); setSearch(""); setTypeFilter(""); setBedsFilter(""); }}
      />

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-grow flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-10 bg-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, address, city, agent..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="Rent">For Rent</option>
          <option value="Sale">For Sale</option>
        </select>

        {/* Beds Filter */}
        <select
          value={bedsFilter}
          onChange={(e) => setBedsFilter(e.target.value)}
          className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Bedrooms</option>
          <option value="1">1 Bed</option>
          <option value="2">2 Beds</option>
          <option value="3">3 Beds</option>
          <option value="4+">4+ Beds</option>
        </select>

        {/* Clear Filters Button */}
        {(search || typeFilter || bedsFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setTypeFilter("");
              setBedsFilter("");
            }}
            className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer px-2 py-1"
          >
            Clear Filters
          </button>
        )}
      </div>

      <ListingTable listings={filtered} />
    </div>
  );
};

export default ListingsManagement;