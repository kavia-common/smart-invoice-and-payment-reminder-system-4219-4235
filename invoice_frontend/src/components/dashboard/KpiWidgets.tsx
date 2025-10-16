import React from "react";
import { SummaryResponse } from "../../services/analyticsApi";

type Props = {
  loading: boolean;
  error?: string | null;
  data?: SummaryResponse | null;
};

export const KpiWidgets: React.FC<Props> = ({ loading, error, data }) => {
  if (loading) {
    return <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <div className="p-4 rounded-lg bg-white shadow-sm animate-pulse h-24" />
      <div className="p-4 rounded-lg bg-white shadow-sm animate-pulse h-24" />
      <div className="p-4 rounded-lg bg-white shadow-sm animate-pulse h-24" />
    </div>;
  }
  if (error) {
    return <div className="p-4 rounded-lg bg-red-50 text-red-700">Failed to load KPIs: {error}</div>;
  }
  if (!data) return null;

  const percent = Math.round((data.onTimePaymentRate || 0) * 100);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <div className="p-4 rounded-lg bg-white shadow-sm">
        <div className="text-xs text-gray-500">Total Outstanding</div>
        <div className="text-2xl font-semibold">${Number(data.totalOutstanding || 0).toLocaleString()}</div>
      </div>
      <div className="p-4 rounded-lg bg-white shadow-sm">
        <div className="text-xs text-gray-500">Avg Payment Delay</div>
        <div className="text-2xl font-semibold">{(data.avgPaymentDelayDays || 0).toFixed(1)} days</div>
      </div>
      <div className="p-4 rounded-lg bg-white shadow-sm">
        <div className="text-xs text-gray-500">On-time Payment Rate</div>
        <div className="text-2xl font-semibold">{percent}%</div>
      </div>
    </div>
  );
};
