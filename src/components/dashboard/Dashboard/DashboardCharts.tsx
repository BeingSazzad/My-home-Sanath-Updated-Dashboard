// components/dashboard/Charts/DashboardCharts.tsx
import { useState } from "react";
import ChartCard from "./ChartCard";
import { useGetRecentActivitiesQuery } from "../../../redux/features/notification/notificationApi";

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

  const { data: userDataResponse } = useGetRecentActivitiesQuery({ year: userYear });
  const { data: revenueDataResponse } = useGetRecentActivitiesQuery({ year: revenueYear });
  const { data: agentDataResponse } = useGetRecentActivitiesQuery({ year: agentYear });

  const userGrowthData =
    userDataResponse?.userGrowth?.map((item: any) => ({
      month: monthNames[item.month - 1],
      value: item.totalUsers,
    })) || fallbackUserData;

  const revenueData =
    revenueDataResponse?.revenue?.map((item: any) => ({
      month: monthNames[item.month - 1],
      value: item.totalRevenue,
    })) || fallbackRevenueData;

  const agentData =
    agentDataResponse?.agents?.map((item: any) => ({
      month: monthNames[item.month - 1],
      value: item.totalAgents,
    })) || fallbackAgentData;

  const currentUsers = userGrowthData.at(-1)?.value ?? 0;
  const currentRevenue = revenueData.at(-1)?.value ?? 0;
  const currentAgents = agentData.at(-1)?.value ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 py-2">
      <ChartCard
        title="User Growth"
        subtitle="Total users over time"
        data={userGrowthData}
        color="#3b82f6"
        gradientId="userGradient"
        footerLabel="Current"
        footerValue={`${currentUsers.toLocaleString()} users`}
        selectedYear={userYear}
        onYearChange={setUserYear}
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
        onYearChange={setAgentYear}
      />
    </div>
  );
};

export default DashboardCharts;