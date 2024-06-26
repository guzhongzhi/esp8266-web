// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import axios from 'axios'
import moment from 'moment';
import VConsole from 'vconsole';

moment.locale('zh-cn');

Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;
Vue.use(ViewUI, {
  transfer: true,
});

new VConsole();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
