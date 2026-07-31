<template>
  <el-header class="app-header">
    <a href="" class="app__logo">
      <span class="app__logo-text">Old System</span>
    </a>
    <h1 class="title">独立运行的旧系统前端演示项目</h1>
    <img
      src="@/assets/logout.svg"
      alt="logout"
      class="logout-icon"
      @click="onLogout"
    />
  </el-header>
</template>

<script>
// 基础模块
import { Message, MessageBox } from 'element-ui';

export default {
  name: 'AppHeader',

  methods: {
    onLogout() {
      MessageBox.confirm('确定要注销登录吗？', '确认注销', {
        confirmButtonText: '注销',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        document.cookie = 'token=; path=/';
        Message.success('登录已注销');
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 0;
  background-color: #001529;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.app__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 200px;
  height: 60px;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.05);
}

.app__logo-text {
  border-radius: 4px;
  width: 90%;
  height: 32px;
  padding: 0 10px;
  background-color: #334454;
  color: rgba(255, 255, 255, .8);
  font-size: 16px;
  line-height: 32px;
  text-align: center;
}

.title {
  margin-right: auto;
  padding-left: 15px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
}

.logout-icon {
  margin-right: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.logout-btn {
  margin-left: 20px;
}
</style>
