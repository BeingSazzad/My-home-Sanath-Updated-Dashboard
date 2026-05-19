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
import { transactions } from "../../../data/transactions";
import { TransactionTypeBadge } from "./TransactionTypeBadge";
import { TransactionStatusBadge } from "./TransactionStatusBadge";


const PAGE_SIZE = 5;

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) => {
          const matchSearch =
            !search ||
            t.id.toLowerCase().includes(search.toLowerCase()) ||
            t.agent.name.toLowerCase().includes(search.toLowerCase()) ||
            t.agent.email.toLowerCase().includes(search.toLowerCase());
          const matchType = !typeFilter || t.type === typeFilter;
          const matchStatus = !statusFilter || t.status === statusFilter;
          return matchSearch && matchType && matchStatus;
        }
      ),
    [search, typeFilter, statusFilter]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <Button variant="outline" className="gap-2 bg-white">
          <Download size={16} />
          Export
        </Button>
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
        
        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="subscription">Subscription</option>
          <option value="featured">Featured Listing</option>
          <option value="refund">Refund</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 outline-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        {/* Clear Filters Button */}
        {(search || typeFilter || statusFilter) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setTypeFilter("");
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
          <p className="text-sm text-gray-500">{filtered.length} transactions found</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="text-xs uppercase tracking-wider text-gray-500">
              <TableHead>Transaction ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Plan/Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((txn) => (
              <TableRow key={txn.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  <CreditCard size={14} className="text-gray-400" />
                  {txn.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{txn.agent.name}</div>
                  <div className="text-xs text-gray-500">{txn.agent.email}</div>
                </TableCell>
                <TableCell>
                  <TransactionTypeBadge type={txn.type} />
                </TableCell>
                <TableCell className="text-sm text-gray-700">{txn.plan}</TableCell>
                <TableCell
                  className={`text-sm font-semibold ${
                    txn.amount < 0 ? "text-red-500" : "text-gray-900"
                  }`}
                >
                  {txn.amount < 0 ? `-£${Math.abs(txn.amount).toFixed(2)}` : `£${txn.amount.toFixed(2)}`}
                </TableCell>
                <TableCell className="text-sm text-gray-700">{txn.paymentMethod}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-gray-400" />
                    {txn.date}
                  </span>
                </TableCell>
                <TableCell>
                  <TransactionStatusBadge status={txn.status} />
                </TableCell>
              </TableRow>
            ))}
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