import Vue from 'vue'
import Router from 'vue-router'

const Canvas = () => import('@/components/Canvas')
const Remote = () => import('@/components/Remote')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Canvas',
      component: Canvas
    },
    {
      path: '/Remote',
      name: 'Remote',
      component: Remote
    }
  ]
})
