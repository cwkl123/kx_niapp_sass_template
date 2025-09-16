import { http } from '@/utils/http'
export const submitRecruiters = (param) => {
  return http({
    url: '/userRecruit/insert',
    data: param,
    showLoading: true,
  })
}
export const getRecruitersInfo = (param) => {
  return http({
    url: '/userRecruit/getInfo',
    method: 'GET',
  })
}
export const updateRecruiters = (param) => {
  return http({
    url: '/userRecruit/update',
    data: param,
    showLoading: true,
  })
}
