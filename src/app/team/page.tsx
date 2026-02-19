"use client";

import { useState } from "react";
import { Users, Code, PenTool, Search, Bot, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  type: "human" | "agent";
  role: string;
  skills: string[];
  status: "active" | "available" | "offline";
}

const teamMembers: TeamMember[] = [
  // Humans
  { id: "human:alex", name: "Alex", type: "human", role: "Project Lead", skills: ["Management", "Architecture"], status: "active" },
  { id: "human:sarah", name: "Sarah", type: "human", role: "Designer", skills: ["UI/UX", "Figma"], status: "available" },
  { id: "human:mike", name: "Mike", type: "human", role: "DevOps", skills: ["AWS", "Docker", "Kubernetes"], status: "active" },
  
  // Agents - Developers
  { id: "agent:builder", name: "Builder Agent", type: "agent", role: "Developer", skills: ["React", "Node.js", "TypeScript"], status: "active" },
  { id: "agent:deployer", name: "Deployer Agent", type: "agent", role: "Developer", skills: ["CI/CD", "AWS", "Docker"], status: "available" },
  { id: "agent:optimizer", name: "Optimizer Agent", type: "agent", role: "Developer", skills: ["Performance", "Database", "Caching"], status: "active" },
  
  // Agents - Writers
  { id: "agent:writer", name: "Writer Agent", type: "agent", role: "Writer", skills: ["Documentation", "Content", "SEO"], status: "available" },
  { id: "agent:reviewer", name: "Reviewer Agent", type: "agent", role: "Writer", skills: ["Code Review", "Testing"], status: "available" },
  
  // Agents - Researchers
  { id: "agent:researcher", name: "Researcher Agent", type: "agent", role: "Researcher", skills: ["Analysis", "Web Scraping", "Data"], status: "active" },
  { id: "agent:analyst", name: "Analyst Agent", type: "agent", role: "Researcher", skills: ["Data Analysis", "Visualization"], status: "available" },
];

const roles = [
  { id: "all", label: "All", icon: Users },
  { id: "developer", label: "Developers", icon: Code },
  { id: "writer", label: "Writers", icon: PenTool },
  { id: "researcher", label: "Researchers", icon: Search },
];

export default function TeamPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = teamMembers.filter(member => {
    const matchesRole = filter === "all" || member.role.toLowerCase().includes(filter);
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const developers = teamMembers.filter(m => m.role === "Developer");
  const writers = teamMembers.filter(m => m.role === "Writer");
  const researchers = teamMembers.filter(m => m.role === "Researcher");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Team Structure</h1>
        <p className="text-[var(--text-secondary)] mt-1">View all team members and agents by role</p>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card p-4 cursor-pointer hover:border-[var(--accent-blue)]" onClick={() => setFilter("all")}>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-xl font-semibold">{teamMembers.length}</p>
              <p className="text-sm text-[var(--text-secondary)]">Total</p>
            </div>
          </div>
        </div>
        <div className="card p-4 cursor-pointer hover:border-[var(--accent-green)]" onClick={() => setFilter("developer")}>
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-xl font-semibold">{developers.length}</p>
              <p className="text-sm text-[var(--text-secondary)]">Developers</p>
            </div>
          </div>
        </div>
        <div className="card p-4 cursor-pointer hover:border-[var(--accent-yellow)]" onClick={() => setFilter("writer")}>
          <div className="flex items-center gap-3">
            <PenTool className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-xl font-semibold">{writers.length}</p>
              <p className="text-sm text-[var(--text-secondary)]">Writers</p>
            </div>
          </div>
        </div>
        <div className="card p-4 cursor-pointer hover:border-[var(--accent-purple)]" onClick={() => setFilter("researcher")}>
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-xl font-semibold">{researchers.length}</p>
              <p className="text-sm text-[var(--text-secondary)]">Researchers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name or skill..."
          className="input pl-12"
        />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <div key={member.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  member.type === "agent" ? "bg-[var(--accent-blue)]/20" : "bg-[var(--accent-purple)]/20"
                }`}>
                  {member.type === "agent" ? (
                    <Bot className="w-5 h-5 text-blue-400" />
                  ) : (
                    <User className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{member.role}</p>
                </div>
              </div>
              <span className={`badge ${
                member.status === "active" ? "badge-active" : 
                member.status === "available" ? "badge-in-progress" : "badge-todo"
              }`}>
                {member.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {member.skills.map(skill => (
                <span key={skill} className="px-2 py-1 bg-[var(--bg-tertiary)] rounded text-xs text-[var(--text-secondary)]">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}