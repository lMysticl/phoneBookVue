import Vue from 'vue'
import Router from 'vue-router'
import contactList from '@/pages/contactList'
import welcome from '@/pages/welcome'
import store from '../store'
import tokenservice from '@/services/token'
import userEdit from '@/pages/user-edit'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: welcome
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/contacts',
      component: contactList,
      meta: {
        requireAuth: true,
      }
    },
    {
      path: '/user-edit',
      component: userEdit,
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
