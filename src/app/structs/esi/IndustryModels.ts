
/**
 * 工业设施
 */
export interface IEsiIndustryFacility {
  facility_id: number
  solar_system_id?: number
  tax?: number
  type_id?: number
}

/**
 * 工业系统
 */
export interface IEsiIndustrySystem {
  cost_indices: IEsiCostIndex[]
  solar_system_id: number
}

/**
 * 成本指数
 */
export interface IEsiCostIndex {
  activity: 'copying' | 'duplicating' | 'invention' | 'manufacturing' | 'none' | 'reaction' | 'researching_material_efficiency' | 'researching_technology' | 'researching_time_efficiency' | 'reverse_engineering'
  cost_index: number
}

/**
 * 工业成本系数
 */
export interface IEsiIndustryCoefficient {
  activity: string
  cost_index: number
  solar_system_id: number
}

/**
 * 工业工作
 */
export interface IEsiIndustryJob {
  activity_id: number
  blueprint_id: number
  blueprint_location_id: number
  blueprint_type_id: number
  completed_character_id?: number
  completed_date?: string
  cost?: number
  duration: number
  end_date: string
  facility_id: number
  installer_id: number
  job_id: number
  licensed_runs?: number
  location_id: number
  output_location_id: number
  pause_date?: string
  probability?: number
  product_type_id?: number
  runs: number
  start_date: string
  station_id?: number
  status: 'active' | 'cancelled' | 'delivered' | 'paused' | 'ready' | 'reverted'
  successful_runs?: number
  team_id?: number
}

/**
 * 角色挖矿记录
 */
export interface IEsiMiningLedger {
  character_id: number
  last_updated: string
  quantity: number
  solar_system_id?: number
  type_id: number
}

/**
 * 采矿提取信息
 */
export interface IEsiMiningExtraction {
  asteroid_belt_id: number
  extraction_start_time: string
  moon_id: number
  natural_decay_rate: number
  structure_id: number
}

/**
 * 采矿观察者
 */
export interface IEsiMiningObserver {
  last_updated: string
  observer_id: number
  observer_type: 'structure'
}

/**
 * 采矿观察者记录
 */
export interface IEsiMiningObserverItem {
  character_id: number
  last_updated: string
  quantity: number
  recorded_corporation_id: number
  type_id: number
}
