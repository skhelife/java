@echo off
chcp 65001 >nul
cls
echo ========================================
echo 🔍 班级分布问题诊断工具
echo ========================================
echo.
echo 【当前状态】
echo 问题：班级分布图表显示全部为0
echo 可能原因：
echo   1. 成绩数据的classId与班级的classId不匹配
echo   2. 数据过滤逻辑有误
echo   3. LocalStorage中的数据格式错误
echo.
echo ========================================
echo 🚀 启动调试模式
echo ========================================
echo.

cd /d "%~dp0frontend"

echo [步骤1] 清理旧数据...
echo 即将清空LocalStorage，重新生成数据
timeout /t 2 >nul

echo.
echo [步骤2] 启动前端（调试模式）...
start "学生成绩管理系统 - 调试模式" cmd /k "npm run dev"

timeout /t 3 >nul

echo.
echo ========================================
echo 📋 调试操作指南
echo ========================================
echo.
echo 1️⃣ 等待浏览器自动打开（约5-10秒）
echo.
echo 2️⃣ 按 F12 打开开发者工具
echo.
echo 3️⃣ 在 Console 控制台执行以下命令：
echo    localStorage.clear()
echo.
echo 4️⃣ 刷新页面 (F5)
echo.
echo 5️⃣ 登录后，再次打开Console，会看到调试信息
echo.
echo 6️⃣ 点击"班级分布"菜单
echo.
echo 7️⃣ 点击任意班级，查看Console输出：
echo    - 应该看到 "🔍 getClassDetail 调试" 信息
echo    - 检查 "筛选结果: 该班级有 X 个成绩"
echo    - 查看表格显示的classId类型和匹配情况
echo    - 查看成绩分布数据
echo.
echo 🎯 预期正确结果：
echo   ✓ 每个班级应该有 50-80 个成绩
echo   ✓ classId应该完全匹配（match: true）
echo   ✓ 成绩分布应该有各个等级的人数
echo.
echo ⚠️ 如果发现问题：
echo   • 如果 "该班级有 0 个成绩" - classId不匹配
echo   • 如果 "match: false" - 数据类型不一致
echo   • 截图Console输出，便于分析
echo.
echo 按任意键继续查看数据结构示例...
pause >nul

cls
echo ========================================
echo 📊 正确的数据结构示例
echo ========================================
echo.
echo 【班级数据 mockClasses】
echo {
echo   id: 1,
echo   classId: "2023春-C001-01",  ^<-- 字符串类型
echo   semester: "2023春季",
echo   courseId: 1,
echo   teacherId: 1
echo }
echo.
echo 【成绩数据 grades】
echo {
echo   id: 1,
echo   studentId: 1,
echo   classId: "2023春-C001-01",  ^<-- 必须与班级classId完全相同
echo   courseName: "高等数学A",
echo   comprehensiveScore: 85.5,
echo   ...
echo }
echo.
echo 【关键匹配逻辑】
echo data.grades.filter((g) =^> g.classId === "2023春-C001-01")
echo                                ^^^^           ^^^^
echo                           必须严格相等（类型+值）
echo.
echo ========================================
echo 🔧 如果问题依然存在
echo ========================================
echo.
echo 在Console中运行以下命令进行深度诊断：
echo.
echo // 1. 检查数据
echo const data = JSON.parse(localStorage.getItem('mockData'))
echo console.log('学生数:', data.students.length)
echo console.log('成绩数:', data.grades.length)
echo console.log('班级数:', data.classes.length)
echo.
echo // 2. 检查第一个班级
echo const firstClass = data.classes[0]
echo console.log('第一个班级:', firstClass)
echo.
echo // 3. 检查该班级的成绩
echo const gradesInClass = data.grades.filter(g =^> g.classId === firstClass.classId)
echo console.log('该班级成绩数:', gradesInClass.length)
echo.
echo // 4. 如果为0，检查类型
echo console.log('班级classId类型:', typeof firstClass.classId)
echo console.log('成绩classId类型（第一条）:', typeof data.grades[0].classId)
echo console.log('成绩classId值（前5条）:', data.grades.slice(0,5).map(g =^> g.classId))
echo.
echo ========================================
pause
