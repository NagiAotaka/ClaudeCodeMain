import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import type { QueueItem } from "@/app/api/haiku-convert/route";
import type { Pattern } from "@/data/patterns";

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

const SYSTEM_PROMPT = `あなたは日本語のキツい言葉をやさしい表現に変換する辞書を改善する専門家です。
ユーザーが「不満」と評価した変換例をもとに、より良い置換テキストを生成してください。

【辞書規則】
- やさしさ優先: 元の語の否定的な意味を一切引き継がない（「期待外れ」「天然」などNG）
- 短さの原則: 2〜6文字が理想
- 形容動詞語幹（「な」なし）またはポジティブな名詞を使う（例: 独特・ユニーク・原石）
- 動詞連体形（〜あふれる・〜光る）が最も汎用的（述語にも連体修飾にも使える）
- 「〜な」「〜の」で終わらない（連体修飾位置で文法崩壊する）
- business: 丁寧・プロフェッショナル / sns: カジュアル・ポジティブ / gentle: 最もやさしく温かい

JSONのみを返してください（前後に余計なテキスト・コードブロック不要）:
{"patterns":[{"match":"元の語","replacements":{"business":"...","sns":"...","gentle":"..."}}]}`;

function buildUserPrompt(items: QueueItem[]): string {
  const uniqueHits = new Map<string, { replacement: string; contexts: string[] }>();
  for (const item of items) {
    for (const hit of item.hits) {
      const entry = uniqueHits.get(hit.match) ?? { replacement: hit.replacement, contexts: [] };
      entry.contexts.push(`「${item.input}」→「${item.currentOutput}」`);
      uniqueHits.set(hit.match, entry);
    }
  }

  const lines = Array.from(uniqueHits.entries()).map(([match, { replacement, contexts }]) => {
    const ctx = contexts.slice(0, 2).join(" / ");
    return `- ${match} → 現在「${replacement}」（不満例: ${ctx}）`;
  });

  return `以下の変換語について、より良いやさしい置換テキストを3モード（business/sns/gentle）で生成してください。\n\n${lines.join("\n")}`;
}

function mergePatterns(base: Pattern[], incoming: Pattern[]): Pattern[] {
  const map = new Map(base.map((p) => [p.match, p]));
  for (const p of incoming) map.set(p.match, p);
  return Array.from(map.values());
}

// POST: キューを処理して learned-patterns.json を更新
export async function POST(req: NextRequest) {
  // 任意の認証チェック（ROUTINE_SECRET が設定されている場合のみ検証）
  const secret = process.env.ROUTINE_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const queue = readJson<QueueItem[]>(queuePath, []);
  if (queue.length === 0) {
    return NextResponse.json({ message: "queue is empty", processed: 0 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const userPrompt = buildUserPrompt(queue);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
      system: SYSTEM_PROMPT,
    });

    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    let newPatterns: Pattern[] = [];
    try {
      const parsed = JSON.parse(rawText) as { patterns: Pattern[] };
      newPatterns = parsed.patterns ?? [];
    } catch {
      return NextResponse.json(
        { error: "Haiku response parse failed", raw: rawText },
        { status: 500 }
      );
    }

    const learned = readJson<Pattern[]>(learnedPath, []);
    const merged = mergePatterns(learned, newPatterns);
    writeJson(learnedPath, merged);

    // 処理済みのキューを空にする
    writeJson(queuePath, []);

    return NextResponse.json({
      processed: queue.length,
      newPatterns: newPatterns.length,
      totalLearned: merged.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Vercel Cron からの自動実行（CRON_SECRET で認証）またはステータス確認
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  // Vercel Cron からの呼び出し（CRON_SECRET が一致した場合は処理実行）
  if (cronSecret && auth === `Bearer ${cronSecret}`) {
    return POST(req);
  }

  // 通常の GET: ステータス確認
  const queue = readJson<QueueItem[]>(queuePath, []);
  const learned = readJson<Pattern[]>(learnedPath, []);
  return NextResponse.json({
    queueLength: queue.length,
    learnedCount: learned.length,
  });
}
