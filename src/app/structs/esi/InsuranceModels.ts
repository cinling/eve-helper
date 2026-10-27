
/**
 * 保险价格
 */
export interface IEsiInsurancePrice {
  levels: IEsiInsuranceLevel[]
  type_id: number
}

/**
 * 保险等级
 */
export interface IEsiInsuranceLevel {
  cost: number
  name: string
  payout: number
}
