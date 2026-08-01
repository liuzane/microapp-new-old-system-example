<template>
  <el-header class="app-header">
    <h1 class="title">
      一个基于 MicroApp 的新老系统融合架构的前端演示项目
    </h1>
    <el-icon
      class="setting-icon"
      @click="showModal = true"
    >
      <Setting />
    </el-icon>

    <!-- 数据管理对话框 -->
    <el-dialog
      v-model="showModal"
      title="数据管理"
      width="600px"
    >
      <p class="description">
        点击下方按钮可重置对应数据表，重置后将清空现有数据并重新初始化。
      </p>

      <!-- 新系统数据 -->
      <el-card
        shadow="never"
        class="data-card"
      >
        <template #header>
          <div class="card-header">
            <span>新系统数据</span>
          </div>
        </template>
        <div class="button-group">
          <el-button
            type="danger"
            :icon="RefreshRight"
            @click="onResetTable(ORDER_STORE_NAME, '订单')"
          >
            重置订单数据
          </el-button>
          <el-button
            type="danger"
            :icon="RefreshRight"
            @click="onResetTable(PRODUCT_STORE_NAME, '产品')"
          >
            重置产品数据
          </el-button>
        </div>
      </el-card>

      <!-- 旧系统数据 -->
      <el-card
        shadow="never"
        class="data-card"
      >
        <template #header>
          <div class="card-header">
            <span>旧系统数据</span>
          </div>
        </template>
        <div class="button-group">
          <el-button
            type="danger"
            :icon="RefreshRight"
            @click="onResetTable(USER_STORE_NAME, '用户')"
          >
            重置用户数据
          </el-button>
          <el-button
            type="danger"
            :icon="RefreshRight"
            @click="onResetTable(ROLE_STORE_NAME, '角色')"
          >
            重置角色数据
          </el-button>
        </div>
      </el-card>

      <!-- 新系统数据 -->
      <el-card
        shadow="never"
        class="data-card"
      >
        <el-button
          type="danger"
          @click="onLogout"
        >
          <template #icon>
            <img
              src="@/assets/logout.svg"
              alt="logout"
              class="logout-icon"
            >
          </template>
          注销登录
        </el-button>
      </el-card>

      <template #footer>
        <el-button @click="showModal = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </el-header>
</template>

<script setup lang="ts">
// 基础模块
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Setting, RefreshRight } from '@element-plus/icons-vue';

// 类型
import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import type { DatabaseMapper as DatabaseMapperType } from 'mockDB/mapper';

// 路由
const router: Router = useRouter();

// 响应式状态
const showModal: Ref<boolean> = ref(false);

// 数据库表名
let ORDER_STORE_NAME: string = '';
let PRODUCT_STORE_NAME: string = '';
let USER_STORE_NAME: string = '';
let ROLE_STORE_NAME: string = '';

onMounted(async () => {
  const mockDBStoreNames: typeof import('mockDB/store-names') = await import('mockDB/store-names');
  ORDER_STORE_NAME = mockDBStoreNames.ORDER_STORE_NAME;
  PRODUCT_STORE_NAME = mockDBStoreNames.PRODUCT_STORE_NAME;
  USER_STORE_NAME = mockDBStoreNames.USER_STORE_NAME;
  ROLE_STORE_NAME = mockDBStoreNames.ROLE_STORE_NAME;
});

/**
 * 重置指定数据表
 * @param storeName - 数据库存储名称
 * @param tableName - 显示的表名
 */
const onResetTable = async (storeName: string, tableName: string): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      `确定要重置 ${tableName}(${storeName}) 数据吗？此操作将清空现有数据并重新初始化。`,
      '确认重置',
      {
        confirmButtonText: '确认重置',
        cancelButtonText: '取消',
        type: 'warning',
      },
    );

    try {
      const { DatabaseMapper } = await import('mockDB/mapper');
      const mapper: DatabaseMapperType<unknown> = new DatabaseMapper<unknown>(window.mockDB.databaseName, storeName);

      // 根据存储名称清空并重新插入对应数据
      await mapper.clear();

      switch (storeName) {
        case ORDER_STORE_NAME: {
          const { default: orders } = await import('mockDB/data/orders');
          await mapper.clear();
          await mapper.insertBatch(orders);
          break;
        }

        case PRODUCT_STORE_NAME: {
          const { default: products } = await import('mockDB/data/products');
          await mapper.clear();
          await mapper.insertBatch(products);
          break;
        }

        case USER_STORE_NAME: {
          const { default: users } = await import('mockDB/data/users');
          await mapper.clear();
          await mapper.insertBatch(users);
          break;
        }

        case ROLE_STORE_NAME: {
          const { default: roles } = await import('mockDB/data/roles');
          await mapper.clear();
          await mapper.insertBatch(roles);
          break;
        }
      }

      ElMessage.success(`重置 ${tableName}(${storeName}) 数据成功`);
    } catch (error) {
      console.error('重置数据失败:', error);
      ElMessage.error('重置数据失败，请重试');
    }
  } catch {
    // 用户取消操作
  }
};

/**
 * 注销登录
 */
const onLogout = (): void => {
  ElMessageBox.confirm('确定要注销登录吗？', '确认注销', {
    confirmButtonText: '注销',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    document.cookie = 'token=; path=/';
    ElMessage.success('登录已注销');
    router.push('/login');
  });
};
</script>

<style scoped>
.ep-header.app-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-right: 40px;
  white-space: nowrap;
}

.setting-icon {
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.setting-icon:hover {
  color: #409eff;
}

.description {
  color: #999;
  margin-bottom: 16px;
}

.data-card {
  margin-bottom: 16px;
  background-color: #fafafa;
}

.card-header {
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.logout-icon {
  width: 14px;
  height: 14px;
}
</style>
