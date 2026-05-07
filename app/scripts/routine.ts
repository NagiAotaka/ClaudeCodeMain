/**
 * routine.ts — Bad フィードバックから辞書改善案を生成する
 *
 * 使い方:
 *   cd app && npx tsx scripts/routine.ts --input feedback-log.jsonl --output suggested-patterns.json
 *
 * 入力 JSONL フォーマット (feedback_* キーの localStorage をエクスポートしたもの):
 *   {"type":"bad","output":"変換後テキスト","ts":1234567890}
 */

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

const RULES = `
## 辞書規則（やさしいフレーズ）

### ルール1: やさしさ優先
置換テキストは元の語の否定的な意味を引き継がない。

### ルール2: 文法的汎用性
- NG: 「な」で終わる形（「独特な」）→「最低な人」→「独特なな人」
- NG: 「〜の」で終わる形（「原石の」）→ 文が途切れる
- OK: 「な」なしの形容動詞語幹（「独特」「ユニーク」）
- OK★: 動詞連体形（「個性あふれる」「才能光る」）← 連体修飾にも述語にも使える

### ルール3: 同一パターン集約
同じ意味の語は1つのPatternのmatch/variantsにまとめる。

### ルール4: 複合語優先登録
複合語（ドブカス、クズ野郎等）は別Patternとして独立登録する。

### ルール5: 短さの原則
置換後テキストは2〜6文字が理想。
`;

function parseArgs(): { input: string; output: string } {
  const args = process.argv.slice(2);
  const inputIdx = args.indexOf("--input");
  const outputIdx = args.indexOf("--output");
  if (inputIdx === -1 || outputIdx === -1) {
    console.error("Usage: npx tsx scripts/routine.ts --input <file.jsonl> --output <file.json>");
    process.exit(1);
  }
  return { input: args[inputIdx + 1], output: args[outputIdx + 1] };
}

function loadFeedback(filePath: string): string[] {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(Boolean);
  return lines
    .map((line) => {
      try {
        const obj = JSON.parse(line);
        return obj.type === "bad" ? obj.output : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as string[];
}

function loadPatterns(): string {
  const patternsPath = path.join(__dirname, "../src/data/patterns.ts");
  return fs.readFileSync(patternsPath, "utf-8");
}

async function main() {
  const { input, output } = parseArgs();

  const badOutputs = loadFeedback(input);
  if (badOutputs.length === 0) {
    console.log("No bad feedback found.");
    process.exit(0);
  }

  const patternsSource = loadPatterns();
  const client = new Anthropic();

  const prompt = `以下は「やさしいフレーズ」アプリの辞書ルールと現在のパターン定義、そしてユーザーから「Bad」評価を受けた変換後テキストのリストです。

${RULES}

## 現在のパターン定義（patterns.ts）
\`\`\`typescript
${patternsSource}
\`\`\`

## Bad評価を受けた変換後テキスト
${badOutputs.map((o, i) => `${i + 1}. ${o}`).join("\n")}

上記のBad評価テキストから、どのパターンに問題があるかを分析し、改善案をJSON配列で返してください。

フォーマット:
[
  {
    "action": "update" | "add",
    "match": "対象のmatch文字列",
    "reason": "改善理由（日本語で1文）",
    "gentleReplacement": "新しいgentle置換テキスト"
  }
]

JSONのみ返してください。マークダウンのコードブロックは不要です。`;

  console.log(`Analyzing ${badOutputs.length} bad feedback entries...`);

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const responseText = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const suggestions = JSON.parse(responseText);
    fs.writeFileSync(output, JSON.stringify(suggestions, null, 2), "utf-8");
    console.log(`✓ ${suggestions.length} suggestions written to ${output}`);
  } catch {
    console.error("Failed to parse response as JSON. Raw response:");
    console.error(responseText);
    fs.writeFileSync(output, responseText, "utf-8");
  }
}

main().catch(console.error);
