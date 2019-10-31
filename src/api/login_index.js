import axios from '@/utils/myaxios/myaxios.js'

// 实现登录验证
export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
