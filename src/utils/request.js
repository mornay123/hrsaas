import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// 定义时间差，判断时间是否超时
const timeout = 3600 // 秒
function isCheckTimeout() {
  const currentTime = Date.now()
  const timeStamp = (currentTime - store.getters.hrsaasTime) / 1000
  return timeStamp > timeout
}
// 克隆一个axios
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    // 时间超时就清除token和用户信息，退出登录，抛出错误
    if (isCheckTimeout()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    // 如果token存在 注入token
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})
service.interceptors.response.use(
  (response) => {
    const { message, success, data } = response.data
    // 1.接口成功，业务逻辑成功
    if (success) {
      return data // 此处已经把token解构出来了
    }
    // 2.接口成功，业务逻辑不成功
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message)) // 抛出错误，通过new Error把message转成promise对象
  },
  (error) => {
    console.log(error.response)
    //  如果token失效，登录状态失效
    if (error.response.status === 401) {
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('token 超时')
    } else {
      // 3.接口不成功
      Message.error(error.message)
    }
    return Promise.reject(error) // error本来就是promise对象
  }
)
export default service
