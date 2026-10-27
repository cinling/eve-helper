
/**
 * 击杀邮件
 */
export interface IEsiKillmail {
  attackers: IEsiKillmailAttacker[]
  killmail_id: number
  killmail_time: string
  solar_system_id: number
  victim: IEsiKillmailVictim
  war_id?: number
}

/**
 * 击杀邮件的攻击者
 */
export interface IEsiKillmailAttacker {
  alliance_id?: number
  character_id?: number
  corporation_id?: number
  damage_done: number
  faction_id?: number
  final_blow: boolean
  security_status: number
  ship_type_id?: number
  weapon_type_id?: number
}

/**
 * 击杀邮件的受害者
 */
export interface IEsiKillmailVictim {
  alliance_id?: number
  character_id?: number
  corporation_id?: number
  damage_taken: number
  faction_id?: number
  position?: IEsiKillmailPosition
  ship_type_id: number
}

/**
 * 击杀邮件坐标
 */
export interface IEsiKillmailPosition {
  x: number
  y: number
  z: number
}

/**
 * 最近的击杀记录
 */
export interface IEsiKillmailRecent {
  killmail_hash: string
  killmail_id: number
}
