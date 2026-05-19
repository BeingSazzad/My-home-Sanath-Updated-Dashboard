

import { BsCurrencyDollar } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { useGetAnalyticsQuery } from "../../../redux/features/dashboard/dashboardApi";
import StatsCard from "./StatsCard";

const StatsCards = () => {
  const { data: analyticsData } = useGetAnalyticsQuery(undefined);

  const stats = [
    {
      title: "Total Property Seekers",
      value: analyticsData?.totalPropertySeekers
        ? analyticsData.totalPropertySeekers.toLocaleString()
        : "4,020",
      icon: <FiUsers className="h-5 w-5 text-blue-600" />,
      iconBgColor: "bg-blue-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
    },
    {
      title: "Total Agents",
      value: analyticsData?.totalAgents ?? "342",
      icon: <MdOutlineRealEstateAgent className="h-5 w-5 text-purple-600" />,
      iconBgColor: "bg-purple-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
    },
    {
      title: "Total Revenue",
      value: analyticsData?.totalRevenue
        ? `£${analyticsData.totalRevenue.toLocaleString()}`
        : "£412,450",
      icon: <BsCurrencyDollar className="h-5 w-5 text-green-600" />,
      iconBgColor: "bg-green-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
    },
  ];

  return (
    <div className="w-full mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="title">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
           { stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
      </div>
    </div>
  );
};

export default StatsCards;