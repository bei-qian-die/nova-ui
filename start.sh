#!/usr/bin/env bash
# Nova UI 一键启动脚本（macOS / Linux）
# 用法：chmod +x start.sh && ./start.sh
set -e

cd "$(dirname "$0")"

echo ""
echo "==> 安装依赖 (pnpm install)"
pnpm install

echo ""
echo "==> 构建组件库 (pnpm --filter @nova-ui/components build)"
pnpm --filter @nova-ui/components build

echo ""
echo "==> 构建 resolver (pnpm --filter @nova-ui/resolver build)"
pnpm --filter @nova-ui/resolver build

echo ""
echo "==> 启动 Playground 开发服务器 -> http://localhost:5173"
echo "    按 Ctrl+C 停止"
echo ""
pnpm --filter playground dev