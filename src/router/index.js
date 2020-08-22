import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import login from '../views/login/index'

Vue.use(Router);

// 重复访问路由时
const routepush = Router.prototype.push;

// 修改push方法
Router.prototype.push = function(path){
  return routepush.call(this,path).catch(err=>{});
};

export default new Router({
  //{path: '/Home', name: 'Home', component:() => import('@/views/login/index')},
  routes: [
    {path: '/', name: 'login', component: login},
    {
      path: '/Home', name: 'Home', component:Home,
      children:[
        {path:'/UserInfo',name:'UserInfo',component:() => import('@/views/User/UserInfo')},
      ]
    },
  ]
})
