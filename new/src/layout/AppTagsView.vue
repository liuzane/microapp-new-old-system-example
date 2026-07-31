<!-- AppTagsView.vue -->
<template>
  <div class="tags-view">
    <el-scrollbar>
      <el-tag
        v-for="tag in visitedViews"
        :key="tag.path"
        class="tags-view-item"
        type="primary"
        :effect="isActive(tag.path) ? 'dark' : 'plain'"
        :closable="tag.meta?.closeable"
        @click="handleClick(tag)"
        @close="handleClose(tag)"
      >
        {{ tag.meta?.title || '未命名' }}
      </el-tag>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
// 基础模块
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Store
import useTagsViewStore from '@/stores/tags-view';

// 类型
import type { ComputedRef } from 'vue';
import type { RouteLocationNormalized, Router } from 'vue-router';
import type { TagView } from '@/models/tags-view';

const route: RouteLocationNormalized = useRoute();
const router: Router = useRouter();
const store: ReturnType<typeof useTagsViewStore> = useTagsViewStore();

const visitedViews: ComputedRef<TagView[]> = computed(() => store.visitedViews);

// 当前激活的标签
const isActive = (path: string) => route.path === path;

// 点击标签切换路由
const handleClick = (tag: { path: string }) => {
  if (route.path === tag.path) return;
  router.push(tag.path);
};

// 关闭单个标签
const handleClose = (tag: { path: string }) => {
  store.removeView(tag.path);
};
</script>

<style scoped>
.tags-view {
  position: relative;
  flex-shrink: 0;
  padding: 0 8px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tags-view-item {
  margin: 4px;
  border-radius: 0;
  cursor: pointer;
  user-select: none;
}

.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #d8dce5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 4px 0;
}
.context-menu div {
  padding: 6px 20px;
  cursor: pointer;
  font-size: 14px;
}
.context-menu div:hover {
  background: #f0f0f0;
}
</style>
