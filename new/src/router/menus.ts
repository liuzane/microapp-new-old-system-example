// 类型
import type { Menu } from '@/models/menu';

const menus: Menu[] = [
  {
    type: 'group',
    path: '/new-menu',
    title: '新系统页面',
    children: [
      {
        type: 'menu',
        path: '/order',
        name: 'Order',
        title: '订单管理',
        closeable: true,
        cache: true,
      },

      {
        type: 'menu',
        path: '/product',
        name: 'Product',
        title: '产品管理',
        closeable: true,
        cache: true,
      },
    ],
  },

  {
    type: 'group',
    path: '/legacy',
    title: '旧系统页面',
    children: [
      {
        type: 'menu',
        path: '/user',
        name: 'User',
        title: '用户管理',
        closeable: true,
        cache: true,
      },

      {
        type: 'menu',
        path: '/role',
        name: 'Role',
        title: '角色管理',
        closeable: true,
        cache: true,
      },
    ],
  },
];

// 模拟异步获取菜单列表
export const queryMenus = async (): Promise<Menu[]> => {
  // 模拟异步请求
  await new Promise((resolve: (value: undefined) => void) => setTimeout(resolve, 500));
  return menus;
};
