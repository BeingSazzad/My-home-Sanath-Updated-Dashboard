import React from "react";
    
import StatusBadge from "./StatusBadge";
import type { User } from "../../../data/usersData";

const avatarColors = [
  { bg: "#dbeafe", color: "#1e40af" }, { bg: "#dcfce7", color: "#166534" },
  { bg: "#e9d5ff", color: "#6b21a8" }, { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#fed7aa", color: "#9a3412" }, { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" }, { bg: "#e0e7ff", color: "#3730a3" },
];

interface Props { user: User; index: number; }

const UserTableRow: React.FC<Props> = ({ user, index }) => {
  const c = avatarColors[index % avatarColors.length];
  return (
    <tr className="border-b border-slate-100/60 hover:bg-gray-50/60 last:border-0 transition-colors">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0"
               style={{ background: c.bg, color: c.color }}>
            {user.initials}
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
            <p className="text-[11.5px] text-gray-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-[12.5px] text-gray-500">{user.phone}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-500">{user.location}</td>
      <td className="py-4 px-5">
        <p className="text-[12.5px] font-medium text-gray-900">{user.savedProperties} properties</p>
        <p className="text-[11.5px] text-gray-400">{user.searches} searches</p>
      </td>
      <td className="py-4 px-5 text-[13px] font-medium text-gray-900">{user.enquiries}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-400">{user.joinDate}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-400">{user.lastActive}</td>
      <td className="py-4 px-5"><StatusBadge status={user.status} /></td>
      <td className="py-4 px-5">
        <button className="text-gray-400 hover:text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 text-base">⋮</button>
      </td>
    </tr>
  );
};

export default UserTableRow;