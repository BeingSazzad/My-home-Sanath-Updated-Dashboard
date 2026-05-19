
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { NotificationStatus } from "../../../data/notifications";
import { Badge } from "../../ui/badge";


const config: Record<NotificationStatus, { icon: React.ReactNode; className: string }> = {
  sent: { icon: <CheckCircle2 size={13} />, className: "bg-green-50 text-green-700 border-green-200" },
  scheduled: { icon: <Clock size={13} />, className: "bg-blue-50 text-blue-700 border-blue-200" },
  draft: { icon: <XCircle size={13} />, className: "bg-gray-100 text-gray-600 border-gray-200" },
};

export function NotificationStatusBadge({ status }: { status: NotificationStatus }) {
  const c = config[status];
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-medium capitalize ${c.className}`}>
      {c.icon}
      {status}
    </Badge>
  );
}