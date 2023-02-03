import axios from 'axios'
// import qs from 'qs'
import { Loading } from 'element-ui'
// 在config.js文件中统一存放一些公共常量，方便之后维护
import { token } from './config.js'

let loadingInstance = null
// 添加请求拦截器，在发送请求之前做些什么(**具体查看axios文档**)--------------------------------------------
axios.interceptors.request.use(function (config) {
  console.log('请求前获取token：' + token)
  config.headers.Authorization = 'token ' + token
  // 显示loading
  loadingInstance = Loading.service({fullscreen: true})
  return config
}, function (error) {
  // 请求错误时弹框提示，或做些其他事
  return Promise.reject(error)
})

// 添加响应拦截器(**具体查看axios文档**)----------------------------------------------------------------
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么，允许在数据返回客户端前，修改响应的数据
  // 如果只需要返回体中数据，则如下，如果需要全部，则 return response 即可
  loadingInstance.close()
  return response.data
}, function (error) {
  loadingInstance.close()
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 封装数据返回失败提示函数---------------------------------------------------------------------------
function errorState (response) {
  // 隐藏loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    // 如果不需要除了data之外的数据，可以直接 return response.data
  } else if (response.toString().endsWith('429') || response.toString().endsWith('514')) {
    // 频繁刷新
    response.errorInfo = '刷慢点'
  } else {
    console.log(response)
  }
  return response
}

// 封装axios--------------------------------------------------------------------------------------
function apiAxios (method, url, params) {
  let httpDefault = {
    method: method,
    url: url,
    // `params` 是即将与请求一起发送的 URL 参数
    // `data` 是作为请求主体被发送的数据
    params: method === 'GET' || method === 'DELETE' ? params : null,
    data: method === 'POST' || method === 'PUT' ? params : null,
    headers: {'Content-Type': 'application/json'},
    timeout: 6000
  }

  // 注意**Promise**使用(Promise首字母大写)
  return new Promise((resolve, reject) => {
    console.log(httpDefault)
    axios(httpDefault)
      // 此处的.then属于axios
      .then((res) => {
        // successState(res)
        resolve(res)
      }).catch((response) => {
        errorState(response)
        reject(response)
      })
  })
}

// 输出函数getAxios、postAxios、putAxios、delectAxios，供其他文件调用-----------------------------
// Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
export default {
  install: function (Vue) {
    Vue.prototype.getAxios = (url, params) => apiAxios('GET', url, params)
    Vue.prototype.postAxios = (url, params) => apiAxios('POST', url, params)
    Vue.prototype.putAxios = (url, params) => apiAxios('PUT', url, params)
    Vue.prototype.delectAxios = (url, params) => apiAxios('DELECT', url, params)
  }
}
