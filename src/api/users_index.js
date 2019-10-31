import axios from '@/utils/myaxios/myaxios.js'

// 获取用户数据
export const getAlluser = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户数据
export const adduser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}

// 编辑用户数据
export const edituser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 分配角色
export const rolesuser = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data: {
      rid: data.rid
    }
  })
}

// 删除用户
export const deluserid = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'

  })
}

// 修改用户状态
export const alteruserstate = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'

  })
}
