@echo off
chcp 65001 >nul
cls
color 0C
echo ════════════════════════════════════════════════════════════
echo  💥 紧急修复 - 强制重置所有数据
echo ════════════════════════════════════════════════════════════
echo.
echo  已启用强制数据重置模式！
echo  每次刷新页面都会重新生成数据！
echo.
echo ════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0frontend"

echo [1] 关闭所有可能的旧进程...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *学生成绩管理系统*" 2>nul
timeout /t 2 >nul

echo.
echo [2] 启动前端（强制重置模式）...
start "学生成绩管理系统 - 强制重置" cmd /k "npm run dev"

timeout /t 8 >nul

cls
color 0A
echo ════════════════════════════════════════════════════════════
echo  ✅ 启动完成！
echo ════════════════════════════════════════════════════════════
echo.
echo  浏览器应该已经自动打开
echo  如果没有，请访问: http://localhost:5174
echo.
echo ════════════════════════════════════════════════════════════
echo  🔥 重要！请按以下步骤操作：
echo ════════════════════════════════════════════════════════════
echo.
echo  ► 步骤 1: 按 F12 打开开发者工具
echo.
echo  ► 步骤 2: 点击 Console 标签
echo.
echo  ► 步骤 3: 刷新页面 (F5 或 Ctrl+R)
echo.
echo  ► 步骤 4: 查看 Console 输出，应该看到：
echo.
echo     🚀 学生成绩管理系统 - 开发模式
echo     ⚠️ 强制重置数据模式
echo     📦 从localStorage加载数据 或 🔄 localStorage无数据
echo     📊 数据诊断报告
echo     🔍 开始数据调试...
echo.
echo  ► 步骤 5: 找到这行输出：
echo.
echo     👥 各班级学生统计:
echo     2023春-C001-01 (高等数学A): XX人  ← 这里应该 ^> 0
echo     2023春-C002-01 (大学英语): XX人
echo     ...
echo.
echo ════════════════════════════════════════════════════════════
echo  ❌ 如果学生数还是 0，请：
echo ════════════════════════════════════════════════════════════
echo.
echo  1. 在 Console 中输入并执行:
echo.
echo     const data = JSON.parse(localStorage.getItem('mockData'))
echo     console.log('grades[0]:', data.grades[0])
echo     console.log('grades[0].classId 类型:', typeof data.grades[0].classId)
echo     console.log('classes[0]:', data.classes[0])
echo     console.log('classes[0].classId 类型:', typeof data.classes[0].classId)
echo.
echo  2. 截图 Console 的输出
echo.
echo  3. 检查两个 classId 是否完全一样（类型和值）
echo.
echo ════════════════════════════════════════════════════════════
echo  🔧 手动强制刷新数据:
echo ════════════════════════════════════════════════════════════
echo.
echo  在 Console 中执行:
echo.
echo  localStorage.clear()
echo  location.reload()
echo.
echo ════════════════════════════════════════════════════════════
pause
