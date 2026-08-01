<template>
  <div class="login-container">
    <div class="login-card">
      <!-- 头部 -->
      <div class="login-header">
        <div class="logo-icon">
          <el-icon :size="40">
            <UserFilled />
          </el-icon>
        </div>
        <h1>新系统</h1>
        <p>请输入账号密码进入系统</p>
      </div>

      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input
            v-model="loginForm.username"
            placeholder="请输入账号 admin"
            :prefix-icon="User"
            clearable
            autofocus
          />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码 123456"
            :prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>

        <!-- 提示信息 -->
        <div class="login-tips">
          <el-text
            size="small"
            type="info"
          >
            默认账号: admin &nbsp;|&nbsp; 密码: 123456
          </el-text>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 基础模块
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, UserFilled } from '@element-plus/icons-vue';

// 类型
import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';

interface LoginForm {
  username: string;
  password: string;
}

const router: Router = useRouter();

const loginFormRef: Ref<FormInstance | undefined> = ref<FormInstance | undefined>();
const loginForm: LoginForm = reactive({
  username: 'admin',
  password: '123456',
});
const loading: Ref<boolean> = ref(false);
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 2, max: 20, message: '账号长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 20, message: '密码长度在 3 到 20 个字符', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  // 表单校验
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();

    loading.value = true;

    // 模拟网络请求延迟
    await new Promise((resolve: (value?: undefined) => void) => setTimeout(resolve, 600));

    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      ElMessage.success('登录成功');

      // 设置 token
      document.cookie = 'token=1234567890; path=/';

      // 跳转到首页
      await router.push('/');
    } else {
      ElMessage.error('账号或密码错误，请重新输入');
    }
  } catch (error) {
    // 表单校验失败
    console.warn('表单校验未通过', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e9f0fc 0%, #c8d9f0 100%);
}

.login-card {
  width: 420px;
  padding: 48px 40px 32px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0, 20, 50, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #409eff, #2d6bb8);
  border-radius: 50%;
  color: #fff;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.35);
}

.login-header h1 {
  font-size: 26px;
  font-weight: 600;
  color: #1d2a3a;
  margin: 0 0 6px;
  letter-spacing: 1px;
}

.login-header p {
  color: #7a8ba3;
  font-size: 14px;
  margin: 0;
}

:deep(.ep-form-item) {
  margin-bottom: 22px;
}

:deep(.ep-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
  padding-bottom: 4px;
}

:deep(.ep-input__wrapper) {
  border-radius: 10px;
  transition: box-shadow 0.2s ease;
}

:deep(.ep-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #b3d8ff;
}

:deep(.ep-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.25);
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 4px;
  border-radius: 10px;
  background: linear-gradient(135deg, #409eff, #2d6bb8);
  border: none;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #5aabff, #3a7fd4);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.35);
}

.login-btn:active {
  transform: translateY(0);
}

.login-tips {
  text-align: center;
  margin-top: 4px;
}

.login-tips .ep-text {
  color: #9aaec2 !important;
  font-size: 13px;
}
</style>
