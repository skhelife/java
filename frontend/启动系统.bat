@echo off
echo ========================================
echo 🎓 学生成绩管理系统 - 炫酷前端版
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查依赖...
if not exist "node_modules\" (
    echo 首次运行，正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
)

echo.
echo [2/3] 启动后端 API 服务器 (端口 4000)...
start "学生成绩系统 - API Server" cmd /k "npm run server"

timeout /t 3 /nobreak >nul

echo.
echo [3/3] 启动前端开发服务器 (端口 5173)...
echo.
echo ✅ 启动完成！浏览器将自动打开...
echo.
echo 📌 前端地址: http://localhost:5173
echo 📌 API地址: http://localhost:4000
echo.
echo 💡 功能导航:
echo    📊 系统概览 - 总体数据与可视化
echo    📈 班级分布 - 2D/3D 图表切换
echo    🔍 学生查询 - 智能搜索与详情
echo    🏆 排行榜 - 金银铜牌榜单
echo    📉 统计分析 - 多维度数据分析
echo    👥 学生管理 - 添加/编辑/删除学生
echo    📝 成绩录入 - 录入/修改成绩
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================

npm run dev
