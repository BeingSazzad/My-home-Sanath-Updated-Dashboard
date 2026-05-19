// components/dashboard/StatsCards/StatsCard.tsx
import { cn } from "../../../lib/utils";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  cardBgColor: string;
  growth: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  cardBgColor,
  growth,
}: StatsCardProps) => {
  return (
    <div className={cn("rounded-xl border border-gray-150/70 p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300", cardBgColor)}>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9.5 w-9.5 items-center justify-center rounded-xl flex-shrink-0 shadow-sm",
            iconBgColor
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-extrabold text-slate-800">{value}</span>
            <span className="text-[10.5px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              {growth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;