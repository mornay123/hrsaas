import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    }
  },
  actions: {
    async loginAction({ commit }, res) {
      const data = await login(res) // 拦截器把请求回复信息解构了
      // console.log(data)
      commit('setToken', data)
    }
  }
}
