// 基础模块
import { Message } from 'element-ui';

// 路由
import router from './router';

/**
 * 从 cookie 中获取指定名称的 cookie 值
 * @param name cookie 名称
 * @returns cookie 值或 null
 */
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return match[2];
  }
  return null;
}

// 白名单
const whiteList = ['/login'];

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  // 白名单直接放行
  if (whiteList.includes(to.path)) {
    next();
    return;
  }

  // 从 cookie 中获取 token
  const token = getCookie('token');

  // 如果 token 不存在，重定向到登录页
  if (!token) {
    if (to.path !== '/') {
      Message.error('token 已过期，请先登录');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    next('/login');
    return;
  }

  next();
});
