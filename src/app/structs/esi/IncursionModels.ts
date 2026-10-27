
/**
 * 入侵
 */
export interface IEsiIncursion {
  constellation_id: number
  faction_id?: number
  has_boss: boolean
  infested_solar_systems: number[]
  influencing_soul_region_id: number
  staging_solar_system_id: number
  state: 'withdrawing' | 'mobilizing' | 'established'
  type: string
}
