import React from "react";
import { statsData } from "../../../data/revenueData";
import RevenueStatCard from "./RevenueStatCard";
import RevenueTrendChart from "./RevenueTrendChart";
// import RevenueSources from "./RevenueSources";
import RecentTransactions from "./RecentTransactions";
import { Button } from "../../ui/button";

const RevenueAnalytics: React.FC = () => (
  <div className="">
    {/* Header */}
    <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="title">Revenue Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track and analyze platform revenue performance</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-1.5  ">
          📅 Last 12 months
        </button>
        <Button variant="outline" className="">
          ⬇ Export Report
        </Button>
      </div>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-3 gap-4 mb-4">
      {statsData.map((s) => <RevenueStatCard key={s.id} {...s} />)}
    </div>

    {/* Trend Chart */}
    <div className="mb-4">
      <RevenueTrendChart />
    </div>

    {/* Transactions */}
    <RecentTransactions />
  </div>
);

export default RevenueAnalytics;