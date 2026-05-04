# ClaudeCodeMain — 開発基盤ナレッジベース

このリポジトリはウェブアプリ・SaaS・ウェブサイト開発の共通基盤です。
新しいプロジェクトを作るたびに、このファイルに学んだことを追記してください。

---

## リポジトリ構成

```
ClaudeCodeMain/
├── docker/
│   └── docker-compose.yml     # ローカル開発用 DB・サービス
├── configs/
│   ├── biome.json             # 共通 Linter/Formatter 設定
│   ├── tsconfig.base.json     # 共通 TypeScript 設定
│   └── .gitignore.template    # 共通 .gitignore
├── templates/
│   └── nextjs-saas/           # Next.js 15 SaaS スターター
├── scripts/
│   └── new-project.sh         # 新規プロジェクト作成スクリプト
└── CLAUDE.md                  # このファイル (ナレッジベース)
```

---

## 新規プロジェクトの作り方

```bash
# 基本
./scripts/new-project.sh <project-name> [template] [target-dir]

# 例
./scripts/new-project.sh my-saas nextjs-saas ~/projects/my-saas
```

作成後の手順:
1. `cd <target-dir>`
2. `.env.local` の各値を設定
3. `docker compose -f ~/ClaudeCodeMain/docker/docker-compose.yml up -d` でDB起動
4. `pnpm db:push` でスキーマ反映
5. `pnpm dev` で開発サーバー起動

---

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

## 無料サービス一覧

| サービス | 用途 | 無料枠 | URL |
|---|---|---|---|
| Vercel | フロントエンドホスティング | 100GB帯域/月 | vercel.com |
| Supabase | PostgreSQL + Auth + Storage | 500MB DB・1GB Storage | supabase.com |
| Resend | メール送信 | 3,000通/月 | resend.com |
| Cloudflare | DNS・CDN | 無制限 | cloudflare.com |
| GitHub Actions | CI/CD | 2,000分/月 (public無制限) | github.com |
| Upstash | Redis (サーバーレス) | 10,000コマンド/日 | upstash.com |
| PlanetScale / Neon | サーバーレスPostgreSQL | 無料枠あり | neon.tech |

---

## ローカル開発サービス (Docker)

```bash
# 起動
docker compose -f ~/ClaudeCodeMain/docker/docker-compose.yml up -d

# 停止
docker compose -f ~/ClaudeCodeMain/docker/docker-compose.yml down

# ログ確認
docker compose -f ~/ClaudeCodeMain/docker/docker-compose.yml logs -f
```

| サービス | URL | 用途 |
|---|---|---|
| PostgreSQL | localhost:5432 | メインDB |
| Redis | localhost:6379 | セッション・キャッシュ |
| Mailpit (SMTP) | localhost:1025 | メール送信テスト |
| Mailpit (Web UI) | http://localhost:8025 | 受信メール確認 |

接続情報:
- DB: `postgresql://dev:devpassword@localhost:5432/devdb`
- Redis: `redis://localhost:6379`

---

## よく使うコマンド

```bash
# 開発
pnpm dev           # 開発サーバー (Turbopack)
pnpm build         # プロダクションビルド
pnpm typecheck     # 型チェックのみ

# DB
pnpm db:push       # スキーマをDBに反映 (開発用)
pnpm db:generate   # マイグレーションファイル生成
pnpm db:migrate    # マイグレーション実行
pnpm db:studio     # Drizzle Studio (DB GUI)

# コード品質
pnpm lint          # Biome チェック
pnpm lint:fix      # Biome 自動修正
pnpm format        # フォーマット

# テスト
pnpm test          # 全テスト実行
pnpm test:watch    # ウォッチモード
```

---

## デプロイ手順 (Vercel)

```bash
# 初回
npx vercel

# 環境変数設定
npx vercel env add DATABASE_URL production
npx vercel env add BETTER_AUTH_SECRET production
npx vercel env add RESEND_API_KEY production

# 本番デプロイ
npx vercel --prod
```

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

## 学んだこと・ナレッジ (随時追記)

<!-- 新しいプロジェクトで得た知見をここに追記していく -->

### 2026-05-04 — 基盤セットアップ
- `better-auth` は Drizzle と直接統合できる (`drizzleAdapter`)
- Tailwind CSS v4 は `@import "tailwindcss"` のみで設定完了 (tailwind.config.ts 不要)
- Biome v1.9 は `extends` でルートの設定ファイルを継承できる
- Next.js 15 の `--turbopack` フラグで HMR が大幅高速化

---

## テンプレート追加の仕方

新しいテンプレートを追加する場合:

1. `templates/<template-name>/` を作成
2. `package.json` に `{{PROJECT_NAME}}` プレースホルダーを使用
3. `biome.json` と `tsconfig.json` は `../../configs/` を extends
4. このファイルの「技術スタック」「コマンド」セクションを更新

---

## 環境変数の命名規則

| プレフィックス | 用途 |
|---|---|
| `NEXT_PUBLIC_` | クライアントサイドで参照可能 |
| `DATABASE_` | DB接続情報 |
| `BETTER_AUTH_` | 認証設定 |
| `RESEND_` | メール設定 |
| `GITHUB_` / `GOOGLE_` | OAuth プロバイダー |
