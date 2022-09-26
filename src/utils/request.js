import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
service.interceptors.response.use(response => {
  try {
    const { message, success, data } = response.data
    // 1.接口成功，业务逻辑成功
    if (success) {
      return data // 此处已经把token解构出来了
    }
    // 2.接口成功，业务逻辑不成功
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message)) // 抛出错误，通过new Error把message转成promise对象
  } catch (error) {
    // 3.接口不成功
    Message.error(error.message)
    return Promise.reject(error) // error本来就是promise对象
  }
})
export default service
