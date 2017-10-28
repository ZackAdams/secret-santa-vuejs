import Vue from 'vue'
import Router from 'vue-router'
import NewNameList from '@/components/NewNameList'
import NameList from '@/components/NameList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NewNameList',
      component: NewNameList
    },
    {
      path: '/list/:listKey',
      name: 'NameList',
      component: NameList,
      props: true
    }
  ]
})
