// components/dashboard/Charts/DashboardCharts.tsx
import { useState } from "react";
import ChartCard from "./ChartCard";
import {
  useGetUserMonthlyStatsQuery,
  useGetRevenueMonthlyStatsQuery,
  useGetAgentMonthlyStatsQuery,
} from "../../../redux/features/dashboard/dashboardApi";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Fallback static data for dev/preview
const fallbackUserData = [
  1200, 1500, 1800, 2000, 2200, 2500, 2700, 2900, 3000, 3200, 3400, 3500,
].map((v, i) => ({ month: monthNames[i], value: v }));

const fallbackRevenueData = [
  10000, 15000, 18000, 22000, 26000, 30000, 34000, 38000, 42000, 46000, 50000, 54000,
].map((v, i) => ({ month: monthNames[i], value: v }));

const fallbackAgentData = [
  180, 195, 210, 220, 235, 245, 258, 270, 285, 300, 330, 355,
].map((v, i) => ({ month: monthNames[i], value: v }));

const DashboardCharts = () => {
  const [userYear, setUserYear] = useState(new Date().getFullYear().toString());
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear().toString());
  const [agentYear, setAgentYear] = useState(new Date().getFullYear().toString());

  const { data: userStatsResponse } = useGetUserMonthlyStatsQuery(userYear);
  const { data: revenueStatsResponse } = useGetRevenueMonthlyStatsQuery(revenueYear);
  const { data: agentStatsResponse } = useGetAgentMonthlyStatsQuery(agentYear);

  const userGrowthData =
    userStatsResponse?.map((item: any) => ({
      month: item.month,
      value: item.totalUsers,
    })) || fallbackUserData;

  const revenueData =
    revenueStatsResponse?.map((item: any) => ({
      month: item.month,
      value: item.totalRevenue,
    })) || fallbackRevenueData;

  const agentData =
    agentStatsResponse?.map((item: any) => ({
      month: item.month,
      value: item.totalAgents,
    })) || fallbackAgentData;

  const currentUsers = userGrowthData.at(-1)?.value ?? 0;
  const currentRevenue = revenueData.at(-1)?.value ?? 0;
  const currentAgents = agentData.at(-1)?.value ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 py-2">
      <ChartCard
        title="Property Seeker"
        subtitle="Total property seekers over time"
        data={userGrowthData}
        color="#3b82f6"
        gradientId="userGradient"
        footerLabel="Current"
        footerValue={`${currentUsers.toLocaleString()} seekers`}
        selectedYear={userYear}
        onYearChange={setUserYear}
        yAxisProps={{
          domain: [0, (dataMax: number) => (dataMax <= 50 ? 50 : Math.ceil(dataMax / 10) * 10)],
          tickCount: 6,
        }}
      />
      <ChartCard
        title="Revenue"
        subtitle="Monthly revenue trend"
        data={revenueData}
        color="#10b981"
        gradientId="revenueGradient"
        footerLabel="This month"
        footerValue={`£${currentRevenue.toLocaleString()}`}
        selectedYear={revenueYear}
        onYearChange={setRevenueYear}
        yAxisProps={{
          domain: [0, (dataMax: number) => Math.max(200000, dataMax)],
          ticks: [0, 50000, 100000, 150000, 200000],
        }}
      />
      <ChartCard
        title="Agents"
        subtitle="Agent acquisition trend"
        data={agentData}
        color="#f97316"
        gradientId="agentGradient"
        footerLabel="Total agents"
        footerValue={`${currentAgents} agents`}
        selectedYear={agentYear}
        onYearChange={setYear => setAgentYear(setYear)}
        yAxisProps={{
          domain: [0, (dataMax: number) => (dataMax <= 50 ? 50 : Math.ceil(dataMax / 10) * 10)],
          tickCount: 6,
        }}
      />
    </div>
  );
};

export default DashboardCharts;