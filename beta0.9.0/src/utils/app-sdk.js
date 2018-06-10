/**
 * Created by 123 on 2018/3/22.
 * 调用安卓应用的方法
 */
/* global COMM_APP */

import config from '../config'

// 安卓端自带COMM_APP全局变量
const APPSDK = (function () {
  const noticeFn = () => {
    if (typeof COMM_APP === 'undefined') {
      console.warn('请在GsafetyApp中调用接口')
      return false
    }
    return true
  }
  return {
    // 选择一个图片
    chooseImage(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.chooseImageCallback = (res) => {
        const obj = JSON.parse(res)
        callback(obj)
      }
      COMM_APP.chooseImage(JSON.stringify(data))
    },
    // 上传一个图片
    uploadImage(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.uploadImageCallback = (res) => {
        const obj = JSON.parse(res)
        callback(obj)
      }
      COMM_APP.uploadImage(JSON.stringify(data))
    },

    // 选择一个文件
    chooseFile(callback, fileType) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.chooseFileCallback = (res) => {
        const obj = JSON.parse(res)
        callback(obj)
      }
      // 如果在调方法的时候有带过来文件类型则采用带过来的文件类型，否侧采用系统配置的文件类型
      const fileTypeArr = fileType || config.fileType
      const fileTypeObj = { sourceType: fileTypeArr }
      COMM_APP.chooseFile(JSON.stringify(fileTypeObj))
    },
    // 上传一个文件
    uploadFile(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.uploadFileCallback = (res) => {
        const obj = JSON.parse(res)
        console.log(`附件ID${res}`)
        callback(obj)
      }
      COMM_APP.uploadFile(JSON.stringify(data))
    },
    // 打开一个附件
    openFile(data) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.openFile(JSON.stringify(data))
    },

    // 写入缓存
    writeCache(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.writeCacheCallback = (res) => {
        const obj = JSON.parse(res)
        callback(obj)
      }
      COMM_APP.writeCache(JSON.stringify(data))
    },
    // 读取缓存
    readCache(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.readCacheCallback = (res) => {
        const obj = JSON.parse(res)
        callback(obj)
      }
      COMM_APP.readCache(JSON.stringify(data))
    },
    // 设置页面头部右上角的按钮显示以及图标(响应事件调用onMenuClick事件)
    setTitleBar(data) {
      const fn = noticeFn()
      if (!fn) {
        console.warn('setTitleBar data:')
        console.warn(data)
        return
      }
      COMM_APP.setTitleBar(JSON.stringify(data))
    },
    // 打开 intent
    openIntent(intent, data) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.openIntent(intent, JSON.stringify(data))
    },
    // 打开链接
    openWindow(data) {
      const fn = noticeFn()
      if (!fn) {
        location.href = data.url
        return
      }
      if (!data.actionBarType) {
        data.actionBarType = 1
      }
      COMM_APP.openWindow(JSON.stringify(data))
    },
    // 打开带参数链接
    openWindowByParam(url, param) {
      const keys = Object.keys(param)
      const params = []
      keys.forEach((key) => {
        let valueStr
        if (typeof param[key] === 'object') {
          valueStr = JSON.stringify(param[key])
        } else {
          valueStr = param[key]
        }
        params.push(`${key}=${valueStr}`)
      })
      const paramStr = params.join('&')
      const miniUrl = `${url}?${paramStr}`
      const fn = noticeFn()
      if (!fn) {
        location.href = miniUrl
        return
      }
      COMM_APP.openWindow(JSON.stringify({
        url: miniUrl
      }))
    },
    /**
     * 关闭当前activity
     */
    closeWindow(data) {
      let optStr = '{}'
      if (data) {
        optStr = JSON.stringify(data)
      } else {
        console.log(`close window with ${data}`)
      }
      const fn = noticeFn()
      if (!fn) {
        console.log(`please close activity in app, callback data:${optStr}`)
        history.go(-1)// 后退到上一个页面
        return
      }
      if (data) {
        COMM_APP.closeWindow(optStr)
      } else {
        COMM_APP.closeWindow() // 无参时写法
      }
    },
    // 更新设置
    updateSettings(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.updateSettingsCallback = (res) => {
        const obj = JSON.parse(res)
        callback(obj)
      }
      COMM_APP.updateSettings(JSON.stringify(data))
    },
    // 加载设置
    loadSettings(data, callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.loadSettingsCallback = (res) => {
        callback(JSON.parse(res))
      }
      COMM_APP.loadSettings(data)
    },
    // 底部弹窗
    onMenuClick(callback) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.onMenuClick = () => {
        callback()
      }
    },
    // 页面返回刷新
    translateDataCallback(callback) {
      const fn = noticeFn()
      if (!fn) {
        console.info(`bind COMM_APP translateDataCallback : ${callback}`)
        return
      }
      COMM_APP.translateDataCallback = (res) => {
        callback(res)
      }
    },
    openSession(team) {
      const fn = noticeFn()
      if (!fn) {
        console.info(`start COMM_APP openSession : ${team}`)
        return
      }
      COMM_APP.openSession(team)
    },
    // 底部弹窗
    setTitle(title) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.setTitle(title)
    },
    // 调起第三方导航功能
    startNavigate(data) {
      const fn = noticeFn()
      if (!fn) {
        console.debug('开启导航')
        return
      }
      COMM_APP.startNav(JSON.stringify(data))
    },
    // 自动聚焦时调起软键盘，若为开启状态则关闭
    showOrHideSoftInput() {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.showOrHideSoftInput()
    },

    // 自动聚焦时调起软键盘，若为开启状态则关闭
    /*
    * 分享到微信
    * params
    * contentType -- 分享内容的类型 0 文本 1 链接
    * type -- 分享类型 0 分享到好友 1 分享到朋友圈
    * webpageUrl -- 分享网址 文本不需要网址
    * title -- 分享的标题
    * description -- 分享的描述
    * */
    weixinFriends(contentType, type, webpageUrl, title, description) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      if (!COMM_APP.shareToWeiXin) {
        return
      }
      COMM_APP.shareToWeiXin(JSON.stringify({
        contentType,
        type,
        webpageUrl,
        title,
        description
      }))
    },
    // 录制视频
    startVideo(callback, cancel) {
      const fn = noticeFn()
      if (!fn) {
        // 如果是在应用外，模拟一个假的请求返回
        // const mockStartVideo = { id: '1', attachPath: '/dummy/test.mp4' }
        // callback(mockStartVideo)
        cancel()
        return
      }
      // 视频上传
      COMM_APP.startVideoCallback = (res) => {
        if (res.errcode) {
          console.error(res)
          cancel(res)
          return
        }
        callback(res)
      }
      const data = {}
      COMM_APP.startVideo(JSON.stringify(data))
    },
    // 播放视频
    playVideo(data) {
      const fn = noticeFn()
      if (!fn) {
        console.debug('playVideo')
        console.debug(data)
        return
      }
      COMM_APP.playVideo(JSON.stringify(data))
    },
    // 发送短信
    sms(data) {
      const fn = noticeFn()
      if (!fn) {
        console.debug('sms')
        console.debug(data)
        return
      }
      COMM_APP.sendMsg(JSON.stringify(data))
    },
    // 录制音频
    startVoice(callback, cancel) {
      const fn = noticeFn()
      if (!fn) {
        // 如果时在应用外，模拟一个假的请求返回
        cancel()
        return
      }
      COMM_APP.startVoiceCallback = function (res) {
        if (res.errcode) {
          console.error(res)
          cancel()
          alert('上传失败！')
          return
        }
        callback(res)
        alert('上传成功！')
      }
      // 音频上传点击返回时触发
      COMM_APP.cancelVoiceCallback = function (res) {
        cancel(res)
      }
      const data = {}
      COMM_APP.startVoice(JSON.stringify(data))
    },
    // 播放音频
    playVoice(data) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.playVoice(JSON.stringify(data))
    },
    // 获取定位信息
    startLoc(successFn) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      if (!COMM_APP.startGPS) {
        return
      }
      COMM_APP.startGPSCallback = function (res) { // 定位失败传过来空对象
        successFn(JSON.parse(res))
      }
      COMM_APP.startGPS()
    },
    /*
    * 在线编辑word文档
    * params
    * fileId--文件在数据库里面的ID
    * localId--服务器下载文件路径
    * */
    amendFile(fileId, localId, successFn) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      if (!COMM_APP.amendFile) {
        return
      }
      // WPS文件保存成功 loaclAttachPath是wps编辑后保存在安卓本地的文件路径
      COMM_APP.amendFileCallback = function (loaclAttachPath) {
        if (successFn) {
          successFn(loaclAttachPath)
        }
      }
      COMM_APP.amendFile(JSON.stringify({
        fileId,
        localId
      }))
    },
    downloadFile(localId) {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      if (!COMM_APP.downloadFile) {
        return
      }
      COMM_APP.downloadFile(JSON.stringify({
        localId
      }))
    },
  //  关闭弹窗
    closeWeb() {
      const fn = noticeFn()
      if (!fn) {
        return
      }
      COMM_APP.closeWeb()
    }
  }
}())

export default APPSDK
