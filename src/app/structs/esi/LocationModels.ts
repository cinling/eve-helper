
/**
 * 角色当前位置
 */
export interface IEsiCharacterLocation {
  solar_system_id: number
  station_id?: number
  structure_id?: number
}

/**
 * 角色在线状态
 */
export interface IEsiCharacterOnline {
  last_login?: string
  last_logout?: string
  logins?: number
  online: boolean
}

/**
 * 角色当前驾驶的飞船
 */
export interface IEsiCharacterShip {
  ship_item_id: number
  ship_name: string
  ship_type_id: number
}
