// 基础模块
import Vue from 'vue';
import ElementUI from 'element-ui';

// 路由
import router from './router';

// 常量
import { DATABASE_NAME } from './consts/mockDB';

// 样式
import '@/styles';

// 应用入口
import App from './App.vue';

// 权限
import './permission';

Vue.use(ElementUI, { size: 'small' });

Vue.config.productionTip = false;

let instance = null;

// 初始化应用
async function init() {
  // 数据库模块
  const { initIndexedDB } = window.mockDB.init;
  await initIndexedDB(DATABASE_NAME);

  // 初始化应用
  instance = new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
}

// 独立运行
if (!window.__MICRO_APP_ENVIRONMENT__) {
  init();
}

window.mount = () => {
  init();
};

window.unmount = () => {
  instance && instance.$destroy();
  instance = null;
};

