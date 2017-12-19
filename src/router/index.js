import Vue from 'vue'
import Router from 'vue-router'

const Desktop = () => import('@/components/Desktop')
const Mobile = () => import('@/components/Mobile')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Desktop',
      component: Desktop
    },
    {
      path: '/Remote',
      name: 'Mobile',
      component: Mobile
    }
  ]
})
