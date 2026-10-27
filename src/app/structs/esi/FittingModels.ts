
/**
 * 装配
 */
export interface IEsiFitting {
  description: string
  fitting_id: number
  items: IEsiFittingItem[]
  name: string
  ship_type_id: number
}

/**
 * 装配的物品
 */
export interface IEsiFittingItem {
  flag: string
  quantity: number
  type_id: number
}

/**
 * 装配提交数据
 */
export interface IEsiFittingInput {
  description: string
  items: IEsiFittingItem[]
  name: string
  ship_type_id: number
}

/**
 * 装配创建结果
 */
export interface IEsiFittingCreated {
  fitting_id: number
}
