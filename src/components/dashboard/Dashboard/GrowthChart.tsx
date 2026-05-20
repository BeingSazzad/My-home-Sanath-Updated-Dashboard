// components/dashboard/Charts/GrowthChart.tsx
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GrowthChartProps {
  data: { month: string; value: number }[];
  color: string;
  gradientId: string;
  yAxisProps?: {
    domain?: any;
    ticks?: number[];
    tickCount?: number;
  };
}

const formatYAxisTick = (value: number) => {
  if (value === 0) return "0";
  if (value >= 1000000) return `${value / 1000000}M`;
  if (value >= 1000) return `${value / 1000}k`;
  return value.toString();
};

const GrowthChart = ({ data, color, gradientId, yAxisProps }: GrowthChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 15, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />

        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          dy={8}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9ca3af", fontSize: 11 }}
          dx={-5}
          width={45}
          domain={yAxisProps?.domain}
          ticks={yAxisProps?.ticks}
          tickCount={yAxisProps?.tickCount}
          tickFormatter={formatYAxisTick}
        />

        <Tooltip
          content={({ active, payload }: any) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-white p-2 shadow-md text-sm">
                  <p className="font-semibold text-gray-700">{payload[0].payload.month}</p>
                  <p className="text-gray-500">Value: {payload[0].value.toLocaleString()}</p>
                </div>
              );
            }
            return null;
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default GrowthChart;