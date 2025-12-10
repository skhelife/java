@echo off
chcp 65001 >nul
echo ========================================
echo   后端启动问题诊断工具
echo ========================================
echo.

echo [1/5] 检查 Java 版本...
java -version
if errorlevel 1 (
    echo ❌ Java 未安装或未配置到 PATH
    pause
    exit /b 1
)
echo.

echo [2/5] 检查 Maven 版本...
mvn -version
if errorlevel 1 (
    echo ❌ Maven 未安装或未配置到 PATH
    pause
    exit /b 1
)
echo.

echo [3/5] 检查 MySQL 连接...
echo 请输入 MySQL root 密码进行连接测试:
mysql -u root -p -e "SELECT VERSION(); SHOW DATABASES LIKE 'student_grade_system';"
if errorlevel 1 (
    echo.
    echo ❌ MySQL 连接失败！
    echo 请检查:
    echo   1. MySQL 服务是否运行
    echo   2. root 密码是否正确
    echo   3. 是否有 student_grade_system 数据库
    pause
    exit /b 1
)
echo ✓ MySQL 连接成功！
echo.

echo [4/5] 检查数据库密码配置...
cd backend\src\main\resources
echo.
echo 当前 application.properties 中的数据库配置:
findstr /C:"spring.datasource" application.properties
echo.
echo ⚠️  请确认上面的密码是否正确！
echo    如果密码不是 'root'，请修改 application.properties
echo.
pause

echo [5/5] 尝试编译项目...
cd ..\..\..\..
mvn clean compile
if errorlevel 1 (
    echo.
    echo ❌ 编译失败！
    echo 正在生成详细错误日志到 compile-error.log...
    mvn clean compile -X > compile-error.log 2>&1
    echo.
    echo 请查看 compile-error.log 文件获取详细错误信息
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✓ 所有检查通过！
echo ========================================
echo.
echo 现在可以尝试启动后端:
echo   mvn spring-boot:run
echo.
pause
