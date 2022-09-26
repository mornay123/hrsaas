import { login, getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async loginAction({ commit }, res) {
      const data = await login(res) // 拦截器把请求回复信息解构了
      // console.log(data)
      commit('setToken', data)
    },
    async getUserInfo({ commit }) {
      const data = await getUserInfo()
      const res1 = await getUserDetailById(data.userId)
      const result = { ...data, ...res1 }
      commit('setUserInfo', result)
      return JSON.parse(JSON.stringify(result))
    }
  }
}
