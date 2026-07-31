export default [
  {
    path: '/',
    title: '首页',
  },

  {
    path: 'new-menu',
    title: '新系统页面',
    children: [
      {
        path: '/new-menu/order',
        title: '订单管理',
      },

      {
        path: '/new-menu/product',
        title: '产品管理',
      },
    ],
  },

  {
    path: 'legacy',
    title: '旧系统页面',
    children: [
      {
        path: '/legacy/user',
        title: '用户管理',
      },

      {
        path: '/legacy/role',
        title: '角色管理',
      },
    ],
  },
];
