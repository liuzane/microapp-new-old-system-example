<template>
  <el-card>
    <div slot="header">
      <span>角色管理</span>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-row">
      <el-input
        v-model="searchText"
        placeholder="搜索角色名称或编码"
        prefix-icon="el-icon-search"
        clearable
        style="width: 300px"
        @input="onSearchInput"
        @keyup.enter.native="onSearch"
      />
      <el-select
        v-model="roleStatus"
        placeholder="选择状态"
        clearable
        style="width: 150px"
        @change="onStatusSelectChange"
      >
        <el-option label="全部状态" value="" />
        <el-option
          v-for="(config, key) in STATUS_MAP"
          :key="key"
          :label="config.text"
          :value="key"
        />
      </el-select>
      <div class="filter-buttons">
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-left: auto"
        @click="onAdd"
      >
        新增角色
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="dataSource"
      v-loading="loading"
      stripe
      border
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" width="50" align="center" fixed />
      <el-table-column prop="name" label="角色名称" min-width="150" />
      <el-table-column prop="code" label="角色编码" min-width="150" />
      <el-table-column label="状态" min-width="120">
        <template slot-scope="{ row }">
          <el-tag :type="STATUS_MAP[row.status] ? STATUS_MAP[row.status].type : 'info'">
            {{ STATUS_MAP[row.status] ? STATUS_MAP[row.status].text : row.status }}
          </el-tag>
          <el-switch
            v-model="row.status"
            :active-value="RoleStatusEnum.Active"
            :inactive-value="RoleStatusEnum.Inactive"
            style="margin-left: 8px"
            @change="(val) => onToggleStatus(val, row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="用户数量" min-width="100">
        <template slot-scope="{ row }">
          {{ row.userCount !== -1 ? `${row.userCount} 人` : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="180" sortable />
      <el-table-column prop="updateTime" label="更新时间" min-width="180" sortable />
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-view" @click="onView(row)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" @click="onEdit(row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click="confirmDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />

    <!-- 查看角色对话框 -->
    <el-dialog
      :title="`角色详情 - ${currentRecord ? currentRecord.name : ''}`"
      :visible.sync="viewModalVisible"
      width="700px"
    >
      <el-descriptions v-if="currentRecord" :column="2" border>
        <el-descriptions-item label="角色编码">{{ currentRecord.code }}</el-descriptions-item>
        <el-descriptions-item label="角色名称">{{ currentRecord.name }}</el-descriptions-item>
        <el-descriptions-item label="角色状态">
          <el-tag :type="STATUS_MAP[currentRecord.status] ? STATUS_MAP[currentRecord.status].type : 'info'">
            {{ STATUS_MAP[currentRecord.status] ? STATUS_MAP[currentRecord.status].text : currentRecord.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用户数量">
          {{ currentRecord.userCount !== -1 ? `${currentRecord.userCount} 人` : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentRecord.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ currentRecord.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="角色描述" :span="2">{{ currentRecord.description }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button @click="viewModalVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      :title="currentRecord ? `编辑角色 - ${currentRecord.name}` : '新增角色'"
      :visible.sync="editModalVisible"
      width="600px"
      @closed="onEditDialogClosed"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="editForm.code"
            placeholder="请输入角色编码（如：admin）"
            :disabled="!!currentRecord"
          />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option
              v-for="(config, key) in STATUS_MAP"
              :key="key"
              :label="config.text"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" @click="onEditSave">保存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 枚举
import { RoleStatusEnum, STATUS_MAP } from '@/enums/role.enum';

// 数据服务
import roleService from '@/services/roleService';
import userService from '@/services/userService';

export default {
  name: 'Role',

  /**
   * 组件数据模型
   * @property {Object} STATUS_MAP - 状态映射（用于展示标签）
   * @property {Object} RoleStatusEnum - 角色状态枚举（用于开关）
   * @property {Array} dataSource - 当前页的角色列表
   * @property {number} total - 角色总数
   * @property {boolean} loading - 表格加载状态
   * @property {string} searchText - 搜索框内容（名称或编码）
   * @property {string} roleStatus - 筛选的角色状态
   * @property {number} currentPage - 当前页码
   * @property {number} pageSize - 每页条数
   * @property {boolean} viewModalVisible - 查看对话框显隐
   * @property {boolean} editModalVisible - 编辑/新增对话框显隐
   * @property {Object|null} currentRecord - 当前操作的角色记录（为 null 表示新增）
   * @property {Object} editForm - 编辑/新增表单的数据
   * @property {Object} editFormRules - 编辑/新增表单的验证规则
   */
  data() {
    return {
      STATUS_MAP,
      RoleStatusEnum,
      dataSource: [],
      total: 0,
      loading: true,
      searchText: '',
      roleStatus: '',
      currentPage: 1,
      pageSize: 10,
      viewModalVisible: false,
      editModalVisible: false,
      currentRecord: null,
      editForm: {
        name: '',
        code: '',
        status: RoleStatusEnum.Active,
        description: '',
      },
      editFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '编码只能包含字母、数字和下划线，且不能以数字开头', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择角色状态', trigger: 'change' }],
      },
    };
  },

  /**
   * 组件挂载钩子：初始化加载角色数据
   */
  mounted() {
    // 路由参数
    const status = this.$route.query.status;
    if (status) {
      this.roleStatus = status;
    }
    this.loadData();
  },

  methods: {
    /**
     * 加载角色数据（分页 + 筛选）
     * @param {Object} [params] - 可选参数，可覆盖当前分页/搜索/状态
     * @param {number} [params.currentPage] - 当前页
     * @param {number} [params.pageSize] - 每页条数
     * @param {string} [params.searchText] - 搜索文本
     * @param {string} [params.status] - 角色状态
     */
    async loadData(params) {
      this.loading = true;
      try {
        const queryParams = {
          currentPage: params && 'currentPage' in params ? params.currentPage : this.currentPage,
          pageSize: params && 'pageSize' in params ? params.pageSize : this.pageSize,
          searchText: params && 'searchText' in params ? params.searchText : this.searchText,
          status: params && 'status' in params ? params.status : this.roleStatus,
        };

        // 并行请求角色分页数据和所有用户数据
        const [rolesResult, usersResult] = await Promise.allSettled([
          roleService.getRolesByPage(queryParams),
          userService.getAllUsers(),
        ]);

        let roles = [];
        let users = [];

        if (rolesResult.status === 'fulfilled' && rolesResult.value) {
          const { code, data, msg } = rolesResult.value;
          if (code === 200 && data) {
            roles = data.list;
            this.total = data.total;
          } else {
            throw new Error(msg || '获取角色列表失败');
          }
        } else {
          throw new Error('获取角色列表失败');
        }

        if (usersResult.status === 'fulfilled' && usersResult.value) {
          const { code, data, msg } = usersResult.value;
          if (code === 200 && data) {
            users = data;
          } else {
            console.error('加载用户数据选项失败:', msg);
          }
        } else {
          console.error('加载用户数据选项失败');
        }

        // 计算每个角色的用户数量（根据 roleName 匹配）
        this.dataSource = roles.map((role) => ({
          ...role,
          userCount: users.length > 0 ? users.filter((user) => user.roleName === role.name).length : -1,
        }));
      } catch (error) {
        console.error('加载角色数据失败:', error);
        this.$message.error(`加载角色数据失败: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 搜索输入框内容变化时重置到第一页（用于后续搜索）
     */
    onSearchInput() {
      this.currentPage = 1;
    },

    /**
     * 状态下拉变更时重置到第一页
     */
    onStatusSelectChange() {
      this.currentPage = 1;
    },

    /**
     * 打开查看角色详情对话框
     * @param {Object} record - 要查看的角色记录
     */
    onView(record) {
      this.currentRecord = record;
      this.viewModalVisible = true;
    },

    /**
     * 打开编辑角色对话框，并填充当前记录的数据
     * @param {Object} record - 要编辑的角色记录
     */
    onEdit(record) {
      this.currentRecord = record;
      this.editForm = {
        name: record.name,
        code: record.code,
        status: record.status,
        description: record.description,
      };
      this.editModalVisible = true;
    },

    /**
     * 打开新增角色对话框，重置表单
     */
    onAdd() {
      this.currentRecord = null;
      this.editForm = {
        name: '',
        code: '',
        status: RoleStatusEnum.Active,
        description: '',
      };
      this.editModalVisible = true;
    },

    /**
     * 编辑/新增对话框关闭后的回调：重置表单验证状态
     */
    onEditDialogClosed() {
      if (this.$refs.editForm) {
        this.$refs.editForm.resetFields();
      }
    },

    /**
     * 确认删除角色（弹出二次确认框）
     * @param {Object} record - 要删除的角色记录
     * @param {number|string} record.id - 角色ID
     * @param {string} record.name - 角色名称
     */
    confirmDelete(record) {
      this.$confirm(
        `确定要删除角色 ${record.name} 吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        try {
          const { code, msg } = await roleService.deleteRole(record.id);
          if (code === 200) {
            const totalPages = Math.ceil((this.total - 1) / this.pageSize);
            if (this.currentPage > totalPages && totalPages > 0) {
              this.currentPage = totalPages;
              this.loadData({ currentPage: this.currentPage });
            } else {
              this.loadData();
            }
            this.$message.success(`删除角色：${record.name} 成功`);
          } else {
            throw new Error(msg);
          }
        } catch (error) {
          console.error('删除失败:', error);
          this.$message.error(`删除角色失败: ${error.message}`);
        }
      }).catch(() => {});
    },

    /**
     * 保存编辑或新增的角色数据
     * 若 currentRecord 存在则更新，否则新增
     */
    async onEditSave() {
      try {
        await this.$refs.editForm.validate();
        const params = {
          name: this.editForm.name,
          code: this.editForm.code,
          status: this.editForm.status,
          description: this.editForm.description,
        };

        if (this.currentRecord) {
          params.id = this.currentRecord.id;
        }
        const { code, msg } = await roleService.updateRole(params);
        if (code === 200) {
          this.loadData();
          this.editModalVisible = false;
          this.$message.success(`角色 ${params.name} ${params.id === -1 ? '创建' : '更新'}成功`);
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error('保存角色失败:', error);
        this.$message.error(`保存角色失败: ${error.message}`);
      }
    },

    /**
     * 切换角色状态（开关事件）
     * @param {string|number} val - 新状态值（Active 或 Inactive）
     * @param {Object} record - 当前行角色记录
     */
    async onToggleStatus(val, record) {
      try {
        const updatedRecord = {
          ...record,
          status: val,
        };
        await roleService.updateRole(updatedRecord);
        await this.loadData();
      } catch (error) {
        console.error('状态切换失败:', error);
        this.$message.error(`状态切换失败: ${error.message}`);
      }
    },

    /**
     * 重置所有筛选条件并重新加载数据
     */
    onReset() {
      this.searchText = '';
      this.roleStatus = '';
      this.currentPage = 1;
      this.loadData({ searchText: '', status: '', currentPage: 1 });
    },

    /**
     * 点击搜索按钮：重置到第一页并执行查询
     */
    onSearch() {
      this.currentPage = 1;
      this.loadData({ currentPage: 1 });
    },

    /**
     * 分页页码变更
     * @param {number} page - 新页码
     */
    onPageChange(page) {
      this.currentPage = page;
      this.loadData({ currentPage: page });
    },

    /**
     * 每页条数变更
     * @param {number} size - 新的每页条数
     */
    onSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.loadData({ currentPage: 1, pageSize: size });
    },
  },
};
</script>
