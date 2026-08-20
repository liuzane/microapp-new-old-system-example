<template>
  <el-card shadow="never">
    <template #header>
      <span>订单管理</span>
    </template>

    <!-- 统计卡片 -->
    <div class="stat-card-container order-cards">
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          总订单
        </div>
        <div
          class="stat-value color-primary"
          @click="onReset"
        >
          {{ statistics.total }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          待支付
        </div>
        <div
          class="stat-value color-warning"
          @click="() => onStatusChange(OrderStatusEnum.Pending)"
        >
          {{ statistics.pending }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          已支付
        </div>
        <div
          class="stat-value color-primary"
          @click="() => onStatusChange(OrderStatusEnum.Paid)"
        >
          {{ statistics.paid }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          已发货
        </div>
        <div
          class="stat-value color-success"
          @click="() => onStatusChange(OrderStatusEnum.Shipped)"
        >
          {{ statistics.shipped }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          已取消
        </div>
        <div
          class="stat-value color-danger"
          @click="() => onStatusChange(OrderStatusEnum.Cancelled)"
        >
          {{ statistics.cancelled }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          已完成
        </div>
        <div
          class="stat-value color-info"
          @click="() => onStatusChange(OrderStatusEnum.Completed)"
        >
          {{ statistics.completed }}
        </div>
      </el-card>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-row">
      <el-input
        v-model="searchText"
        placeholder="搜索订单号"
        style="width: 300px"
        clearable
        :prefix-icon="Search"
        @keyup.enter="onSearch"
      />
      <el-select
        v-model="orderStatus"
        placeholder="选择订单状态"
        style="width: 150px"
        clearable
      >
        <el-option
          v-for="(config, key) in STATUS_MAP"
          :key="key"
          :label="config.text"
          :value="key"
        />
      </el-select>
      <div class="filter-buttons">
        <el-button
          type="primary"
          @click="onSearch"
        >
          查询
        </el-button>
        <el-button @click="onReset">
          重置
        </el-button>
      </div>
    </div>

    <!-- 订单表格 -->
    <el-table
      v-loading="loading"
      :data="dataSource"
      row-key="orderNo"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="orderNo"
        label="订单号"
        min-width="150"
        fixed="left"
      />
      <el-table-column
        prop="productName"
        label="商品名称"
        min-width="300"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-link
            type="primary"
            underline="never"
            @click="onViewProduct(scope.row)"
          >
            {{ scope.row.productName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="客户信息"
        min-width="120"
      >
        <template #default="scope">
          <el-link
            type="primary"
            underline="never"
            @click="onViewCustomer(scope.row)"
          >
            {{ scope.row.customerName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="金额"
        min-width="120"
        sortable
      >
        <template #default="scope">
          ¥ {{ scope.row.amount.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        min-width="100"
      >
        <template #default="scope">
          <el-tag
            :type="STATUS_MAP[scope.row.status as OrderStatusType].color"
            disable-transitions
          >
            {{ STATUS_MAP[scope.row.status as OrderStatusType].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        min-width="180"
        sortable
      />
      <el-table-column
        label="操作"
        width="240"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            :icon="View"
            @click="onView(scope.row)"
          >
            查看
          </el-button>
          <el-button
            type="primary"
            link
            :icon="Edit"
            @click="onEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            :icon="Delete"
            @click="confirmDelete(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      @size-change="onPageSizeChange"
      @current-change="onCurrentPageChange"
    />

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewModalVisible"
      :title="`订单详情 - ${currentRecord?.orderNo || ''}`"
      width="700px"
      destroy-on-close
    >
      <el-descriptions
        v-if="currentRecord"
        border
        :column="2"
      >
        <el-descriptions-item label="订单号">
          {{ currentRecord.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item label="商品名称">
          {{ currentRecord.productName }}
        </el-descriptions-item>
        <el-descriptions-item label="客户姓名">
          {{ currentRecord.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ currentRecord.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">
          ¥ {{ currentRecord.amount.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="STATUS_MAP[currentRecord.status].color">
            {{ STATUS_MAP[currentRecord.status].text }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="下单时间"
          :span="2"
        >
          {{ currentRecord.createTime }}
        </el-descriptions-item>
        <el-descriptions-item
          label="收货地址"
          :span="2"
        >
          {{ currentRecord.address }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 编辑订单对话框 -->
    <el-dialog
      v-model="editModalVisible"
      :title="`编辑订单 - ${currentRecord?.orderNo || ''}`"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item
          label="商品名称"
          prop="productName"
        >
          <el-select
            v-model="formData.productName"
            placeholder="请选择商品名称"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="订单金额"
          prop="amount"
        >
          <el-input-number
            v-model="formData.amount"
            :precision="2"
            :min="0.01"
            style="width: 100%"
            placeholder="请输入金额"
          />
        </el-form-item>
        <el-form-item
          label="订单状态"
          prop="status"
        >
          <el-select
            v-model="formData.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option
              v-for="status in Object.values(OrderStatusEnum)"
              :key="status"
              :label="STATUS_MAP[status].text"
              :value="status"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="客户姓名"
          prop="customerName"
        >
          <el-select
            v-model="formData.customerName"
            placeholder="请选择客户姓名"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="联系电话"
          prop="phone"
        >
          <el-input
            v-model="formData.phone"
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item
          label="收货地址"
          prop="address"
        >
          <el-input
            v-model="formData.address"
            type="textarea"
            :rows="2"
            placeholder="请输入收货地址"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editModalVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="onEditSave"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
// 基础模块
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, View, Edit, Delete } from '@element-plus/icons-vue';

// 枚举
import { OrderStatusEnum } from '@/enums/order.enum';

// 类型
import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import type {
  IOrderSearchParams,
  IOrder,
  OrderStatusType,
  IStatistics,
  IStatusConfig,
  IOrderEditForm,
} from '@/models/order';
import type { Product } from 'mockDB/data/products';
import type { User } from 'mockDB/data/users';

// 数据服务
import orderService from '@/services/orderService';
import productService from '@/services/productService';
import userService from '@/services/userService';

// 状态配置映射
const STATUS_MAP: Record<OrderStatusType, IStatusConfig> = {
  [OrderStatusEnum.Pending]: { text: '待支付', color: 'warning' },
  [OrderStatusEnum.Paid]: { text: '已支付', color: 'primary' },
  [OrderStatusEnum.Shipped]: { text: '已发货', color: 'success' },
  [OrderStatusEnum.Completed]: { text: '已完成', color: 'info' },
  [OrderStatusEnum.Cancelled]: { text: '已取消', color: 'danger' },
};

// 路由
const router: Router = useRouter();

// 响应式状态
const dataSource: Ref<IOrder[]> = ref<IOrder[]>([]);
const total: Ref<number> = ref<number>(0);
const loading: Ref<boolean> = ref<boolean>(true);
const products: Ref<Product[]> = ref<Product[]>([]);
const users: Ref<User[]> = ref<User[]>([]);
const searchText: Ref<string> = ref<string>('');
const orderStatus: Ref<OrderStatusType | ''> = ref<OrderStatusType | ''>('');
const currentPage: Ref<number> = ref<number>(1);
const pageSize: Ref<number> = ref<number>(10);
const statistics: Ref<IStatistics> = ref<IStatistics>({
  total: 0,
  pending: 0,
  paid: 0,
  shipped: 0,
  completed: 0,
  cancelled: 0,
});
const viewModalVisible: Ref<boolean> = ref<boolean>(false);
const editModalVisible: Ref<boolean> = ref<boolean>(false);
const currentRecord: Ref<IOrder | null> = ref<IOrder | null>(null);
const formRef: Ref<FormInstance | undefined> = ref<FormInstance | undefined>();
const formLoading: Ref<boolean> = ref<boolean>(false);

const formData: IOrderEditForm = reactive<IOrderEditForm>({
  productName: '',
  amount: 0,
  status: OrderStatusEnum.Pending,
  customerName: '',
  phone: '',
  address: '',
});

const formRules: FormRules = {
  productName: [{ required: true, message: '请选择商品名称', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入订单金额', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
  customerName: [{ required: true, message: '请选择客户姓名', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
};

// 分页边界自动修正
watch(
  [total, pageSize, currentPage],
  () => {
    const totalPages: number = Math.ceil(total.value / pageSize.value);
    if (currentPage.value > totalPages && totalPages > 0) {
      currentPage.value = totalPages;
    }
  },
);

// 页面挂载时加载数据
onMounted(() => {
  loadData();
  loadStatistics();
  loadOptions();
});

/**
 * 加载数据
 * @param {IOrderSearchParams} params - 查询参数对象
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.searchText - 搜索文本
 * @param {OrderStatusType} params.status - 订单状态
 */
const loadData = async (params?: IOrderSearchParams): Promise<void> => {
  loading.value = true;
  try {
    const { code, data, msg } = await orderService.getOrdersByPage({
      currentPage: params && 'currentPage' in params ? params.currentPage : currentPage.value,
      pageSize: params && 'pageSize' in params ? params.pageSize : pageSize.value,
      searchText: params && 'searchText' in params ? params.searchText : searchText.value,
      status: params && 'status' in params ? params.status : orderStatus.value,
    });
    if (code === 200 && data) {
      dataSource.value = data.list as IOrder[];
      total.value = data.total;
    } else {
      throw new Error(msg);
    }
  } catch (error) {
    console.error('加载订单数据失败:', error);
    ElMessage.error(`加载订单数据失败: ${(error as Error).message}`);
  } finally {
    loading.value = false;
  }
};

/**
 * 加载统计数据
 */
const loadStatistics = async (): Promise<void> => {
  try {
    const { code, data, msg } = await orderService.getAllOrders();
    if (code === 200 && data) {
      const allOrders: IOrder[] = data as IOrder[];
      statistics.value = {
        total: allOrders.length,
        pending: allOrders.filter((item: IOrder) => item.status === OrderStatusEnum.Pending).length,
        paid: allOrders.filter((item: IOrder) => item.status === OrderStatusEnum.Paid).length,
        shipped: allOrders.filter((item: IOrder) => item.status === OrderStatusEnum.Shipped).length,
        cancelled: allOrders.filter((item: IOrder) => item.status === OrderStatusEnum.Cancelled).length,
        completed: allOrders.filter((item: IOrder) => item.status === OrderStatusEnum.Completed).length,
      };
    } else {
      throw new Error(msg);
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
    ElMessage.error(`加载统计数据失败: ${(error as Error).message}`);
  }
};

/**
 * 加载数据选项
 */
const loadOptions = async (): Promise<void> => {
  const [productsResult, usersResult] = await Promise.allSettled([
    productService.getAllProducts(),
    userService.getAllUsers(),
  ]);
  if (productsResult.status === 'fulfilled' && productsResult.value) {
    const { code, data, msg } = productsResult.value;
    if (code === 200 && data) {
      products.value = data;
    } else {
      console.error('加载商品数据选项失败:', msg);
    }
  }
  if (usersResult.status === 'fulfilled' && usersResult.value) {
    const { code, data, msg } = usersResult.value;
    if (code === 200 && data) {
      users.value = data;
    } else {
      console.error('加载客户数据选项失败:', msg);
    }
  }
};

/**
 * 查看商品详情
 * @param {IOrder} record - 订单记录对象
 * @param {string} record.productName - 商品名称
 */
const onViewProduct = (record: IOrder): void => {
  router.push({
    name: 'Product',
    query: {
      name: record.productName,
    },
  });
};

/**
 * 查看客户信息
 * @param {IOrder} record - 订单记录对象
 * @param {string} record.customerName - 客户名称
 */
const onViewCustomer = (record: IOrder): void => {
  router.push({
    name: 'User',
    query: {
      name: record.customerName,
    },
  });
};

/**
 * 查看订单详情
 * @param {IOrder} record - 订单记录对象
 */
const onView = (record: IOrder): void => {
  currentRecord.value = record;
  viewModalVisible.value = true;
};

/**
 * 编辑订单
 * @param {IOrder} record - 订单记录对象
 * @param {string} record.productName - 商品名称
 * @param {number} record.amount - 订单金额
 * @param {OrderStatusType} record.status - 订单状态
 * @param {string} record.customerName - 客户名称
 * @param {string} record.phone - 联系电话
 * @param {string} record.address - 收货地址
 */
const onEdit = (record: IOrder): void => {
  currentRecord.value = record;
  const formValues: IOrderEditForm = {
    productName: record.productName,
    amount: record.amount,
    status: record.status,
    customerName: record.customerName,
    phone: record.phone,
    address: record.address,
  };
  Object.assign(formData, formValues);
  formRef.value?.clearValidate();
  editModalVisible.value = true;
};

/**
 * 确认删除订单
 * @param {IOrder} record - 订单记录对象
 * @param {string} record.orderNo - 订单号
 * @param {number} record.id - 订单ID
 */
const confirmDelete = (record: IOrder): void => {
  ElMessageBox.confirm(
    `确定要删除订单 ${record.productName}(${record.orderNo}) 吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        const { code, msg } = await orderService.deleteOrder(record.id);
        if (code === 200) {
          const totalPages: number = Math.ceil((total.value - 1) / pageSize.value);
          if (currentPage.value > totalPages && totalPages > 0) {
            currentPage.value = totalPages;
            await loadData({ currentPage: totalPages });
          } else {
            await loadData();
          }
          loadStatistics();
          ElMessage.success(`删除订单：${record.productName}(${record.orderNo}) 成功`);
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error('删除订单失败:', error);
        ElMessage.error(`删除订单失败: ${(error as Error).message}`);
      }
    })
    .catch(() => {
      // 用户取消删除操作
    });
};

/**
 * 保存编辑后的订单
 */
const onEditSave = async (): Promise<void> => {
  formLoading.value = true;
  try {
    await formRef.value!.validate();
    if (currentRecord.value) {
      const params: IOrder = {
        ...currentRecord.value,
        productName: formData.productName,
        amount: formData.amount,
        status: formData.status,
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
      };
      const { code, msg } = await orderService.updateOrder(params);
      if (code === 200) {
        await loadData();
        loadStatistics();
        editModalVisible.value = false;
        ElMessage.success(`订单 ${currentRecord.value.orderNo} 更新成功`);
      } else {
        throw new Error(msg);
      }
    }
  } catch (error) {
    console.error('更新订单失败:', error);
    ElMessage.error(`更新订单失败: ${(error as Error).message}`);
  } finally {
    formLoading.value = false;
  }
};

/**
 * 重置搜索条件
 */
const onReset = (): void => {
  searchText.value = '';
  orderStatus.value = '';
  currentPage.value = 1;
  loadData({ searchText: '', status: '', currentPage: 1 });
};

/**
 * 搜索订单
 */
const onSearch = (): void => {
  currentPage.value = 1;
  loadData({ currentPage: 1 });
};

/**
 * 按状态筛选订单
 * @param {OrderStatusType} status - 订单状态枚举值
 */
const onStatusChange = (status: OrderStatusType): void => {
  searchText.value = '';
  orderStatus.value = status;
  currentPage.value = 1;
  loadData({ searchText: '', status, currentPage: 1 });
};

/**
 * 改变每页显示条数
 * @param {number} size - 每页显示条数
 */
const onPageSizeChange = (size: number): void => {
  pageSize.value = size;
  currentPage.value = 1;
  loadData({ pageSize: size, currentPage: 1 });
};

/**
 * 改变当前页码
 * @param {number} page - 当前页码
 */
const onCurrentPageChange = (page: number): void => {
  currentPage.value = page;
  loadData({ currentPage: page });
};
</script>

<style scoped>
.order-cards {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}
</style>
