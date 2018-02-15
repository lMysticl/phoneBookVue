import Vue from 'vue'
import Router from 'vue-router'
import test from '@/pages/test'
import store from '../store'
import tokenservice from '@/services/token'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/test',
      component: test,
      meta: {
        requireAuth: true,
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  let isAuth = store.getters.isAuth;

  if (tokenservice.isTokenExpired()) {
    tokenservice.deleteToken();
    store.commit('setAuth', false)
  } else {
     store.commit('setAuth', true);
    next()
  }

  isAuth = store.getters.isAuth;

  if (!isAuth && requireAuth) {
    next('/')
  }  else {
    next()
  }
});
export default router
