# New System

本目录是新系统的完整源代码，基于 Vue 3 + Vite + TypeScript 构建。它是新老系统渐进式升级架构中的主应用，负责统一布局、菜单导航，并通过 Iframe 容器加载并融合旧系统，实现新老系统的无缝协同与路由同步。


## 技术栈

| 维度           | 技术选型                                |
| -------------- | --------------------------------------- |
| 语言           | TypeScript                              |
| 构建工具       | Vite                                    |
| 框架           | Vue 3                                   |
| 路由           | Vue Router @5                           |
| UI 组件库      | Element Plus                            |
| 状态管理       | Pinia                                   |
| 模拟数据库      | mockDB（模块联邦）                       |

## 快速开始

### 前置要求

- Node.js >= 22
- npm / yarn / pnpm

### 安装依赖

在 `new` 目录下执行：

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用默认运行在 `http://localhost:3010`。

### 打包构建

```bash
npm run build
```
