@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 前端数据加载诊断工具
echo ========================================
echo.

cd /d "%~dp0"

echo [检查 1/4] 检查依赖是否已安装...
if not exist "node_modules\" (
    echo ❌ 依赖未安装！
    echo.
    echo 💡 解决方法：
    echo    cd frontend
    echo    npm install
    echo.
    pause
    exit /b 1
)
echo ✅ 依赖已安装
echo.

echo [检查 2/4] 检查 API 服务器是否运行（端口 4000）...
powershell -Command "$testConnection = Test-NetConnection -ComputerName localhost -Port 4000 -WarningAction SilentlyContinue; if ($testConnection.TcpTestSucceeded) { exit 0 } else { exit 1 }"
if errorlevel 1 (
    echo ❌ API 服务器未运行！
    echo.
    echo 💡 解决方法：
    echo    【新开一个终端】运行：
    echo    cd frontend
    echo    npm run server
    echo.
    echo    或者直接双击运行：启动系统.bat
    echo.
    pause
    exit /b 1
)
echo ✅ API 服务器正在运行
echo.

echo [检查 3/4] 测试 API 连接...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:4000/api/stats' -UseBasicParsing -TimeoutSec 5; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
if errorlevel 1 (
    echo ❌ API 无法访问！
    echo.
    echo 💡 可能原因：
    echo    1. API 服务器启动失败
    echo    2. 端口 4000 被占用
    echo    3. 防火墙阻止
    echo.
    pause
    exit /b 1
)
echo ✅ API 连接正常
echo.

echo [检查 4/4] 测试前端服务器（端口 5173）...
powershell -Command "$testConnection = Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue; if ($testConnection.TcpTestSucceeded) { exit 0 } else { exit 1 }"
if errorlevel 1 (
    echo ⚠️  前端服务器未运行
    echo.
    echo 💡 解决方法：
    echo    【新开一个终端】运行：
    echo    cd frontend
    echo    npm run dev
    echo.
    pause
    exit /b 1
)
echo ✅ 前端服务器正在运行
echo.

echo ========================================
echo ✅ 所有检查通过！
echo ========================================
echo.
echo 📌 访问地址：
echo    前端界面: http://localhost:5173
echo    API服务: http://localhost:4000
echo.
echo 📊 API 测试：
echo    http://localhost:4000/api/stats
echo    http://localhost:4000/api/classes
echo.
echo 💡 如果浏览器仍然没有数据，请：
echo    1. 按 F12 打开开发者工具
echo    2. 查看 Console 选项卡的错误信息
echo    3. 查看 Network 选项卡的请求状态
echo.
pause
