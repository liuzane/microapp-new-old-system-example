// 基础模块
import {
  createRouter,
  createWebHashHistory,
} from 'vue-router';

// 类型
import type { Router } from 'vue-router';

// 路由配置
import { constantRoutes } from './routes';

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;
