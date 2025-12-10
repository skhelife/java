@echo off
chcp 65001 >nul
echo ========================================
echo   修复数据库密码配置
echo ========================================
echo.

set /p DB_PASSWORD="请输入你的 MySQL root 密码: "

echo.
echo 正在更新 application.properties...

cd src\main\resources

:: 备份原文件
copy application.properties application.properties.backup >nul

:: 使用 PowerShell 替换密码
powershell -Command "(Get-Content application.properties) -replace 'spring.datasource.password=.*', 'spring.datasource.password=%DB_PASSWORD%' | Set-Content application.properties"

echo ✓ 密码已更新！
echo.
echo 新的配置:
findstr /C:"spring.datasource.password" application.properties
echo.

echo 测试 MySQL 连接...
mysql -u root -p%DB_PASSWORD% -e "SHOW DATABASES LIKE 'student_grade_system';"

if errorlevel 1 (
    echo.
    echo ❌ MySQL 连接失败，恢复原配置...
    copy application.properties.backup application.properties >nul
    echo 请检查密码是否正确
    pause
    exit /b 1
)

echo.
echo ✓ MySQL 连接成功！
echo.
echo 现在可以启动后端了:
echo   cd backend
echo   mvn spring-boot:run
echo.
pause
