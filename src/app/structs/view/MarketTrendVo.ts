
/**
 * 市场趋势数据
 */
export interface IMarketTrendVo {
  imgsrc: string
  name: string

  lowSellPrice: number
  highBuyPrice: number
  middlePrice: number
  orderCount: number
  lastDayAveragePrice: number
  lastDayVolume: number
  twentyDayAveragePrice: number
  twentyDayVolume: number
}