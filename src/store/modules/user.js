import { login, getUserInfo, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: null,
    userInfo: {},
    hrsaasTime: 0
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
    },
    removeToken(state) {
      state.token = null
    },
    setHesaasTime(state, hrsaasTime) {
      state.hrsaasTime = hrsaasTime
    }
  },
  actions: {
    async loginAction({ commit }, res) {
      const data = await login(res) // 拦截器把请求回复信息解构了
      // console.log(data)
      commit('setToken', data)
      commit('setHesaasTime', new Date().getTime())
    },
    async getUserInfo({ commit }) {
      const data = await getUserInfo()
      const res1 = await getUserDetailById(data.userId)
      const result = { ...data, ...res1 }
      commit('setUserInfo', result)
      return JSON.parse(JSON.stringify(result))
    },
    logout({ commit }) {
      // 退出登录清除token和用户信息
      commit('removeUserInfo')
      commit('removeToken')
    }
  }
}
