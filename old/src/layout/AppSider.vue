<template>
  <el-aside width="200px">
    <el-menu
      :default-active="activeMenu"
      :default-opened="openedMenus"
      background-color="transparent"
      text-color="#000"
      active-text-color="#409eff"
      router
    >
      <template v-for="(menu, index) in menus">
        <el-submenu v-if="menu.children" :key="index" :index="menu.path">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item v-for="(child, childIndex) in menu.children" :key="childIndex" :index="child.path">{{ child.title }}</el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="index + menu.path" :index="menu.path">
          <i class="el-icon-s-home"></i>
          <span>{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
// 菜单
import menus from './menus';

export default {
  name: 'AppSider',

  data() {
    return {
      menus,
      activeMenu: '/',
      openedMenus: [],
    };
  },

  watch: {
    '$route'(to) {
      this.activeMenu = to.path;
      this.openedMenus = [to.path.split('/')[1]];
    },
  },

  mounted() {
    if (this.$route.path === '/') {
      return;
    }
    this.activeMenu = this.$route.path;
    const pathnamePieces = this.$route.path.split('/');
    if (pathnamePieces.length > 2) {
      this.openedMenus = [pathnamePieces[1]];
    }
  },
};
</script>

<style scoped>
.el-aside {
  background-color: #fff;
  overflow-y: auto;
}

.el-menu {
  border-right: none;
}
</style>
