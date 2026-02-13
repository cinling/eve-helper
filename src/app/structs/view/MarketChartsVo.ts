/**
 * 市场图表数据
 */
export interface IMarketChartsVo {
  date: string[]
  average: number[]
  /**
   * 20天平均
   */
  average_20d: number[]
  highest: number[]
  lowest: number[]
  order_count: number[]
  volume: number[]
}