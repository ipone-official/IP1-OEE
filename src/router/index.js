import Vue from 'vue';
import Router from 'vue-router';

import Login from '../pages/core/Login.vue';
import Error from '../pages/core/Error.vue';
import LineProcessOrder from '@/pages/LineProcessOrder.vue';
import ReportOee from '@/pages/Report/ReportOee.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/ReportOee',
      name: 'ReportOee',
      component: ReportOee,
      meta: {
        breadcrumb: [
          { name: 'Report OEE' }
        ]
      }
    },
    {
      path: '/LineProcessOrder',
      name: 'LineProcessOrder',
      component: LineProcessOrder,
      meta: {
        breadcrumb: [
          { name: 'Line Process Order' }
        ]
      }
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
        allowAnonymous: true
      }
    },
    {
      path: '/error',
      name: 'Error',
      component: Error,
      meta: {
        allowAnonymous: true
      }
    },
  ]
});
