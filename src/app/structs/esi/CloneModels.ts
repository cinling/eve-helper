
/**
 * 角色的克隆
 */
export interface IEsiCharacterClones {
  home_location?: IEsiCloneLocation
  jump_clones: IEsiJumpClone[]
  last_clone_jump_date?: string
  last_station_change_date?: string
}

/**
 * 克隆位置
 */
export interface IEsiCloneLocation {
  location_id: number
  location_type: string
}

/**
 * 跳跃克隆
 */
export interface IEsiJumpClone {
  implants: number[]
  jump_clone_id: number
  location_id: number
  location_type: string
  name?: string
}
