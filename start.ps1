# Nova UI 一键启动脚本（Windows PowerShell）
# 用法：在项目根目录执行 ./start.ps1，或右键“使用 PowerShell 运行”
$ErrorActionPreference = 'Stop'

function Step([string]$msg) {
  Write-Host "`n==> $msg" -ForegroundColor Cyan
}

# 切换到脚本所在目录（项目根目录）
Set-Location -Path $PSScriptRoot

# 1. 检查 pnpm
try {
  $null = pnpm --version
} catch {
  Write-Host "[错误] 未检测到 pnpm，请先安装：" -ForegroundColor Red
  Write-Host "       npm install -g pnpm@9" -ForegroundColor Yellow
  exit 1
}

# 2. 安装依赖
Step "安装依赖 (pnpm install)"
pnpm install

# 3. 构建组件库 + resolver（Playground 依赖构建产物）
Step "构建组件库 (pnpm --filter @nova-ui/components build)"
pnpm --filter @nova-ui/components build

Step "构建 resolver (pnpm --filter @nova-ui/resolver build)"
pnpm --filter @nova-ui/resolver build

# 4. 启动 Playground 开发服务器
Step "启动 Playground 开发服务器 -> http://localhost:5173"
Write-Host "   按 Ctrl+C 停止`n" -ForegroundColor DarkGray
pnpm --filter playground dev