import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EIS_MARKETS_GROUPS, ESI_BASE_URL, getEsiMarketsRegionHistoryUrl, getEsiMarketsRegionOrdersUrl } from '../../statics/contants/esi-api';
import { IMarketGroup } from '../../statics/entities/MarketGroup';
import { PageValue } from '../../structs/PageValue';
import { IEsiMarketHistory } from '../../structs/esi/MarketHistory';
import { IEsiMarketPrice, IEsiStructureOrderInput } from '../../structs/esi/MarketModels';
import { IEsiOrder } from '../../structs/esi/Order';
import { ValueHelper } from '../../statics/helpers/ValueHelper';

@Injectable({
  providedIn: 'root'
})
export class MarketApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取全市场的平均物价
   * @returns
   */
  marketsPrices(): Observable<IEsiMarketPrice[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/markets/prices/`)
      .pipe(map(response => response as IEsiMarketPrice[]))
  }

  /**
   * 获取星域物品历史价格信息
   * @param regionId
   * @param typeId
   * @returns
   */
  marketsRegionHistory(regionId: number, typeId: number): Observable<IEsiMarketHistory[]> {
    return this.httpClient.get(getEsiMarketsRegionHistoryUrl(regionId, typeId))
      .pipe(map(response => response as IEsiMarketHistory[]))
  }

  /**
   * 获取星域物品订单信息
   *
   * 接口的数据缓存时间：300s
   * 每次请求最大数据返回条数：maxItems: 1000
   * @param regionId 星域id
   * @param orderType 订单类型
   * @param page 页码
   * @param typeId 物品id
   * @returns
   */
  marketsRegionOrders(regionId: number, orderType: 'buy' | 'sell' | 'all' = 'all', page: number = 1, typeId?: number): Observable<IEsiOrder[]> {
    return this.httpClient.get(getEsiMarketsRegionOrdersUrl(regionId, orderType, page, typeId))
      .pipe(map(response => response as IEsiOrder[]))
  }

  /**
   * 获取星域内可交易的物品id
   * @param regionId
   * @param page
   * @returns
   */
  marketsRegionTypes(regionId: number, page: number | undefined = undefined): Observable<PageValue<number>> {
    let url = `${ESI_BASE_URL}/markets/${regionId}/types/` + "?uuid=" + ValueHelper.uuid()
    if (page) {
      url += `&page=${page}`
    }

    return this.httpClient.get(url, {
      observe: 'response'
    }).pipe(map(response => {
      let size = Number(response.headers.get("X-Pages") ?? '1')
      let data = response.body as number[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取市场订单详情
   * @param orderId
   * @returns
   */
  marketsOrder(orderId: number): Observable<IEsiOrder> {
    return this.httpClient.get(`${ESI_BASE_URL}/markets/orders/${orderId}/`)
      .pipe(map(response => response as IEsiOrder))
  }

  /**
   * 获取所有市场分类
   * @returns
   */
  marketsGroups(): Observable<number[]> {
    return this.httpClient.get(EIS_MARKETS_GROUPS)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取市场分类
   * @param marketGroupId 市场分类ID
   * @returns
   */
  marketsGroup(marketGroupId: number): Observable<IMarketGroup | null> {
    return this.httpClient.get(`${EIS_MARKETS_GROUPS}/${marketGroupId}`).pipe(map(response => {
      if (response) {
        return response as IMarketGroup
      }
      return null
    }))
  }

  /**
   * 获取结构中的市场订单列表
   * @param accessToken
   * @param structureId
   * @param page
   * @returns
   */
  marketsStructureOrders(accessToken: string, structureId: number, page: number | undefined = undefined): Observable<PageValue<IEsiOrder>> {
    let url = `${ESI_BASE_URL}/markets/structures/${structureId}/` + "?uuid=" + ValueHelper.uuid()
    if (page) {
      url += `&page=${page}`
    }

    return this.httpClient.get(url, {
      observe: 'response',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => {
      let size = Number(response.headers.get("X-Pages") ?? '1')
      let data = response.body as IEsiOrder[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 提交结构中的市场订单
   * @param accessToken
   * @param structureId
   * @param orders 订单列表
   * @returns
   */
  marketsStructureOrdersUpdate(accessToken: string, structureId: number, orders: IEsiStructureOrderInput[]): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/markets/structures/${structureId}/`, {
      orders: orders
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }
}
