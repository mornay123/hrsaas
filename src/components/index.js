import PageTool from './pageTools'
import * as filters from '@/filters'
const components = [PageTool]
// export default {
//   install: function(Vue) {
//     components.forEach(ele => {
//       console.log(ele)
//       Vue.component(ele.name, ele)
//     })
//   }
// }
// 路径，是否查找子路径，正则
const fn = require.context('./', true, /\.vue$/)
// console.log(fn.keys()) // 路径
// console.log(fn('./pageTools/index.vue')) // 根据路径查找模块
const components1 = fn.keys().map(ele => {
  return fn(ele)
})
// 一次性导入所有模块
export default (Vue) => {
  // 自定义指令
  components1.forEach(ele => {
    // console.log(ele.default.name, ele.default)
    Vue.component(ele.default.name, ele.default)
  })
  // 过滤器
  Object.keys(filters).forEach(key => {
    // console.log(key, filters[key])
    Vue.filter(key, filters[key])
  })
  // 组件
  components.forEach(ele => Vue.component(ele.name, ele))
}
