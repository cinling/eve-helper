
/**
 * 蓝图数据
 */
export interface IBlueprint {
    activities: {
        copying: {
            time: number
        }
        /**
         * 发明数据
         */
        invention: {
            time: number
            materials: {
                quantity: number
                typeID: number
            }[]
            products: {
                probability: number
                quantity: number
                typeID: number
            }[]
            skills: {
                level: number
                typeID: number
            }[]
        }
        /**
         * 工业数据/制造数据
         */
        manufacturing?: {
            time: number
            materials: {
                quantity: number
                typeID: number
            }[]
            products: {
                quantity: number
                typeID: number
            }[]
            skills: {
                level: number
                typeID: number
            }[]
        }
        research_material: {
            time: number
        }
        research_time: {
            time: number
        }
    }
    blueprintTypeID: number
    maxProductionLimit: number
}

/**
 * 蓝图材料
 */
export interface IBlueprintMaterial {
    /**
     * 物品id
     */
    typeId: number

    /**
     * 物品名字
     */
    name: string

    /**
     * 物品数量
     */
    quantity: number

    /**
     * 物品单价
     */
    price?: number

    /**
     * 物品总价
     */
    totalPrice?: number
}