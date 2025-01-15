import Vue from 'vue';
import Router from 'vue-router';

import Login from '../pages/core/Login.vue';
import Error from '../pages/core/Error.vue';
import LineProcessOrder from '@/pages/LineProcessOrder.vue';
import ReportOee from '@/pages/Report/ReportOee.vue'
import UploadStd from '@/pages/Upload/UploadStd.vue'
import UploadProblemReason from '@/pages/Upload/UploadProblemReason.vue'
import { isTokenNearExpiration, RenewToken } from '@/services/apiService.js';

Vue.use(Router);


  const routes = [
    {
      path: '/UploadStd',
      name: 'UploadStd',
      component: UploadStd,
      meta: {
        breadcrumb: [
          { name: 'Upload Speed Standard', allowAnonymous: false }
        ]
      }
    },
    {
      path: '/ReportOee',
      name: 'ReportOee',
      component: ReportOee,
      meta: {
        breadcrumb: [
          { name: 'Report OEE', allowAnonymous: false }
        ]
      }
    },
    {
      path: '/LineProcessOrder',
      name: 'LineProcessOrder',
      component: LineProcessOrder,
      meta: {
        breadcrumb: [
          { name: 'Line Process Order', allowAnonymous: false }
        ]
      }
    },
    {
      path: '/UploadProblemReason',
      name: 'UploadProblemReason',
      component: UploadProblemReason,
      meta: {
        breadcrumb: [
          { name: 'Problem & Reason', allowAnonymous: false }
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

  const router = new Router({ routes });

router.beforeEach(async (to, from, next) => {
  try {
    if (!to.meta.allowAnonymous) {
      const refreshToken = localStorage.getItem('refreshTokenOee');
      if (!refreshToken) {
        console.warn('No refresh token found. Redirecting to login.');
        return next({ path: '/' });
      }

      if (isTokenNearExpiration()) {
        await RenewToken(refreshToken);
      }
    }
    next();
  } catch (error) {
    console.error('Error during token renewal:', error);
    localStorage.removeItem('accessTokenOee');
    localStorage.removeItem('refreshTokenOee');
    next({ path: '/' });
  }
});

export default router;