import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WORKSPACE_PATH = "/root/.openclaw/workspace";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  try {
    const items: { name: string; path: string; type: string }[] = [];
    
    const dirs = ["memory", "src", "projects"];
    
    for (const dir of dirs) {
      const dirPath = path.join(WORKSPACE_PATH, dir);
      if (fs.existsSync(dirPath)) {
        try {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            items.push({
              name: file,
              path: `/${dir}/${file}`,
              type: "file",
            });
          });
        } catch (e) {}
      }
    }

    // Root files
    const rootFiles = fs.readdirSync(WORKSPACE_PATH).filter(f => 
      !f.includes(".") || f.endsWith(".md") || f.endsWith(".json")
    );
    rootFiles.forEach(file => {
      items.push({
        name: file,
        path: `/${file}`,
        type: "file",
      });
    });

    return NextResponse.json({ files: items });
  } catch (error) {
    return NextResponse.json({ files: [], error: "Error listing files" }, { status: 500 });
  }
}