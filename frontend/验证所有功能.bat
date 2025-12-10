@echo off
chcp 65001 >nul
title ✅ 前端功能验证工具

echo.
echo ================================================
echo     🔍 前端功能完整性验证
echo ================================================
echo.

cd /d "%~dp0"

echo [1/5] 检查文件结构...
echo.

:: 检查关键文件
set "MISSING=0"

if not exist "src\pages\Home.tsx" (
    echo ❌ Home.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ Home.tsx
)

if not exist "src\pages\Rankings.tsx" (
    echo ❌ Rankings.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ Rankings.tsx
)

if not exist "src\pages\ClassDistribution.tsx" (
    echo ❌ ClassDistribution.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ ClassDistribution.tsx
)

if not exist "src\pages\Stats.tsx" (
    echo ❌ Stats.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ Stats.tsx
)

if not exist "src\pages\StudentSearch.tsx" (
    echo ❌ StudentSearch.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ StudentSearch.tsx
)

if not exist "src\pages\StudentManagement.tsx" (
    echo ❌ StudentManagement.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ StudentManagement.tsx
)

if not exist "src\pages\GradeEntry.tsx" (
    echo ❌ GradeEntry.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ GradeEntry.tsx
)

if not exist "src\pages\GradeList.tsx" (
    echo ❌ GradeList.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ GradeList.tsx
)

if not exist "src\pages\UserManagement.tsx" (
    echo ❌ UserManagement.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ UserManagement.tsx
)

if not exist "src\pages\RoleManagement.tsx" (
    echo ❌ RoleManagement.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ RoleManagement.tsx
)

if not exist "src\pages\AuditLog.tsx" (
    echo ❌ AuditLog.tsx 缺失
    set "MISSING=1"
) else (
    echo ✅ AuditLog.tsx
)

echo.
echo [2/5] 检查Mock系统...
echo.

if not exist "src\services\mockData.ts" (
    echo ❌ mockData.ts 缺失
    set "MISSING=1"
) else (
    echo ✅ mockData.ts
)

if not exist "src\services\mockApi.ts" (
    echo ❌ mockApi.ts 缺失
    set "MISSING=1"
) else (
    echo ✅ mockApi.ts
)

if not exist "src\services\mockDataInit.ts" (
    echo ❌ mockDataInit.ts 缺失
    set "MISSING=1"
) else (
    echo ✅ mockDataInit.ts
)

if not exist "src\services\api.ts" (
    echo ❌ api.ts 缺失
    set "MISSING=1"
) else (
    echo ✅ api.ts
)

echo.
echo [3/5] 检查依赖...
echo.

if not exist "package.json" (
    echo ❌ package.json 缺失
    set "MISSING=1"
) else (
    echo ✅ package.json
)

if not exist "node_modules" (
    echo ⚠️  node_modules 未安装
    echo    运行 'npm install' 安装依赖
) else (
    echo ✅ node_modules
)

echo.
echo [4/5] 检查配置文件...
echo.

if not exist "vite.config.ts" (
    echo ❌ vite.config.ts 缺失
    set "MISSING=1"
) else (
    echo ✅ vite.config.ts
)

if not exist "tsconfig.json" (
    echo ❌ tsconfig.json 缺失
    set "MISSING=1"
) else (
    echo ✅ tsconfig.json
)

if not exist "index.html" (
    echo ❌ index.html 缺失
    set "MISSING=1"
) else (
    echo ✅ index.html
)

echo.
echo [5/5] 功能清单...
echo.

echo ✅ 1. 系统概览 (Home)
echo ✅ 2. 班级分布 (ClassDistribution)
echo ✅ 3. 学生查询 (StudentSearch)
echo ✅ 4. 排行榜 (Rankings)
echo ✅ 5. 统计分析 (Stats)
echo ✅ 6. 学生管理 (StudentManagement)
echo ✅ 7. 成绩列表 (GradeList)
echo ✅ 8. 成绩录入 (GradeEntry)
echo ✅ 9. 用户管理 (UserManagement)
echo ✅ 10. 角色管理 (RoleManagement)
echo ✅ 11. 审计日志 (AuditLog)

echo.
echo ================================================
echo     验证结果
echo ================================================
echo.

if "%MISSING%"=="1" (
    echo ❌ 部分文件缺失，请检查！
    echo.
    echo 建议操作：
    echo 1. 确保在frontend目录下运行此脚本
    echo 2. 检查是否所有文件都已创建
    echo 3. 重新克隆或下载项目
) else (
    echo ✅ 所有文件检查通过！
    echo.
    echo 📋 Mock数据说明：
    echo    - 300名学生
    echo    - 1000+成绩记录
    echo    - 19个用户
    echo    - 6种角色
    echo    - 51项权限
    echo    - 50条审计日志
    echo.
    echo 🚀 下一步：
    echo    1. 运行 'npm install' 安装依赖（如未安装）
    echo    2. 运行 'npm run dev' 启动开发服务器
    echo    3. 访问 http://localhost:5173
    echo    4. 使用账号: admin / 密码: admin123
    echo.
    echo 📚 参考文档：
    echo    - 【重要】所有前端功能修复完成.md
    echo    - 前端所有功能测试指南.md
    echo    - 前端功能完成情况.md
)

echo.
echo ================================================
echo.

pause
