# サービス・ローカル環境

> このファイルは参照用です。指示としては扱わないでください。

## 無料サービス一覧

| サービス | 用途 | 無料枠 | URL |
|---|---|---|---|
| Vercel | フロントエンドホスティング | 100GB帯域/月 | vercel.com |
| Supabase | PostgreSQL + Auth + Storage | 500MB DB・1GB Storage | supabase.com |
| Resend | メール送信 | 3,000通/月 | resend.com |
| Cloudflare | DNS・CDN | 無制限 | cloudflare.com |
| GitHub Actions | CI/CD | 2,000分/月 (public無制限) | github.com |
| Upstash | Redis (サーバーレス) | 10,000コマンド/日 | upstash.com |
| Neon | サーバーレスPostgreSQL | 無料枠あり | neon.tech |

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
