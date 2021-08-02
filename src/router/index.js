import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/Index'
import Users from '@/view/Users'

Vue.use(Router);

var router = new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path:"/users",
      name:"users",
      component: Users
    }
  ]
});
router.beforeEach((to, from, next) => {
  window.pageHistory.push(from);
  next();
});

export default router
