import { useEffect, useState } from 'react';
import { AnalyticsApi } from '../api/analyticsApi';
import WidgetCard from '../components/common/WidgetCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Analytics() {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: ov }, { data: pay }] = await Promise.all([
        AnalyticsApi.overview(),
        AnalyticsApi.payments({ period: '6m' }),
      ]);
      setOverview(ov || {});
      setTrend(pay?.trend || pay || []);
    } catch {
      // tolerate missing backend during early integration
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      {loading && <div>Loading...</div>}

      <div className="helper-row" style={{ flexWrap: 'wrap' }}>
        <WidgetCard title="Outstanding">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{fmtCurr(overview?.outstanding || 0)}</div>
        </WidgetCard>
        <WidgetCard title="Paid This Month">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{fmtCurr(overview?.paidThisMonth || 0)}</div>
        </WidgetCard>
        <WidgetCard title="Avg Payment Delay">
          <div style={{ fontSize: 24, fontWeight: 700 }}>{(overview?.avgDelayDays ?? '-')} days</div>
        </WidgetCard>
      </div>

      <WidgetCard title="Payments Trend">
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>
    </div>
  );
}

function fmtCurr(v) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(v || 0));
  } catch {
    return String(v);
  }
}
