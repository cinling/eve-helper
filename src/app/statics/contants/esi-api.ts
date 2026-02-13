/**
 * esi api 相关的常量数据
 */


/**
 * 基础url
 */
export const ESI_BASE_URL = 'https://esi.evetech.net'

/**
 * 物品类型
 */
export const ESI_UNIVERSE_TYPES = `${ESI_BASE_URL}/universe/types`

/**
 * 物品名称
 */
export const ESI_UNIVERSE_NAMES = `${ESI_BASE_URL}/universe/names`

/**
 * 物品分类
 */
export const ESI_UNIVERSE_CATEGORIES = `${ESI_BASE_URL}/universe/categories`

/**
 * 物品分组
 */
export const ESI_UNIVERSE_GROUPS = `${ESI_BASE_URL}/universe/groups`

/**
 * 物品市场分组
 */
export const EIS_MARKETS_GROUPS = `${ESI_BASE_URL}/markets/groups`

/**
 * 物品图标
 */
export const ESI_UNIVERSE_GRAPHICS = `${ESI_BASE_URL}/universe/graphics`

/**
 * 获取所有星域
 */
export const ESI_UNIVERSE_REGIONS = `${ESI_BASE_URL}/universe/regions`

/**
 * 获取所有星系
 */
export const ESI_UNIVERSE_SYSTEMS = `${ESI_BASE_URL}/universe/systems`

/**
 * 空间站数据
 */
export const ESI_UNIVERSE_STATIONS = `${ESI_BASE_URL}/universe/stations`

/**
 * 星座数据
 */
export const ESI_UNIVERSE_CONSTELLATIONS = `${ESI_BASE_URL}/universe/constellations`

/**
 * 获取星域里物品的历史价格
 * @param regionId
 * @param typeId
 * @returns
 */
export function getEsiMarketsRegionHistoryUrl(regionId: number, typeId: number) {
  return `${ESI_BASE_URL}/markets/${regionId}/history?datasource=tranquility&type_id=${typeId}`
}

/**
 * 获取星域里物品的订单
 * @param regionId 星域id
 * @param order_type 订单类型
 * @param page 页码
 * @param type_id 物品id
 * @returns
 */
export function getEsiMarketsRegionOrdersUrl(regionId: number, order_type: 'buy' | 'sell' | 'all' = 'all', page: number = 1, typeId?: number) {
  let url = `${ESI_BASE_URL}/markets/${regionId}/orders/?datasource=tranquility&order_type=${order_type}&page=${page}`
  if (typeId) {
    url = url += `&type_id=${typeId}`
  }
  return url
}