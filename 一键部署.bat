@echo off
chcp 65001 >nul
echo ========================================
echo   学生成绩管理系统 - 一键部署脚本
echo   包含300名学生成绩数据
echo ========================================
echo.

:: 1. 初始化数据库
echo [1/3] 正在初始化数据库...
cd backend
mysql -u root -p < init.sql
if errorlevel 1 (
    echo.
    echo ❌ 数据库初始化失败！
    echo 请检查:
    echo   1. MySQL服务是否已启动
    echo   2. root密码是否正确
    echo   3. MySQL命令是否在PATH中
    pause
    exit /b 1
)
echo ✓ 数据库初始化成功！
echo.

:: 2. 编译并启动后端
echo [2/3] 正在启动后端服务 (端口4000)...
start "后端服务" cmd /k "cd /d %cd% && mvn spring-boot:run"
echo ✓ 后端服务启动中...
timeout /t 10 /nobreak >nul
echo.

:: 3. 启动前端
echo [3/3] 正在启动前端服务 (端口5173)...
cd ..\frontend
start "前端服务" cmd /k "npm run dev"
echo ✓ 前端服务启动中...
echo.

echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 📊 数据统计:
echo   • 学生: 300人
echo   • 教师: 20人
echo   • 课程: 15门
echo   • 教学班: 30个
echo   • 成绩记录: 约1000+条
echo   • 用户: 19个测试账号
echo   • 角色: 6种角色
echo   • 权限: 51项权限
echo   • 审计日志: 30+条操作记录
echo.
echo 🌐 访问地址:
echo   前端: http://localhost:5173
echo   后端: http://localhost:4000
echo.
echo 👤 测试账号 (密码都是: 123456):
echo   super_admin    - 超级管理员 (所有权限)
echo   admin          - 管理员
echo   academic_admin - 教务管理员
echo   teacher01      - 教师
echo   student001     - 学生
echo   guest          - 访客
echo.
echo ========================================
echo 等待15秒后自动打开浏览器...
timeout /t 15 /nobreak >nul

start http://localhost:5173

echo.
echo 提示: 可以关闭本窗口，后端和前端将继续运行
pause
