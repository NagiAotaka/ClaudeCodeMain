# ClaudeCodeMain

## Architecture Overview

このリポジトリは〇〇を行うシステムです。（プロジェクトの概要を2〜3文で記述してください）

---

## Directory Map

```
/
├── src/
│   ├── api/          # 外部API呼び出し・HTTPクライアント
│   ├── components/   # UIコンポーネント
│   ├── features/     # 機能単位のモジュール
│   ├── utils/        # 共通ユーティリティ関数
│   └── types/        # 型定義
├── tests/            # テストコード
├── docs/             # ドキュメント
└── CLAUDE.md         # Claude Code向けプロジェクトガイド
```

> 実際のディレクトリ構成に合わせて更新してください。

---

## Where to Find / Fix Things

| やりたいこと               | 対応ファイル・ディレクトリ       |
|--------------------------|-------------------------------|
| 認証ロジックの修正          | `src/auth/`                   |
| APIエラーハンドリング       | `src/api/error-handler.ts`    |
| UIコンポーネントの追加・修正 | `src/components/`             |
| 新機能の追加               | `src/features/<機能名>/`      |
| 共通ユーティリティの修正     | `src/utils/`                  |
| 型定義の変更               | `src/types/`                  |

> 実際のファイル構成に合わせてこのテーブルを更新してください。このテーブルが最もトークン効率に直結します。

---

## Common Workflows

### バグ修正
1. 上の「Where to Find / Fix Things」テーブルで対象ファイルを特定
2. `fix/<issue番号>-<簡単な説明>` ブランチを切る
3. 修正 → テスト → PR

### 新機能追加
1. `src/features/<機能名>/` にモジュールを追加
2. `tests/` に対応するテストを追加
3. このREADMEのテーブルを更新

---

## Key Constraints

- （使用言語・ランタイムのバージョンを記載：例 Node.js 20+, Python 3.11+）
- （コーディング規約：例 `any` 型禁止、関数は100行以内）
- （その他注意事項）

---

## Token-Efficient Prompting Guide

Claude Code への修正依頼を効率よく行うコツ：

**良いプロンプトの例:**
```
src/billing/processor.ts の charge() 関数で
カード決済が2重実行されるバグがあります。
修正してください。
```

**ポイント:**
- ファイルパスを明示する（`@src/billing/processor.ts` でファイルを直接参照できる）
- 「何が起きているか」と「あるべき動作」を両方書く
- 1回の依頼を1ファイル or 1機能に絞る

**CLAUDE.md の活用:** プロジェクトルートに `CLAUDE.md` を置くと Claude Code が自動読み込みします。プロジェクト固有のルールや構造をそこに書いておくと、毎回説明する必要がなくなります。`/init` コマンドで自動生成できます。
