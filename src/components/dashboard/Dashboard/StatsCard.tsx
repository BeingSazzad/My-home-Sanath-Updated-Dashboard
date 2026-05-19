// components/dashboard/StatsCards/StatsCard.tsx
import { cn } from "../../../lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  cardBgColor: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  cardBgColor,
}: StatsCardProps) => {
  return (
    <div className={cn("rounded-2xl border border-slate-100 py-6 px-5 bg-white shadow-sm hover:shadow-md transition-all duration-300", cardBgColor)}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 shadow-xs",
            iconBgColor
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;