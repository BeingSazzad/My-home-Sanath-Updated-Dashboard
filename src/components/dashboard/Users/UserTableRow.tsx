import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import type { User, UserStatus } from "../../../data/usersData";
import { imageUrl } from "../../../redux/base/baseAPI";
import { confirmDelete } from "../../Shared/confirmDelete";
import {
  useUpdateUserMutation,
  useUserDeleteMutation,
} from "../../../redux/features/user/userApi";

interface Props {
  user: User;
  index: number;
}

const normalizeStatus = (raw: unknown): UserStatus => {
  if (typeof raw === "boolean") {
    return raw ? "ACTIVE" : "INACTIVE";
  }
  const s = String(raw ?? "INACTIVE").trim().toUpperCase();
  return s === "ACTIVE" ? "ACTIVE" : "INACTIVE";
};

const getUserId = (user: User): string | undefined => {
  const raw = user._id ?? user.id;
  if (!raw) return undefined;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null && "_id" in raw) {
    return String((raw as { _id: string })._id);
  }
  return String(raw);
};

const UserTableRow: React.FC<Props> = ({ user }) => {
  const userId = getUserId(user);
  const [statusPending, setStatusPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const [updateUser] = useUpdateUserMutation();
  const [userDelete] = useUserDeleteMutation();

  const rowStatus = useMemo(() => {
    const withActive = user as User & { isActive?: boolean };
    return normalizeStatus(withActive.isActive ?? user.status);
  }, [user]);
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderLocation = (location: User["location"]) => {
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

  const handleStatusChange = async (newStatus: string) => {
    if (!userId || statusPending) return;
    const nextStatus = normalizeStatus(newStatus);
    if (nextStatus === rowStatus) return;
    setStatusPending(true);
    try {
      await updateUser({ id: userId, status: nextStatus }).unwrap();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.data?.message ?? "Could not update user status. Please try again.",
      });
    } finally {
      setStatusPending(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || deletePending) return;
    const confirmed = await confirmDelete({
      title: "Delete this user?",
      text: `${user.name} will be removed permanently.`,
    });
    if (!confirmed) return;

    setDeletePending(true);
    try {
      await userDelete(userId).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User removed successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Something went wrong while deleting the user.",
      });
    } finally {
      setDeletePending(false);
    }
  };

  const actionsDisabled = !userId || statusPending || deletePending;

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
              <span>{user.initials || getInitials(user.name)}</span>
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
        <p className="text-[12.5px] font-medium text-gray-900">{user.savedPropertyCount || 0} properties</p>
        <p className="text-[11.5px] text-gray-400">{user.savedSearchCount || 0} searches</p>
      </td>
      <td className="py-4 px-5 text-[13px] font-medium text-gray-900">{user.enqueryCount || 0}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-400">{formatDate(user.createdAt)}</td>
      <td className="py-4 px-5 text-[12.5px] text-gray-400">{formatDate(user.lastLoginAt)}</td>
      <td className="py-4 px-5">
        <select
          value={rowStatus}
          disabled={actionsDisabled}
          onChange={(e) => void handleStatusChange(e.target.value)}
          className={`text-xs font-semibold rounded-full px-3 py-1.5 border outline-none cursor-pointer transition-all min-w-[108px] ${
            rowStatus === "ACTIVE"
              ? "bg-green-50 text-green-700 border-green-200 focus:ring-2 focus:ring-green-100"
              : "bg-gray-100 text-gray-600 border-gray-200 focus:ring-2 focus:ring-gray-100"
          } ${actionsDisabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-95"}`}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </td>
      <td className="py-4 px-5">
        <div className="flex items-center justify-end">
          <button
            type="button"
            disabled={actionsDisabled}
            onClick={handleDelete}
            title="Delete user"
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
