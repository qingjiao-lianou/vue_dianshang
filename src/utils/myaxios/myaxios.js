import axios from 'axios'
// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加拦截请求头
// 拦截器的本质并不用来发起请求的，而是对请求报文进行处理
axios.interceptors.request.use(function (config) {
  // 获取token
  let mytoken = localStorage.getItem('vue_dome_token')
  // 设置请求头
  if (mytoken) {
    config.headers.Authorization = mytoken
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  //   Promise.reject(error):中止本次请求
  return Promise.reject(error)
}
)

export default axios
