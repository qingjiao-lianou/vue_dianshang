import axios from '@/utils/myaxios/myaxios.js'

// 获取统计图
export const getReports = (type) => {
  return axios({
    url: `reports/type/${type}`

  })
}
