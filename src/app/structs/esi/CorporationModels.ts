
/**
 * 军团公开信息
 */
export interface IEsiCorporation {
  alliance_id?: number
  ceo_id: number
  creator_id: number
  date_founded?: string
  description?: string
  faction_id?: number
  home_station_id?: number
  member_count: number
  name: string
  shares?: number
  tax_rate: number
  ticker: string
  url?: string
  war_eligible?: boolean
}

/**
 * 军团的联盟历史
 */
export interface IEsiCorporationAllianceHistory {
  alliance_id?: number
  is_deleted?: boolean
  record_id: number
  start_date: string
}

/**
 * 军团蓝图
 */
export interface IEsiCorporationBlueprint {
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
 * 容器日志
 */
export interface IEsiContainerLog {
  action: string
  character_id: number
  container_id: number
  container_type_id: number
  location_flag: string
  location_id: number
  logged_at: string
  new_config_bitmask?: number
  old_config_bitmask?: number
  password_type?: string
  quantity?: number
  type_id?: number
}

/**
 * 军团部门（机库部门和钱包部门）
 */
export interface IEsiDivision {
  hangar: IEsiDivisionItem[]
  wallet: IEsiDivisionItem[]
}

/**
 * 军团部门项
 */
export interface IEsiDivisionItem {
  division: number
  name: string
}

/**
 * 军团设施
 */
export interface IEsiCorporationFacility {
  facility_id: number
  system_id: number
  type_id: number
}

/**
 * 军团图标
 */
export interface IEsiCorporationIcon {
  px128x128?: string
  px256x256?: string
  px64x64?: string
}

/**
 * 军团勋章
 */
export interface IEsiCorporationMedal {
  created_at: string
  creator_id: number
  description: string
  medal_id: number
  title: string
}

/**
 * 已颁发的勋章
 */
export interface IEsiCorporationMedalIssued {
  character_id: number
  issued_at: string
  issuer_id: number
  medal_id: number
  reason: string
  status: 'private' | 'public'
}

/**
 * 军团成员
 */
export interface IEsiCorporationMember {
  character_id: number
  joined_on: string
  title_id?: number
}

/**
 * 成员的头衔
 */
export interface IEsiCorporationMemberTitle {
  character_id: number
  titles: IEsiCorporationTitleShort[]
}

/**
 * 头衔简略信息
 */
export interface IEsiCorporationTitleShort {
  title_id: number
  name: string
}

/**
 * 成员追踪信息
 */
export interface IEsiCorporationMemberTracking {
  character_id: number
  location_id?: number
  logon_date?: string
  logout_date?: string
  ship_type_id?: number
  start_date?: string
}

/**
 * 军团角色权限
 */
export interface IEsiCorporationRole {
  character_id: number
  roles?: string[]
  roles_at_hq?: string[]
  roles_at_base?: string[]
  roles_at_other?: string[]
}

/**
 * 军团角色权限历史
 */
export interface IEsiCorporationRoleHistory {
  changed_at: string
  character_id: number
  issuer_id?: number
  new_roles: string[]
  old_roles?: string[]
  role_type: string
}

/**
 * 股东
 */
export interface IEsiShareholder {
  character_id?: number
  corporation_id?: number
  share_count: number
}

/**
 * 军团结构
 */
export interface IEsiCorporationStructure {
  corporation_id: number
  fuel_expires?: string
  name?: string
  next_reinforce_apply?: string
  next_reinforce_weekday?: number
  profile_id: number
  reinforce_hour?: number
  services?: IEsiCorporationStructureService[]
  state?: string
  state_timer_end?: string
  state_timer_start?: string
  structure_id: number
  system_id: number
  type_id: number
  unanchors_at?: string
}

/**
 * 军团结构的服务
 */
export interface IEsiCorporationStructureService {
  name: string
  state: string
}

/**
 * 军团头衔
 */
export interface IEsiCorporationTitle {
  creator_id?: number
  name?: string
  title_id?: number
}

/**
 * 军团名称
 */
export interface IEsiCorporationName {
  corporation_id: number
  corporation_name: string
}
