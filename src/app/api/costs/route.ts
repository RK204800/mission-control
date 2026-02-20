import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = "/root/.openclaw/workspace/mission-control/data/api-costs.json";

interface CostRecord {
  id: string;
  date: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  sessionId: string;
}

interface DataStore {
  records: CostRecord[];
  models: Record<string, { input: number; output: number }>;
}

function readData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.error("Error reading cost data:", e);
  }
  return { records: [], models: {} };
}

function writeData(data: DataStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "daily";
  
  const data = readData();
  const records = data.records;

  // Get date ranges
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  // Calculate totals
  const allTimeTotal = records.reduce((sum, r) => sum + r.cost, 0);
  const monthTotal = records
    .filter(r => new Date(r.date) >= monthAgo)
    .reduce((sum, r) => sum + r.cost, 0);
  const weekTotal = records
    .filter(r => new Date(r.date) >= weekAgo)
    .reduce((sum, r) => sum + r.cost, 0);
  const dayTotal = records
    .filter(r => new Date(r.date) >= today)
    .reduce((sum, r) => sum + r.cost, 0);

  // Group by period
  const grouped = records.reduce((acc: Record<string, number>, record) => {
    const date = new Date(record.date);
    let key: string;
    
    if (period === "daily") {
      key = date.toISOString().split("T")[0];
    } else if (period === "weekly") {
      const weekNum = getWeekNumber(date);
      key = `${date.getFullYear()}-W${weekNum}`;
    } else if (period === "monthly") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else {
      key = date.toISOString().split("T")[0];
    }
    
    acc[key] = (acc[key] || 0) + record.cost;
    return acc;
  }, {});

  // Convert to chart data
  const chartData = Object.entries(grouped)
    .map(([date, cost]) => ({ date, cost: Math.round(cost * 1000) / 1000 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    summary: {
      allTime: Math.round(allTimeTotal * 1000) / 1000,
      month: Math.round(monthTotal * 1000) / 1000,
      week: Math.round(weekTotal * 1000) / 1000,
      day: Math.round(dayTotal * 1000) / 1000,
    },
    chartData,
    records: records.slice(-20).reverse(),
    models: data.models,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, model, inputTokens, outputTokens, sessionId } = body;

    const data = readData();
    
    // Get model pricing
    const modelKey = model || provider;
    const pricing = data.models[modelKey] || { input: 0.2, output: 0.2 };
    
    // Calculate cost (price is per 1M tokens)
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    const totalCost = inputCost + outputCost;

    const newRecord: CostRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      provider: provider || "openrouter",
      model: modelKey,
      inputTokens: inputTokens || 0,
      outputTokens: outputTokens || 0,
      cost: Math.round(totalCost * 1000) / 1000,
      sessionId: sessionId || "unknown",
    };

    data.records.push(newRecord);
    writeData(data);

    return NextResponse.json({ success: true, record: newRecord });
  } catch (e) {
    return NextResponse.json({ error: "Failed to log cost" }, { status: 500 });
  }
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}