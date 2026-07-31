export interface Menu {
  type: 'group' | 'menu'; // 菜单类型
  path: string; // 路由路径, 相对路径
  name?: string; // 路由名称
  title?: string; // 菜单标题
  closeable?: boolean; // 是否可关闭
  cache?: boolean; // 是否缓存
  children?: Menu[]; // 子菜单
};
