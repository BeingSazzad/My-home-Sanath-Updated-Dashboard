import React from "react";
import type { Agent } from "../../../data/agentsData";
import { imageUrl } from "../../../redux/base/baseAPI";
import type { UserStatus } from "../../../data/usersData";

const planStyles: Record<string, string> = {
  Professional: "bg-purple-100 text-purple-800",
  Enterprise: "bg-indigo-100 text-indigo-800",
  Basic: "bg-gray-100 text-gray-700",
};

type StatusType = "ACTIVE" | "INACTIVE";

const statusConfig: Record<
  StatusType,
  { cls: string; icon: React.ReactNode }
> = {
  ACTIVE: {
    cls: "bg-green-50 text-green-700",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },

  INACTIVE: {
    cls: "bg-orange-50 text-orange-600",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
};

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  const s = statusConfig[status as StatusType] || statusConfig.INACTIVE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize ${s.cls}`}>
      {s.icon}
      {status || "INACTIVE"}
    </span>
  );
};



interface Props { agent: Agent }

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}



const AgentTableRow: React.FC<Props> = ({ agent: a }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderPlan = (plan: any) => {
    if (!plan) return "N/A";
    if (typeof plan === "string") return plan;
    return plan.title || plan.tier || "N/A";
  };

  const planName = renderPlan(a.plan);



  return (
    <tr className="border-b border-gray-100/60 hover:bg-gray-50/60 last:border-0 transition-colors">
      <td className="py-4.5 px-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[13px] font-medium flex-shrink-0">
            {a.profileImage ? (
              <img
                src={`${imageUrl}${a.profileImage}`}
                alt={a.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {a.initials || getInitials(a.name)}
              </span>
            )}
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900">{a.name}</p>
            <p className="text-[11.5px] text-gray-400">{a.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4.5 px-5">
        <p className="text-[13px] text-gray-800">{a.agencyName || "N/A"}</p>
        <p className="text-[11.5px] text-gray-400">{a.phone || "N/A"}</p>
      </td>
      <td className="py-4.5 px-5">
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${planStyles[planName] || planStyles.Basic}`}>
          {planName}
        </span>
      </td>
      <td className="py-4.5 px-5 text-[13px] font-medium text-gray-900">{a.totalListings || 0}</td>
      <td className="py-4.5 px-5 text-[13px] font-medium text-green-600">
        £{(a.revenue || 0).toLocaleString()}
      </td>
      <td className="py-4.5 px-5">
        <StatusBadge status={a.status as UserStatus} />
      </td>
      <td className="py-4.5 px-5 text-[12.5px] text-gray-500">{formatDate(a.createdAt)}</td>
      <td className="py-4.5 px-5">
        <button className="text-gray-400 hover:text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 text-lg">⋮</button>
      </td>
    </tr>
  );
};

export default AgentTableRow;