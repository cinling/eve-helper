
/**
 * 市场物品信息
 * 经过处理的消息
 */
export interface IStoreMarketItem {
  /**
   * 物品id
   */
  typeId: number

  /**
   * 空间站id
   */
  locationId: number

  /**
   * 卖单最低价
   */
  sellPrice: number

  /**
   * 最低卖价的数量
   */
  sellAmount: number

  /**
   * 买单最高价
   */
  buyPrice: number

  /**
   * 最高价的数量
   */
  buyAmount: number

  /**
   * 一日内平均交易价格
   */
  daliyAvgPrice: number

  /**
   * 一日内平均交易数量
   */
  dailyAmount: number

  /**
   * 20天内平均交易价格
   */
  twentyDaysAvgPrice: number

  /**
   * 20天内平均交易量
   */
  twentyDaysAvgAmount: number

  /**
   * 数据更新时间
   */
  updateTime: number
}