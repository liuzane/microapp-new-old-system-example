// 基础模块
import { defineStore } from 'pinia';

// 路由配置
import router from '@/router';
import { componentMap } from '@/router/routes';

// 类型
import type { Menu } from '@/models/menu';

// 菜单列表
import { queryMenus } from '@/router/menus';

export default defineStore('user', {
  state: () => ({
    menus: [] as Menu[],
  }),
  actions: {
    /**
     * 查询菜单
     */
    async queryMenus(): Promise<void> {
      const menus: Menu[] = await queryMenus();
      // 递归遍历菜单列表，添加路由
      function traverse(menuList: Menu[], parentPath: string) {
        for (const menu of menuList) {
          if (menu.type === 'menu' && menu.name) {
            menu.path = parentPath + menu.path;
            router.addRoute('Admin', {
              path: menu.path,
              name: menu.name,
              component: componentMap[menu.name],
              meta: {
                title: menu.title,
                closeable: menu.closeable,
                cache: menu.cache,
              },
            });
          }

          if (menu.children && menu.children.length > 0) {
            traverse(menu.children, parentPath + menu.path);
          }
        }
      }
      traverse(menus, '');
      this.menus = menus;
    },
  },
});
