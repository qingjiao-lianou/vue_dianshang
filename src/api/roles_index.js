import axios from '@/utils/myaxios/myaxios.js'

// 获取角色列表数据
export const roleslistuser = () => {
  return axios({
    url: 'roles'

  })
}

// 删除权限数据
export const delRightdata = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'

  })
}

// 角色授权
export const getroleAuthorization = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}

// 添加角色
export const addrole = (data) => {
  return axios({
    url: `roles`,
    method: 'post',
    data
  })
}
