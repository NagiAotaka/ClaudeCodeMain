# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロダクト概要

**「やさしいフレーズ」** — きつい言葉・悪口を3つのモード（ビジネス / SNS / やさしい）でやさしい表現に変換する Web アプリ。

開発ブランチ: `claude/monetization-strategy-plan-g3QQH`

## 環境の注意事項

**Claude Code のクラウド環境（claude.ai/code）ではトンネル機能が無効**のため、`npm run dev` で起動した開発サーバー（`localhost:3000`）にブラウザから直接アクセスできない。

コードの変更を確認するには、ユーザーがローカルPCで以下を実行する必要がある：

```bash
git pull origin claude/monetization-strategy-plan-g3QQH
cd app && npm install && npm run dev
# → ユーザー自身のブラウザで http://localhost:3000 を開く
```

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

## 辞書規則（patterns.ts 編集時のガイドライン）

### ルール1: やさしさ優先（最重要）
置換テキストは元の語の否定的な意味を引き継がない。批判・皮肉が残るものはすべてNG。

| Bad（NG）の例 | 問題 | Good（OK）の例 |
|------------|------|--------------|
| 最低 → 期待外れ | 「期待外れ」はまだ批判的 | 最低 → **独特** |
| バカ → 天然 | 「天然」≒ちょっとバカの含意が残る | バカ → **ユニーク** |
| カス → 磨かれていない可能性 | 「磨かれていない」は否定的 | カス → **原石** |

### ルール2: 文法的汎用性（「な」重複・途切れを防ぐ）

**NG: 「な」で終わる語（形容動詞の連体形）**
- Bad例：「最低」→「独特**な**」 → 「最低**な**人」→「独特**なな**人」✗
- Bad例：「クズ野郎」→「少し荒削りな魅力のある」 → 「クズ野郎め」→「少し荒削りな魅力のあるめ」✗
- 修正：「な」を取って語幹だけにする → 「独特」「ユニーク」

**NG: 「〜の」で終わる語（連体形修飾+の）**
- Bad例：「カス」→「原石**の**」 → 「このカス」→「この原石の」（文が途切れる）✗
- 修正：「の」を取る → 「原石」

**NG: 「〜な方」など長い説明文**
- Bad例：「クズ野郎」→「少しユニークな発想をお持ちの」 → 「クズ野郎め」→「少しユニークな発想をお持ちのめ」✗
- 修正：短い独立した語に置き換える

**OK: 形容動詞語幹（「な」なし）**
- 「バカな人」→「ユニークな人」✓（元の「な」はそのまま残る）
- 「あいつはバカ」→「あの方はユニーク」✓

**OK★（最も汎用）: 動詞連体形（〜あふれる、〜光る）**
- 「クソ仕様」→「個性あふれる仕様」✓（連体修飾）
- 「あいつマジでクソ」→「あの方本当に個性あふれる」✓（述語）

**複合名詞（〜野郎、〜め等）は「方」付き名詞句でもOK**
- 「クズ野郎め」→「才能光る方め」✓

### ルール3: 同一パターン集約
同じ意味の語は1つのPatternにまとめる。
- NG: バカとバーカをそれぞれ別Patternに登録する
- OK: `match: "バカ", variants: ["バーカ", "ばーか", "馬鹿"]`

### ルール4: 複合語優先登録
複合語（ドブカス、クズ野郎等）は別Patternとして独立登録する（部分一致防止）。
- NG: カスの variants に "ドブカス" を入れる
- OK: "ドブカス" を独立した match として登録し、variantsには含めない

### ルール5: 短さの原則
置換後テキストは短く（2〜6文字が理想）。長いと連続ヒット時に文が肥大化する。

### ルール6: 受動的攻撃表現の扱い
「〜すぎじゃない？」「ありえなくない？」の嫌味な疑問形は、直前の否定語が置換されれば十分。単体のパターン登録は誤爆リスクが高いため避ける。

---

## シークレット管理

シークレットは必ず `app/.env.local` に記述（`.gitignore` 済み）。

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase |
| `STRIPE_SECRET_KEY` | Stripe |
| `ANTHROPIC_API_KEY` | Claude API |
