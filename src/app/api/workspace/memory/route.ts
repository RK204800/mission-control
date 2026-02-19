import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WORKSPACE_PATH = "/root/.openclaw/workspace";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  // Return list of memory files
  if (!file) {
    try {
      const memoryDir = path.join(WORKSPACE_PATH, "memory");
      
      let files: { name: string; path: string; modified?: string }[] = [];
      
      if (fs.existsSync(memoryDir)) {
        const dirFiles = fs.readdirSync(memoryDir)
          .filter(f => f.endsWith(".md"))
          .map(f => {
            const stats = fs.statSync(path.join(memoryDir, f));
            return {
              name: f,
              path: `/memory/${f}`,
              modified: getRelativeTime(stats.mtime),
            };
          })
          .sort((a, b) => b.name.localeCompare(a.name));
        files = dirFiles;
      }

      // Also check for root workspace files
      const rootFiles = ["AGENTS.md", "TOOLS.md", "projects.md", "lessons.md", "self-review.md"]
        .filter(f => fs.existsSync(path.join(WORKSPACE_PATH, f)))
        .map(f => ({
          name: f,
          path: `/${f}`,
          modified: "Varies",
        }));

      return NextResponse.json({ files: [...files, ...rootFiles] });
    } catch (error) {
      return NextResponse.json({ 
        files: [
          { name: "2026-02-19.md", path: "/memory/2026-02-19.md", modified: "Today" },
          { name: "2026-02-18.md", path: "/memory/2026-02-18.md", modified: "Yesterday" },
          { name: "lessons.md", path: "/lessons.md", modified: "Last week" },
        ],
        error: "Could not read all files" 
      });
    }
  }

  // Return file content
  try {
    const filePath = file.startsWith("/memory/") 
      ? path.join(WORKSPACE_PATH, "memory", path.basename(file))
      : path.join(WORKSPACE_PATH, path.basename(file));

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return NextResponse.json({ content });
    }
    return NextResponse.json({ content: "File not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ content: "Error reading file" }, { status: 500 });
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}