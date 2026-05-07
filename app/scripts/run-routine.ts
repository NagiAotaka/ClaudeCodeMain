/**
 * ルーティンスクリプト
 * 使い方: cd app && npx tsx scripts/run-routine.ts --input <bad-feedback.json>
 *
 * 1. ブラウザで 👎 → 「ルーティン用にエクスポート」ボタンで JSON をダウンロード
 * 2. このスクリプトに --input で渡す
 * 3. Haiku が改善パターンを生成し public/learned-patterns.json に保存
 * 4. ページリロードで反映
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env.local") });

const learnedPath = path.join(__dirname, "../public/learned-patterns.json");

type Mode = "business" | "sns" | "gentle";

type Pattern = {
  match: string;
  variants?: string[];
  replacements: Record<Mode, string>;
  ng?: boolean;
};

type QueueItem = {
  type: string;
  input: string;
  output: string;
  hits: { match: string; replacement: string }[];
  ts: number;
};

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
      entry.contexts.push(`「${item.input}」→「${item.output}」`);
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

async function main() {
  const args = process.argv.slice(2);
  const inputFlag = args.indexOf("--input");
  const inputFile = inputFlag !== -1 ? args[inputFlag + 1] : null;

  if (!inputFile) {
    console.error("❌ 使い方: npx tsx scripts/run-routine.ts --input <bad-feedback.json>");
    console.error("   ブラウザの「ルーティン用にエクスポート」ボタンでファイルを取得してください。");
    process.exit(1);
  }

  const allItems = readJson<QueueItem[]>(inputFile, []);
  const queue = allItems.filter((item) => item.type === "bad" && item.hits?.length > 0);

  if (queue.length === 0) {
    console.log("✅ Bad フィードバックが見つかりません。処理するアイテムがありません。");
    return;
  }

  console.log(`📋 Bad フィードバック: ${queue.length} 件`);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("❌ ANTHROPIC_API_KEY が設定されていません。app/.env.local を確認してください。");
    process.exit(1);
  }

  console.log("🤖 Haiku で処理中...");

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
    console.error("❌ Haiku のレスポンスが JSON として解析できませんでした:");
    console.error(rawText);
    process.exit(1);
  }

  const learned = readJson<Pattern[]>(learnedPath, []);
  const merged = mergePatterns(learned, newPatterns);
  writeJson(learnedPath, merged);

  console.log(`✅ 完了: ${queue.length} 件処理 / ${newPatterns.length} パターン生成 / 累計 ${merged.length} パターン`);
  console.log("📝 新しいパターン:");
  for (const p of newPatterns) {
    console.log(`  ${p.match}: gentle="${p.replacements.gentle}" / business="${p.replacements.business}" / sns="${p.replacements.sns}"`);
  }
  console.log("\n→ ページをリロードすると学習済みパターンが反映されます。");
}

main().catch((err) => {
  console.error("❌ エラー:", err);
  process.exit(1);
});
