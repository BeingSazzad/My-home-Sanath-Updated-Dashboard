import React, { useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import { cn } from "../../../lib/utils";
import { statsData } from "../../../data/revenueData";
import RevenueStatCard from "./RevenueStatCard";
import RevenueTrendChart from "./RevenueTrendChart";
import RecentTransactions from "./RecentTransactions";
import { Button } from "../../ui/button";

type Period = "All Time" | "This Year" | "This Month";

const PERIODS: Period[] = [
  "All Time",
  "This Year",
  "This Month",
];

const RevenueAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<Period>("This Year");
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="title">Revenue Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track and analyze platform revenue performance</p>
        </div>

        <div className="flex gap-2 items-center">
          {/* Period Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="text-slate-700">{period}</span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", open && "rotate-180")} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-100 shadow-lg z-20 py-1 overflow-hidden">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm transition-colors",
                      period === p
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <Button variant="outline" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {statsData.map((s) => {
          let baseLabel = "";
          if (s.id === "total") baseLabel = "Revenue";
          if (s.id === "month") baseLabel = "Net Profit";
          if (s.id === "txn") baseLabel = "Transactions";
          
          const label = period === "All Time" ? `Total ${baseLabel}` : `${baseLabel} (${period})`;
          return <RevenueStatCard key={s.id} {...s} label={label} />;
        })}
      </div>

      {/* Trend Chart */}
      <div className="mb-4">
        <RevenueTrendChart />
      </div>

      {/* Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default RevenueAnalytics;