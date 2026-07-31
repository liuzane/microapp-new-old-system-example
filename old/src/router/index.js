import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },

    {
      path: '/',
      name: 'Admin',
      component: () => import('@/layout'),
      children: [
        {
          path: '/user',
          name: 'User',
          component: () => import('@/views/user/index.vue'),
        },

        {
          path: '/role',
          name: 'Role',
          component: () => import('@/views/role/index.vue'),
        },
      ],
    },
  ],
});

export default router;
