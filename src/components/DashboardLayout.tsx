"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { Activity, Cpu, Clock, CheckCircle } from "lucide-react";

interface SystemStats {
  activeAgents: number;
  pendingTasks: number;
  completedToday: number;
  uptime: string;
}

interface DashboardContextType {
  stats: SystemStats;
  refreshStats: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  stats: { activeAgents: 2, pendingTasks: 5, completedToday: 12, uptime: "99.9%" },
  refreshStats: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<SystemStats>({
    activeAgents: 2,
    pendingTasks: 5,
    completedToday: 12,
    uptime: "99.9%",
  });

  const refreshStats = async () => {
    try {
      const res = await fetch("/api/workspace/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: "Active Agents", value: stats.activeAgents, icon: Activity, color: "text-green-400" },
    { label: "Pending Tasks", value: stats.pendingTasks, icon: Clock, color: "text-yellow-400" },
    { label: "Completed Today", value: stats.completedToday, icon: CheckCircle, color: "text-blue-400" },
    { label: "System Uptime", value: stats.uptime, icon: Cpu, color: "text-purple-400" },
  ];

  return (
    <DashboardContext.Provider value={{ stats, refreshStats }}>
      <div className="min-h-screen">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--text-secondary)] text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        {children}
      </div>
    </DashboardContext.Provider>
  );
}