import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HEALTH_FILE = "/root/.openclaw/workspace/mission-control/data/health.json";

export async function GET() {
  let isHealthy = true;
  let lastCheck = null;
  
  try {
    if (fs.existsSync(HEALTH_FILE)) {
      const content = fs.readFileSync(HEALTH_FILE, "utf-8");
      const data = JSON.parse(content);
      isHealthy = data.healthy;
      lastCheck = data.lastCheck;
    }
  } catch (e) {
    // Default to healthy if no data
    isHealthy = true;
  }

  return NextResponse.json({
    healthy: isHealthy,
    lastCheck: lastCheck,
    status: isHealthy ? "operational" : "down"
  });
}
