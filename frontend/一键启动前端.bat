@echo off
chcp 65001 >nul
echo ========================================
echo  学生成绩管理系统 - 前端启动脚本
echo ========================================
echo.

REM 检查 Node.js 环境
echo [1/3] 检查 Node.js 环境...
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到 Node.js 环境
    echo    请先安装 Node.js 14 或更高版本
    pause
    exit /b 1
)
echo ✅ Node.js 环境已就绪
echo.

REM 检查依赖是否已安装
echo [2/3] 检查依赖...
if not exist "node_modules" (
    echo ⏳ 检测到首次运行，正在安装依赖...
    echo    这可能需要几分钟，请耐心等待...
    npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败!
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已就绪
)
echo.

REM 启动前端服务
echo [3/3] 启动前端服务...
echo ⏳ 正在启动，请稍候...
echo.
echo ========================================
echo  提示: 浏览器会自动打开 http://localhost:5173/
echo  按 Ctrl+C 可停止服务
echo ========================================
echo.

npm run dev

if errorlevel 1 (
    echo.
    echo ❌ 前端启动失败!
    echo.
    echo 可能的原因:
    echo 1. 端口 5173 已被占用
    echo 2. 依赖安装不完整
    echo.
    echo 解决方案:
    echo 1. 关闭其他占用 5173 端口的程序
    echo 2. 删除 node_modules 文件夹后重新运行此脚本
    echo.
    pause
    exit /b 1
)

pause
