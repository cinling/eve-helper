
/**
 * AssetComponent 页面所需的数据
 */
export interface IAssetViewVo {
  /**
   * 资产数据
   */
  assetItemVos: IAssetItemVo[]

  /**
   * 上次更新时间
   */
  lastUpdateTime: string
}

/**
 * 资产表格一行的数据
 */
export interface IAssetItemVo {

  /**
   * id
   */
  id: number

  /**
   * 类型
   */
  type: AssetItemType

  /**
   * 类型id
   */
  typeId?: number

  /**
   * 名字
   */
  name: string

  /**
   * 预估价总价
   */
  amount: number

  /**
   * 数量
   */
  quantity?: number
  /**
   * nz-table 所需的key
   */
  key: string
  level?: number;
  expand?: boolean;
  children?: IAssetItemVo[]
  parent?: IAssetItemVo;
}


/**
 * 项目类型
 */
export type AssetItemType = "character" | "corporation" | "station" | "Structure" | "stationHangar" | "stationAssetSafety" | "pack" | "item" | "solarSystem"

export class AssetItemTypeConstants {
  /**
   * 角色
   */
  static readonly Character: AssetItemType = "character"

  /**
   * 军团
   */
  static readonly Corporation: AssetItemType = "corporation"

  /**
   * 空间站
   */
  static readonly Station: AssetItemType = "station"

  /**
   * 建筑
   */
  static readonly Structure: AssetItemType = "Structure";

  /**
   * 星系
   */
  static readonly SolarSystem: AssetItemType = "solarSystem"

  /**
   * 空间站-舰船机库
   */
  static readonly StationHangar: AssetItemType = "stationHangar"

  /**
   * 空间站-物品机库
   */
  static readonly StationAssetSafety: AssetItemType = "stationAssetSafety"

  /**
   * 集装箱/货柜
   */
  static readonly Pack: AssetItemType = "pack"

  /**
   * 物品
   */
  static readonly Item: AssetItemType = "item"
}