

import { useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { useGetAnalyticsQuery } from "../../../redux/features/dashboard/dashboardApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import StatsCard from "./StatsCard";

const StatsCards = () => {
  const [filter, setFilter] = useState("This Year");
  const { data: analyticsData } = useGetAnalyticsQuery({ period: filter });

  const getTitle = (base: string) => {
    if (filter === "Total") return `Total ${base}`;
    return `${base} (${filter})`;
  };

  const stats = [
    {
      title: getTitle("Property Seekers"),
      value: analyticsData?.totalPropertySeekers
        ? analyticsData.totalPropertySeekers.toLocaleString()
        : "4,020",
      icon: <FiUsers className="h-5 w-5 text-blue-600" />,
      iconBgColor: "bg-blue-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
    },
    {
      title: getTitle("Agents"),
      value: analyticsData?.totalAgents ?? "342",
      icon: <MdOutlineRealEstateAgent className="h-5 w-5 text-purple-600" />,
      iconBgColor: "bg-purple-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
    },
    {
      title: getTitle("Revenue"),
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

        {/* Period Select */}
        <Select
          value={filter}
          onValueChange={(value) => setFilter(value)}
        >
          <SelectTrigger className="w-[150px] h-10 px-4 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer rounded-xl font-medium">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white border border-slate-100 text-slate-800 shadow-md rounded-lg">
            {["Total", "This Year", "This Month"].map((option) => (
              <SelectItem key={option} value={option} className="cursor-pointer hover:bg-slate-50">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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