import Vue from 'vue';
import Router from 'vue-router';

import Login from '../pages/core/Login.vue';
import Error from '../pages/core/Error.vue';
import PayinForm from '../pages/PayinForm.vue'
import MachineProcessOrder from '../pages/OeePage/MachineProcessOrder.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/MachineProcessOrder',
      name: 'MachineProcessOrder',
      component: MachineProcessOrder,
      meta: {
        breadcrumb: [
          { name: 'Machine Process Order' }
        ]
      }
    },
    {
      path: '/PayinForm',
      name: 'PayinForm',
      component: PayinForm,
      meta: {
        breadcrumb: [
          { name: 'Payin Form' }
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
