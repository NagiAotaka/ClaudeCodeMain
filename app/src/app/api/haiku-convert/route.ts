import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";

const learnedPath = path.join(process.cwd(), "src/data/learned-patterns.json");
const queuePath = path.join(process.cwd(), "src/data/bad-queue.json");

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

export type QueueItem = {
  input: string;
  currentOutput: string;
  hits: { match: string; replacement: string }[];
  ts: number;
};

// GET: 学習済みパターン一覧を返す
export async function GET() {
  const learned = readJson(learnedPath, []);
  return NextResponse.json(learned);
}

// POST: Bad フィードバックをキューに追加
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<QueueItem, "ts">;
    if (!body.input || !body.hits?.length) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }
    const queue = readJson<QueueItem[]>(queuePath, []);
    queue.push({ ...body, ts: Date.now() });
    writeJson(queuePath, queue);
    return NextResponse.json({ queued: true, queueLength: queue.length });
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
