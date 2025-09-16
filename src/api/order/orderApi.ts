import { http } from '@/utils/http'

/**
 * 获取用户订单数量
 */
export const getOrderCount = () => {
  return http.get<number>('/order/orderCountByUser')
}

/**
 * 获取服务项每周预约时间
 * @param serviceId - 服务ID
 */
export const getOrderWeekTimes = (serviceId: string) => {
  return http.get<Array<any>>('/serviceItem/listOfAppointmentTimes/' + serviceId)
}

/**
 * 获取服务项特定日期的预约小时
 * @param serviceId - 服务ID
 * @param day - 日期（格式：yyyy-MM-dd）
 * @param addressId - 地址ID
 */
export const getOrderHourTimes = (serviceId: string, day: string, addressId: string) => {
  return http.get<Array<string>>(
    '/serviceItem/listOfAppointmentHours/' + serviceId + '/' + day + '/' + addressId,
  )
}

/**
 * 创建新订单
 * @param param - 订单数据
 */
export const createOrder = (param: object) => {
  return http.post<string>('/order/ins', param)
}

/**
 * 获取订单分页列表
 * @param param - 查询参数
 */
export const getOrderPage = (param: object) => {
  return http.post<PageResult<Order>>('/order/queryOrder', param)
}

/**
 * 选择维修人员
 * @param param - 选择参数
 */
export const selectRepairer = (param: object) => {
  return http.post<Array<Repairer>>('/repairer/selectRepairer', param)
}

/**
 * 评价订单
 * @param param - 评价数据
 */
export const evaluateOrder = (param: object) => {
  return http.post<string>('/appraise/insert', param)
}

/**
 * 取消订单
 * @param orderId - 订单ID
 */
export const cancelOrder = (orderId: string) => {
  return http.get<boolean>('/order/cancelOrder/' + orderId)
}

/**
 * 获取配置信息
 * @param param - 配置参数
 */
export const getConfig = (param?: object) => {
  return http.post<Config>('/kuaixiu/api/kxConfig/getConfig', param)
}

/**
 * 获取订单详情
 * @param orderId - 订单ID
 */
export const getDetail = (orderId: string) => {
  return http.get<OrderDetail>('/order/getOrderDetail/' + orderId)
}

/**
 * 更新订单预约时间
 * @param param - 时间更新数据
 */
export const updateOrderTime = (param: object) => {
  return http.post<string>('/order/updateOrderTime', param)
}

/**
 * 发起支付
 * @param param - 支付参数
 */
export const goPay = (param: object) => {
  return http.post<PaymentResult>('/trade/applet', param)
}

/**
 * 获取订单创建时间（备用）
 * @param param - 订单数据
 */
export const getstimee = (param: object) => {
  return http.post<string>('/order/ins', param)
}

/**
 * 更新订单地址
 * @param orderId - 订单ID
 * @param repairsId - 维修地址ID
 */
export const updateOrderAddress = (orderId: string, repairsId: string) => {
  return http.get<boolean>('/order/updateOrderAddress/' + orderId + '/' + repairsId)
}

/**
 * 获取可更新订单列表
 */
export const getUpdateOrder = () => {
  return http.get<Array<Order>>('/order/getOrderUpdate')
}

/**
 * 批量更新订单状态
 * @param param - 批量更新参数
 */
export const updateOrderBatch = (param: object) => {
  return http.post<boolean>('/order/updateBatch', param)
}

// ================= 类型定义 =================

/**
 * 分页结果类型
 */
interface PageResult<T> {
  current: number
  pages: number
  records: T[]
  size: number
  total: number
}

/**
 * 订单信息
 */
interface Order {
  id: string
  orderNo: string
  status: number
  createTime: string
  // 其他订单字段...
}

/**
 * 维修人员信息
 */
interface Repairer {
  id: string
  name: string
  rating: number
  // 其他维修人员字段...
}

/**
 * 订单详情
 */
interface OrderDetail extends Order {
  serviceItems: ServiceItem[]
  address: Address
  // 其他详情字段...
}

/**
 * 配置信息
 */
interface Config {
  minOrderAmount: number
  maxDistance: number
  // 其他配置字段...
}

/**
 * 支付结果
 */
interface PaymentResult {
  appId: string
  timeStamp: string
  nonceStr: string
  package: string
  signType: string
  paySign: string
}

/**
 * 服务项
 */
interface ServiceItem {
  id: string
  name: string
  price: number
}

/**
 * 地址信息
 */
interface Address {
  id: string
  addressDetail: string
  contactName: string
  contactPhone: string
}
