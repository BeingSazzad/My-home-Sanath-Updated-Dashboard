import React from "react";
import { sourcesData } from "../../../data/revenueData";

const RevenueSources: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 h-full">
    <p className="text-[15px] font-medium text-gray-900">Revenue Sources</p>
    <p className="text-xs text-gray-400 mb-5">Breakdown by category</p>

    <div className="space-y-5">
      {sourcesData.map((src) => (
        <div key={src.name}>
          <div className="flex justify-between text-[13px] text-gray-500 mb-1.5">
            <span>{src.name}</span>
            <span>{src.pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full mb-1.5">
            <div
              className="h-1.5 rounded-full"
              style={{ width: `${src.pct}%`, background: src.color }}
            />
          </div>
          <p className="text-sm font-medium text-gray-900">{src.amount}</p>
        </div>
      ))}
    </div>

    <div className="flex justify-between items-center border-t border-gray-100 mt-5 pt-4">
      <span className="text-sm text-gray-500">Total Revenue</span>
      <span className="text-base font-medium text-blue-600">£412,450</span>
    </div>
  </div>
);

export default RevenueSources;