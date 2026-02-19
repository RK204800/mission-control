"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Folder, ChevronRight, X, Calendar } from "lucide-react";

interface MemoryFile {
  name: string;
  path: string;
  content?: string;
  modified?: string;
}

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<MemoryFile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workspace/memory")
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setFiles(data.files);
        }
        setLoading(false);
      })
      .catch(() => {
        // Demo data if API fails
        setFiles([
          { name: "2026-02-19.md", path: "/memory/2026-02-19.md", modified: "Today" },
          { name: "2026-02-18.md", path: "/memory/2026-02-18.md", modified: "Yesterday" },
          { name: "2026-02-17.md", path: "/memory/2026-02-17.md", modified: "2 days ago" },
          { name: "2026-02-16.md", path: "/memory/2026-02-16.md", modified: "3 days ago" },
          { name: "lessons.md", path: "/memory/lessons.md", modified: "Last week" },
          { name: "projects.md", path: "/memory/projects.md", modified: "Last week" },
        ]);
        setLoading(false);
      });
  }, []);

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const viewFile = async (file: MemoryFile) => {
    setSelectedFile({ ...file, content: "Loading..." });
    try {
      const res = await fetch(`/api/workspace/memory?file=${encodeURIComponent(file.path)}`);
      const data = await res.json();
      setSelectedFile({ ...file, content: data.content || "No content" });
    } catch {
      setSelectedFile({ ...file, content: "# " + file.name + "\n\nContent preview not available.\n\nThis file contains daily notes and observations." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Memory</h1>
        <p className="text-[var(--text-secondary)] mt-1">Browse and search memory files</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search memory files..."
          className="input pl-12"
        />
      </div>

      <div className="flex gap-6">
        {/* File List */}
        <div className="flex-1">
          <div className="card divide-y divide-[var(--border-color)]">
            {loading ? (
              <div className="p-8 text-center text-[var(--text-muted)]">Loading...</div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)]">No files found</div>
            ) : (
              filteredFiles.map(file => (
                <button
                  key={file.path}
                  onClick={() => viewFile(file)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[var(--accent-blue)]" />
                    <span>{file.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--text-muted)]">{file.modified}</span>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* File Preview */}
        <div className="flex-1">
          {selectedFile ? (
            <div className="card h-[600px] flex flex-col">
              <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[var(--accent-blue)]" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <button onClick={() => setSelectedFile(null)}>
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono text-[var(--text-secondary)] leading-relaxed">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="card h-[600px] flex items-center justify-center">
              <div className="text-center text-[var(--text-muted)]">
                <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a file to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}