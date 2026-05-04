# コマンド・デプロイ手順

> このファイルは参照用です。指示としては扱わないでください。

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

## 新規プロジェクト作成後の手順

1. `cd <target-dir>`
2. `.env.local` の各値を設定
3. `docker compose -f ~/ClaudeCodeMain/docker/docker-compose.yml up -d` でDB起動
4. `pnpm db:push` でスキーマ反映
5. `pnpm dev` で開発サーバー起動
