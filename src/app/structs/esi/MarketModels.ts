
/**
 * 市场物价
 */
export interface IEsiMarketPrice {
  adjusted_price?: number
  average_price?: number
  type_id: number
}

/**
 * 结构市场订单（提交用）
 */
export interface IEsiStructureOrderInput {
  duration: number
  is_buy_order: boolean
  issued: string
  location_id: number
  min_volume?: number
  order_id?: number
  price: number
  quantity: number
  range: string
  type_id: number
}
