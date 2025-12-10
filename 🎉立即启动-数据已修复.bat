@echo off
chcp 65001 >nul
echo ================================================
echo 🎉 mockData.ts 已完全修复！
echo ================================================
echo.
echo ✅ 修复内容：
echo   1. 添加了 courses 数据（10门课程）
echo   2. 添加了 teachers 数据（10位教师）
echo   3. 添加了 classes 数据（5个教学班）
echo   4. initMockData() 现在返回完整的9个数据数组
echo   5. 修复了所有TypeScript类型错误
echo.
echo 📋 数据统计：
echo   - 学生: 300人
echo   - 成绩: 900+条
echo   - 课程: 10门
echo   - 教师: 10位
echo   - 教学班: 5个
echo   - 用户: 18个
echo   - 角色: 5个
echo   - 权限: 12个
echo   - 日志: 100条
echo.
echo 🚀 即将启动前端...
echo.
echo ⚠️  重要提示：
echo   1. 页面打开后，按 F12 打开开发者工具
echo   2. 在 Console 中执行: localStorage.clear()
echo   3. 刷新页面 (F5) 重新加载数据
echo   4. 使用 admin/123456 登录
echo.
pause

cd frontend
npm run dev
