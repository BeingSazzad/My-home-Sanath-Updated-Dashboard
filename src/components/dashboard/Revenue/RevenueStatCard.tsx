import React from "react";

const iconBgColorMap: Record<string, string> = {
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
};

const badgeColorMap: Record<string, string> = {
  green: "bg-green-50/80 text-green-600",
  blue: "bg-blue-50/80 text-blue-600",
  purple: "bg-purple-50/80 text-purple-600",
};

const icons: Record<string, React.ReactNode> = {
  dollar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  trend: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
};

interface Props {
  label: string;
  value: string;
  badge: string;
  color: string;
  icon: string;
}

const RevenueStatCard: React.FC<Props> = ({ label, value, badge, color, icon }) => (
  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${iconBgColorMap[color] || "bg-slate-50 text-slate-600"}`}>
        {icons[icon]}
      </div>
      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColorMap[color] || "bg-slate-50 text-slate-600"}`}>
        ↑ {badge}
      </span>
    </div>

    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="mt-1 text-3xl font-bold text-gray-800">{value}</h3>
      <p className="mt-1 text-xs text-gray-400">vs last month</p>
    </div>
  </div>
);

export default RevenueStatCard;