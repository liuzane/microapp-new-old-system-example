<template>
  <div
    v-loading="!isLegacyReady"
    element-loading-text="应用加载中"
    class="legacy-container"
  >
    <micro-app
      :name="appName"
      :url="legacyUrl"
      keep-alive
    />
  </div>
</template>

<script setup lang="ts">
// 基础模块
import microApp from '@micro-zoe/micro-app';
import { ref, onMounted, watch, onDeactivated, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

// 类型
import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { MessageData } from '@/models/legacy';

const appName: string = 'old-system';
const legacyUrl: string = import.meta.env.VITE_LEGACY_URL;

// 响应式状态
const route: RouteLocationNormalized = useRoute();
const isLegacyReady: Ref<boolean> = ref(false);

// 监听路由变化，当旧系统就绪后发送新路径
watch(
  () => route.path,
  (newPath: string) => {
    if (isLegacyReady.value) {
      sendMessage({
        type: 'navigate',
        payload: {
          path: newPath.replace('/legacy', ''),
          params: route.params,
          query: route.query,
        },
      });
    }
  },
);

// 组件挂载后监听消息并获取 iframe window
onMounted(() => {
  microApp.addDataListener(appName, handleDataChange);
});

// 组件卸载前移除监听
onBeforeUnmount(() => {
  microApp.removeDataListener(appName, handleDataChange);
});

// 组件停用时重置状态
onDeactivated(() => {
  // isLegacyReady.value = false;
});

// 向旧系统发送路由路径
const sendMessage = (data: MessageData) => {
  microApp.setData(appName, data as unknown as Record<string, unknown>);
};

// 处理旧系统发来的消息
const handleDataChange = (data: MessageData) => {
  console.log('收到旧系统消息: ', data);
  if (data.type === 'ready' && data.payload === 'ok') {
    isLegacyReady.value = true;
    // 发送当前路由
    sendMessage({
      type: 'navigate',
      payload: {
        path: route.path.replace('/legacy', ''),
        params: route.params,
        query: route.query,
      },
    });
  }
};
</script>

<style scoped>
.legacy-container {
  width: 100%;
  height: 100%;
}
</style>
