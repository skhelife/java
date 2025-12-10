# 🎓 学生成绩管理系统 - 炫酷前端版

> 基于 Vite + React + TypeScript 的现代化学生成绩可视化系统

## ✨ 技术栈

- **前端框架**: Vite + React 18 + TypeScript
- **数据可视化**: ECharts + ECharts-GL (支持 2D/3D 切换)
- **UI 设计**: 玻璃拟态 (Glassmorphism) + 动态渐变背景
- **动画效果**: Framer Motion + CSS Animations
- **路由**: React Router v6
- **搜索**: Fuse.js 模糊搜索
- **后端模拟**: Express + CORS

## 🚀 核心功能

### 📊 查询与可视化
1. **系统概览** - 首页仪表盘，展示关键指标卡片、成绩分布柱状图、成就徽章
2. **班级分布** - 教学班列表 + 点击查看分布，支持 2D/3D/饼图三种视图切换
3. **学生查询** - 智能模糊搜索（姓名/学号），详情页展示雷达图、成绩表、徽章
4. **排行榜** - Top 10/20/50/100 切换，前三名金银铜牌特效，滑入动画
5. **统计分析** - 8 个统计卡片、成绩分布饼图、趋势折线图、智能文本分析

### 👥 管理功能（超越原 CLI 系统）
6. **学生管理** - 添加/编辑/删除学生信息，实时表格展示，表单验证
7. **成绩录入** - 选择学生 → 录入/修改成绩（平时/期中/实验/期末），自动计算综合成绩

## 🎨 UI/UX 亮点

### 视觉设计
- **玻璃拟态**: 半透明卡片 + 背景模糊 (backdrop-filter)
- **动态背景**: 双层径向渐变 + 浮动光斑
- **渐变配色**: 绿松石 → 蓝色 → 紫色 (Tailwind 风格)
- **金银铜**: 排行榜前三名专属颜色

### 交互动画
- **Shimmer**: Logo 闪烁动画
- **Pulse**: AI 助手脉冲效果
- **Slide In**: 排行榜列表错开滑入
- **Hover**: 卡片悬浮、放大、位移
- **Loading**: 动态省略号

### 响应式
- 大屏 (> 1024px): 网格布局
- 中屏 (768-1024px): 单列布局
- 小屏 (< 768px): 侧边栏收缩、隐藏文字

## 📦 安装与启动

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动后端 Mock API (端口 4000)
```bash
npm run server
```
> API 会生成 300 个学生、5 门课程、10 个教学班的完整数据

### 3. 启动前端开发服务器 (端口 5173)
```bash
npm run dev
```

### 4. 访问
打开浏览器访问: http://localhost:5173

## 📂 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   └── FloatingBackground.tsx    # 动态背景组件
│   ├── pages/
│   │   ├── Home.tsx                  # 系统概览
│   │   ├── ClassDistribution.tsx    # 班级分布（2D/3D/饼图）
│   │   ├── StudentSearch.tsx        # 学生查询（雷达图）
│   │   ├── Rankings.tsx              # 排行榜（金银铜）
│   │   └── Stats.tsx                 # 统计分析
│   ├── services/
│   │   └── api.ts                    # API 封装
│   ├── App.tsx                       # 路由配置
│   ├── main.tsx                      # 入口文件
│   └── styles.css                    # 全局样式
├── server/
│   └── server.js                     # Mock API 服务器
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎯 核心创新点

1. **3D 可视化**: 使用 echarts-gl 实现 3D 柱状图，支持自动旋转和交互
2. **智能联想**: 输入即搜索，模糊匹配学号和姓名
3. **成就系统**: 自动判定并显示徽章（满分、进步、稳定、学霸）
4. **雷达图**: 多维度展示学生各科成绩
5. **金银铜牌**: 排行榜前三名特殊视觉效果
6. **智能分析**: 根据数据自动生成文字建议
7. **动态背景**: 浮动光斑 + 玻璃拟态营造科技感

## 🔌 API 接口说明

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/classes` | GET | 获取所有教学班 |
| `/api/classes/:classId` | GET | 获取班级详情和成绩分布 |
| `/api/students/search?q=xxx` | GET | 搜索学生（模糊匹配） |
| `/api/students/:id` | GET | 获取学生详情 |
| `/api/rankings?top=N` | GET | 获取排行榜（Top N） |
| `/api/stats` | GET | 获取系统统计 |
| `/api/stats/distribution` | GET | 获取成绩分布 |

## 🛠️ 扩展建议

### 接入真实后端
1. 在 Java 项目中添加 HTTP 接口（推荐 SparkJava 或 Spring Boot）
2. 修改 `src/services/api.ts` 中的 `API_BASE` 地址
3. 处理 CORS（后端添加跨域支持）

### 功能增强
- [ ] WebSocket 实时更新排行榜
- [ ] PDF 导出功能（jsPDF）
- [ ] 命令面板（Cmd+K 快速跳转）
- [ ] 深色/浅色主题切换
- [ ] 数据导出（CSV/Excel）
- [ ] AI 助手接入 LLM（如 GPT）

## 📸 页面预览

### 系统概览
- 快速统计卡片
- 成绩分布图表
- 成就徽章展示

### 班级分布
- 2D/3D/饼图切换
- 自动旋转 3D 柱状图

### 学生查询
- 智能联想
- 雷达图
- 成绩表格

### 排行榜
- 金银铜牌
- 动态滚动

### 统计分析
- 8 项指标
- 饼图 + 趋势图
- 智能建议

## 📝 开发说明

- 使用 TypeScript 确保类型安全
- 所有 API 调用均有错误处理
- 图表配置可在各页面组件中自定义
- 样式使用 CSS + 内联样式（便于快速调整）

## 🎉 总结

本前端系统完整复现了命令行版本的所有核心功能，并通过现代化的可视化手段、炫酷的动画效果和创新的交互设计，将传统的命令行工具升级为一个**装逼级别的可视化数据面板**！

---

**开发者**: GitHub Copilot  
**技术支持**: Vite + React + ECharts + TypeScript  
**设计理念**: 玻璃拟态 + 赛博朋克 + 数据美学

