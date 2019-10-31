import axios from '@/utils/myaxios/myaxios.js'

// 获取商品列表数据
export const getcate = (type) => {
  return axios({
    url: `categories`,
    params: { type }
  })
}
