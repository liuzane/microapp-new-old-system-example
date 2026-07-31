// 基础模块
import { ElMessage } from 'element-plus';

// 路由实例
import router from './router';

// Store
import useTagsViewStore from '@/stores/tags-view';
import useUserStore from '@/stores/user';

// 类型
import type { RouteLocationNormalized } from 'vue-router';

/**
 * 从 cookie 中获取指定名称的 cookie 值
 * @param name cookie 名称
 * @returns cookie 值或 null
 */
function getCookie(name: string): string | null {
  const match: RegExpMatchArray | null = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return match[2];
  }
  return null;
}

// 白名单
const whiteList: string[] = ['/login'];

// 路由守卫
router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
  // 白名单直接放行
  if (whiteList.includes(to.path)) {
    return true;
  }

  // 从 cookie 中获取 token
  const token: string | null = getCookie('token');

  // 如果 token 不存在，重定向到登录页
  if (!token) {
    if (to.path !== '/') {
      ElMessage.error('token 已过期，请先登录');
      await new Promise((resolve: (value?: unknown) => void) => setTimeout(resolve, 1000));
    }
    return '/login';
  }

  // 初始化 userStore
  const userStore: ReturnType<typeof useUserStore> = useUserStore();

  // 如果菜单为空，查询菜单
  if (userStore.menus.length === 0) {
    await userStore.queryMenus();
    // 添加完路由要重定向到目标路由
    router.replace(to);
    return true;
  }

  // 确保 store 已初始化
  const tagsViewStore: ReturnType<typeof useTagsViewStore> = useTagsViewStore();
  // 添加当前路由到标签
  tagsViewStore.addView(to);
  return true;
});
