// 导入组件，组件必须声明 name
import LeManySlider from './src'
// 为组件提供 install 安装方法，供按需引入
LeManySlider.install = function (Vue) {
  Vue.component(LeManySlider.name, LeManySlider)
}
// 导出组件
export default LeManySlider