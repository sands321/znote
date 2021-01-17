import Vue from 'vue'
import Router from 'vue-router'
import tabs from "@/components/tabs";

Vue.use(Router)

console.log('debug>>'+__dirname);
let router=new Router({
  // /grabd/
  // mode:'hash',
  // history
  mode:'hash',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'tabs',
      component: tabs
    }
  ]
})

router.beforeEach((to, from, next) => {
  //未匹配时-至上级
  if (to.matched.length===0) {  
    from.path?next({path:from.path}):next('/');
  } else {
    next();
  }
});

export default router
