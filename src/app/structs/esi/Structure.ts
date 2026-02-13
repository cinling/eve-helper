
/**
 * 建筑信息
 */
export interface IEsiStructure {
  name: string
  owner_id: number
  position: {
    x: number
    y: number
    z: number
  }
  solar_system_id: number
  type_id: number
}