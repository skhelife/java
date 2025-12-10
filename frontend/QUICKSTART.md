# 快速启动指南

## Windows 用户

### 方法一：使用命令行
```powershell
# 1. 安装依赖（首次运行）
cd frontend
npm install

# 2. 启动 Mock API 服务器（保持运行）
npm run server

# 3. 新开一个终端，启动前端开发服务器
npm run dev
```

### 方法二：使用批处理文件
创建 `start.bat`:
```batch
@echo off
echo 正在启动学生成绩管理系统前端...
cd frontend
start cmd /k "npm run server"
timeout /t 3
start cmd /k "npm run dev"
echo 服务已启动！
echo Mock API: http://localhost:4000
echo 前端界面: http://localhost:5173
pause
```

## 访问地址

- **前端界面**: http://localhost:5173
- **Mock API**: http://localhost:4000

## 常见问题

### 1. 端口被占用
如果 4000 或 5173 端口被占用：
- 修改 `server/server.js` 中的 `port` 变量
- 修改 `vite.config.ts` 中的 `server.port`
- 修改 `src/services/api.ts` 中的 `API_BASE`

### 2. 依赖安装失败
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 3. 图表不显示
确保已安装 echarts 和 echarts-gl：
```bash
npm install echarts echarts-for-react echarts-gl
```

## 功能测试清单

- [ ] 首页统计数据加载
- [ ] 班级列表显示
- [ ] 点击班级查看分布图
- [ ] 2D/3D/饼图切换
- [ ] 搜索学生（输入"张"试试）
- [ ] 查看学生详情和雷达图
- [ ] 排行榜显示前50名
- [ ] 统计页面所有图表加载

## 下一步

1. **连接真实后端**: 在 Java 项目中添加 REST API
2. **增强功能**: WebSocket 实时更新、PDF 导出
3. **部署**: 使用 `npm run build` 构建生产版本
