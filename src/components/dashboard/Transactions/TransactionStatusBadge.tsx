
import { CheckCircle2, Clock, XCircle, CornerDownLeft } from "lucide-react";
import { Badge } from "../../ui/badge";


const config: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  completed: {
    label: "completed",
    icon: <CheckCircle2 size={13} />,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  pending: {
    label: "pending",
    icon: <Clock size={13} />,
    className: "bg-orange-50 text-orange-600 border-orange-200",
  },
  failed: {
    label: "failed",
    icon: <XCircle size={13} />,
    className: "bg-red-50 text-red-600 border-red-200",
  },
  refunded: {
    label: "refunded",
    icon: <CornerDownLeft size={13} />,
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  active: {
    label: "active",
    icon: <CheckCircle2 size={13} />,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  canceled: {
    label: "canceled",
    icon: <XCircle size={13} />,
    className: "bg-red-50 text-red-600 border-red-200",
  },
  trialing: {
    label: "trialing",
    icon: <Clock size={13} />,
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  deactivated: {
    label: "deactivated",
    icon: <XCircle size={13} />,
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export function TransactionStatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() || "";
  const c = config[normalized] || {
    label: status || "Unknown",
    icon: <Clock size={13} />,
    className: "bg-gray-50 text-gray-700 border-gray-200"
  };
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-medium capitalize ${c.className}`}>
      {c.icon}
      {c.label}
    </Badge>
  );
}