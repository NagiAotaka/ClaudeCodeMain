# やさしいフレーズ

きつい言葉・悪口をやさしい表現に変換する Web アプリ。

## セットアップ

```bash
git clone https://github.com/NagiAotaka/ClaudeCodeMain.git
cd ClaudeCodeMain/app
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

---

## パブリックリポジトリとしての注意点

### 絶対にコミットしてはいけないもの

| ファイル | 内容 |
|---------|------|
| `.env.local` | Supabase・Stripe・Claude API などの秘密鍵 |
| `.env` | 同上 |
| `*secret*` `*key*` 等のファイル | 認証情報全般 |

`.env*.local` は `.gitignore` で除外済みのため、**シークレットは必ず `.env.local` に書くこと。**

### シークレットを誤ってコミットしたら

1. 該当サービスでキーを即座に無効化・再発行
2. `git log` でコミット履歴からも削除（履歴に残ると危険）
3. GitHub の Secret scanning アラートを確認

### 今後追加予定の機能で必要な設定

| 機能 | 設定場所 |
|------|---------|
| Supabase（DB・認証） | `app/.env.local` に `NEXT_PUBLIC_SUPABASE_URL` など |
| Stripe（決済） | `app/.env.local` に `STRIPE_SECRET_KEY` など |
| Claude API（AI変換） | `app/.env.local` に `ANTHROPIC_API_KEY` |

### コードを公開することで起きること

- 誰でもソースコードを閲覧・フォークできる
- 変換辞書（`src/data/patterns.ts`）も公開される
- 事業戦略（`monetization-strategy.md`）も公開される

競合リスクが気になる場合は、`monetization-strategy.md` をリポジトリから削除することを検討してください。

---

## ディレクトリ構成

```
ClaudeCodeMain/
├── app/                      # Next.js アプリ本体
│   └── src/
│       ├── app/              # ページ・レイアウト
│       ├── data/patterns.ts  # 変換辞書
│       └── lib/convert.ts    # 変換ロジック
└── monetization-strategy.md  # 事業戦略ドキュメント
```
