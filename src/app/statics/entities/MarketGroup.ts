/**
 * 市场分组的 静态数据 的json结构
 */
export interface IMarketGroup {
  marketGroupID: number
  categoryID: number
  name: string
  description: string
  parentGroupID: number
  hasTypes: boolean
  iconID: number
}
