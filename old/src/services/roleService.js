// 常量
import { DATABASE_NAME } from '@/consts/mockDB';

const roleMapper = new window.mockDB.mapper.DatabaseMapper(
  DATABASE_NAME,
  window.mockDB.storeNames.ROLE_STORE_NAME
);

export default new window.mockDB.services.RoleService({
  roleMapper,
  init: async () => {
    // 初始化角色表数据
    const roleCount = await roleMapper.count();
    if (roleCount === 0) {
      console.log('角色表为空，开始初始化...');
      const roles = window.mockDB.data.roles;
      await roleMapper.insertBatch(roles);
    }
  },
});

