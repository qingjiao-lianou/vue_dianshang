// 引入vue
import Vue from 'vue'
// 引入路由插件
import VueRouter from 'vue-router'
// 引入组件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Reports from '@/views/reports.vue'
import Welcome from '@/views/welcome.vue'
import Uers from '@/views/uers/uers.vue'
import Rightlist from '@/views/rights/rightlist.vue'
import Rolelist from '@/views/rights/rolelist.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'

// 使用路由插件
Vue.use(VueRouter)

// 创建一个路由对象
export default new VueRouter({
  routes: [
    //   设置重定向
    {
      name: '',
      path: '/',
      redirect: { name: 'login' }

    },

    {
      name: 'login',
      path: '/login',
      component: Login

    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports
        },
        {
          name: 'users',
          path: 'users',
          component: Uers
        },

        {
          name: 'rights',
          path: 'rights',
          component: Rightlist
        },

        {
          name: 'roles',
          path: 'roles',
          component: Rolelist
        },
        {
          name: 'goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'list' },
          children: [
            {
              name: 'list',
              path: 'list',
              component: List
            },
            {
              name: 'add',
              path: 'add',
              component: Add
            }
          ]
        }
      ]

    }
  ]
})
