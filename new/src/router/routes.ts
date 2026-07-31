// 类型
import type { RouteRecordRaw } from 'vue-router';

// 组件映射
export const componentMap: Record<string, () => Promise<unknown>> = {
  Order: () => import('@/views/order/index.vue'),
  Product: () => import('@/views/product/index.vue'),
  User: () => import('@/views/legacy/index.vue'),
  Role: () => import('@/views/legacy/index.vue'),
};

// 常量路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },

  {
    path: '/',
    name: 'Admin',
    component: () => import('@/layout'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页', // 标签页标题和左侧菜单标题
          closeable: false, // tags-view 中不可关闭标签, 默认 true
          cache: true, // keep-alive 缓存页面, 默认 true
        },
      },

      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404/index.vue'),
      },
    ],
  },
];
