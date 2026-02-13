/**
 * 市场相关的常量、类型
 */


/**
 * 市场数节点模式
 * 'market' 市场模式
 * 'blueprint' 蓝图模式
 */
export type MarketTreeMode = 'market' | 'blueprint'
export class MarketTreeModeConstants {
  static readonly Market: MarketTreeMode = 'market'
  static readonly Blueprint: MarketTreeMode = 'blueprint'
}


/**
 * 市场节点类型
 */
export type MarketNodeType = 'marketGroup' | 'type'
export class MarketNodeTypeConstants {
  static readonly MarketGroup: MarketNodeType = 'marketGroup'
  static readonly Type: MarketNodeType = 'type'
}

/**
 * 市场价格类型
 */
export type PriceType = 'average' | 'lowestSell' | 'highestBuy' | 'average20d' | 'middle'
export class PriceTypeConstants {
  static readonly LowestSell: PriceType = 'lowestSell'
  static readonly HighestBuy: PriceType = 'highestBuy'
  static readonly Average: PriceType = 'average'
  static readonly Average20d: PriceType = 'average20d'
  static readonly Middle: PriceType = 'middle'
}