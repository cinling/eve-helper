
import { IEsiPosition } from './CharactersAssetsLocations';

/**
 * 血统的祖先
 */
export interface IEsiAncestry {
  bloodline_id: number
  description: string
  icon_id: number
  id: number
  name: string
  short_description?: string
}

/**
 * 小行星带
 */
export interface IEsiAsteroidBelt {
  name: string
  position: IEsiPosition
  system_id: number
}

/**
 * 血统
 */
export interface IEsiBloodline {
  bloodline_id: number
  charisma: number
  corporation_id: number
  description: string
  intelligence: number
  memory: number
  name: string
  perception: number
  ship_type_id: number
  willpower: number
}

/**
 * 势力
 */
export interface IEsiFaction {
  corporation_id?: number
  description: string
  faction_id: number
  is_unique: boolean
  militia_corporation_id?: number
  name: string
  size_factor: number
  solar_system_id?: number
  station_count: number
  station_system_count: number
}

/**
 * 卫星
 */
export interface IEsiMoon {
  asteroid_belt_id?: number
  constellation_id: number
  name: string
  position: IEsiPosition
  planet_id: number
  system_id: number
}

/**
 * 行星
 */
export interface IEsiPlanet {
  asteroid_belt_id?: number
  constellation_id: number
  name: string
  planet_id: number
  position: IEsiPosition
  system_id: number
  type_id: number
}

/**
 * 种族
 */
export interface IEsiRace {
  alliance_id: number
  description: string
  name: string
  race_id: number
}

/**
 * 星门
 */
export interface IEsiStargate {
  constellation_id: number
  destination: IEsiStargateDestination
  name: string
  position: IEsiPosition
  solar_system_id: number
  stargate_id: number
  type_id: number
}

/**
 * 星门目的地
 */
export interface IEsiStargateDestination {
  stargate_id: number
  system_id: number
}

/**
 * 恒星
 */
export interface IEsiStar {
  age: number
  luminosity: number
  name: string
  radius: number
  solar_system_id: number
  spectral_class: string
  temperature: number
  type_id: number
}

/**
 * 宇宙对象的名称
 */
export interface IEsiUniverseName {
  category: 'alliance' | 'character' | 'constellation' | 'corporation' | 'inventory_type' | 'region' | 'solar_system' | 'station' | 'faction' | 'structure'
  id: number
  name: string
}
