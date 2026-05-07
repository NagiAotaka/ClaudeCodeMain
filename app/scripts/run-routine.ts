/**
 * ルーティン用データリーダー
 * 使い方: cd app && npx tsx scripts/run-routine.ts --input <bad-feedback.json>
 *
 * Bad フィードバックの内容を整形して標準出力に表示する。
 * 出力を Claude Code に渡すと、改善パターンを生成して
 * public/learned-patterns.json に書き込んでもらえる。
 */

import * as fs from "fs";
import * as path from "path";

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
  console.log("✅ Bad フィードバックが見つかりません。");
  process.exit(0);
}

// ユニークなヒット語ごとに集約
const hitMap = new Map<string, { current: string; examples: string[] }>();
for (const item of queue) {
  for (const hit of item.hits) {
    const entry = hitMap.get(hit.match) ?? { current: hit.replacement, examples: [] };
    entry.examples.push(`「${item.input}」→「${item.output}」`);
    hitMap.set(hit.match, entry);
  }
}

console.log(`=== Bad フィードバック: ${queue.length} 件 ===\n`);
for (const [match, { current, examples }] of hitMap.entries()) {
  console.log(`語: ${match}`);
  console.log(`現在の置換 (gentle): ${current}`);
  console.log(`不満例: ${examples.slice(0, 2).join(" / ")}`);
  console.log("---");
}
console.log("\n→ Claude Code に「routineを実行して」と伝えるとパターンが改善されます。");
