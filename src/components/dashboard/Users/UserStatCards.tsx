import React from "react";
import { statCards } from "../../../data/usersData";

const themeStyles: Record<string, { cardBg: string; border: string; iconBg: string; iconColor: string }> = {
  blue: {
    cardBg: "bg-white",
    border: "border-gray-150/70",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  green: {
    cardBg: "bg-white",
    border: "border-gray-150/70",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  purple: {
    cardBg: "bg-white",
    border: "border-gray-150/70",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  orange: {
    cardBg: "bg-white",
    border: "border-gray-150/70",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
};

const icons: Record<string, React.ReactNode> = {
  users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  mail:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  eye:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

const UserStatCards: React.FC = () => (
  <div className="grid grid-cols-4 gap-4 mb-6">
    {statCards.map((s) => {
      const theme = themeStyles[s.color] || themeStyles.blue;
      return (
        <div key={s.label} className={`rounded-xl border ${theme.border} p-4 ${theme.cardBg} shadow-sm hover:shadow-md transition-all duration-300`}>
          <div className="flex items-center gap-3">
            <div className={`w-9.5 h-9.5 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center flex-shrink-0`}>
              {icons[s.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-800">{s.value}</span>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default UserStatCards;