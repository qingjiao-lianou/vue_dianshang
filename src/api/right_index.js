import axios from '@/utils/myaxios/myaxios.js'

// 获取权限列表数据
export const getrightListData = (type) => {
  return axios({
    url: `rights/${type}`
  })
}

// 左侧菜单权限

export const getmenusList = () => {
  return axios({
    url: `menus`
  })
}
