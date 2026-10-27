
/**
 * 角色的行星概要
 */
export interface IEsiPlanetSummary {
  last_update: string
  num_pins: number
  owner_id: number
  planet_id: number
  planet_type: string
  solar_system_id: number
  upgrade_level: number
}

/**
 * 行星的详细设施
 */
export interface IEsiPlanetDetails {
  links: IEsiPlanetLink[]
  pins: IEsiPlanetPin[]
  routes: IEsiPlanetRoute[]
}

/**
 * 行星的传送带连接
 */
export interface IEsiPlanetLink {
  destination_pin_id: number
  link_level: number
  source_pin_id: number
}

/**
 * 行星的设施
 */
export interface IEsiPlanetPin {
  latitude: number
  longitude: number
  pin_id: number
  type_id: number
  contents?: IEsiPlanetPinContent[]
  expiry_time?: string
  extractor_details?: IEsiExtractorDetails
  factory_details?: IEsiFactoryDetails
  install_time?: string
  last_cycle_start?: string
  product_type_id?: number
  qty_per_cycle?: number
  schematic_id?: number
}

/**
 * 行星设施的存货
 */
export interface IEsiPlanetPinContent {
  amount: number
  type_id: number
}

/**
 * 采集器详情
 */
export interface IEsiExtractorDetails {
  cycle_time: number
  head_radius: number
  heads: IEsiExtractorHead[]
  product_type_id: number
  qty_per_cycle: number
}

/**
 * 采集器探头
 */
export interface IEsiExtractorHead {
  head_id: number
  latitude: number
  longitude: number
}

/**
 * 工厂详情
 */
export interface IEsiFactoryDetails {
  schematic_id: number
}

/**
 * 行星的传送路线
 */
export interface IEsiPlanetRoute {
  content_type_id: number
  destination_pin_id: number
  quantity: number
  route_id: number
  source_pin_id: number
  waypoints?: number[]
}

/**
 * 蓝图示意图
 */
export interface IEsiSchematic {
  cycle_time: number
  schematic_name: string
}

/**
 * 海关办公室
 */
export interface IEsiCustomsOffice {
  alliance_id?: number
  allow_standings_access: boolean
  corporation_id?: number
  reinforce_hour: number
  standing_level: number
  structure_id: number
  system_id: number
  tax_rate?: number
}
