"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Bot, Clock, FileText } from "lucide-react";
import Link from "next/link";

// Demo data for tasks
const initialTasks = [
  { id: "1", title: "Set up CI/CD pipeline", status: "done", assignee: "agent:builder", priority: "high" },
  { id: "2", title: "Fix authentication bug", status: "in-progress", assignee: "human:alex", priority: "high" },
  { id: "3", title: "Update documentation", status: "todo", assignee: "agent:writer", priority: "medium" },
  { id: "4", title: "Review PR #42", status: "todo", assignee: "human:sarah", priority: "low" },
  { id: "5", title: "Deploy to staging", status: "in-progress", agent: "agent:deployer", priority: "high" },
];

// Demo agents
const agents = [
  { id: "agent:builder", name: "Builder Agent", role: "developer", status: "active", task: "Creating project structure" },
  { id: "agent:writer", name: "Writer Agent", role: "writer", status: "idle", task: "Waiting for task" },
  { id: "agent:researcher", name: "Researcher Agent", role: "researcher", status: "active", task: "Analyzing competitors" },
];

// Demo scheduled tasks
const scheduledTasks = [
  { id: "1", name: "Daily backup", schedule: "0 2 * * *", nextRun: "02:00 UTC", status: "active" },
  { id: "2", name: "Health check", schedule: "*/15 * * * *", nextRun: "Every 15 min", status: "active" },
  { id: "3", name: "Weekly report", schedule: "0 9 * * 1", nextRun: "Mon 09:00 UTC", status: "active" },
];

export default function HomePage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [recentMemory, setRecentMemory] = useState<string[]>([]);

  useEffect(() => {
    // Try to load actual data from API
    fetch("/api/workspace/memory")
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setRecentMemory(data.files.slice(0, 3).map((f: { name?: string }) => f.name));
        }
      })
      .catch(() => {});
  }, []);

  const todoCount = tasks.filter(t => t.status === "todo").length;
  const inProgressCount = tasks.filter(t => t.status === "in-progress").length;
  const doneCount = tasks.filter(t => t.status === "done").length;

  const activeAgents = agents.filter(a => a.status === "active").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-[var(--text-secondary)] mt-1">Here&apos;s what&apos;s happening with your agents today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Tasks Summary */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Link href="/tasks" className="text-[var(--accent-blue)] text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">To Do</span>
              <span className="badge badge-todo">{todoCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">In Progress</span>
              <span className="badge badge-in-progress">{inProgressCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Done</span>
              <span className="badge badge-done">{doneCount}</span>
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Agents</h2>
            <Link href="/agents" className="text-[var(--accent-blue)] text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {agents.slice(0, 3).map(agent => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm">{agent.name}</span>
                </div>
                <span className={`badge ${agent.status === "active" ? "badge-active" : "badge-idle"}`}>
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Scheduled</h2>
            <Link href="/calendar" className="text-[var(--accent-blue)] text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {scheduledTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--text-muted)]" />
                  <span className="text-sm">{task.name}</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">{task.nextRun}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Memory */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Memory
          </h2>
          <Link href="/memory" className="text-[var(--accent-blue)] text-sm flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentMemory.length > 0 ? (
          <div className="space-y-2">
            {recentMemory.map((name: string) => (
              <div key={name} className="p-3 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-sm">{name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">No recent memory files</p>
        )}
      </div>
    </div>
  );
}