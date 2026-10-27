
/**
 * 资产位置数据
 */
export interface IEsiCharactersAssetsLocations {
  item_id: number
  position: IEsiPosition
}

/**
 * 空间坐标
 */
export interface IEsiPosition {
  x: number
  y: number
  z: number
}
