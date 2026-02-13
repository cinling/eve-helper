
/**
 * 物品制造配方
 */
export interface ITypeMaterial {
  materials: IMaterial[]
}

/**
 * 配方中的单个数据
 */
export interface IMaterial {
    materialTypeID: number
    quantity: number
}