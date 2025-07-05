# 应用使用时长监控器

一个基于 Electron + Vue 3 + ECharts 的桌面应用，用于实时监控和可视化 Windows 系统中的应用使用时长。

## ✨ 功能特性

- 🔍 **实时进程监控**：自动检测当前活跃的 Windows 应用程序
- 📊 **多图表展示**：支持柱状图、折线图、饼图三种可视化方式
- 💾 **本地数据存储**：自动保存使用数据到本地 JSON 文件
- 🎨 **现代化 UI**：采用深色主题设计，界面美观
- ⚡ **实时更新**：每分钟自动更新使用时长数据
- 🎯 **智能图标**：自动为常见应用分配对应图标

## 🚀 快速开始

### 方法一：使用批处理文件（推荐）

1. 双击运行 `start.bat` 文件
2. 等待开发服务器和 Electron 应用启动
3. 开始监控你的应用使用时长

### 方法二：手动启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 新开一个终端，启动 Electron
npm run electron
```

## 📋 系统要求

- Windows 10/11
- Node.js 16+ 
- npm 或 yarn

## 🔧 技术栈

- **前端框架**：Vue 3 + Composition API
- **桌面应用**：Electron
- **图表库**：ECharts 5
- **样式框架**：Tailwind CSS
- **构建工具**：Vite

## 📁 项目结构

```
app-use-time/
├── electron.js          # Electron 主进程入口
├── electron/
│   ├── main.js         # 主进程逻辑（已集成到 electron.js）
│   └── preload.js      # 预加载脚本
├── src/
│   ├── APP.vue         # 主应用组件
│   ├── components/
│   │   └── UsageChart.vue  # 图表组件
│   └── main.js         # Vue 应用入口
├── usage-data.json     # 使用数据存储文件（自动生成）
└── start.bat          # Windows 启动脚本
```

## 🎯 核心功能

### 进程监控
- 使用 Windows `tasklist` 命令获取系统进程
- 通过 PowerShell 检测当前活跃窗口
- 每分钟自动更新使用时长

### 数据存储
- 按日期分类存储使用数据
- 自动保存到 `usage-data.json` 文件
- 应用重启后自动加载历史数据

### 智能识别
- 自动识别常见应用（Chrome、VS Code、微信等）
- 为不同应用分配对应图标
- 支持自定义应用图标映射

## 🎨 界面特性

- **深色主题**：护眼的深色配色方案
- **响应式设计**：适配不同屏幕尺寸
- **动画效果**：流畅的过渡动画
- **实时状态**：监控状态指示器

## 📊 图表类型

1. **柱状图**：直观显示各应用使用时长对比
2. **折线图**：展示使用时长趋势变化
3. **饼图**：显示使用时长占比分布

## 🔒 隐私说明

- 所有数据仅存储在本地，不会上传到任何服务器
- 仅监控应用名称和使用时长，不收集其他信息
- 可随时停止监控或删除数据文件

## 🛠️ 开发说明

### 开发模式
```bash
npm run dev          # 启动 Vite 开发服务器
npm run electron     # 启动 Electron（需要先启动 dev）
```

### 构建生产版本
```bash
npm run build        # 构建 Vue 应用
npm run electron     # 启动 Electron 应用
```

## 🐛 常见问题

### Q: 启动时提示 PowerShell 执行策略错误
A: 使用 `start.bat` 文件启动，或手动设置 PowerShell 执行策略：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q: 监控不到某些应用
A: 确保应用有窗口标题，某些后台进程可能无法被检测到

### Q: 数据不更新
A: 检查是否点击了"开始监控"按钮，监控状态指示灯应为绿色

## 📝 更新日志

### v1.0.0
- ✅ 基础进程监控功能
- ✅ 多图表可视化
- ✅ 本地数据存储
- ✅ 现代化 UI 设计
- ✅ 实时数据更新

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
