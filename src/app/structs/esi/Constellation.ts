/**
 * ESI 星座数据
 */
export interface IEsiConstellation {
  constellation_id: number,
  name: string,
  position: {
    x: number,
    y: number,
    z: number,
  },
  region_id: number,
  systems: number[],
}
