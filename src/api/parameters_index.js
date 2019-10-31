import axios from '@/utils/myaxios/myaxios.js'

// 获取商品参数
export const getParameter = (id, sel) => {
  return axios({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}
