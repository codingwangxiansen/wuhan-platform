/**
 * Created by wangjunfei on 2018/1/12.
 * 扩展并重命名axios
 */
import axios from 'axios'
import config from 'src/config'

axios.defaults.baseURL = '' // 配置基路径
// axios.defaults.header.common['Authorization']=AUTH_TOKEN; // 配置用户验证
// 配置请求头内容类型
// axios.defaults.header.post['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8'

// 请求前拦截
// axios.interceptors.request.use((conf) => {
//   return conf
// }, (err) => { // eslint-disable-line arrow-body-style
//   return Promise.reject(err)
// })

const Http = Object.assign(axios, {
  /*
   获取包含分页的列表
   @param list-列表数据 url-资源路径  page-当前页号  size-每页的数量 option-查询条件 cb 修改list之后的回调
   @return 返回list列表数组
   * */
  getList: (url, page, size, option, cb, type) => {
    let optionObj = {}
    optionObj = Object.assign({}, option)
    const param = { param: JSON.stringify(optionObj) }
    const serverUrl = type === 'm' ? config.serverUrl : `${config.serverUrl}/api/m`
    const URL = `${serverUrl}${url}?page=${page}&size=${size}`
    axios.post(URL, param)
      .then((res) => {
        if (res && res.data.response && res.data.response.result) {
          const list = res.data.response.result
          if (typeof cb === 'function') {
            cb(list)
          }
        }
      })
      .catch(() => {
        console.log('error')
      })
  },
  getData: (url, paramData, successFn, errorFn) => { // 带有传参和自定义统一错误处理的get请求
    axios.get(url, {
      params: paramData
    })
    .then((res) => {
      if (typeof successFn === 'function') {
        successFn(res.data)
      }
    })
    .catch((res) => {
      if (typeof errorFn === 'function') {
        errorFn(res)
      }
    })
  },
  postData: (url, paramData, successFn, errorFn) => { // 带有传参和自定义统一错误处理的post请求
    axios.post(url, paramData)
      .then((res) => {
        if (typeof successFn === 'function') {
          successFn(res.data)
        }
      })
      .catch((res) => {
        if (typeof errorFn === 'function') {
          errorFn(res)
        }
      })
  },
  /*
   执行多个并发GET请求
   @param url1-资源路径1  param1-参数1 url2-资源路径2  param2-参数2
   * */
  getMulti: (url1, param1, url2, param2, successFn) => {
    function get1() {
      return axios.get(url1, {
        params: param1
      })
    }

    function get2() {
      return axios.get(url2, {
        params: param2
      })
    }
    axios.all([get1, get2])
      .then(axios.spread(
        successFn
      ))
  },
  /*
   执行多个并发POST请求
   @param url1-资源路径1  param1-参数1 url2-资源路径2  param2-参数2
   * */
  postMuilti: (url1, param1, url2, param2, successFn) => {
    function post1() {
      return axios.post(url1, param1)
    }

    function post2() {
      return axios.post(url2, param2)
    }
    axios.all([post1, post2])
      .then(axios.spread(
        successFn
      ))
  }
})
export default Http
