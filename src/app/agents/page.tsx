"use client";

import { useState } from "react";
import { Bot, Activity, Circle, RefreshCw } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle";
  task: string;
  lastActive: string;
}

// Demo agents data
const initialAgents: Agent[] = [
  { id: "agent:builder", name: "Builder Agent", role: "developer", status: "active", task: "Creating project structure", lastActive: "Now" },
  { id: "agent:writer", name: "Writer Agent", role: "writer", status: "idle", task: "Waiting for task", lastActive: "5 min ago" },
  { id: "agent:researcher", name: "Researcher Agent", role: "researcher", status: "active", task: "Analyzing competitors", lastActive: "Now" },
  { id: "agent:deployer", name: "Deployer Agent", role: "developer", status: "idle", task: "Waiting for task", lastActive: "1 hour ago" },
  { id: "agent:optimizer", name: "Optimizer Agent", role: "developer", status: "active", task: "Running database optimizations", lastActive: "Now" },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [refreshing, setRefreshing] = useState(false);

  const refreshAgents = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const activeCount = agents.filter(a => a.status === "active").length;
  const idleCount = agents.filter(a => a.status === "idle").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Agent Status</h1>
          <p className="text-[var(--text-secondary)] mt-1">Monitor all running sub-agents</p>
        </div>
        <button 
          onClick={refreshAgents}
          className="btn btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{activeCount}</p>
            <p className="text-[var(--text-secondary)]">Active Agents</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center">
            <Circle className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{idleCount}</p>
            <p className="text-[var(--text-secondary)]">Idle Agents</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  agent.status === "active" ? "bg-green-500/20" : "bg-gray-500/20"
                }`}>
                  <Bot className={`w-6 h-6 ${agent.status === "active" ? "text-green-400" : "text-gray-400"}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-[var(--text-muted)]">Current Task</p>
                  <p className="font-medium">{agent.task}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--text-muted)]">Last Active</p>
                  <p className="text-sm">{agent.lastActive}</p>
                </div>
                <span className={`badge ${agent.status === "active" ? "badge-active" : "badge-idle"}`}>
                  {agent.status === "active" ? "● Active" : "○ Idle"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}