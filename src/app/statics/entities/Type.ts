/**
 * 类型/物品 数据结构
 * @deprecated 移动到 structs/sde 中
 */
export interface IType {
    typeID: number
    name: string
    marketGroupID: number | undefined
    description: string | undefined
}