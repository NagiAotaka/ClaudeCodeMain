# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロダクト概要

**「やさしいフレーズ」** — きつい言葉・悪口を3つのモード（ビジネス / SNS / やさしい）でやさしい表現に変換する Web アプリ。

開発ブランチ: `claude/monetization-strategy-plan-g3QQH`

## コマンド（すべて `app/` ディレクトリから実行）

```bash
npm run dev          # 開発サーバー起動 → http://localhost:3000
npm run build        # 本番ビルド
npm run lint         # ESLint
npx tsc --noEmit     # 型チェックのみ

# ロジック単体テスト（テストフレームワーク未導入のため tsx で直接実行）
npx tsx -e "import { convert } from './src/lib/convert.ts'; console.log(convert('バカやろう', 'business'));"
```

## アーキテクチャ

```
app/src/
├── data/patterns.ts   # 変換辞書（唯一のデータ定義）
├── lib/convert.ts     # 変換エンジン（辞書を読んで変換）
└── app/page.tsx       # UI（"use client" の単一ページ）
```

パスエイリアス: `@/*` → `src/*`（例: `@/lib/convert`）

### データフロー

`page.tsx` → `convert(input, mode)` → `ConvertResult { output, hits[] }`

### `patterns.ts` — Pattern 型

```ts
type Pattern = {
  match: string;           // 主マッチ文字列
  variants?: string[];     // 表記ゆれ・スラング（馬鹿, バーカ, タヒ 等）
  replacements: Record<"business" | "sns" | "gentle", string>;
  ng?: boolean;            // true = コミュニティ表示時に伏字化
};
```

辞書を追加・編集する際は `patterns.ts` のみ変更する。`convert.ts` は自動で `match + variants` をすべて照合する。

### `convert.ts` — 変換エンジン

モジュールロード時に `match` と全 `variants` を展開して `MatchEntry[]` を構築し、**文字列長の降順**でソートして登録。変換時は長いキーから順にマッチするため、「は？意味わからん」が「は？」より先にヒットする。

`maskNgWords(input, patterns[])` は `ng: true` なパターンの `match` と `variants` を `〇` で伏字化する（コミュニティ機能向け）。

## 今後の実装予定（未着手）

| 機能 | 概要 |
|------|------|
| 変換アニメーション | ボタン押下時に文字が変わる演出 + タブ切替（やさしい版 / 元の文） |
| X シェア改善 | 変換後のみポスト（現在は対比テキスト）|
| コミュニティギャラリー | 変換後テキストのみ投稿・いいね・ランキング（変換前は保存しない） |
| 認証・使用制限 | Supabase Auth + 1日3回制限 |
| 広告リワード | 動画視聴 → +3回回復（Google AdSense、ギャンブル等のカテゴリはブロック） |
| Stripe 決済 | 月額 580円、無制限・広告なし |
| AI 変換（Phase 2） | Claude Haiku API（有料ユーザーのみ） |

## シークレット管理

シークレットは必ず `app/.env.local` に記述（`.gitignore` 済み）。

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |
| `STRIPE_SECRET_KEY` | Stripe |
| `ANTHROPIC_API_KEY` | Claude API |
