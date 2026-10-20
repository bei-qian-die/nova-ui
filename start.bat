@echo off
rem Nova UI 一键启动脚本（Windows 双击运行）
chcp 65001 >nul

where pnpm >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 pnpm，请先执行: npm install -g pnpm@9
  pause
  exit /b 1
)

echo.
echo == 安装依赖 (pnpm install)
call pnpm install
if errorlevel 1 goto fail

echo.
echo == 构建组件库与 resolver
call pnpm --filter @nova-ui/components build
if errorlevel 1 goto fail
call pnpm --filter @nova-ui/resolver build
if errorlevel 1 goto fail

echo.
echo == 启动 Playground 开发服务器 -> http://localhost:5173
echo    按 Ctrl+C 停止
echo.
call pnpm --filter playground dev

goto :eof

:fail
echo.
echo [错误] 启动失败，请检查上方输出。
pause
exit /b 1