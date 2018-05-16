import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login.vue';
import BackStage from '@/views/Backstage';
import Upload from '@/views/Upload';
import Management from '@/views/Management';
import Sites from '@/views/Sites';
import Keys from '@/views/Keys';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/sites'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/sites',
      name: 'Sites',
      component: Sites
    },
    {
      path: '/backstage',
      name: 'BackStage',
      redirect: '/backstage/upload',
      component: BackStage,
      children: [
        {
          path: 'upload',
          name: 'Upload',
          component: Upload
        },
        {
          path: 'management',
          name: 'Management',
          component: Management
        },
        {
          path: 'keys',
          name: 'Keys',
          component: Keys
        }
      ]
    }
  ]
});
