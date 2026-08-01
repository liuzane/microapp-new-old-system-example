<template>
  <el-aside width="200px">
    <a
      href=""
      class="app__logo"
    >
      <span class="app__logo-text">New System</span>
    </a>

    <el-menu
      :default-active="activeMenu"
      :default-openeds="openedMenus"
      background-color="transparent"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      router
    >
      <template
        v-for="menu in menus"
        :key="menu.path"
      >
        <!-- 子菜单 -->
        <el-sub-menu
          v-if="menu.children"
          :index="menu.path"
        >
          <template #title>
            <el-icon>
              <Menu />
            </el-icon>

            <span>{{ menu.title }}</span>
          </template>

          <el-menu-item
            v-for="child in menu.children"
            :key="child.path"
            :index="child.path"
          >
            {{ child.title }}
          </el-menu-item>
        </el-sub-menu>

        <!-- 单菜单 -->
        <el-menu-item
          v-else
          :index="menu.path"
        >
          <el-icon>
            <House />
          </el-icon>

          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup lang="ts">
// 基础模块
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, House } from '@element-plus/icons-vue';

// 类型
import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';

// 菜单配置
import menus from './menus';

// 路由
const route: RouteLocationNormalized = useRoute();

// 响应式状态
const activeMenu: Ref<string> = ref<string>('/');
const openedMenus: Ref<string[]> = ref<string[]>([]);

// 监听路由变化
watch(
  () => route.path,
  (path: string) => {
    updateMenu(path);
  },
);

// 组件挂载时更新菜单状态
onMounted(() => {
  if (route.path !== '/') {
    updateMenu(route.path);
  }
});

/**
 * 根据路由更新菜单状态
 * @param {string} path - 当前路由路径
 */
const updateMenu = (path: string) => {
  activeMenu.value = path;

  const pieces: string[] = path.split('/');

  if (pieces.length > 2) {
    openedMenus.value = [pieces[1]];
  } else {
    openedMenus.value = [];
  }
};
</script>

<style scoped>
.ep-aside {
  background: #0d1b2a;
  overflow-y: auto;
}

.app__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 60px;
  text-decoration: none;
  background-color: #ffffff0d;
}

.app__logo-text {
  border-radius: 4px;
  width: 90%;
  height: 32px;
  padding: 0 10px;
  background-color: #334454;
  color: rgba(255,255,255,.8);
  font-size: 16px;
  line-height: 32px;
  text-align: center;
}

.ep-menu {
  border-right: none;
}
</style>
