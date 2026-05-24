import React, { useState } from "react";
import ListingStatCards from "./ListingStatCards";
import ListingTabs from "./ListingTabs";
import ListingTable from "./ListingTable";
import { useGetAllListingsQuery, useGetListingStatsQuery } from "../../../redux/features/listings/listingsApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";

type Tab = "all" | "pending";

const ListingsManagement: React.FC = () => {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: allData, isLoading } = useGetAllListingsQuery({
    page,
    limit,
    searchTerm: search || undefined,
    listingType: typeFilter ? typeFilter.toUpperCase() : undefined,
    status: tab === "pending" ? "PENDING_APPROVAL" : undefined,
  });

  // Fetch counts independently so they don't go to 0 when switching tabs
  const { data: allCountData } = useGetAllListingsQuery({ limit: 1 });
  const { data: pendingCountData } = useGetAllListingsQuery({ limit: 1, status: "PENDING_APPROVAL" });
  const { data: stats } = useGetListingStatsQuery(undefined);



  const listingsList = allData?.data || [];
  const totalPages = allData?.meta?.totalPage || 1;
  const allCount = allCountData?.meta?.total || 0;
  const pendingCount = pendingCountData?.meta?.total || 0;

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-start mb-5 flex-wrap gap-3">
        <div>
          <h1 className="title">Listings Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all property listings on the platform</p>
        </div>
      </div>

      {/* Stats */}
      <ListingStatCards stats={stats}
      />

      <ListingTabs
        active={tab}
        allCount={allCount}
        pendingCount={pendingCount}
        onChange={(t) => { setTab(t); setSearch(""); setTypeFilter(""); setPage(1); }}
      />

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-grow flex items-center gap-2 border border-gray-200 rounded-lg px-3 h-10 bg-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search by title, city, country..."
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

        {/* Clear Filters Button */}
        {(search || typeFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setTypeFilter("");
              setPage(1);
            }}
            className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer px-2 py-1"
          >
            Clear Filters
          </button>
        )}
      </div>

      <ListingTable listings={listingsList} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ListingsManagement;