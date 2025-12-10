@echo off
chcp 65001 >nul
echo ========================================
echo   学生成绩管理系统 - 数据库初始化
echo ========================================
echo.

echo 请确保 MySQL 服务已启动！
echo.

set /p MYSQL_USER=请输入MySQL用户名 (默认 root): 
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASS=请输入MySQL密码 (默认 root): 
if "%MYSQL_PASS%"=="" set MYSQL_PASS=root

echo.
echo 正在初始化数据库...
echo.

mysql -u %MYSQL_USER% -p%MYSQL_PASS% < init.sql

if %ERRORLEVEL% == 0 (
    echo.
    echo ========================================
    echo   数据库初始化成功！
    echo ========================================
    echo.
    echo 数据库名: student_grade_system
    echo 测试账号: admin / 123456
    echo.
) else (
    echo.
    echo ========================================
    echo   数据库初始化失败！
    echo ========================================
    echo.
    echo 请检查:
    echo 1. MySQL 服务是否启动
    echo 2. 用户名和密码是否正确
    echo 3. mysql 命令是否在 PATH 中
    echo.
)

pause
