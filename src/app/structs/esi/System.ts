/**
 * ESI 星系数据
 */
export interface IEsiSystem {
  constellation_id: number
  name: string
  plants?: {
    asteroid_belts?: number[]
    moons?: number[]
    planet_id: number
  }
  position: {
    x: number
    y: number
    z: number
  }
  security_class?: string
  security_status: number
  star_id?: number
  stargates?: number[]
  stations?: number[]
  system_id: number
}