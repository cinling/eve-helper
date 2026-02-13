

/**
 * 静态数据类型id
 * 这里并没有将所有的类型都包含进来，只包含了一些可能会用到的
 */
export interface ISdeType {
    typeID: number
    groupID: number
    name: string
    marketGroupID: number | undefined
    description: string | undefined
}