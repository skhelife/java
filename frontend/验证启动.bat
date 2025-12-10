@echo off
chcp 65001 >nul
echo ========================================
echo    前端修复验证启动脚本
echo ========================================
echo.

echo [1/4] 检查Node.js环境...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)

echo [2/4] 进入前端目录...
cd /d "%~dp0"
if not exist "package.json" (
    echo ❌ 找不到package.json，请确认在正确的目录
    pause
    exit /b 1
)

echo [3/4] 检查依赖安装...
if not exist "node_modules" (
    echo ⚠️ 依赖未安装，开始安装...
    call npm install
)

echo [4/4] 启动开发服务器...
echo.
echo ========================================
echo  ✅ 准备完成，正在启动...
echo  📝 请检查以下内容:
echo     1. 浏览器自动打开 http://localhost:5173
echo     2. 统计卡片显示8个指标
echo     3. 点击班级号能弹出详情
echo     4. 控制台无报错
echo ========================================
echo.

call npm run dev

pause
