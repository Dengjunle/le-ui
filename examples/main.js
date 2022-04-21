import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 导入组件库
import ljtui from '../packages/src'
// 注册组件库
Vue.use(ljtui)


new Vue({
  render: h => h(App),
}).$mount('#app')
