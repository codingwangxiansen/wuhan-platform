/**
 * Created by wjf on 2018/1/31.
 */
const config = {
  // 服务端root
  serverUrl: '/geminirest',
  // 后台服务root
  siteUrl: '/geminirest/api/m',
  // 前端服务root
  htmlUrl: '/geminihtml',
  // 文件服务名
  fileServer: '/geminifs',
  // 选择附件上传的文件类型
  fileType: ['doc', 'docx', 'pdf'],
  // 附件页面
  attach_view: `${this.htmlUrl}/module/attach.html`,
  // 地图的key
  mapKey: '8a7b9aac0db21f9dd995e61a14685f05',
  // 帮助页面路径
  // helpLink: 'http://mp.weixin.qq.com/mp/homepage?__biz=MzU3MjUwNDQ2Nw==&hid=2&sn=dabce9665541a5293c611073de7cd8f3#wechat_redirect'
  helpLink: 'http://mp.weixin.qq.com/s?__biz=MzU3MjUwNDQ2Nw==&mid=100000010&idx=1&sn=e5db04a8f50800d7501e5b0b0cfd05c4&scene=19#wechat_redirect'
}

export default config
