// 基础模块
import microApp from '@micro-zoe/micro-app';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

// 类型定义
import type { App as VueApp } from 'vue';
import type { Pinia } from 'pinia';

// 常量
import { DATABASE_NAME } from './consts/mockDB';

// 路由
import router from './router';

// 样式
import './styles';

// 应用入口
import App from './App.vue';

// 权限模块
import './permission';

// 数据库模块
const { initIndexedDB } = await import('mockDB/init');

async function init() {
  await initIndexedDB(DATABASE_NAME);

  // 初始化应用
  const app: VueApp = createApp(App);
  const pinia: Pinia = createPinia();

  app.use(pinia);
  app.use(router);
  app.use(ElementPlus, {
    locale: zhCn,
  });

  await router.isReady();

  app.mount('#app');

  // 启动 MicroApp
  microApp.start({
    'router-mode': 'pure',
    // 全局生命周期钩子
    'lifeCycles': {
      created(_e: CustomEvent, appName: string) {
        console.log('Micro app created:', appName);
      },
      beforemount(_e: CustomEvent, appName: string) {
        console.log('Micro app beforemount:', appName);
      },
      mounted(_e: CustomEvent, appName: string) {
        console.log('Micro app mounted:', appName);
      },
      unmount(_e: CustomEvent, appName: string) {
        console.log('Micro app unmount:', appName);
      },
      error(_e: CustomEvent, appName: string) {
        console.error('Micro app error:', appName);
      },
    },
  });

  // 隐藏 loading 文本
  const el: HTMLElement | null = document.getElementById('loading')!;
  el.style.opacity = '0';
  el.addEventListener('transitionend', () => {
    el.remove();
  }, { once: true });
}

init();
