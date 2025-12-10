@echo off
chcp 65001 >nul
title 🚀 前端功能完整测试

echo.
echo ========================================
echo     🎓 学生成绩管理系统 - 功能测试
echo ========================================
echo.
echo 正在启动前端服务...
echo.

cd /d "%~dp0"

:: 检查node_modules
if not exist "node_modules" (
    echo ⚠️  未检测到依赖，正在安装...
    call npm install
    if errorlevel 1 (
        echo.
        echo ❌ 依赖安装失败！
        pause
        exit /b 1
    )
)

echo.
echo ✅ 依赖检查完成
echo.
echo 🌐 启动开发服务器...
echo.
echo ========================================
echo 测试清单：
echo ========================================
echo 1. ✅ 系统概览 - http://localhost:5173/
echo 2. ✅ 班级分布 - http://localhost:5173/distribution
echo 3. ✅ 学生查询 - http://localhost:5173/search
echo 4. ✅ 排行榜   - http://localhost:5173/rankings
echo 5. ✅ 统计分析 - http://localhost:5173/stats
echo 6. ✅ 学生管理 - http://localhost:5173/management
echo 7. ✅ 成绩列表 - http://localhost:5173/grade-list
echo 8. ✅ 成绩录入 - http://localhost:5173/grades
echo 9. ✅ 用户管理 - http://localhost:5173/users
echo 10. ✅ 角色管理 - http://localhost:5173/roles
echo 11. ✅ 审计日志 - http://localhost:5173/logs
echo ========================================
echo.
echo 默认账号: admin
echo 默认密码: admin123
echo.
echo 🎯 提示：按 Ctrl+C 停止服务
echo.

:: 启动开发服务器
call npm run dev

pause
