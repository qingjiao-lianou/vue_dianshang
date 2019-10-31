import axios from '@/utils/myaxios/myaxios.js'

// 获取商品列表数据
export const getCommodity = (params) => {
  return axios({
    url: `goods`,
    params
  })
}

// 商品添加
export const addGoods = (data) => {
  return axios({
    url: `goods`,
    method: 'post',
    data
  })
}