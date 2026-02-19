"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle, Clock, Circle, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
  priority: "low" | "medium" | "high";
}

// Demo data
const initialTasks: Task[] = [
  { id: "1", title: "Set up CI/CD pipeline", status: "done", assignee: "agent:builder", priority: "high" },
  { id: "2", title: "Fix authentication bug", status: "in-progress", assignee: "human:alex", priority: "high" },
  { id: "3", title: "Update documentation", status: "todo", assignee: "agent:writer", priority: "medium" },
  { id: "4", title: "Review PR #42", status: "todo", assignee: "human:sarah", priority: "low" },
  { id: "5", title: "Deploy to staging", status: "in-progress", assignee: "agent:deployer", priority: "high" },
  { id: "6", title: "Write unit tests", status: "todo", assignee: "agent:builder", priority: "medium" },
  { id: "7", title: "Database optimization", status: "done", assignee: "agent:optimizer", priority: "high" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");
  const [newTask, setNewTask] = useState<{ title: string; assignee: string; priority: Task["priority"] }>({ title: "", assignee: "", priority: "medium" });

  const filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      status: "todo",
      assignee: newTask.assignee || "unassigned",
      priority: newTask.priority,
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", assignee: "", priority: "medium" });
    setShowAddModal(false);
  };

  const updateTaskStatus = (id: string, status: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = () => {
    if (!editingTask) return;
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "done": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in-progress": return <Clock className="w-5 h-5 text-blue-400" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage and track all tasks</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "todo", "in-progress", "done"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f 
                ? "bg-[var(--accent-blue)] text-white" 
                : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {f === "all" ? "All" : f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {filteredTasks.map(task => (
          <div key={task.id} className="card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => {
                const nextStatus = task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo";
                updateTaskStatus(task.id, nextStatus);
              }}>
                {getStatusIcon(task.status)}
              </button>
              <div>
                <h3 className={`font-medium ${task.status === "done" ? "line-through text-[var(--text-muted)]" : ""}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-[var(--text-secondary)]">{task.assignee}</span>
                  <span className={`text-xs ${getPriorityColor(task.priority)}`}>● {task.priority}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${
                task.status === "done" ? "badge-done" : 
                task.status === "in-progress" ? "badge-in-progress" : "badge-todo"
              }`}>
                {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              <button 
                onClick={() => setEditingTask(task)}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add New Task</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="input"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTask.assignee}
                  onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="input"
                  placeholder="agent:name or human:name"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button onClick={addTask} className="btn btn-primary w-full">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Task</h2>
              <button onClick={() => setEditingTask(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Assignee</label>
                <input
                  type="text"
                  value={editingTask.assignee}
                  onChange={e => setEditingTask({ ...editingTask, assignee: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Status</label>
                <select
                  value={editingTask.status}
                  onChange={e => setEditingTask({ ...editingTask, status: e.target.value as Task["status"] })}
                  className="input"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={e => setEditingTask({ ...editingTask, priority: e.target.value as Task["priority"] })}
                  className="input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button onClick={updateTask} className="btn btn-primary w-full">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}