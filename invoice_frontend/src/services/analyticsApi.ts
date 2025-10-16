import { apiClient } from "./httpClient";

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";

export interface SummaryResponse {
  totalOutstanding: number;
  avgPaymentDelayDays: number;
  onTimePaymentRate: number; // 0..1
  statusCounts: Record<InvoiceStatus, number>;
}

// Period is first day of month
export interface TimeseriesPoint {
  period: string; // ISO date string
  amount: number;
  partnerId?: number | null;
  status?: InvoiceStatus | null;
}

export interface TimeseriesResponse {
  metric: "invoiced" | "paid";
  points: TimeseriesPoint[];
}

// PUBLIC_INTERFACE
export async function fetchAnalyticsSummary(params: {
  partnerId?: number;
  from?: string;
  to?: string;
  status?: InvoiceStatus;
}): Promise<SummaryResponse> {
  const resp = await apiClient.get("/api/analytics/summary", { params });
  return resp.data;
}

// PUBLIC_INTERFACE
export async function fetchAnalyticsTimeseries(params: {
  partnerId?: number;
  from?: string;
  to?: string;
  status?: InvoiceStatus;
  metric?: "invoiced" | "paid";
}): Promise<TimeseriesResponse> {
  const resp = await apiClient.get("/api/analytics/timeseries", { params });
  return resp.data;
}
