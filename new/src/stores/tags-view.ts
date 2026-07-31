// 基础模块
import { defineStore } from 'pinia';

// 路由
import router from '@/router';

// 类型
import type { RouteLocationNormalized } from 'vue-router';
import type { TagsViewState, TagView } from '@/models/tags-view';

export default defineStore('tags-view', {
  state: (): TagsViewState => ({
    visitedViews: [],
  }),
  actions: {
    // 添加视图
    addView(route: RouteLocationNormalized) {
      const view: TagView = this.generateTagView(route);
      // 已存在则不再重复添加
      const isExist: boolean = this.visitedViews.some((v: TagView) => v.path === view.path);
      if (!isExist) {
        this.visitedViews.push(view);
      }
    },

    // 生成标签对象
    generateTagView(route: RouteLocationNormalized): TagView {
      return {
        path: route.path,
        name: route.name as string,
        meta: {
          title: route.meta?.title as string || '',
          closeable: route.meta?.closeable === undefined ? true : route.meta?.closeable as boolean,
          cache: route.meta?.cache === undefined ? true : route.meta?.cache as boolean,
        },
      };
    },

    // 删除视图（根据路径）
    removeView(path: string) {
      const index: number = this.visitedViews.findIndex((v: TagView) => v.path === path);
      if (index === -1) return;
      const view: TagView = this.visitedViews[index];
      // 如果 closeable 为 false，不允许关闭
      if (view.meta?.closeable === false) return;

      this.visitedViews.splice(index, 1);

      // 如果关闭的是当前路由，则跳转到最后一个可见标签
      const currentPath: string = router.currentRoute.value.path;
      if (path === currentPath) {
        const lastView: TagView = this.visitedViews[this.visitedViews.length - 1];
        if (lastView) {
          router.push(lastView.path);
        } else {
          // 无标签时跳转首页（需自行定义）
          router.push('/');
        }
      }
    },
  },
});
