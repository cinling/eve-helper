
/**
 * 忠诚点商店的兑换品
 */
export interface IEsiLoyaltyOffer {
  ak_cost?: number
  isk_cost: number
  lp_cost: number
  offer_id: number
  quantity: number
  required_items: IEsiLoyaltyRequiredItem[]
  type_id: number
}

/**
 * 忠诚点兑换所需物品
 */
export interface IEsiLoyaltyRequiredItem {
  quantity: number
  type_id: number
}
