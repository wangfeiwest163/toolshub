# GitHub上传说明

## 项目名称: ToolsHub - Comprehensive Online Tools Collection

### 项目简介
这是一个功能丰富的在线工具平台，包含48种不同的实用工具，涵盖密码生成器、URL缩短器、单位转换器、计算器、图像工具、开发者工具等多种类型。

### 项目特点
- 基于Node.js和Express.js构建
- 智能数据库管理系统（支持MongoDB，降级到内存存储）
- 48种不同类型的在线工具
- 响应式设计，支持多设备访问
- 包含用户功能（收藏夹、历史记录、分析等）

### 上传步骤

1. 登录GitHub网站并创建一个新的仓库
   - 访问 https://github.com/new
   - 输入仓库名（例如：tools-hub 或 openclaw-tools-hub）
   - 可选择添加描述
   - 选择 Public 或 Private
   - 不要勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

2. 返回到本地项目目录，复制以下命令并执行（替换为您自己的仓库地址）：
   ```
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   git branch -M main
   git push -u origin main
   ```

3. 如果是第一次使用GitHub，请先设置您的身份信息：
   ```
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### 项目部署

1. 确保系统已安装Node.js和npm
2. 安装依赖：`npm install`
3. 启动应用：`npm start`
4. 应用将在 http://localhost:3000 上运行

### 环境配置

如果需要连接MongoDB，请在项目根目录创建 `.env` 文件：
```
MONGODB_URI=mongodb://localhost:27017/toolshub
NODE_ENV=development
PORT=3000
```

注意：即使没有MongoDB，应用也会自动切换到内存存储模式，所有功能仍然可用。

### 技术栈
- 后端：Node.js, Express.js
- 数据库：MongoDB (可选，有内存存储降级方案)
- 前端：HTML, CSS, JavaScript
- 实时通信：Socket.IO