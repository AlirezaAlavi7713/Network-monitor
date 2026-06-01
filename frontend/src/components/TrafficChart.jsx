// recharts fournit des composants React prêts à l'emploi pour faire des graphes.
// LineChart = le graphe, Line = la courbe, XAxis/YAxis = les axes,
// Tooltip = l'info-bulle au survol, ResponsiveContainer = adapte la taille au parent

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TrafficChart({ history }) {
  return (
    <div className="chart-wrapper">
      <h2 className="chart-title">Connexions dans le temps</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis
            dataKey="time"
            stroke="#718096"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis stroke="#718096" tick={{ fontSize: 11 }} width={35} />
          <Tooltip
            contentStyle={{ background: "#1e2330", border: "1px solid #2d3748", borderRadius: 6 }}
            labelStyle={{ color: "#a0aec0" }}
            itemStyle={{ color: "#38bdf8" }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            name="Total"
          />
          <Line
            type="monotone"
            dataKey="established"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            name="ESTABLISHED"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
