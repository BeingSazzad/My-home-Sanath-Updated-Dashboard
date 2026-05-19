

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


const currentYear = new Date().getFullYear();

const StatsCards = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const { data: analyticsData } = useGetAnalyticsQuery({ year: selectedYear });

  const stats = [
    {
      title: "Total Property Seeker",
      value: analyticsData?.totalPropertySeekers
        ? analyticsData.totalPropertySeekers.toLocaleString()
        : "4,020",
      icon: <FiUsers className="h-5 w-5 text-blue-600" />,
      iconBgColor: "bg-blue-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
      growth: "+12.5%",
    },
    {
      title: "Total Agents",
      value: analyticsData?.totalAgents ?? "342",
      icon: <MdOutlineRealEstateAgent className="h-5 w-5 text-purple-600" />,
      iconBgColor: "bg-purple-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
      growth: "+8.2%",
    },
    {
      title: "Total Revenue",
      value: analyticsData?.totalRevenue
        ? `£${analyticsData.totalRevenue.toLocaleString()}`
        : "£412,450",
      icon: <BsCurrencyDollar className="h-5 w-5 text-green-600" />,
      iconBgColor: "bg-green-50/70",
      cardBgColor: "bg-white border border-slate-100 shadow-sm",
      growth: "+15.3%",
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

        {/* Year Select */}
        <Select
          value={selectedYear}
          onValueChange={(value) => setSelectedYear(value)}
        >
          <SelectTrigger className="w-32 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer rounded-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white border border-slate-100 text-slate-800 shadow-md rounded-lg">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SelectItem key={i} value={(currentYear - i).toString()} className="cursor-pointer hover:bg-slate-50">
                {currentYear - i}
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