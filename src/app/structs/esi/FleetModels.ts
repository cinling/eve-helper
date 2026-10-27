
/**
 * 舰队
 */
export interface IEsiFleet {
  is_free_move: boolean
  is_registered: boolean
  is_voice_enabled: boolean
  motd: string
}

/**
 * 舰队成员
 */
export interface IEsiFleetMember {
  character_id: number
  join_time: string
  role: 'fleet_commander' | 'wing_commander' | 'squad_commander' | 'squad_member'
  role_name: string
  ship_type_id: number
  solar_system_id: number
  squad_id: number
  station_id?: number
  wing_id: number
}

/**
 * 舰队邀请数据
 */
export interface IEsiFleetInvite {
  character_id: number
  role: 'fleet_commander' | 'wing_commander' | 'squad_commander' | 'squad_member'
  role_name?: string
  squad_id?: number
  wing_id?: number
}

/**
 * 舰队的翅膀
 */
export interface IEsiFleetWing {
  id: number
  name: string
  squads: IEsiFleetSquad[]
}

/**
 * 舰队的小队
 */
export interface IEsiFleetSquad {
  id: number
  name: string
}

/**
 * 创建翅膀的结果
 */
export interface IEsiFleetWingCreated {
  wing_id: number
}

/**
 * 创建小队的结果
 */
export interface IEsiFleetSquadCreated {
  squad_id: number
}

/**
 * 角色所在的舰队
 */
export interface IEsiCharacterFleet {
  fleet_id: number
  role: string
  squad_id: number
  wing_id: number
}
