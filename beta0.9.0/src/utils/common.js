/**
 * Created by wangjunfei on 2017/2/7.
 */
import APPSDK from './app-sdk'
import WXSDK from './weixin-jssdk'

// 路径配置相关
export const appUrl = '/geminirest'// 后台服务root
export const siteUrl = '/geminirest/api/m'// 后台服务root
export const htmlUrl = '/geminihtml'// 前端服务root
export const fileserver = '/geminifs'// 文件服务名
export const pathConfig = {
  ATTACH_VIEW: `${htmlUrl}/module/attach.html`
}
export const conUrl = location.href.split('/module')[0]

// 无图片时显示默认图片
export const imageNotFoudData = 'http://171.34.169.249:8100/fileserver_install/none.jpg '

export const getLocationSearch = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const s = window.location.search.substr(1).match(reg)
  if (s != null) {
    return unescape(s[2])
  }
  return null
}

export const getTimeStamp = (dateStr) => {
  const timeStamp = Date.parse(dateStr.replace(/-/gi, '/'))
  const now = new Date().getTime()
  const diffValue = now - timeStamp
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const monthc = diffValue / month
  const weekc = diffValue / (7 * day)
  const dayc = diffValue / day
  const hourc = diffValue / hour
  const minc = diffValue / minute
  let result
  if (monthc >= 1) {
    result = `${parseInt(monthc, 0)}个月前`
  } else if (weekc >= 1) {
    result = `${parseInt(weekc, 0)}周前`
  } else if (dayc >= 1) {
    result = `${parseInt(dayc, 0)}天前`
  } else if (hourc >= 1) {
    result = `${parseInt(hourc, 0)}小时前`
  } else if (minc >= 1) {
    result = `${parseInt(minc, 0)}分钟前`
  } else {
    result = '刚刚发表'
  }
  return result
}

const getGsafety = (projectType) => {
  if (projectType === 'app') {
    return APPSDK
  } else if (projectType === 'mini') {
    return WXSDK
  }
  return APPSDK
}
export { getGsafety }

const pageUtils = { // 页面工具对象
  // 获取url问号后面的值
  GetRequest() {
    const url = decodeURI(location.hash) // 获取url中"？"符后的字串
    const theRequest = {}
    if (url.indexOf('?') !== -1) {
      const Index = url.indexOf('?') + 1
      const str = url.substr(Index)
      const strs = str.split('&')
      const strsVals = Object.values(strs)
      strsVals.forEach((value) => {
        theRequest[value.split('=')[0]] = unescape(value.split('=')[1])
      })
    }
    return theRequest
  },
  // 获取cookie
  getCookie(name) {
    let arr
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`)
    if (document.cookie.match(reg)) {
      arr = document.cookie.match(reg)
      return (arr[2])
    }
    return null
  },
// cookie 存入
  setCookie(name, value) {
    document.cookie = `${name}=${escape(value)};path=/;`
  },
  //  cookie 删除
  delCookie(name, getCookie) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    if (getCookie !== null) {
      document.cookie = `${name}=${getCookie};expires=${exp.toGMTString()}`
    }
  },
  // 确定导航tab页，是obj否show nav
  showNav(path) {
    switch (path) {
      case '/':
        return true
      default:
        return false
    }
  },
//  本地缓存localStorage的存储，设置，删除
  setlocalStorage(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj))
  },
//  获取值
  getlocalStorage(name) {
    const data = JSON.parse(localStorage.getItem(name))
    return data
  },
//  删除值
  deletlocalStorage(name) {
    localStorage.removeItem(name)
  },
  encodeUnicode(str) {
    const res = []
    for (let i = 0; i < str.length; i++) {
      res[i] = (`00${str.charCodeAt(i).toString(16)}`).slice(-4)
    }
    const back = `\\u${res.join('\\u')}`
    return back
  },
//  特殊字符处理 全角的范围FF21-FFEF  \uff20 tounicode()
  specialTrans(str) {
  //  获取当前字符的unicode编码
    const transCode = this.encodeUnicode(str)
    // \u0 000 从第4个开始比较
    if (str === ' ' || !str) {
      return ''
    }
    // 从 \u 开始逐个判断
    const chartS = transCode.charCodeAt(2)
    const chartT = transCode.charCodeAt(3)
    const chartFO = transCode.charCodeAt(4)
    // 第四个编码大于或等于f的时候，就是特殊字符，不可能大于。
    if (chartT >= 'f'.charCodeAt(0)
      && chartS >= 'f'.charCodeAt(0)
      && chartFO >= '2'.charCodeAt(0)) {
      console.log('大于')
      return ''
    }
    return str
  },
//  遍历当前的字符串，删除特殊字符
  delectSpecial(str) {
    if (!str) {
      return false
    }
    let back = ''
    const strArr = str.split('')
    strArr.forEach((val) => {
      back += this.specialTrans(val)
    })
    return back
  }
}
export { pageUtils }

// // 手机回退按钮
// ((g) => {
//   if (typeof COMM_APP === 'undefined') {
//     return
//   }
//   COMM_APP.onBackClick = () => {
//     const cb = g.onBackclick
//     if (typeof cb === 'function') {
//       cb()
//     } else {
//       g.closeWindow()
//     }
//   }
// })($gsafety)

// // 非VUE页面js的ajax方法
// let $ajax = (()=>{
//   let xhr = new XMLHttpRequest();
//   return {
//     get:(url,successFn,errorFn,aysc)=>{
//       "use strict";
//       aysc=aysc?aysc:false;
//       xhr.onreadystatechange = ()=>{
//         if(xhr.readyState==4){
//           if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
//             console.log(xhr.responseText)
//             successFn(xhr.responseText)
//           }else{
//             errorFn(xhr)
//           }
//         }
//       }
//       xhr.open("get",url,aysc)
//       xhr.send(null)
//     },
//     post:(url,data,successFn,errorFn,aysc)=>{
//       "use strict";
//       aysc=aysc?aysc:false;
//       xhr.onreadystatechange = ()=>{
//         if(xhr.readyState==4){
//           if((xhr.status>=200&&xhr.status<300)||xhr.status==304){
//             successFn(xhr.responseText)
//           }else{
//             errorFn(xhr)
//           }
//         }
//       }
//       xhr.open("post",url,aysc)
//       xhr.send(data)
//     }
//   }
// })()
//
// export {$ajax}


/* 和地图iframe通信控制器 */
/*
* frameId--地图的iframe的ID
* */
const messageController = (frameId) => {
  const frame = frameId ? document.getElementById(frameId) : document.getElementsByTagName('iframe')[0]
  let iframeLoaded = false // iframe是否加载完毕
  let loaded = false
  frame.onload = function () {
    iframeLoaded = true
    window.addEventListener('message', (e) => {
      const msgObj = e.data
      if (msgObj.type) {
        switch (msgObj.type) {
          case 'mapLoaded': // 选中地图上标记的点
            loaded = true
            break
          default:
            break
        }
      }
    })
  }
  return {
    /*
     * type--操作地图的类型  addPoint/centerPoint
     * objList--坐标集
     * */
    sendMessage: (type, objList, callback) => {
      const that = this
      const msg = { type, data: objList }
      if (!iframeLoaded) {
        frame.onload = function () {
          iframeLoaded = true
          window.addEventListener('message', (e) => {
            const msgObj = e.data
            if (msgObj.type) {
              switch (msgObj.type) {
                case 'mapLoaded': // 选中地图上标记的点
                  loaded = true
                  frame.contentWindow.postMessage(msg, '*')
                  if (typeof callback === 'function') {
                    callback()
                  }
                  break
                default:
                  break
              }
            }
          })
        }
      } else if (!loaded) {
        setTimeout(() => {
          that.sendMessage(type, objList, callback)
        }, 500)
      } else {
        frame.contentWindow.postMessage(msg, '*')
        if (typeof callback === 'function') {
          callback()
        }
      }
    },
    receiveMessage: (type, callback) => {
      window.addEventListener('message', (e) => {
        const msgObj = e.data
        if (msgObj.type) {
          switch (msgObj.type) {
            case type:// 选中地图上标记的点
              callback(msgObj.data)
              break
            default:
              break
          }
        }
      })
    }
  }
}
export { messageController }


// 历史搜索数据
/*
 * type--自定义数据类型  如:law--法律法规
 * strHistory--搜索关键字
 * */
export const searchHistoryController = (() => ({
  arrayname: 'array', // 数组名称常量
  /*
   * 查找一个缓存块，如果没有则创建一个新的并返回
   */
  getCacheBlock(index, max) {
    let dataJson = window.localStorage.getItem(index)
    if (dataJson) {
      console.debug(`find block:${index},data:${dataJson}`)
    } else {
      const data = { array: [], max: max || 5 }
      dataJson = JSON.stringify(data)
      window.localStorage.setItem(index, dataJson)
      console.debug(`create new block:${index},data:${dataJson}`)
    }
    return JSON.parse(dataJson)
  },
  /*
   * 自定义JSON字符串 例：{type:'indexhistory',data:'我的',pageUrl:"/matstroage.html/#",....}
   * 约定所有模块搜索历史记录 type 为‘indexhistory’，模块单个搜索关键字为模块加History，
   * 例如避难场所type为‘resasylumareaptHistory’
   * */
  addPageHistory(dataObj) {
    // 获取存储对象
    const index = dataObj.type
    if (!dataObj.keyword) {
      dataObj.keyword = dataObj.pageUrl
    }

    const val = dataObj.keyword
    console.debug(`add item:${index},value:${val}`)
    const indexhistory = this.getCacheBlock(index)

    // 判断数组长度，比较对象是否重复
    const array = indexhistory[this.arrayname]
    const p = this.containsItem(index, dataObj)
    // 如果是已有元素，删除指定元素元素
    if (p > -1) {
      array.splice(p, 1)
    }
    array.push(dataObj)

    // 如果制定元素大于特定长度，则移除第一个数据
    if (array.length > indexhistory.max) {
      array.splice(0, 1)
    }

    window.localStorage.setItem(index, JSON.stringify(indexhistory))
  },
//     /*
//      *
//      */
  getPageHistory(index) {
    const indexhistory = this.getCacheBlock(index)
    return indexhistory[this.arrayname].reverse()
  },
//     /*
//      *
//      */
  containsItem(index, dataObj) {
    const indexhistory = this.getCacheBlock(index)
    const array = indexhistory[this.arrayname]
    for (const tmp in array) {
      if (dataObj.keyword === array[tmp].keyword) {
        return tmp
      }
    }
    return -1
  },
  deleteHistory(key) {
    window.localStorage.removeItem(key)
  }
}))()

/*
* APP端控制页面的全局对象
* */
export const pageController = (() => ({
  initOffline(cb) {
    window.offline = (offlineStatus) => { // APP切换在线离线的时候调用
      if (typeof cb === 'function') {
        cb(offlineStatus)
      }
    }
  }
}))()

