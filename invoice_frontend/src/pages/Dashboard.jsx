import WidgetCard from '../components/common/WidgetCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', amt: 400 },
  { name: 'Feb', amt: 360 },
  { name: 'Mar', amt: 500 },
  { name: 'Apr', amt: 620 },
  { name: 'May', amt: 540 },
  { name: 'Jun', amt: 700 },
];

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Dashboard</h2>
      <div className="helper-row" style={{ flexWrap: 'wrap' }}>
        <WidgetCard title="Outstanding Amount">
          <div style={{ fontSize: 24, fontWeight: 700 }}>$12,450</div>
          <div className="text-muted">Across 18 invoices</div>
        </WidgetCard>
        <WidgetCard title="Paid This Month">
          <div style={{ fontSize: 24, fontWeight: 700 }}>$8,230</div>
          <div className="text-muted">Up 12% vs last month</div>
        </WidgetCard>
        <WidgetCard title="Avg. Payment Delay">
          <div style={{ fontSize: 24, fontWeight: 700 }}>5.2 days</div>
          <div className="text-muted">Target: <strong>3 days</strong></div>
        </WidgetCard>
      </div>

      <WidgetCard title="Cashflow Trend (stub)">
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amt" stroke="#2563EB" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>
    </div>
  );
}
