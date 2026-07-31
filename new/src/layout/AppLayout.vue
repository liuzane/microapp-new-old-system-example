<template>
  <el-container class="app-layout">
    <AppSider />
    <el-container direction="vertical">
      <AppHeader />
      <AppTagsView />
      <el-main class="main-content">
        <RouterView v-slot="{ Component, route }">
          <KeepAlive v-if="route.meta.cache || route.meta.cache === undefined">
            <component
              :is="Component"
            />
          </KeepAlive>
          <component
            :is="Component"
            v-else
          />
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
// 组件
import AppHeader from './AppHeader.vue';
import AppSider from './AppSider.vue';
import AppTagsView from './AppTagsView.vue';
</script>

<style scoped>
.app-layout {
  width: 100%;
  height: 100vh;
  background-color: #f0f2f5;
}

.main-content {
  padding: 12px;
  overflow-y: auto;
}
</style>
