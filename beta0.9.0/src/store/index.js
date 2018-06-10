/**
 * Created by wangjunfei on 2018/1/6.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import state from './state'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 内存数据，组件可通过this.$store.state.获得数据
  state,
  // 唯一拥有更改store内存数据的接口，不可进行异步操作
  mutations,
  // 与mutations通讯，组件写入内存数据的接口，可以异步操作
  actions,
  plugins: []
})

export default store
