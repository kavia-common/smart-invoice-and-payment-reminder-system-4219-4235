import React, { useEffect, useState } from "react";
import { fetchAnalyticsSummary, fetchAnalyticsTimeseries, SummaryResponse, TimeseriesResponse } from "../services/analyticsApi";
import { KpiWidgets } from "../components/dashboard/KpiWidgets";
import { LineChart } from "../components/charts/LineChart";

const todayIso = new Date().toISOString().slice(0, 10);
const firstOfYearIso = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);

const Analytics: React.FC = () => {
  const [metric, setMetric] = useState<"invoiced" | "paid">("invoiced");
  const [from, setFrom] = useState(firstOfYearIso);
  const [to, setTo] = useState(todayIso);

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [series, setSeries] = useState<TimeseriesResponse | null>(null);
  const [loadingKpi, setLoadingKpi] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [errorKpi, setErrorKpi] = useState<string | null>(null);
  const [errorSeries, setErrorSeries] = useState<string | null>(null);

  const reload = () => {
    setLoadingKpi(true);
    setLoadingSeries(true);
    fetchAnalyticsSummary({ from, to })
      .then(setSummary)
      .catch((e) => setErrorKpi(e?.response?.data?.message || e.message))
      .finally(() => setLoadingKpi(false));
    fetchAnalyticsTimeseries({ from, to, metric })
      .then(setSeries)
      .catch((e) => setErrorSeries(e?.response?.data?.message || e.message))
      .finally(() => setLoadingSeries(false));
  };

  useEffect(() => { reload(); }, []); // initial

  useEffect(() => { reload(); }, [metric]); // when metric changes

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="flex items-center gap-2">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1" />
          <span>-</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1" />
          <select value={metric} onChange={(e) => setMetric(e.target.value as any)} className="border rounded px-2 py-1">
            <option value="invoiced">Invoiced</option>
            <option value="paid">Paid</option>
          </select>
          <button onClick={reload} className="bg-blue-600 text-white px-3 py-1 rounded">Apply</button>
        </div>
      </div>

      <KpiWidgets loading={loadingKpi} error={errorKpi} data={summary} />

      <div className="p-4 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium capitalize">{metric} (Monthly)</div>
        </div>
        {loadingSeries ? (
          <div className="h-56 animate-pulse bg-gray-100 rounded" />
        ) : errorSeries ? (
          <div className="p-3 rounded bg-red-50 text-red-700">Failed to load timeseries: {errorSeries}</div>
        ) : (
          <LineChart points={series?.points || []} />
        )}
      </div>
    </div>
  );
};

export default Analytics;
