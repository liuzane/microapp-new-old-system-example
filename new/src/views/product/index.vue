<template>
  <el-card shadow="never">
    <template #header>
      <span>产品管理</span>
    </template>

    <!-- 统计卡片 -->
    <div class="stat-card-container">
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          总产品
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
          上架
        </div>
        <div
          class="stat-value color-success"
          @click="() => onStatusChange(ProductStatusEnum.OnSale)"
        >
          {{ statistics.onSale }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          缺货
        </div>
        <div
          class="stat-value color-danger"
          @click="() => onStatusChange(ProductStatusEnum.OutOfStock)"
        >
          {{ statistics.outOfStock }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          库存紧张
        </div>
        <div
          class="stat-value color-warning"
          @click="() => onStatusChange(ProductStatusEnum.LowStock)"
        >
          {{ statistics.lowStock }}
        </div>
      </el-card>
      <el-card
        shadow="never"
        class="stat-card"
      >
        <div class="stat-label">
          下架
        </div>
        <div
          class="stat-value color-info"
          @click="() => onStatusChange(ProductStatusEnum.OffSale)"
        >
          {{ statistics.offSale }}
        </div>
      </el-card>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-row">
      <el-input
        v-model="searchText"
        placeholder="搜索产品编号或名称"
        style="width: 300px"
        clearable
        :prefix-icon="Search"
        @keyup.enter="onSearch"
      />
      <el-select
        v-model="category"
        placeholder="选择分类"
        style="width: 150px"
        clearable
      >
        <el-option
          v-for="(label, key) in CATEGORY_MAP"
          :key="key"
          :label="label"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="productStatus"
        placeholder="选择状态"
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
      <el-button
        type="primary"
        :icon="Plus"
        @click="onAdd"
      >
        新增产品
      </el-button>
    </div>

    <!-- 产品表格 -->
    <el-table
      v-loading="loading"
      :data="dataSource"
      row-key="productNo"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="productNo"
        label="产品编号"
        min-width="120"
        fixed="left"
      />
      <el-table-column
        prop="name"
        label="产品名称"
        min-width="300"
        show-overflow-tooltip
      />
      <el-table-column
        prop="category"
        label="分类"
        min-width="120"
      >
        <template #default="scope">
          {{ CATEGORY_MAP[scope.row.category as ProductCategoryEnum] }}
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        min-width="120"
        sortable
      >
        <template #default="scope">
          ¥ {{ scope.row.price.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        min-width="100"
      >
        <template #default="scope">
          <el-tag
            :type="getStockColor(scope.row.stock)"
            disable-transitions
          >
            {{ scope.row.stock }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sales"
        label="销量"
        min-width="100"
        sortable
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="100"
      >
        <template #default="scope">
          <el-tag
            :type="STATUS_MAP[scope.row.status as ProductStatusEnum].color"
            disable-transitions
          >
            {{ STATUS_MAP[scope.row.status as ProductStatusEnum].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplier"
        label="供应商"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
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
      :title="`产品详情 - ${currentRecord?.productNo || ''}`"
      width="700px"
      destroy-on-close
    >
      <el-descriptions
        v-if="currentRecord"
        border
        :column="2"
      >
        <el-descriptions-item
          label="产品编号"
          :span="2"
        >
          {{ currentRecord.productNo }}
        </el-descriptions-item>
        <el-descriptions-item
          label="产品名称"
          :span="2"
        >
          {{ currentRecord.name }}
        </el-descriptions-item>
        <el-descriptions-item label="产品分类">
          {{ CATEGORY_MAP[currentRecord.category] }}
        </el-descriptions-item>
        <el-descriptions-item label="产品状态">
          <el-tag :type="STATUS_MAP[currentRecord.status].color">
            {{ STATUS_MAP[currentRecord.status].text }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="产品价格">
          ¥ {{ currentRecord.price.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="库存数量">
          {{ currentRecord.stock }}
        </el-descriptions-item>
        <el-descriptions-item label="销量">
          {{ currentRecord.sales }}
        </el-descriptions-item>
        <el-descriptions-item label="供应商">
          {{ currentRecord.supplier }}
        </el-descriptions-item>
        <el-descriptions-item
          label="创建时间"
          :span="2"
        >
          {{ currentRecord.createTime }}
        </el-descriptions-item>
        <el-descriptions-item
          label="产品描述"
          :span="2"
        >
          {{ currentRecord.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 新增/编辑产品对话框 -->
    <el-dialog
      v-model="editModalVisible"
      :title="currentRecord ? `编辑产品 - ${currentRecord.productNo}` : '新增产品'"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formState"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item
          label="产品名称"
          prop="name"
        >
          <el-input
            v-model="formState.name"
            placeholder="请输入产品名称"
          />
        </el-form-item>
        <el-form-item
          label="产品价格"
          prop="price"
        >
          <el-input-number
            v-model="formState.price"
            :precision="2"
            :min="0.01"
            style="width: 100%"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item
          label="库存数量"
          prop="stock"
        >
          <el-input-number
            v-model="formState.stock"
            :min="0"
            style="width: 100%"
            placeholder="请输入库存数量"
          />
        </el-form-item>
        <el-form-item
          label="产品分类"
          prop="category"
        >
          <el-select
            v-model="formState.category"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="cat in Object.values(ProductCategoryEnum)"
              :key="cat"
              :label="CATEGORY_MAP[cat]"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="产品状态"
          prop="status"
        >
          <el-select
            v-model="formState.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option
              v-for="status in Object.values(ProductStatusEnum)"
              :key="status"
              :label="STATUS_MAP[status].text"
              :value="status"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="供应商"
          prop="supplier"
        >
          <el-input
            v-model="formState.supplier"
            placeholder="请输入供应商"
          />
        </el-form-item>
        <el-form-item
          label="产品描述"
          prop="description"
        >
          <el-input
            v-model="formState.description"
            type="textarea"
            :rows="2"
            placeholder="请输入产品描述"
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
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, View, Edit, Delete, Plus } from '@element-plus/icons-vue';

// 枚举
import { ProductStatusEnum, ProductCategoryEnum } from '@/enums/product.enum';

// 类型
import type { Ref } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import type {
  IProductSearchParams,
  IProduct,
  IStatistics,
  ProductStatusType,
  ProductCategoryType,
  IStatusConfig,
  IProductEditForm,
} from '@/models/product';

// 数据服务
import ProductService from '@/services/ProductService';

// 状态配置映射
const STATUS_MAP: Record<ProductStatusType, IStatusConfig> = {
  [ProductStatusEnum.OnSale]: { text: '上架', color: 'success' },
  [ProductStatusEnum.OffSale]: { text: '下架', color: 'info' },
  [ProductStatusEnum.OutOfStock]: { text: '缺货', color: 'danger' },
  [ProductStatusEnum.LowStock]: { text: '库存紧张', color: 'warning' },
};

// 分类映射
const CATEGORY_MAP: Record<ProductCategoryType, string> = {
  [ProductCategoryEnum.Electronics]: '电子产品',
  [ProductCategoryEnum.Clothing]: '服装',
  [ProductCategoryEnum.Home]: '家居用品',
  [ProductCategoryEnum.Beauty]: '美妆个护',
  [ProductCategoryEnum.Food]: '食品饮料',
};

// 服务实例
const productService: ProductService = new ProductService();

// 路由
const route: RouteLocationNormalized = useRoute();

// 响应式状态 - 全部显式类型注解
const dataSource: Ref<IProduct[]> = ref<IProduct[]>([]);
const total: Ref<number> = ref<number>(0);
const loading: Ref<boolean> = ref<boolean>(true);
const searchText: Ref<string> = ref<string>('');
const category: Ref<ProductCategoryType | ''> = ref<ProductCategoryType | ''>('');
const productStatus: Ref<ProductStatusType | ''> = ref<ProductStatusType | ''>('');
const currentPage: Ref<number> = ref<number>(1);
const pageSize: Ref<number> = ref<number>(10);
const statistics: Ref<IStatistics> = ref<IStatistics>({
  total: 0,
  onSale: 0,
  offSale: 0,
  outOfStock: 0,
  lowStock: 0,
});
const viewModalVisible: Ref<boolean> = ref<boolean>(false);
const editModalVisible: Ref<boolean> = ref<boolean>(false);
const currentRecord: Ref<IProduct | null> = ref<IProduct | null>(null);
const formRef: Ref<FormInstance | undefined> = ref<FormInstance | undefined>();
const formLoading: Ref<boolean> = ref<boolean>(false);

// 表单状态
const formState: IProductEditForm = reactive<IProductEditForm>({
  name: '',
  price: 0,
  stock: 0,
  category: ProductCategoryEnum.Electronics,
  status: ProductStatusEnum.OnSale,
  supplier: '',
  description: '',
});

// 表单校验规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入产品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '库存数量必须大于等于0', trigger: 'blur' },
  ],
  category: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择产品状态', trigger: 'change' }],
  supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
  description: [],
};

// 分页边界修正
watch([total, pageSize, currentPage], () => {
  const totalPages: number = Math.ceil(total.value / pageSize.value);
  if (currentPage.value > totalPages && totalPages > 0) {
    currentPage.value = totalPages;
  }
});

// 页面挂载时加载数据
onMounted(() => {
  const name: string | null = (route.query.name as string) || null;
  if (name) {
    searchText.value = name;
    loadData({ searchText: name });
  } else {
    loadData();
  }
});

/**
 * 根据库存数量获取标签颜色
 * @param {number} stock - 库存数量
 * @returns {string} 标签颜色类型（danger | warning | success）
 */
const getStockColor = (stock: number): string => {
  if (stock === 0) {
    return 'danger';
  }
  if (stock < 10) {
    return 'warning';
  }
  return 'success';
};

/**
 * 加载产品数据
 * @param {IProductSearchParams} params - 查询参数对象
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.searchText - 搜索文本（产品编号或名称）
 * @param {ProductCategoryType} params.category - 产品分类
 * @param {ProductStatusType} params.status - 产品状态
 */
const loadData = async (params?: IProductSearchParams): Promise<void> => {
  loading.value = true;
  try {
    const { data, total: totalCount } = await productService.getProductsByPage({
      currentPage: params && 'currentPage' in params ? params.currentPage : currentPage.value,
      pageSize: params && 'pageSize' in params ? params.pageSize : pageSize.value,
      searchText: params && 'searchText' in params ? params.searchText : searchText.value,
      category: params && 'category' in params ? params.category : category.value,
      status: params && 'status' in params ? params.status : productStatus.value,
    });
    dataSource.value = data;
    total.value = totalCount;

    const allProducts: IProduct[] = await productService.getAllProducts();
    statistics.value = {
      total: allProducts.length,
      onSale: allProducts.filter((item: IProduct) => item.status === ProductStatusEnum.OnSale).length,
      offSale: allProducts.filter((item: IProduct) => item.status === ProductStatusEnum.OffSale).length,
      outOfStock: allProducts.filter((item: IProduct) => item.status === ProductStatusEnum.OutOfStock).length,
      lowStock: allProducts.filter((item: IProduct) => item.stock > 0 && item.stock < 10).length,
    };
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载产品数据失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
};

/**
 * 查看产品详情
 * @param {IProduct} record - 产品记录对象
 * @param {string} record.productNo - 产品编号
 * @param {string} record.name - 产品名称
 * @param {number} record.price - 产品价格
 * @param {number} record.stock - 库存数量
 * @param {number} record.sales - 销量
 * @param {ProductCategoryType} record.category - 产品分类
 * @param {ProductStatusType} record.status - 产品状态
 * @param {string} record.supplier - 供应商
 * @param {string} record.createTime - 创建时间
 * @param {string} record.description - 产品描述
 */
const onView = (record: IProduct): void => {
  currentRecord.value = record;
  viewModalVisible.value = true;
};

/**
 * 编辑产品
 * @param {IProduct} record - 产品记录对象
 * @param {string} record.name - 产品名称
 * @param {number} record.price - 产品价格
 * @param {number} record.stock - 库存数量
 * @param {ProductCategoryType} record.category - 产品分类
 * @param {ProductStatusType} record.status - 产品状态
 * @param {string} record.supplier - 供应商
 * @param {string} record.description - 产品描述
 */
const onEdit = (record: IProduct): void => {
  currentRecord.value = record;
  const formValues: IProductEditForm = {
    name: record.name,
    price: record.price,
    stock: record.stock,
    category: record.category,
    status: record.status,
    supplier: record.supplier,
    description: record.description,
  };
  Object.assign(formState, formValues);
  formRef.value?.clearValidate();
  editModalVisible.value = true;
};

/**
 * 新增产品
 */
const onAdd = (): void => {
  currentRecord.value = null;
  const defaultForm: IProductEditForm = {
    name: '',
    price: 0,
    stock: 0,
    category: ProductCategoryEnum.Electronics,
    status: ProductStatusEnum.OnSale,
    supplier: '',
    description: '',
  };
  Object.assign(formState, defaultForm);
  formRef.value?.clearValidate();
  editModalVisible.value = true;
};

/**
 * 确认删除产品
 * @param {IProduct} record - 产品记录对象
 * @param {string} record.productNo - 产品编号
 * @param {number} record.id - 产品ID
 */
const confirmDelete = (record: IProduct): void => {
  ElMessageBox.confirm(
    `确定要删除产品 ${record.productNo} 吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        await productService.deleteProduct(record.id);
        await loadData();
        ElMessage.success(`删除产品：${record.productNo} 成功`);
      } catch (error) {
        console.error('删除失败:', error);
        ElMessage.error('删除失败，请重试');
      }
    })
    .catch(() => {
      // 用户取消删除
    });
};

/**
 * 保存新增或编辑的产品
 */
const onEditSave = async (): Promise<void> => {
  formLoading.value = true;
  try {
    await formRef.value!.validate();
    if (currentRecord.value) {
      // 更新产品
      const updatedRecord: IProduct = {
        ...currentRecord.value,
        name: formState.name,
        price: formState.price,
        stock: formState.stock,
        category: formState.category,
        status: formState.status,
        supplier: formState.supplier,
        description: formState.description,
      };
      await productService.updateProduct(updatedRecord);
      await loadData();
      editModalVisible.value = false;
      ElMessage.success(`产品 ${currentRecord.value.productNo} 更新成功`);
    } else {
      // 新增产品
      const now: Date = new Date();
      const newProduct: IProduct = {
        id: now.getTime(),
        productNo: `P${now.getTime().toString().slice(-8)}`,
        name: formState.name,
        price: formState.price,
        stock: formState.stock,
        sales: 0,
        category: formState.category,
        status: formState.status,
        supplier: formState.supplier,
        createTime: now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).replace(/\//g, '-'),
        description: formState.description,
      };
      await productService.insertProduct(newProduct);
      await loadData();
      editModalVisible.value = false;
      ElMessage.success(`产品 ${newProduct.name} 创建成功`);
    }
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    formLoading.value = false;
  }
};

/**
 * 重置筛选条件
 */
const onReset = (): void => {
  searchText.value = '';
  category.value = '';
  productStatus.value = '';
  currentPage.value = 1;
  loadData({ searchText: '', category: '', status: '', currentPage: 1 });
};

/**
 * 按状态筛选产品
 * @param {ProductStatusType} status - 产品状态枚举值
 */
const onStatusChange = (status: ProductStatusType): void => {
  searchText.value = '';
  category.value = '';
  productStatus.value = status;
  currentPage.value = 1;
  loadData({ searchText: '', category: '', status, currentPage: 1 });
};

/**
 * 执行搜索
 */
const onSearch = (): void => {
  currentPage.value = 1;
  loadData({ currentPage: 1 });
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
