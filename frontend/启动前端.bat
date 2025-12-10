@echo off
chcp 65001 >nul
echo ========================================
echo   学生成绩管理系统 - 前端启动
echo ========================================
echo.

cd /d "%~dp0"

echo 正在检查 Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js 未安装！
    echo 请从 https://nodejs.org/ 下载安装。
    pause
    exit /b 1
)

echo 正在检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    npm install
)

echo.
echo 正在启动前端服务 (端口 5173)...
echo 浏览器访问: http://localhost:5173
echo.

npm run dev

pause
