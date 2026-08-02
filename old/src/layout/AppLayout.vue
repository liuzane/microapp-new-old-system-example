<template>
  <el-container v-if="!isInMicroApp" direction="vertical" class="container">
    <AppHeader />
    <el-container direction="horizontal">
      <AppSider />
      <el-main class="main-content">
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
  <keep-alive v-else>
    <router-view />
  </keep-alive>
</template>

<script>
// 组件
import AppHeader from './AppHeader.vue';
import AppSider from './AppSider.vue';

export default {
  name: 'AppLayout',

  components: {
    AppHeader,
    AppSider,
  },

  data() {
    return {
      isInMicroApp: window.__MICRO_APP_ENVIRONMENT__,
    };
  },

  // 组件挂载时执行
  mounted() {
    // 微应用环境中
    if (this.isInMicroApp) {
      // 向父窗口发送本系统已经初始化完成的消息
      this.sendMessage({
        type: 'ready',
        payload: 'ok',
      });
      window.microApp.addDataListener(this.handleParentMessage, true);
    }
  },

  // 组件销毁时移除事件监听
  beforeDestroy() {
    if (this.isInMicroApp) {
      window.microApp.removeDataListener(this.handleParentMessage);
    }
  },

  methods: {
    sendMessage(data) {
      console.log('旧系统发送消息', data);
      window.microApp.dispatch(data);
    },

    handleParentMessage(data) {
      console.log('收到自新系统的数据', data);
      const { type, payload } = data || {};
      if (type === 'navigate' && payload) {
        this.$router.push(payload);
      }
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  background-color: #f0f2f5;
}

.main-content {
  padding: 12px;
  overflow-y: auto;
}
</style>
