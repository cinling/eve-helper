
/**
 * 角色的研究进度
 */
export interface IEsiAgentsResearch {
  agent_id: number
  division_id: number
  points_per_day: number
  remainder_points: number
  skill_type_id: number
}

/**
 * 角色蓝图
 */
export interface IEsiCharacterBlueprint {
  item_id: number
  location_flag: string
  location_id: number
  material_efficiency: number
  quantity: number
  runs: number
  time_efficiency: number
  type_id: number
}

/**
 * 角色的军团职位
 */
export interface IEsiCharacterCorporationRoles {
  roles: string[]
  roles_at_hq?: string[]
  roles_at_base?: string[]
  roles_at_other?: string[]
}

/**
 * 角色的疲劳度
 */
export interface IEsiCharacterFatigue {
  last_jump_date?: string
  jump_fatigue_expire_date?: string
  last_update_date?: string
}

/**
 * 角色勋章
 */
export interface IEsiCharacterMedal {
  corporation_id: number
  date: string
  description: string
  graphics: IEsiMedalGraphic[]
  issuer_id: number
  medal_id: number
  reason: string
  status: 'private' | 'public'
  title: string
}

/**
 * 勋章图标
 */
export interface IEsiMedalGraphic {
  color: number
  graphic: string
  layer: number
  part: number
}

/**
 * 通知
 */
export interface IEsiNotification {
  is_read?: boolean
  notification_id: number
  sender_id: number
  sender_type: string
  text?: string
  timestamp: string
  type: string
}

/**
 * 联系人通知
 */
export interface IEsiContactNotification {
  message: string
  notification_id: number
  send_date: string
  sender_id: number
  sender_type: string
  standing_level: number
}

/**
 * 角色头像
 */
export interface IEsiCharacterPortrait {
  px128x128?: string
  px256x256?: string
  px512x512?: string
  px64x64?: string
}

/**
 * 角色的权限
 */
export interface IEsiCharacterRoles {
  roles?: string[]
  roles_at_hq?: string[]
  roles_at_base?: string[]
  roles_at_other?: string[]
}

/**
 * 声望
 */
export interface IEsiStanding {
  from_id: number
  from_type: 'agent' | 'npc_corp' | 'faction'
  standing: number
}

/**
 * 角色头衔
 */
export interface IEsiCharacterTitle {
  name?: string
  title_id: number
}

/**
 * 计算CSPA费用的请求
 */
export interface IEsiCspaRequest {
  characters: number[]
}
