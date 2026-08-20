# Micro App 新旧系统无缝融合方案

本项目演示如何基于 **Micro App**（京东微前端框架）将 **Vue 3 新系统** 与 **Vue 2 旧系统** 整合至同一平台，实现路由同步、状态共享和跨应用通信。旧系统保持独立部署，新系统作为主应用（基座）通过 Micro App 加载旧系统，用户可无感知切换，体验统一。

---

## 前置要求

| 系统 | Node.js 版本 | 包管理器 |
|------|--------------|----------|
| 新系统（Vue 3 主应用） | >= 22 | npm / yarn / pnpm |
| 旧系统（Vue 2 子应用） | >= 8 且 <= 16 | npm / yarn / pnpm |

---

## 项目目录说明

- **`old/`** – 新系统（Vue 3）源码目录，作为主应用（基座）  
- **`new/`** – 旧系统（Vue 2）源码目录，作为子应用（被嵌入方）

> 目录命名保留了历史背景，实际开发中可根据团队习惯调整。

---

## Git 大小写敏感配置（Mac / Windows）

为避免因大小写问题导致文件冲突，建议在项目根目录执行：

```bash
git config core.ignorecase false
```

---

## 安装依赖

在**根目录**下分别安装两个系统的依赖（建议开启两个终端窗口）。

### 1. 安装主应用（Vue 3）依赖

```bash
cd old
nvm use 22
npm install
```

### 2. 安装子应用（Vue 2）依赖

```bash
cd new
nvm use 14
npm install
```

---

## 启动开发环境

同样建议分两个终端启动，保持两个服务同时运行。

### 1. 启动主应用（基座）

```bash
cd old
nvm use 22
npm run dev
```

默认访问地址：`http://localhost:3010`

### 2. 启动子应用（旧系统）

```bash
cd new
nvm use 14
npm run dev
```

默认访问地址：`http://localhost:3000`

---

### 访问验证

- 打开浏览器访问 `http://localhost:3010`，即可看到新系统主界面。
- 新系统主页通过 **`<micro-app>` 标签**加载旧系统（URL 由环境变量 `VITE_LEGACY_URL` 控制，默认指向 `http://localhost:3000`）。
- Micro App 框架自动处理：
  - **路由同步**：主应用路由变化时，子应用路由跟随变化（需配置 `keep-router` 等属性）。
  - **跨应用通信**：通过 `window.microApp` 提供的 `dispatch` / `addDataListener` 实现主子应用双向数据传递。
  - **样式隔离**：默认启用 Shadow DOM 或 scoped 样式，避免 CSS 污染。
  - **JS 沙箱**：子应用运行在隔离环境，保证全局变量不冲突。

> 具体配置可参考主应用 `src/views/Home.vue` 中 `<micro-app>` 标签的使用示例。

---

## 打包构建

生产环境构建也需分别执行。

### 1. 构建主应用

```bash
cd old
nvm use 22
npm run build
```

### 2. 构建子应用

```bash
cd new
nvm use 14
npm run build
```

构建产物分别位于各自目录下的 `dist` 文件夹，可部署到 Web 服务器。

---

## 部署建议

- **同主域名部署（推荐）**  
  将主应用和子应用部署在同一主域名下，例如：
  - 主应用：`https://app.example.com/`
  - 子应用：`https://app.example.com/old/`  
  这样可避免跨域问题，同时 Micro App 的沙箱和通信机制更加稳定。

- **跨域部署**  
  若必须部署在不同域名，需确保子应用服务配置了正确的 CORS 头（如 `Access-Control-Allow-Origin: *` 或指定主应用域名），并在 Micro App 中设置 `disableScopecss` 等属性以应对跨域限制。

- **使用 Nginx 反向代理**  
  可通过 Nginx 统一对外入口，将 `/old` 代理至子应用实际地址，其余请求转发至主应用，同时可统一处理跨域头。

- **Micro App 特定配置**  
  生产环境下，建议在主应用中显式设置 `baseurl` 和 `default-page` 等属性，确保子应用资源加载正确；若子应用使用 `public-path`，需按 Micro App 文档进行适配。

---

## 技术栈简介

- **主应用**：Vue 3 + Vite + Micro App  
- **子应用**：Vue 2 + Webpack（或 Vue CLI）  
- **通信方式**：Micro App 内置的 `data` 机制 + 全局事件总线  
- **路由同步**：Micro App 的 `keep-router` 和 `router-mode` 配置

---

## 许可证

MIT License  
Copyright (c) 2026-present, liuzane