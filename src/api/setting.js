import request from '@/utils/request'
export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}
export const addRole = (data) => {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}
export const updateRole = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}
export const deleteRole = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

