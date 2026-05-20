import React from "react";

import StatusBadge from "./StatusBadge";
import type { User } from "../../../data/usersData";
import { imageUrl } from "../../../redux/base/baseAPI";

const avatarColors = [
  { bg: "#dbeafe", color: "#1e40af" }, { bg: "#dcfce7", color: "#166534" },
  { bg: "#e9d5ff", color: "#6b21a8" }, { bg: "#fce7f3", color: "#9d174d" },
  { bg: "#fed7aa", color: "#9a3412" }, { bg: "#d1fae5", color: "#065f46" },
  { bg: "#fef3c7", color: "#92400e" }, { bg: "#e0e7ff", color: "#3730a3" },
];

interface Props { user: User; index: number; }

const UserTableRow: React.FC<Props> = ({ user, index }) => {
  const c = avatarColors[index % avatarColors.length];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderLocation = (location: any) => {
    if (typeof location === "string") return location;
    if (location && typeof location === "object") {
      return location.address || location.city || "N/A";
    }
    return "N/A";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <tr className="border-b border-slate-100/60 hover:bg-gray-50/60 last:border-0 transition-colors">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-[13px] font-medium flex-shrink-0">
            {user.profileImage ? (
              <img
                src={`${imageUrl}${user.profileImage}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>
                {user.initials || getInitials(user.name)}
              </span>
            )}
          </div>
          <div>
            <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
            <p className="text-[11.5px] text-gray-400">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-[12.5px] text-gray-500">{user.phone || "N/A"}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-500">{renderLocation(user.location)}</td>
      <td className="py-4 px-5">
        <p className="text-[12.5px] font-medium text-gray-900">{user.savedProperties || 0} properties</p>
        <p className="text-[11.5px] text-gray-400">{user.searches || 0} searches</p>
      </td>
      <td className="py-4 px-5 text-[13px] font-medium text-gray-900">{user.enquiries || 0}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-400">{formatDate(user.createdAt)}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-400">{formatDate(user.lastLoginAt)}</td>
      <td className="py-4 px-5"><StatusBadge status={user.status} /></td>
      <td className="py-4 px-5">
        <button className="text-gray-400 hover:text-gray-700 px-2.5 py-1.5 rounded hover:bg-gray-100 text-base">⋮</button>
      </td>
    </tr>
  );
};

export default UserTableRow;