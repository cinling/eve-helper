
/**
 * 主权战争行动
 */
export interface IEsiSovereigntyCampaign {
  attackers_score?: number
  campaign_id: number
  constellation_id: number
  defender_id?: number
  defender_score?: number
  event_type: 'tcu_defense' | 'ihub_defense' | 'station_defense' | 'station_freeport'
  participants?: IEsiSovereigntyCampaignParticipant[]
  solar_system_id: number
  start_time: string
  structure_id: number
}

/**
 * 主权战争行动的参与者
 */
export interface IEsiSovereigntyCampaignParticipant {
  alliance_id: number
  score: number
}

/**
 * 主权星系
 */
export interface IEsiSovereigntySystem {
  alliance_id?: number
  corporation_id?: number
  faction_id?: number
  system_id: number
}

/**
 * 主权结构
 */
export interface IEsiSovereigntyStructure {
  alliance_id?: number
  corporation_id?: number
  faction_id?: number
  structure_id: number
  system_id: number
  type_id: number
  vulnerability_occupancy_level?: number
  vulnerable_end_time?: string
  vulnerable_start_time?: string
}
