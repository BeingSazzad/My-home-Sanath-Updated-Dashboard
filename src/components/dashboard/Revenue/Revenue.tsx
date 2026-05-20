import React from "react";
import RevenueStatCard from "./RevenueStatCard";
import RevenueTrendChart from "./RevenueTrendChart";
import RecentTransactions from "./RecentTransactions";
import { useGetRevenueStatsQuery } from "../../../redux/features/revenue/revenueApi";



const RevenueAnalytics: React.FC = () => {
  const { data: stats } = useGetRevenueStatsQuery(undefined);
  console.log(stats);

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="title">Revenue Analytics</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track and analyze platform revenue performance</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <RevenueStatCard
          label="Total Revenue"
          value={`$${stats?.totalRevenue ?? 0}`}
          badge=""
          color="purple"
          icon="dollar"
        />
        <RevenueStatCard
          label="Total Revenue (This Month)"
          value={`$${stats?.totalRevenueThisMonth ?? 0}`}
          badge=""
          color="green"
          icon="trend"
        />
        <RevenueStatCard
          label="Total Transactions"
          value={`${stats?.totalTransactions ?? 0}`}
          badge=""
          color="blue"
          icon="card"
        />
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