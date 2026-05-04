#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# new-project.sh — 新規プロジェクトのブートストラップスクリプト
# 使い方: ./scripts/new-project.sh <project-name> <template> <target-dir>
# 例:     ./scripts/new-project.sh my-saas nextjs-saas ~/projects/my-saas
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- カラー出力 ---
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERR]${NC}  $*"; exit 1; }

# --- 引数チェック ---
usage() {
  echo "使い方: $0 <project-name> [template] [target-dir]"
  echo ""
  echo "テンプレート一覧:"
  for t in "$BASE_DIR/templates"/*/; do echo "  - $(basename "$t")"; done
  echo ""
  echo "例: $0 my-app nextjs-saas ~/projects/my-app"
  exit 1
}

PROJECT_NAME="${1:-}"
TEMPLATE="${2:-nextjs-saas}"
TARGET_DIR="${3:-$(pwd)/$PROJECT_NAME}"

[[ -z "$PROJECT_NAME" ]] && usage
TEMPLATE_DIR="$BASE_DIR/templates/$TEMPLATE"
[[ ! -d "$TEMPLATE_DIR" ]] && error "テンプレート '$TEMPLATE' が見つかりません"
[[ -d "$TARGET_DIR" ]]    && error "ディレクトリ '$TARGET_DIR' は既に存在します"

# --- コピー & 変数置換 ---
info "プロジェクト '$PROJECT_NAME' を作成中... ($TEMPLATE)"
info "出力先: $TARGET_DIR"

cp -r "$TEMPLATE_DIR" "$TARGET_DIR"

# {{PROJECT_NAME}} を実際のプロジェクト名に置換
find "$TARGET_DIR" -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.env*" -o -name "*.md" \) \
  -exec sed -i "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" {} +

# .env.example → .env.local にコピー
if [[ -f "$TARGET_DIR/.env.example" ]]; then
  cp "$TARGET_DIR/.env.example" "$TARGET_DIR/.env.local"
  success ".env.local を作成しました (値を設定してください)"
fi

# .gitignore テンプレートをコピー
cp "$BASE_DIR/configs/.gitignore.template" "$TARGET_DIR/.gitignore"

# tsconfig.json の extends パスを絶対パスに書き換え
CONFIGS_PATH="$BASE_DIR/configs"
if [[ -f "$TARGET_DIR/tsconfig.json" ]]; then
  sed -i "s|../../configs/tsconfig.base.json|$CONFIGS_PATH/tsconfig.base.json|g" "$TARGET_DIR/tsconfig.json"
fi
if [[ -f "$TARGET_DIR/biome.json" ]]; then
  sed -i "s|../../configs/biome.json|$CONFIGS_PATH/biome.json|g" "$TARGET_DIR/biome.json"
fi

# --- 依存関係インストール ---
cd "$TARGET_DIR"
if command -v pnpm &>/dev/null; then
  info "pnpm install を実行中..."
  pnpm install
elif command -v npm &>/dev/null; then
  info "npm install を実行中..."
  npm install
else
  warn "パッケージマネージャが見つかりません。手動で install してください"
fi

# --- Git 初期化 ---
git init
git add .
git commit -m "chore: initial commit from $TEMPLATE template"
success "git リポジトリを初期化しました"

# --- 完了メッセージ ---
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  セットアップ完了!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "次のステップ:"
echo "  1. cd $TARGET_DIR"
echo "  2. .env.local の値を設定"
echo "  3. docker compose -f $BASE_DIR/docker/docker-compose.yml up -d  # DB起動"
echo "  4. pnpm db:push   # スキーマをDBに反映"
echo "  5. pnpm dev       # 開発サーバー起動"
echo ""
echo "メール確認: http://localhost:8025 (Mailpit)"
