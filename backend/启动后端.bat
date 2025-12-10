@echo off
chcp 65001 >nul
echo ========================================
echo   学生成绩管理系统 - 后端启动
echo ========================================
echo.

cd /d "%~dp0"

echo 正在检查 Maven...
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Maven 未安装或不在 PATH 中！
    echo 请安装 Maven 或使用 IDEA 启动项目。
    pause
    exit /b 1
)

echo 正在启动后端服务 (端口 4000)...
echo.

mvn spring-boot:run

pause
