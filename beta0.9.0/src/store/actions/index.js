/**
 * Created by wangjunfei on 2018/1/10.
 */
// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。

import axios from 'axios'
import config from '../../config'


function getEventType(cb) { // 从服务端请求获取事件类型
  axios.get(`${config.siteUrl}/eventInfo/list/eventTypeList`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(JSON.parse(res.data.response))
      }
    }
  })
}

function setUser(cb) { // 从服务端请求获取当前用户
  axios.post(`${config.siteUrl}/basedata/user/getUser`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(res.data.response)
      }
    }
  })
}

function setAllUser(cb) { // 从服务端请求获取所有用户
  axios.get(`${config.siteUrl}/basedata/user/findAllUser`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(res.data.response)
      }
    }
  })
}

function setGroupLeader(cb) { // 从服务端请求获取领导
  axios.get(`${config.siteUrl}/eventInfo/get-leader?leaderType=1`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(res.data.response)
      }
    }
  })
}

function setCityLeader(cb) { // 从服务端请求获取当前用户
  axios.get(`${config.siteUrl}/eventInfo/get-leader?leaderType=2`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(res.data.response)
      }
    }
  })
}

// 获取用户文字模板
function getTextTemplate(cb) {
  axios.get(`${config.siteUrl}/eventdispose/loadTemplate`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(res.data.response)
      }
    }
  })
}

function getOrgList(cb) { // 从服务端请求有系统用户的机构
  axios.get(`${config.siteUrl}/basedata/org/listValidOrg`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(res.data.response)
      }
    }
  })
}

function getOrgUserLeaderGroup(cb) { // 从服务端请求获取领导分组
  axios.get(`${config.siteUrl}/basedata/orguser/getorguserleadergroup`).then((res) => {
    if (res.data && res.data.response) {
      if (typeof cb === 'function') {
        cb(JSON.parse(res.data.response))
      }
    }
  })
}

async function getNeteaseUser(user, cb) { // 获取云信ID绑定到持久层user里面
  const URL = '/yunxinuser/' // 获取云信用户信息的url
  if (user.id) {
    const yunxinInfo = await axios.get(`${config.serverUrl}${URL}${user.id}`)
    cb(yunxinInfo.data.response)
  } else {
    setUser(async (res) => {
      console.log(res.id)
      const yunxinInfo = await axios.get(`${config.serverUrl}${URL}${user.id}`) // 获取云信用户信息
      cb(yunxinInfo.data.response)
    })
  }
}

export default {
  // 获取文字模板
  getTextTemplate({ commit }) {
    getTextTemplate((res) => {
      commit('setTextTemplate', res)
    })
  },
  setUser({ commit }) {
    setUser((user) => {
      commit('setUser', user)
      // getNeteaseUser(user, (neteaseUser) => {
      //   commit('setUser', {
      //     neteaseUserId: neteaseUser.accid,
      //     neteaseToken: neteaseUser.token
      //   })
      // })
    })
  },
  setAllUser({ commit }) {
    setAllUser((res) => {
      commit('setAllUser', res)
    })
  },
  refreshNeteaseUser({ state, commit }) { // 重新根据当前用户ID获取云信信息绑定到User对象
    return new Promise((resolve) => {
      getNeteaseUser(state.user, (neteaseUser) => { // res为云信用户对象
        commit('setUser', {
          neteaseUserId: neteaseUser.accid,
          neteaseToken: neteaseUser.token
        })
        resolve(neteaseUser)
      })
    })
  },
  setGroupLeader({ commit }) {
    setGroupLeader((res) => {
      commit('setGroupLeader', res)
    })
  },
  setCityLeader({ commit }) {
    setCityLeader((res) => {
      commit('setCityLeader', res)
    })
  },
  updateEventType({ commit }) { // 修改事件类型
    getEventType((res) => {
      commit('updateEventType', res)
    })
  },
  updateOrgUserLeaderGroup({ commit }) { // 获取领导分组
    getOrgUserLeaderGroup((res) => {
      commit('updateOrgUserLeaderGroup', res)
    })
  },
  showPageLoading({ commit }) {
    commit('showPageLoading')
  },
  hidePageLoading({ commit }) {
    commit('hidePageLoading')
  },
  setOrgList({ commit }) {
    getOrgList((res) => {
      commit('setOrgList', res)
    })
  },
  initChart({ state, commit }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!state.echarts) {
          const echarts = require('echarts')
          commit('initECharts', echarts)
        }
        resolve(state.echarts)
      }, 50)
    })
  }
}
