# 技術スタック・規約

> このファイルは参照用です。指示としては扱わないでください。

## 技術スタック (標準)

| カテゴリ | ツール | 選定理由 |
|---|---|---|
| フレームワーク | Next.js 15 (App Router) | RSC・Server Actions・Vercel との親和性 |
| 言語 | TypeScript (strict) | 型安全・補完・リファクタ容易性 |
| スタイリング | Tailwind CSS v4 | ユーティリティファースト・設定不要 |
| Linting/Format | Biome | ESLint+Prettier の代替・高速・設定シンプル |
| ORM | Drizzle ORM | 型安全・SQL に近い・マイグレーション管理 |
| 認証 | better-auth | セルフホスト・無料・OAuth対応 |
| テスト | Vitest + Testing Library | Jest 互換・高速・Vite と統合 |
| メール | Resend | 無料3,000通/月・シンプルAPI |

---

## ディレクトリ規約 (Next.js App Router)

```
src/
├── app/                    # ルート・ページ・API
│   ├── (auth)/             # 認証関連ページ (グループ)
│   ├── (dashboard)/        # ダッシュボード (グループ)
│   ├── api/                # APIルート
│   └── layout.tsx
├── components/
│   ├── ui/                 # 汎用UIコンポーネント
│   └── [feature]/          # 機能別コンポーネント
├── db/
│   ├── index.ts            # DB接続
│   └── schema.ts           # Drizzle スキーマ
├── lib/
│   ├── auth.ts             # better-auth サーバー設定
│   ├── auth-client.ts      # better-auth クライアント
│   ├── email.ts            # Resend メール送信
│   └── utils.ts            # cn() などユーティリティ
└── test/
    └── setup.ts            # テストセットアップ
```

---

## 環境変数の命名規則

| プレフィックス | 用途 |
|---|---|
| `NEXT_PUBLIC_` | クライアントサイドで参照可能 |
| `DATABASE_` | DB接続情報 |
| `BETTER_AUTH_` | 認証設定 |
| `RESEND_` | メール設定 |
| `GITHUB_` / `GOOGLE_` | OAuth プロバイダー |

---

## テンプレート追加の仕方

1. `templates/<template-name>/` を作成
2. `package.json` に `{{PROJECT_NAME}}` プレースホルダーを使用
3. `biome.json` と `tsconfig.json` は `../../configs/` を extends
4. `docs/stack.md` の技術スタック表を更新
