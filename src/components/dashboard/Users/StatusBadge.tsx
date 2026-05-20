import React from "react";
import type { UserStatus } from "../../../data/usersData";


const config: Record<UserStatus, { cls: string; icon: React.ReactNode }> = {
  ACTIVE: {
    cls: "bg-green-50 text-green-800",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
  INACTIVE: {
    cls: "bg-gray-100 text-gray-600",
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  },
};

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  const s = config[status] || config.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${s.cls}`}>
      {s.icon}
      {status || "INACTIVE"}
    </span>
  );
};

export default StatusBadge;