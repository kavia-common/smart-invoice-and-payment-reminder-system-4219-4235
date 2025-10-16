import React from "react";
import { TimeseriesPoint } from "../../services/analyticsApi";

type Props = {
  points: TimeseriesPoint[];
  height?: number;
};

export const LineChart: React.FC<Props> = ({ points, height = 220 }) => {
  if (!points || points.length === 0) {
    return <div className="p-4 text-gray-500">No data</div>;
  }
  const w = 600;
  const h = height;
  const pad = 32;

  const xs = points.map((p) => new Date(p.period).getTime());
  const ys = points.map((p) => p.amount || 0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = Math.max(...ys, 1);

  const xScale = (x: number) => pad + ((x - minX) / (maxX - minX || 1)) * (w - pad * 2);
  const yScale = (y: number) => h - pad - ((y - minY) / (maxY - minY || 1)) * (h - pad * 2);

  const pathD = points
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime())
    .map((p, idx) => {
      const x = xScale(new Date(p.period).getTime());
      const y = yScale(p.amount || 0);
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const xLabels = points.map((p) => {
    const d = new Date(p.period);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      <rect x={0} y={0} width={w} height={h} fill="white" rx={8} />
      {/* Axes */}
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#e5e7eb" />
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#e5e7eb" />
      {/* Path */}
      <path d={pathD} fill="none" stroke="#2563EB" strokeWidth={2} />
      {/* Points */}
      {points.map((p, i) => {
        const x = xScale(new Date(p.period).getTime());
        const y = yScale(p.amount || 0);
        return <circle key={i} cx={x} cy={y} r={3} fill="#2563EB" />;
      })}
      {/* Simple labels on x-axis: first, mid, last */}
      {[0, Math.floor(points.length / 2), points.length - 1].map((i, idx) => {
        if (i < 0 || i >= points.length) return null;
        const x = xScale(new Date(points[i].period).getTime());
        return (
          <text key={idx} x={x} y={h - pad + 16} textAnchor="middle" fontSize="10" fill="#6b7280">
            {xLabels[i]}
          </text>
        );
      })}
    </svg>
  );
};
