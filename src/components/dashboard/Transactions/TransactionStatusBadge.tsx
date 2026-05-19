
import { CheckCircle2, Clock, XCircle, CornerDownLeft } from "lucide-react";
import { Badge } from "../../ui/badge";

type Status = "completed" | "pending" | "failed" | "refunded";

const config: Record<Status, { label: string; icon: React.ReactNode; className: string }> = {
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
};

export function TransactionStatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-medium capitalize ${c.className}`}>
      {c.icon}
      {c.label}
    </Badge>
  );
}