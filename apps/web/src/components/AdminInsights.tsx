import { Empty } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  buildDailyLeadCounts,
  buildFinishLeadCounts,
  buildProductLeadCounts,
} from "../lib/adminInsights";
import type { AdminLead } from "../types/auth";

type AdminInsightsProps = {
  leads: AdminLead[];
};

const chartColors = ["#16a3a3", "#f15a4a", "#525ddc", "#a4c639"];

export function AdminInsights({ leads }: AdminInsightsProps) {
  const productCounts = buildProductLeadCounts(leads);
  const finishCounts = buildFinishLeadCounts(leads);
  const dailyCounts = buildDailyLeadCounts(leads);

  if (!leads.length) {
    return (
      <div className="insight-empty">
        <Empty description="No lead insights yet" />
      </div>
    );
  }

  return (
    <div className="insight-grid" aria-label="Lead insights">
      <section className="insight-panel">
        <span className="eyebrow">Products</span>
        <h3>Lead mix</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={productCounts}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} width={28} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {productCounts.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="insight-panel">
        <span className="eyebrow">Timeline</span>
        <h3>Daily leads</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyCounts}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} width={28} />
            <Tooltip />
            <Line dataKey="leads" stroke="#525ddc" strokeWidth={3} type="monotone" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="insight-panel">
        <span className="eyebrow">Configuration</span>
        <h3>Finish demand</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={finishCounts}
              dataKey="value"
              innerRadius={48}
              nameKey="name"
              outerRadius={82}
              paddingAngle={3}
            >
              {finishCounts.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
