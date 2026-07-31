# new-old-microapp-example

基于 Micro App 实现的新老系统无缝融合方案，让 Vue 3 新系统与 Vue 2 旧系统在同一平台下协同工作。旧系统保持独立部署，通过 Micro App 加载旧系统，并实现路由同步与跨应用通信。


## 快速开始

### 前置要求

#### 新系统
- Node.js >= 22
- npm / yarn / pnpm

#### 旧系统
- Node.js >= 8 && <= 16
- npm / yarn / pnpm

### 安装依赖

在根目录执行以下命令安装所有模块依赖：

```bash
npm run install --prefix new && npm run install --prefix old
```

### 启动开发环境

1. **启动旧系统**（新终端）

```bash
cd old
npm run dev
```

2. **启动新系统**（新终端）

```bash
cd new
npm run dev
```

1. 访问新系统：`http://localhost:3010`
2. 访问旧系统：`http://localhost:3000`

新系统主页将展示项目概览，并内嵌旧系统页面（通过 Micro App 加载 `VITE_LEGACY_URL`）。

### 打包构建

```bash
npm run build --prefix new && npm run build --prefix old
```


## 部署建议

- 生产环境推荐将新系统与旧系统部署在同一主域名下（如 `https://app.example.com` 和 `https://app.example.com/old`）。
- 可通过 Nginx 反向代理统一入口，隐藏新旧系统实际部署路径。


## 许可证

MIT License  
Copyright (c) 2026-present, liuzane
