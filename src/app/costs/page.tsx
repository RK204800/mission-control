"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { DollarSign, Calendar, TrendingUp, Clock } from "lucide-react";

type ChartType = "bar" | "line" | "area";
type Period = "daily" | "weekly" | "monthly";

interface CostData {
  summary: {
    allTime: number;
    month: number;
    week: number;
    day: number;
  };
  chartData: { date: string; cost: number }[];
  records: {
    id: string;
    date: string;
    provider: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    cost: number;
  }[];
}

export default function CostsPage() {
  const [data, setData] = useState<CostData | null>(null);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/costs?period=${period}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-blue)]"></div>
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load cost data</div>;
  }

  const { summary, chartData, records } = data;

  const renderChart = () => {
    const chartProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const axisStyle = {
      fill: "var(--text-muted)",
      fontSize: 12,
    };

    const tooltipStyle = {
      contentStyle: {
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        color: "var(--text-primary)",
      },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={(v) => `$${v.toFixed(2)}`} />
            <Tooltip {...tooltipStyle} formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]} />
            <Line 
              type="monotone" 
              dataKey="cost" 
              stroke="var(--accent-blue)" 
              strokeWidth={2}
              dot={{ fill: "var(--accent-blue)", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "var(--accent-blue)" }}
            />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={(v) => `$${v.toFixed(2)}`} />
            <Tooltip {...tooltipStyle} formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]} />
            <defs>
              <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="cost" 
              stroke="var(--accent-blue)" 
              fill="url(#costGradient)" 
              strokeWidth={2}
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={axisStyle} />
            <YAxis tick={axisStyle} tickFormatter={(v) => `$${v.toFixed(2)}`} />
            <Tooltip {...tooltipStyle} formatter={(value) => [`$${Number(value).toFixed(4)}`, "Cost"]} />
            <Bar 
              dataKey="cost" 
              fill="var(--accent-blue)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">API Cost Tracker</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Track and analyze your OpenClaw API usage costs
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--accent-blue)]/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-[var(--accent-blue)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">All Time</p>
              <p className="text-2xl font-bold">${summary.allTime.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">This Month</p>
              <p className="text-2xl font-bold">${summary.month.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">This Week</p>
              <p className="text-2xl font-bold">${summary.week.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Today</p>
              <p className="text-2xl font-bold">${summary.day.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Cost Over Time</h2>
          <div className="flex items-center gap-4">
            {/* Period Selector */}
            <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-1">
              {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    period === p
                      ? "bg-[var(--accent-blue)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Chart Type Selector */}
            <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] rounded-lg p-1">
              {(["bar", "line", "area"] as ChartType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    chartType === type
                      ? "bg-[var(--accent-blue)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Records */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-4">Recent API Calls</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[var(--text-secondary)] border-b border-[var(--border)]">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Model</th>
                <th className="pb-3 font-medium">Input</th>
                <th className="pb-3 font-medium">Output</th>
                <th className="pb-3 font-medium text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr 
                  key={record.id} 
                  className="border-b border-[var(--border)]/50 hover:bg-[var(--bg-tertiary)]/50"
                >
                  <td className="py-3 text-sm">
                    {new Date(record.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 text-sm">
                    <span className="px-2 py-1 bg-[var(--bg-tertiary)] rounded text-xs">
                      {record.model.split("/").pop()}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-[var(--text-secondary)]">
                    {record.inputTokens.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-[var(--text-secondary)]">
                    {record.outputTokens.toLocaleString()}
                  </td>
                  <td className="py-3 text-sm text-right font-medium">
                    ${record.cost.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}