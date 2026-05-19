import { Badge } from "../../ui/badge";

type TxnType = "subscription" | "featured" | "refund";

const config: Record<TxnType, string> = {
  subscription: "bg-blue-100 text-blue-700 border-blue-200",
  featured: "bg-purple-100 text-purple-700 border-purple-200",
  refund: "bg-red-100 text-red-600 border-red-200",
};

export function TransactionTypeBadge({ type }: { type: TxnType }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium capitalize ${config[type]}`}>
      {type}
    </Badge>
  );
}