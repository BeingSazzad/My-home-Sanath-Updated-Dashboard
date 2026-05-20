import { Calendar, CreditCard, Download, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../../ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";
import { useGetTransactionsQuery } from "../../../redux/transaction/transactionApi";
import { TransactionStatusBadge } from "./TransactionStatusBadge";


const PAGE_SIZE = 5;

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: apiData, isLoading } = useGetTransactionsQuery({
    page,
    limit: PAGE_SIZE,
    searchTerm: search || undefined,
    status: statusFilter || undefined,
  });

  const transactionsList = apiData?.data || [];
  const totalItems = apiData?.meta?.total || 0;
  const totalPages = apiData?.meta?.totalPage || 1;

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="title">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all platform transactions and payments
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-grow max-w-sm">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-9 bg-white"
            placeholder="Search by agent, email, or transaction ID..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="canceled">Canceled</option>
          <option value="deactivated">Deactivated</option>
        </select>

        {/* Clear Filters Button */}
        {(search|| statusFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setPage(1);
            }}
            className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>
          <p className="text-sm text-gray-500">{totalItems} transactions found</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="text-xs uppercase tracking-wider text-gray-500">
              <TableHead>Transaction ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">Loading...</TableCell>
              </TableRow>
            ) : transactionsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">No transactions found</TableCell>
              </TableRow>
            ) : (
              transactionsList.map((txn: any) => (
                <TableRow key={txn._id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-sm text-gray-700 flex items-center gap-2">
                    <CreditCard size={14} className="text-gray-400" />
                    {txn.trxId || txn._id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{txn.userId?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{txn.userId?.email || ''}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">{txn.planId?.title || 'Unknown Plan'}</TableCell>
                  <TableCell
                    className={`text-sm font-semibold ${
                      txn.amountPaid < 0 ? "text-red-500" : "text-gray-900"
                    }`}
                  >
                    {txn.amountPaid < 0 ? `-£${Math.abs(txn.amountPaid).toFixed(2)}` : `£${txn.amountPaid?.toFixed(2) || '0.00'}`}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-gray-400" />
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={txn.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
    </div>
  );
}