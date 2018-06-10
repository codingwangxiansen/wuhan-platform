/**
 * Created by wangjunfei on 2017/4/12.
 * 这个方法加载微信js-sdk，做为公共方法在每个微信前端中调用
 * jsApiList：当前页需要初始化的微信API
 */
import config from '../config'
import http from './http'
import { getLocationSearch } from './common'

const WXSDK = ((window) => {
  if (!window.wx) {
    return false
  }
  return {
    ready(successFn) {
      wx.ready(() => {
        /*
        * config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
        * config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
        * 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        * */
        if (successFn) {
          successFn()
        }
      })
    },
    error(func) {
      wx.error((res) => {
        /*
         * config信息验证失败会执行error函数，如签名过期导致验证失败，
         * 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看
         * 对于SPA可以在这里更新签名。
         * */
        if (func) {
          func(res)
        }
      })
    },
    oauth(successFn) { // 网页授权登录并返回用户信息
      const URL_OAUTH = `${config.siteUrl}/weixin/wxOauth`
      const code = getLocationSearch('code')
      http.get(`${URL_OAUTH}?code=${code}`, (res) => {
        if (successFn) {
          successFn(res)
        }
      })
    },
    permission(successFn, errorFn, jsApiList) {
      wx.ready(() => {
        if (successFn) {
          successFn()
        }
      })

      wx.error(() => {
        if (errorFn) {
          errorFn()
        }
      })

      function wxconfig(res) {
        let obj
        if (typeof res === 'object') {
          obj = res
        } else if (typeof res === 'string') {
          obj = JSON.parse(res) // res为json字符串，需要转换为对象,请王俊飞加判断，res为字符串或对象的处理
        }
        if (obj.code === 200) {
          const options = obj.response
          wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            appId: options.appId, // 必填，公众号的唯一标识
            timestamp: options.timestamp, // 必填，生成签名的时间戳
            nonceStr: options.nonceStr, // 必填，生成签名的随机串
            signature: options.signature, // 必填，签名，见附录1
            jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        } else {
          console.log('load weixin sdk failed:')
        }
      }

      // 微信sdk
      let data = { url: window.location.href.split('#')[0] }
      data = JSON.stringify(data)
      const url = `${config.siteUrl}/weixin/config_options`
      http.post(url, data, wxconfig)
    },
    checkJsApi(jsApiList, successFn) {
      wx.checkJsApi({
        jsApiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,Array
        success(res) {
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    onMenuShareTimeline(title, link, imgUrl, successFn, cancelFn) {
      // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
        title, // 分享标题
        link, // 分享链接
        imgUrl, // 分享图标
        success() {
          // 用户确认分享后执行的回调函数
          if (successFn) {
            successFn()
          }
        },
        cancel() {
          // 用户取消分享后执行的回调函数
          if (cancelFn) {
            cancelFn()
          }
        }
      })
    },
    onMenuShareAppMessage(title, desc, link, imgUrl, type, dataUrl, successFn, cancelFn) {
      // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接
        imgUrl, // 分享图标
        type, // 分享类型,music、video或link，不填默认为link
        dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
        success() {
          // 用户确认分享后执行的回调函数
          if (successFn) {
            successFn()
          }
        },
        cancel() {
          // 用户取消分享后执行的回调函数
          if (cancelFn) {
            cancelFn()
          }
        }
      })
    },
    onMenuShareQQ(title, desc, link, imgUrl, successFn, cancelFn) {
      wx.onMenuShareQQ({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接
        imgUrl, // 分享图标
        success() {
          // 用户确认分享后执行的回调函数
          if (successFn) {
            successFn()
          }
        },
        cancel() {
          // 用户取消分享后执行的回调函数
          if (cancelFn) {
            cancelFn()
          }
        }
      })
    },
    chooseImage(options, successFn) {
      let count = 1
      let sizeType = ['compressed']
      let sourceType = ['album', 'camera']
      if (Object.prototype.hasOwnProperty.call(options, 'count')) {
        count = options.count
      } else if (Object.prototype.hasOwnProperty.call(options, 'sizeType')) {
        sizeType = options.sizeType
      } else if (Object.prototype.hasOwnProperty.call(options, 'sourceType')) {
        sourceType = options.sourceType
      }
      wx.chooseImage({
        count, // 默认9
        sizeType, // ['original', 'compressed']可以指定是原图还是压缩图，默认二者都有
        sourceType, // ['album', 'camera']可以指定来源是相册还是相机，默认二者都有
        success(res) {
          const localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          const imageData = {
            url: localIds[0]
          }
          if (typeof successFn === 'function') {
            successFn(imageData)
          }
        }
      })
    },
    previewImage(current, urls) {
      wx.previewImage({
        current, // 当前显示图片的http链接
        urls // 需要预览的图片http链接列表 数组
      })
    },
    uploadImage(options, successFn) {
      let localId
      let isShowProgressTips = 1
      if (Object.prototype.hasOwnProperty.call(options, 'localId')) {
        localId = options.localId
      } else if (Object.prototype.hasOwnProperty.call(options, 'isShowProgressTips')) {
        isShowProgressTips = options.isShowProgressTips
      }
      wx.uploadImage({
        localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips, // 默认为1，显示进度提示
        success(res) {
          const serverId = res.serverId // 返回图片的服务器端ID
          console.log(serverId)
          const data = { media_id: serverId }
          http.post(
            `${config.serverUrl}/miniappcgibin/wechatmedia/formatAttach`,
            data
          ).then((response) => {
            if (response.data.code === 200) {
              if (typeof successFn === 'function') {
                successFn(response.data.response)
              }
            }
          })
            .catch(() => {
            })
        }
      })
    },
    downloadImage(serverId, isShowProgressTips, successFn) {
      wx.downloadImage({
        serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
        isShowProgressTips, // 默认为1，显示进度提示
        success(res) {
          const localId = res.localId // 返回图片下载后的本地ID
          console.log(localId)
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    startRecord() { // 开始录音接口
      wx.startRecord()
    },
    stopRecord(successFn) {
      wx.stopRecord({
        success(res) {
          const localId = res.localId
          console.log(localId)
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    onVoiceRecordEnd(completeFn) { // 监听录音自动停止接口
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete(res) {
          const localId = res.localId
          console.log(localId)
          if (completeFn) {
            completeFn(res)
          }
        }
      })
    },
    playVoice(localId) { // 播放语言接口
      wx.playVoice({
        localId // 需要播放的音频的本地ID，由stopRecord接口获得
      })
    },
    pauseVoice(localId) {
      wx.pauseVoice({
        localId // 需要暂停的音频的本地ID，由stopRecord接口获得
      })
    },
    stopVoice(localId) {
      wx.stopVoice({
        localId // 需要停止的音频的本地ID，由stopRecord接口获得
      })
    },
    onVoicePlayEnd(successFn) { // 监听语音播放完毕接口
      wx.onVoicePlayEnd({
        success(res) {
          const localId = res.localId // 返回音频的本地ID
          console.log(localId)
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    uploadVoice(localId, isShowProgressTips, successFn) { // 上传语音接口
      wx.uploadVoice({
        localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips, // 默认为1，显示进度提示
        success(res) {
          const serverId = res.serverId // 返回音频的服务器端ID
          console.log(serverId)
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    downloadVoice(serverId, isShowProgressTips, successFn) {
      wx.downloadVoice({
        serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips, // 默认为1，显示进度提示
        success(res) {
          const localId = res.localId // 返回音频的本地ID
          console.log(localId)
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    translateVoice(localId, isShowProgressTips, successFn) { // 识别音频并返回识别结果接口
      wx.translateVoice({
        localId, // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips, // 默认为1，显示进度提示
        success(res) {
          // alert(res.translateResult); // 语音识别的结果
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    getNetworkType(successFn) { // 获取网络状态接口
      wx.getNetworkType({
        success(res) {
          const networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
          console.log(networkType)
          if (successFn) {
            successFn(res)
          }
        }
      })
    },
    openLocation(latitude, longitude, name, address, scale, infoUrl) {
      // 使用微信内置地图查看位置接口
      wx.openLocation({
        latitude, // 纬度，浮点数，范围为90 ~ -90
        longitude, // 经度，浮点数，范围为180 ~ -180。
        name, // 位置名
        address, // 地址详情说明
        scale, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
      })
    },
    startLoc(successFn) {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success(res) {
          const latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
          const longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。
          const speed = res.speed // 速度，以米/每秒计
          const accuracy = res.accuracy // 位置精度
          const resObj = {
            longitude,
            latitude
          }
          console.log(speed)
          console.log(accuracy)
          if (successFn) {
            successFn(resObj)
          }
        }
      })
    },
    startSearchBeacons(ticket, completeFn) { // 开启查找周边ibeacon设备接口
      wx.startSearchBeacons({
        ticket,  // 摇周边的业务ticket, 系统自动添加在摇出来的页面链接后面
        complete(argv) {
          // 开启查找完成后的回调函数
          if (completeFn) {
            completeFn(argv)
          }
        }
      })
    },
    stopSearchBeacons(completeFn) { // 关闭查找周边ibeacon设备接口
      wx.stopSearchBeacons({
        complete(res) {
          // 关闭查找完成后的回调函数
          if (completeFn) {
            completeFn(res)
          }
        }
      })
    },
    onSearchBeacons(completeFn) { // 监听周边ibeacon设备接口
      wx.onSearchBeacons({
        complete(argv) {
          // 回调函数，可以数组形式取得该商家注册的在周边的相关设备列表
          if (completeFn) {
            completeFn(argv)
          }
        }
      })
    },
    closeWindow() { // 关闭当前网页窗口接口
      wx.closeWindow()
    },
    hideMenuItems(menuList) { // 批量隐藏功能按钮接口
      wx.hideMenuItems({
        menuList // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3 数组
      })
    },
    showMenuItems(menuList) {
      wx.showMenuItems({
        menuList // 要显示的菜单项，所有menu项见附录3 数组
      })
    },
    showOptionMenu() {
      wx.showOptionMenu()
    },
    hideOptionMenu() { // 禁用分享等按钮
      wx.hideOptionMenu()
    },
    hideAllNonBaseMenuItem() { // 隐藏所有非基础按钮接口
      wx.hideAllNonBaseMenuItem()
    },
    scanQRCode(needResult, scanType, successFn) {
      wx.scanQRCode({
        needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType, // ["qrCode","barCode"]可以指定扫二维码还是一维码，默认二者都有
        success(res) {
          const result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
          console.log(result)
          successFn(res)
        }
      })
    },
    chooseWXPay(timestamp, nonceStr, mypackage, signType, paySign, successFn) {
      wx.chooseWXPay({
        timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr, // 支付签名随机串，不长于 32 位
        package: mypackage, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign, // 支付签名
        success(res) {
          // 支付成功后的回调函数
          successFn(res)
        }
      })
    },
    /*
     * 向小程序发送消息  参数为js对象
      * */
    postMessage(data) {
      if (!wx) {
        return
      }
      wx.miniProgram.postMessage({ data })
    },
    /*
     * 控制小程序跳页面
     * params
     * url -- 小程序路径
     * param -- url传递参数到小程序
     * success -- 成功回调
     * fail -- 失败回调
     * complete -- 完成回调 成功或者失败都执行
     * */
    navigateTo(url, param, success) {
      const keys = Object.keys(param)
      const params = []
      keys.forEach((key) => {
        let valueStr
        if (typeof param[key] === 'object') {
          valueStr = JSON.stringify(param[key])
          valueStr = encodeURI(valueStr)
        } else {
          valueStr = encodeURI(param[key])
        }
        params.push(`${key}=${valueStr}`)
      })
      const paramStr = params.join('&')
      const miniUrl = `${url}?${paramStr}`
      wx.miniProgram.navigateTo({
        url: miniUrl,
        success
      })
    },
    /*
     * 控制小程序返回上一页
     * params
     * url -- 小程序路径
     * success -- 成功回调
     * fail -- 失败回调
     * complete -- 完成回调 成功或者失败都执行
     * */
    navigateBack() {
      wx.miniProgram.navigateBack({
        url: '../test/test'
      })
    },
    /*
     * 控制小程序跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     * params
     * url -- 小程序tabbar路径
     * success -- 成功回调
     * fail -- 失败回调
     * complete -- 完成回调 成功或者失败都执行
     * */
    switchTab(url, success, fail, complete) {
      wx.miniProgram.switchTab(url, success, fail, complete)
    },
    /*
     * 控制小程序关闭所有页面，打开到应用内的某个页面。
     * params
     * url -- 小程序tabbar路径
     * success -- 成功回调
     * fail -- 失败回调
     * complete -- 完成回调 成功或者失败都执行
     * */
    reLaunch(url, success, fail, complete) {
      wx.miniProgram.reLaunch(url, success, fail, complete)
    },
    /*
     * 控制小程序关闭当前页面，跳转到应用内的某个页面
     * params
     * url -- 小程序tabbar路径
     * success -- 成功回调
     * fail -- 失败回调
     * complete -- 完成回调 成功或者失败都执行
     * */
    redirectTo(url, success, fail, complete) {
      wx.miniProgram.redirectTo(url, success, fail, complete)
    },
    /*
     * 小程序获取当前环境
     * */
    getEnv(cb) {
      wx.miniProgram.getEnv((res) => {
        cb()
        console.log(res.miniprogram) // true
      })
    }
  }
})(window)

export default WXSDK
