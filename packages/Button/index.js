// 导入组件，组件必须声明 name
import LeButton from './src'
// 为组件提供 install 安装方法，供按需引入
LeButton.install = function (Vue) {
  Vue.component(LeButton.name, LeButton)
}
// 导出组件
export default LeButton