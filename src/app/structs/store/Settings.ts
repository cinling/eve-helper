import { PriceType } from "../../statics/contants/market"

/**
 * 应用设置
 */
export interface IStoreSettings {
  /**
   * 工业设置
   */
  industry: ISettingIndustry

  /**
   * 市场配置数据
   */
  market: ISettingsMarket

  /**
   * 库存资产设置
   */
  asset: IAsset
}

/**
 * 市场配置数据
 */
export interface ISettingsMarket {
  /**
   * 数据过期时间
   */
  expireMin: number,

  /**
   * 默认市场
   * @deprecated 已废弃，建议使用 defaultMarketKey
   */
  defaultStationId?: number,

  /**
   * 默认市场key
   * 市场不一定是一个空间站，可能是一个星系
   * 结构： systemId + '-' + stationId
   */
  defaultMarketKey: string,

  /**
   * 市场数据
   */
  stations: ISettingsMarketStation[]
}

/**
 * 市场地点配置数据
 */
export interface ISettingsMarketStation {

  /**
   * 星系id
   */
  systemId: number,

  /**
   * 空间站id （如果有）
   */
  stationId?: number,

  /**
   * 别称
   */
  alias: string,

  /**
   * 是否自动加载数据
   */
  autoloading: boolean
}

/**
 * 工业设置
 */
export interface ISettingIndustry {
  /**
   * 材料价格配置
   */
  material: ISettingIndustryPrice,

  /**
   * 产品价格配置
   */
  product: ISettingIndustryPrice,

  /**
   * 材料效率
   * 单位：%
   * 范围：[0-10] 整数
   */
  meterialEfficiency: number,

  /**
   * 时间效率
   * 单位：%
   * 范围：[0-10] 整数
   */
  timeEfficiency: number,
}

export interface ISettingIndustryPrice {
    /**
   * 材料市场key
   */
  marketKey: string,

  /**
   * 材料价格类型
   */
  priceType: PriceType,

  /**
   * 材料价格折扣。单位：%
   */
  discount: number,
}

/**
 * 库存资产设置
 */
export interface IAsset {
  /**
   * 数据有效期
   * 单位：小时
   */
  expireHour: number
}


/**
 * 构建市场key
 * @param systemId
 * @param stationId
 * @returns
 */
export function makeMarketKeyByValue(systemId: number, stationId?: number): string {
  let key = systemId + "-"
  if (stationId) {
    key += stationId
  }
  return key
}

/**
 * 构建市场key
 * @param station
 * @returns
 */
export function makeMarketKey(station: ISettingsMarketStation) {
  return makeMarketKeyByValue(station.systemId, station.stationId)
}

export function getMarketKeySystemId(marketKey: string): number {
  return Number(marketKey.split("-")[0])
}

export function getMarketKeyStationId(marketKey: string): number | null {
  let stationId = marketKey.split("-")[1]
  if (stationId) {
    return Number(stationId)
  }
  return null
}