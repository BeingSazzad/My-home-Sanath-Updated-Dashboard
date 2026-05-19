// components/dashboard/Charts/ChartCard.tsx
import GrowthChart from "./GrowthChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface ChartCardProps {
  title: string;
  subtitle: string;
  data: { month: string; value: number }[];
  color: string;
  gradientId: string;
  footerLabel: string;
  footerValue: string;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const ChartCard = ({
  title,
  subtitle,
  data,
  color,
  gradientId,
  footerLabel,
  footerValue,
  selectedYear,
  onYearChange,
}: ChartCardProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>

        {/* Year Select */}
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="w-24 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer rounded-lg text-xs py-1 h-8">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent position="popper" className="bg-white border border-slate-100 text-slate-800 shadow-md rounded-lg">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SelectItem key={i} value={(currentYear - i).toString()} className="cursor-pointer hover:bg-slate-50 text-xs">
                {currentYear - i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <GrowthChart data={data} color={color} gradientId={gradientId} />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm text-gray-400">{footerLabel}</span>
        <span className="text-base font-bold text-gray-900">{footerValue}</span>
      </div>
    </div>
  );
};

export default ChartCard;