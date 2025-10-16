import React, { useEffect, useState } from "react";
import { fetchAnalyticsSummary, fetchAnalyticsTimeseries, SummaryResponse, TimeseriesResponse } from "../services/analyticsApi";
import { KpiWidgets } from "../components/dashboard/KpiWidgets";
import { LineChart } from "../components/charts/LineChart";

const todayIso = new Date().toISOString().slice(0, 10);
const firstOfYearIso = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [series, setSeries] = useState<TimeseriesResponse | null>(null);
  const [loadingKpi, setLoadingKpi] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [errorKpi, setErrorKpi] = useState<string | null>(null);
  const [errorSeries, setErrorSeries] = useState<string | null>(null);

  useEffect(() => {
    setLoadingKpi(true);
    fetchAnalyticsSummary({ from: firstOfYearIso, to: todayIso })
      .then(setSummary)
      .catch((e) => setErrorKpi(e?.response?.data?.message || e.message))
      .finally(() => setLoadingKpi(false));
  }, []);

  useEffect(() => {
    setLoadingSeries(true);
    fetchAnalyticsTimeseries({ from: firstOfYearIso, to: todayIso, metric: "invoiced" })
      .then(setSeries)
      .catch((e) => setErrorSeries(e?.response?.data?.message || e.message))
      .finally(() => setLoadingSeries(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <KpiWidgets loading={loadingKpi} error={errorKpi} data={summary} />
      <div className="p-4 rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Invoiced (Monthly)</div>
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

export default Dashboard;
