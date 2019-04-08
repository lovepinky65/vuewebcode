// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios'; //axios
import VueAxios from 'vue-axios'; //axios
import 'bootstrap'; //bootstrap
import Loading from 'vue-loading-overlay'; //loading
import 'vue-loading-overlay/dist/vue-loading.css'; //loading

import App from './App';
import router from './router';
import './bus'; //Alert
import currencyFilter from './filters/currency'; //filter千分號




Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.component('Loading', Loading);//loading使用
Vue.filter('currency', currencyFilter);//filter千分號使用 Vue.filter('自訂名稱', 上方import名稱);

axios.defaults.withCredentials = true;//指示跨站點是否訪問控制請求


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 導航守衛判斷是否有登入
router.beforeEach((to, from, next) => {
  // 判斷頁面是否有要驗證
  if (to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      if (response.data.success){
        next();
      }else{
        next({
          path: '/login',
        })
      }      
    })
  }else{
    next();
  }
})
