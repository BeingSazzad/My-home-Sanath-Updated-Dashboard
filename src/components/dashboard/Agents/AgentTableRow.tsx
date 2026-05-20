import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";
import type { Agent } from "../../../data/agentsData";
import type { UserStatus } from "../../../data/usersData";
import StatusBadge from "../Users/StatusBadge";
import { imageUrl } from "../../../redux/base/baseAPI";
import { confirmDelete } from "../../Shared/confirmDelete";
import {
  useUpdateUserMutation,
  useUserDeleteMutation,
} from "../../../redux/features/user/userApi";

interface Props {
  agent: Agent;
}

const normalizeStatus = (raw: unknown): UserStatus => {
  if (typeof raw === "boolean") {
    return raw ? "ACTIVE" : "INACTIVE";
  }
  const s = String(raw ?? "INACTIVE").trim().toUpperCase();
  return s === "ACTIVE" ? "ACTIVE" : "INACTIVE";
};

const getAgentId = (agent: Agent): string | undefined => {
  const raw = agent._id ?? agent.id;
  if (!raw) return undefined;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null && "_id" in raw) {
    return String((raw as { _id: string })._id);
  }
  return String(raw);
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

const planStyles: Record<string, string> = {
  TRIAL: "bg-gray-100 text-gray-700",
  STARTER: "bg-blue-100 text-blue-800",
  PROFESSIONAL: "bg-purple-100 text-purple-800",
  PREMIUM: "bg-indigo-100 text-indigo-800",
  BASIC: "bg-gray-100 text-gray-700",
  ENTERPRISE: "bg-indigo-100 text-indigo-800",
};

const AgentTableRow: React.FC<Props> = ({ agent: a }) => {
  const agentId = getAgentId(a);
  const [statusPending, setStatusPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const [updateUser] = useUpdateUserMutation();
  const [userDelete] = useUserDeleteMutation();

  const rowStatus = useMemo(() => {
    const withActive = a as Agent & { isActive?: boolean };
    return normalizeStatus(withActive.isActive ?? a.status);
  }, [a]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderPlan = (plan: Agent["plan"]) => {
    if (!plan) return "N/A";
    if (typeof plan === "string") return plan;
    return plan.title || plan.tier || "N/A";
  };

  const planName = renderPlan(a.plan);

  const handleStatusChange = async (newStatus: string) => {
    if (!agentId || statusPending) return;
    const nextStatus = normalizeStatus(newStatus);
    if (nextStatus === rowStatus) return;
    setStatusPending(true);
    try {
      await updateUser({ id: agentId, status: nextStatus }).unwrap();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err?.data?.message ?? "Could not update agent status. Please try again.",
      });
    } finally {
      setStatusPending(false);
    }
  };

  const handleDelete = async () => {
    if (!agentId || deletePending) return;
    const confirmed = await confirmDelete({
      title: "Delete this agent?",
      text: `${a.name} will be removed permanently.`,
    });
    if (!confirmed) return;

    setDeletePending(true);
    try {
      await userDelete(agentId).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Agent removed successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Something went wrong while deleting the agent.",
      });
    } finally {
      setDeletePending(false);
    }
  };

  const actionsDisabled = !agentId || statusPending || deletePending;

  return (
    <tr className="relative z-0 border-b border-gray-100/60 transition-colors last:border-0 hover:z-20 hover:bg-gray-50/60">
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
              <span>{a.initials || getInitials(a.name)}</span>
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
        <span
          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
            planStyles[planName.toUpperCase()] || planStyles.TRIAL
          }`}
        >
          {planName}
        </span>
      </td>
      <td className="py-4.5 px-5 text-[13px] font-medium text-gray-900">
        {a.totalListings || 0}
      </td>
      <td className="py-4.5 px-5 text-[13px] font-medium text-green-600">
        £{(a.revenue || 0).toLocaleString()}
      </td>
      <td className="py-4.5 px-5">
        <StatusBadge status={rowStatus} />
      </td>
      <td className="py-4.5 px-5 text-[12.5px] text-gray-500">
        {formatDate(a.createdAt)}
      </td>
      <td className="relative z-30 bg-white py-4.5 px-5">
        <div className="relative z-50 flex items-center justify-end gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-sm">
          <select
            value={rowStatus}
            disabled={actionsDisabled}
            onChange={(e) => void handleStatusChange(e.target.value)}
            className={`relative z-50 min-w-[100px] cursor-pointer rounded-full border bg-white px-2.5 py-1.5 text-xs font-semibold outline-none transition-all focus:ring-2 ${
              rowStatus === "ACTIVE"
                ? "border-green-200 text-green-700 focus:ring-green-100"
                : "border-gray-200 text-gray-600 focus:ring-gray-100"
            } ${actionsDisabled ? "cursor-not-allowed opacity-50" : "hover:brightness-95"}`}
          >
            <option value="ACTIVE" className="bg-white text-gray-900">
              Active
            </option>
            <option value="INACTIVE" className="bg-white text-gray-900">
              Inactive
            </option>
          </select>
          <button
            type="button"
            disabled={actionsDisabled}
            onClick={handleDelete}
            title="Delete agent"
            className="relative z-50 inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AgentTableRow;
