#!/usr/bin/env bash
# CLAUDE.md の行数を監視し、閾値超えで圧縮・分割を提案する

CLAUDE_MD="/home/user/ClaudeCodeMain/CLAUDE.md"

if [ ! -f "$CLAUDE_MD" ]; then
  exit 0
fi

LINES=$(wc -l < "$CLAUDE_MD")

if [ "$LINES" -gt 250 ]; then
  echo ""
  echo "⚠️  CLAUDE.md が ${LINES}行になっています【分割推奨】"
  echo "   対応: セクションを docs/ に切り出してください"
  echo "   例:   docs/stack.md / docs/commands.md / docs/knowledge/YYYY-MM.md"
  echo "   CLAUDE.md には概要と docs/ への参照のみ残す（目標 ≤100行）"
elif [ "$LINES" -gt 150 ]; then
  echo ""
  echo "📝 CLAUDE.md が ${LINES}行になっています【圧縮推奨】"
  echo "   対応: 古いナレッジを docs/knowledge/$(date +%Y-%m).md に移してください"
  echo "   CLAUDE.md には直近1〜2件のナレッジのみ残す（目標 ≤150行）"
fi
# 150行以下では何も出力しない（正常）
