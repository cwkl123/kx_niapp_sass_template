import { http } from '@/utils/http'

export const uploadImg = (param) => {
  return http({
    method: 'POST',
    url: '/upload/uploadImg',
    data: param,
  })
}

export const getConfigList = (param) => {
  return http({
    method: 'GET',
    url: '/system/getSysConfig/' + param.configType,
    data: {
      tagType: param.tagType,
    },
  })
}
export const getinfo = (param) => {
  return http({
    method: 'POST',
    url: '/upms/user/getinfo',
    data: param,
  })
}
export const getConfig = (param) => {
  return http({
    method: 'POST',
    url: '/kuaixiu/api/sysConfig/getConfig',
    data: {},
  })
}
