// 常量
import { DATABASE_NAME } from '@/consts/mockDB';

const userMapper = new window.mockDB.mapper.DatabaseMapper(
  DATABASE_NAME,
  window.mockDB.storeNames.USER_STORE_NAME
);

export default new window.mockDB.services.UserService({
  userMapper,
  init: async () => {
    // 初始化用户表数据
    const userCount = await userMapper.count();
    if (userCount === 0) {
      console.log('用户表为空，开始初始化...');
      const users = window.mockDB.data.users;
      await userMapper.insertBatch(users);
    }
  },
});
