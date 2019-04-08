import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Dashboard from '@/components/Dashboard'
import LOGIN from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import CustomerList from '@/components/pages/CustomerList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*', //如頁面不存在，導到redirect 指定頁面
      redirect: '/'
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta: { requiresAuth: true } //true 為此頁需要驗證
    // },
    {
      path: '/login',
      name: 'Login',
      component: LOGIN
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children:[
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true }, //true 為此頁需要驗證
        }
      ],
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer_list',
          name: 'CustomerList',
          component: CustomerList,
        }
      ],
    },
  ]
})
