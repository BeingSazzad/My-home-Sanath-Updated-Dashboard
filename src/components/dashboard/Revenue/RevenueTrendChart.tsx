import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { trendData } from "../../../data/revenueData";

const chartData = trendData.labels.map((month, i) => ({
  month,
  revenue: trendData.values[i],
}));

const RevenueTrendChart: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5">
    <p className="text-[15px] font-medium text-gray-900">Revenue Trend</p>
    <p className="text-xs text-gray-400 mb-4">Monthly revenue</p>

    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#22c996" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#22c996" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "#888" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `£${v >= 1000 ? Math.round(v / 1000) + "k" : v}`}
        />
        {/* <Tooltip formatter={(v: number) => [`£${v.toLocaleString()}`, "Revenue"]} /> */}
        <Tooltip  />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#22c996"
          strokeWidth={2}
          fill="url(#revenueGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>

    <div className="grid grid-cols-3 gap-0 border-t border-gray-100 mt-4 pt-4">
      {[
        { label: "This Month", value: trendData.thisMonth, green: false },
        { label: "Target",     value: trendData.target,    green: false },
        { label: "Achievement",value: trendData.achievement, green: true },
      ].map(({ label, value, green }) => (
        <div key={label}>
          <p className="text-[11px] text-gray-400 mb-1">{label}</p>
          <p className={`text-base font-medium ${green ? "text-green-500" : "text-gray-900"}`}>{value}</p>
        </div>
      ))}
    </div>
  </div>
);

export default RevenueTrendChart;