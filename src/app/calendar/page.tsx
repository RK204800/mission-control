"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Play, Pause, Plus, X } from "lucide-react";

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  nextRun: string;
  status: "active" | "paused";
  description: string;
}

// Demo scheduled tasks
const scheduledTasks: ScheduledTask[] = [
  { id: "1", name: "Daily Backup", schedule: "0 2 * * *", nextRun: "02:00 UTC", status: "active", description: "Database and file backup" },
  { id: "2", name: "Health Check", schedule: "*/15 * * * *", nextRun: "Every 15 min", status: "active", description: "System health monitoring" },
  { id: "3", name: "Weekly Report", schedule: "0 9 * * 1", nextRun: "Mon 09:00 UTC", status: "active", description: "Generate weekly analytics" },
  { id: "4", name: "Cache Cleanup", schedule: "0 3 * * *", nextRun: "03:00 UTC", status: "active", description: "Clear old cache files" },
  { id: "5", name: "Security Scan", schedule: "0 4 * * 0", nextRun: "Sun 04:00 UTC", status: "paused", description: "Weekly security scan" },
  { id: "6", name: "Data Sync", schedule: "*/30 * * * *", nextRun: "Every 30 min", status: "active", description: "Sync data with external APIs" },
];

const formatDescription = (schedule: string) => {
  const parts = schedule.split(" ");
  if (schedule.includes("*/")) {
    const interval = schedule.replace("*/", "");
    return `Every ${interval} minutes`;
  }
  if (parts[0] === "0" && parts[1] === "*" && parts[2] === "*" && parts[3] === "*") {
    return "Daily at midnight";
  }
  if (parts[0] !== "*" && parts[1] !== "*" && parts[2] !== "*" && parts[3] !== "*") {
    return `Weekly on day ${parts[4]} at ${parts[1]}:${parts[0]}`;
  }
  return schedule;
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>(scheduledTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", schedule: "", description: "" });

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === "active" ? "paused" : "active" } : t
    ));
  };

  const addTask = () => {
    if (!newTask.name || !newTask.schedule) return;
    const task: ScheduledTask = {
      id: Date.now().toString(),
      name: newTask.name,
      schedule: newTask.schedule,
      description: newTask.description,
      status: "active",
      nextRun: "Pending",
    };
    setTasks([...tasks, task]);
    setNewTask({ name: "", schedule: "", description: "" });
    setShowAddModal(false);
  };

  const activeTasks = tasks.filter(t => t.status === "active");
  const pausedTasks = tasks.filter(t => t.status === "paused");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Calendar</h1>
          <p className="text-[var(--text-secondary)] mt-1">Scheduled tasks and cron jobs</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{activeTasks.length}</p>
              <p className="text-[var(--text-secondary)]">Active Schedules</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Pause className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{pausedTasks.length}</p>
              <p className="text-[var(--text-secondary)]">Paused Schedules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cron Help */}
      <div className="card p-4 bg-[var(--bg-tertiary)]">
        <h3 className="font-semibold mb-2">Cron Format Help</h3>
        <div className="grid grid-cols-4 gap-4 text-sm text-[var(--text-secondary)]">
          <div><code className="text-[var(--accent-blue)]">* * * * *</code> - Every minute</div>
          <div><code className="text-[var(--accent-blue)]">*/15 * * * *</code> - Every 15 min</div>
          <div><code className="text-[var(--accent-blue)]">0 * * * *</code> - Every hour</div>
          <div><code className="text-[var(--accent-blue)]">0 0 * * *</code> - Daily at midnight</div>
          <div><code className="text-[var(--accent-blue)]">0 9 * * 1</code> - Mon 9am</div>
          <div><code className="text-[var(--accent-blue)]">0 0 * * 0</code> - Weekly on Sunday</div>
        </div>
      </div>

      {/* Scheduled Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Scheduled Tasks</h2>
        {tasks.map(task => (
          <div key={task.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  task.status === "active" ? "bg-green-500/20" : "bg-yellow-500/20"
                }`}>
                  <CalendarIcon className={`w-5 h-5 ${task.status === "active" ? "text-green-400" : "text-yellow-400"}`} />
                </div>
                <div>
                  <h3 className="font-semibold">{task.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-[var(--text-muted)]">Schedule</p>
                  <p className="font-mono text-sm">{task.schedule}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[var(--text-muted)]">Next Run</p>
                  <p className="text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.nextRun}
                  </p>
                </div>
                <button
                  onClick={() => toggleStatus(task.id)}
                  className={`btn ${task.status === "active" ? "btn-secondary" : "btn-primary"}`}
                >
                  {task.status === "active" ? "Pause" : "Resume"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Scheduled Task</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Task Name</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Daily Backup"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Cron Schedule</label>
                <input
                  type="text"
                  value={newTask.schedule}
                  onChange={e => setNewTask({ ...newTask, schedule: e.target.value })}
                  className="input font-mono"
                  placeholder="0 2 * * *"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Description</label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  className="input"
                  placeholder="What does this task do?"
                />
              </div>
              <button onClick={addTask} className="btn btn-primary w-full">
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}