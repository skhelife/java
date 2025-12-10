@echo off
chcp 65001 >nul
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        学生成绩管理系统 - 一键启动脚本                       ║
echo ║        实验四：Spring Boot 后端实现                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1] 初始化数据库
echo [2] 启动后端 (端口 4000)
echo [3] 启动前端 (端口 5173)  
echo [4] 同时启动前后端
echo [5] 退出
echo.

set /p choice=请选择操作 (1-5): 

if "%choice%"=="1" (
    cd backend
    call 初始化数据库.bat
    cd ..
    goto :eof
)

if "%choice%"=="2" (
    cd backend
    call 启动后端.bat
    cd ..
    goto :eof
)

if "%choice%"=="3" (
    cd frontend
    call 启动前端.bat
    cd ..
    goto :eof
)

if "%choice%"=="4" (
    echo 正在启动后端...
    start cmd /k "cd backend && mvn spring-boot:run"
    
    echo 等待后端启动 (5秒)...
    timeout /t 5 /nobreak >nul
    
    echo 正在启动前端...
    start cmd /k "cd frontend && npm run dev"
    
    echo.
    echo ========================================
    echo 前后端已启动！
    echo 后端: http://localhost:4000
    echo 前端: http://localhost:5173
    echo ========================================
    pause
    goto :eof
)

if "%choice%"=="5" (
    exit
)

echo 无效选择！
pause
