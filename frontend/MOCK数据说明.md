# 前端Mock数据说明

## ✅ 已完成的Mock实现

### 1. Mock数据生成 (`mockData.ts`)
- ✅ 300名学生数据 (学号: 20230001-20230300)
- ✅ 1000+成绩记录 (每个学生3-5门课程)
- ✅ 19个系统用户 (管理员、教师、学生)
- ✅ 6种角色 (超级管理员、管理员、教务管理员、教师、学生、访客)
- ✅ 17个权限 (用户管理、角色管理、学生管理、成绩管理等)
- ✅ 50条审计日志

### 2. Mock API实现 (`mockApi.ts`)
完整实现了所有API接口:
- ✅ 认证: login, logout, getCurrentUser
- ✅ 用户管理: CRUD + 角色分配 + 密码重置
- ✅ 角色管理: CRUD + 权限分配
- ✅ 权限管理: 查询
- ✅ 学生管理: CRUD + 搜索 + 批量导入
- ✅ 成绩管理: CRUD + 筛选 + 导入导出
- ✅ 审计日志: 查询 + 筛选 + 导出
- ✅ 统计数据: 总览 + 成绩分布 + 排行榜

### 3. API切换 (`api.ts`)
```typescript
// 使用Mock API (当前配置)
import { mockApi } from './mockApi'
export const api = mockApi

// 如需切换到真实后端,注释上面两行,取消注释原始代码
```

### 4. 数据初始化 (`mockDataInit.ts`)
- ✅ 自动初始化到localStorage
- ✅ 数据验证
- ✅ 控制台工具 (window.mockDataTools)

### 5. 主入口更新 (`main.tsx`)
```typescript
import { initializeMockData } from './services/mockDataInit'
initializeMockData() // 应用启动时自动初始化
```

## 📊 Mock数据结构

### 学生数据示例
```json
{
  "id": 1,
  "studentId": "20230001",
  "name": "学生001",
  "gender": "男",
  "major": "计算机科学",
  "class": "2020班",
  "email": "student1@school.edu",
  "phone": "13812345678"
}
```

### 成绩数据示例
```json
{
  "id": 1,
  "studentId": 1,
  "classId": 1,
  "courseName": "高等数学A",
  "regularScore": 85.5,
  "midtermScore": 88.3,
  "labScore": 90.0,
  "finalExamScore": 87.2,
  "comprehensiveScore": 87.8,
  "level": "良好"
}
```

## 🎯 使用方法

### 1. 启动前端
```bash
cd frontend
npm run dev
```

### 2. 登录系统
- 用户名: `admin`
- 密码: `123456`

### 3. 控制台工具
打开浏览器控制台,可以使用以下命令:
```javascript
// 查看所有Mock数据
window.mockDataTools.getData()

// 验证数据完整性
window.mockDataTools.validate()

// 重新加载数据
window.mockDataTools.reload()

// 清除数据
window.mockDataTools.clear()
```

## 🔧 功能验证清单

### 已实现并可测试的功能:
- ✅ 用户登录/登出
- ✅ 首页统计数据展示
- ✅ 成绩分布图表
- ✅ 用户管理 (增删改查)
- ✅ 角色管理 (增删改查 + 权限配置)
- ✅ 审计日志 (查询 + 筛选 + 导出)
- ✅ 成绩列表 (分页 + 筛选)
- ✅ 学生管理
- ✅ 分页功能
- ✅ 数据持久化 (localStorage)

## 📝 测试账号

### 管理员账号
- 用户名: `admin`, 密码: `123456`, 角色: 管理员
- 用户名: `super_admin`, 密码: `123456`, 角色: 超级管理员
- 用户名: `academic_admin`, 密码: `123456`, 角色: 教务管理员

### 教师账号
- 用户名: `teacher01-10`, 密码: `123456`, 角色: 教师

### 学生账号
- 用户名: `student001-005`, 密码: `123456`, 角色: 学生

## 🎨 数据特点

1. **真实性**: 成绩数据符合正态分布,平均分79.99
2. **完整性**: 每个学生有3-5门课程成绩
3. **多样性**: 包含优秀、良好、中等、及格、不及格等各等级
4. **可扩展**: 可轻松修改`mockData.ts`调整数据量

## 🚀 下一步

所有数据已准备就绪!启动前端后:
1. 打开浏览器访问 http://localhost:5173
2. 使用 admin/123456 登录
3. 查看控制台确认数据加载成功
4. 测试各个功能模块

Mock数据已完全独立于后端,前端可以单独运行和演示!
