# Old System

本目录是旧系统的完整源代码，基于 Vue 2 + Vue CLI + JavaScript 构建。它是新老系统渐进式升级架构中的子应用，可独立部署运行，也可通过 Iframe 嵌入新系统，实现新老系统的无缝融合与路由同步。

## 技术栈

| 维度           | 技术选型                                |
| -------------- | --------------------------------------- |
| 语言           | JavaScript                              |
| 构建工具       | Vue CLI                                 |
| 框架           | Vue 2                                   |
| 路由           | Vue Router @3                           |
| UI 组件库      | Element UI                              |
| 模拟数据库     | mockDB（浏览器变量）                       |

## 快速开始

### 前置要求

- Node.js >= 8 && <= 16
- npm / yarn / pnpm

### 安装依赖

在 `old` 目录下执行：

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用默认运行在 `http://localhost:3000`。

### 打包构建

```bash
npm run build
```