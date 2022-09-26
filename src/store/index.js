import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import createPersistedstate from 'vuex-persistedstate' // 持久化

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  plugins: [createPersistedstate({
    paths: ['user.token'] // 缓存模块或者模里面的字段
  })]
})

export default store
