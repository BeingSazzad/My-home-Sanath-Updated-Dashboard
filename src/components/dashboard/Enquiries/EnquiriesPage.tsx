import { useState } from "react";
import type { Enquiry } from "../../../types/enquiry";

import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { EnquiryTable } from "./EnquiryTable";
import { EnquiryModal } from "./EnquiryModal";
import { Inbox, Calendar, BarChart3, Filter } from "lucide-react";
import { useGetEnquiryStatsQuery, useGetAllEnquiriesQuery } from "../../../redux/features/enquiries/enquiriesApi";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../ui/pagination";


const StatsCard = ({ title, value, icon: Icon, iconBg, iconColor }: any) => {
    return (
        <Card className="rounded-2xl border border-gray-150/70 shadow-sm bg-white hover:shadow-md transition-all duration-300">
        <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-800">{value}</span>
                </div>
              </div>
            </div>
        </CardContent>
        </Card>
    );
};


export default function EnquiriesPage() {
  const [selected, setSelected] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const { data: stats } = useGetEnquiryStatsQuery(undefined);
  const { data: apiData, isLoading } = useGetAllEnquiriesQuery({
    page,
    limit: PAGE_SIZE,
    searchTerm: search || undefined,
  });

  const enquiriesList = apiData?.data || [];

  const totalPages = apiData?.meta?.totalPage || 1;

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleView = (item: Enquiry) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="title">Leads & Enquiries</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Total Enquiries"
          value={stats?.totalEnqueries?.toLocaleString() || "0"}
          icon={Inbox}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="New This Week"
          value={stats?.thisWeekEnqueries?.toLocaleString() || "0"}
          icon={Calendar}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="This Month"
          value={stats?.thisMonthEnqueries?.toLocaleString() || "0"}
          icon={BarChart3}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9 bg-white"
          placeholder="Search by name and email"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <EnquiryTable data={enquiriesList} onView={handleView} isLoading={isLoading} />

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

      {/* Modal */}
      <EnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        data={selected || undefined}
      />
    </div>
  );
}