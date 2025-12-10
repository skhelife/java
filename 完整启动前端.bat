@echo off
chcp 65001 > nul
cd /d "%~dp0frontend"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     🎓 学生成绩管理系统 - 前端启动脚本               ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo [步骤 1/4] 检查 Node.js 环境...
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js,请先安装 Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

echo.
echo [步骤 2/4] 检查依赖...
if not exist "node_modules\" (
    echo 📦 正在安装依赖包...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)

echo.
echo [步骤 3/4] Mock数据配置检查...
if exist "src\services\mockData.ts" (
    echo ✅ mockData.ts 存在
) else (
    echo ❌ 缺少 mockData.ts
)

if exist "src\services\mockApi.ts" (
    echo ✅ mockApi.ts 存在
) else (
    echo ❌ 缺少 mockApi.ts
)

if exist "src\services\mockDataInit.ts" (
    echo ✅ mockDataInit.ts 存在
) else (
    echo ❌ 缺少 mockDataInit.ts
)

echo.
echo [步骤 4/4] 启动开发服务器...
echo.
echo ═══════════════════════════════════════════════════════
echo   📊 Mock数据已启用
echo   👥 包含300名学生数据
echo   📝 包含1000+成绩记录
echo   🔐 测试账号: admin / 123456
echo   🌐 访问地址: http://localhost:5173
echo ═══════════════════════════════════════════════════════
echo.
echo 💡 提示: 
echo    - 首次加载时会自动初始化Mock数据
echo    - 打开浏览器控制台可查看数据加载日志
echo    - 使用 window.mockDataTools 查看数据工具
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo ❌ 启动失败,请检查错误信息
    pause
    exit /b 1
)

pause
