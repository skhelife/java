@echo off
chcp 65001 >nul
cls
color 0A
echo ╔════════════════════════════════════════════════════════════╗
echo ║  🔍 班级分布问题 - 终极诊断与修复工具                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 【问题描述】
echo  班级列表显示学生数为0
echo  点击班级后成绩分布图显示全0
echo.
echo 【诊断流程】
echo  1. 数据结构检查
echo  2. 数据生成逻辑验证  
echo  3. API过滤逻辑分析
echo  4. 前端显示逻辑检查
echo.
echo ════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0frontend"

echo [第1步] 清理环境
echo  └─ 准备清空LocalStorage，重新生成数据...
timeout /t 2 >nul

echo.
echo [第2步] 启动开发服务器
echo  └─ 启动前端（带调试模式）...
start "学生成绩管理系统 - 详细诊断模式" cmd /k "npm run dev"

timeout /t 5 >nul

cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║  📋 操作指南                                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ┌─ 步骤 1: 清空数据 ─────────────────────────────┐
echo │                                                  │
echo │  浏览器打开后，按 F12 打开开发者工具           │
echo │  在 Console 控制台中执行:                       │
echo │                                                  │
echo │  localStorage.clear()                           │
echo │                                                  │
echo └──────────────────────────────────────────────────┘
echo.
echo ┌─ 步骤 2: 刷新页面 ─────────────────────────────┐
echo │                                                  │
echo │  按 F5 或 Ctrl+R 刷新页面                       │
echo │  等待页面完全加载                               │
echo │                                                  │
echo └──────────────────────────────────────────────────┘
echo.
echo ┌─ 步骤 3: 查看自动诊断 ─────────────────────────┐
echo │                                                  │
echo │  页面加载1秒后会自动输出诊断信息:              │
echo │                                                  │
echo │  🚀 学生成绩管理系统 - 开发模式                │
echo │  📊 数据诊断报告                                │
echo │  🔍 开始数据调试...                             │
echo │                                                  │
echo │  查找输出的关键信息:                            │
echo │  - 学生总数: 应该是 300                         │
echo │  - 成绩总数: 应该是 900+                        │
echo │  - 班级数: 应该是 5                             │
echo │                                                  │
echo │  👥 各班级学生统计:                             │
echo │  应该看到每个班级都有 50-80 人                  │
echo │                                                  │
echo └──────────────────────────────────────────────────┘
echo.
echo ┌─ 步骤 4: 登录系统 ─────────────────────────────┐
echo │                                                  │
echo │  账号: admin                                     │
echo │  密码: 123456                                    │
echo │                                                  │
echo └──────────────────────────────────────────────────┘
echo.
echo ┌─ 步骤 5: 测试班级分布 ─────────────────────────┐
echo │                                                  │
echo │  1. 点击左侧菜单"班级分布"                      │
echo │                                                  │
echo │  2. 查看Console输出:                            │
echo │     📚 getClasses 被调用                        │
echo │     - classes数量: 5                            │
echo │     - grades总数: 900+                          │
echo │                                                  │
echo │  3. 检查每个班级的输出:                         │
echo │     检查班级: 2023春-C001-01                    │
echo │     - 找到 XX 个成绩  (应该 ^> 0)               │
echo │                                                  │
echo │  4. 点击任意班级，查看Console:                  │
echo │     🔍 getClassDetail 调试                      │
echo │     - 筛选结果: 该班级有 XX 个成绩              │
echo │     - 成绩分布: {优秀: X, 良好: X, ...}         │
echo │                                                  │
echo └──────────────────────────────────────────────────┘
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  ⚠️ 如果发现问题                                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 【问题A】学生数仍然为0
echo  可能原因:
echo  - localStorage中有旧数据
echo  - classId类型不匹配
echo.
echo  解决方法:
echo  1. 完全关闭浏览器（所有窗口）
echo  2. 重新打开浏览器
echo  3. 访问: http://localhost:5174/reset-data.html
echo  4. 点击"1️⃣ 清空LocalStorage"
echo  5. 点击"2️⃣ 检查当前数据"查看诊断
echo  6. 点击"4️⃣ 返回首页"
echo.
echo 【问题B】Console显示classId不匹配
echo  查看Console输出中的:
echo  - 成绩不匹配: {gradeClassId, gradeClassIdType, ...}
echo  - 如果看到类型不同（string vs number），截图发送
echo.
echo 【问题C】grades总数为0
echo  说明数据没有生成，需要:
echo  1. 检查Console是否有错误
echo  2. 执行: window.mockDataTools.regenerate()
echo  3. 刷新页面
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 💡 小贴士:
echo    - 可以随时按 F5 刷新页面重新加载
echo    - 使用 Ctrl+Shift+I 快速打开开发者工具
echo    - 在Console中输入 debugMockData() 手动运行诊断
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause

