
/**
 * 联盟公开信息
 */
export interface IEsiAlliance {
  creator_corporation_id: number
  creator_id: number
  date_founded: string
  executor_corporation_id?: number
  faction_id?: number
  name: string
  ticker: string
}

/**
 * 联盟图标
 */
export interface IEsiAllianceIcon {
  px128x128?: string
  px256x256?: string
  px64x64?: string
}

/**
 * 联盟名称
 */
export interface IEsiAllianceName {
  alliance_id: number
  alliance_name: string
}
