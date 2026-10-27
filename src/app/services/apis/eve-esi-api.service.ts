import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { EIS_MARKETS_GROUPS, ESI_BASE_URL, ESI_UNIVERSE_CATEGORIES, ESI_UNIVERSE_CONSTELLATIONS, ESI_UNIVERSE_GRAPHICS, ESI_UNIVERSE_GROUPS, ESI_UNIVERSE_REGIONS, ESI_UNIVERSE_STATIONS, ESI_UNIVERSE_SYSTEMS, ESI_UNIVERSE_TYPES, getEsiMarketsRegionHistoryUrl, getEsiMarketsRegionOrdersUrl } from '../../statics/contants/esi-api';
import { IGroup, IType } from '../../statics/entities/common';
import { IMarketGroup } from '../../statics/entities/MarketGroup';
import { IEsiMarketHistory } from '../../structs/esi/MarketHistory';
import { IEsiOrder } from '../../structs/esi/Order';
import { IEsiSystem } from '../../structs/esi/System';
import { IEsiStation } from '../../structs/esi/Station';
import { IEsiConstellation } from '../../structs/esi/Constellation';
import { PageValue } from '../../structs/PageValue';
import { IEisAsset } from '../../structs/esi/Asset';
import { IEsiCharactersAssetsNames } from '../../structs/esi/CharactersAssetsNames';
import { IEsiCharactersAffiliationItem } from '../../structs/esi/CharactersAffiliationItem';
import { IEsiStructure } from '../../structs/esi/Structure';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { IEsiCharacter } from '../../structs/esi/Character';

@Injectable({
  providedIn: 'root'
})
export class EveEsiApiService {

  constructor(
    private httpClient: HttpClient
  ) {}


  public universeTypes(): Observable<number[]>{
    return new Observable<number[]>(sub => { setTimeout(async() => {
      let types = await firstValueFrom(this.httpClient.get(ESI_UNIVERSE_TYPES)) as number[]
      sub.next(types)
      sub.complete()
    }) })
  }

  public universeType(typeId: number): Observable<IType> {
    return new Observable<IType>(sub => { setTimeout(async() => {
      let type = await firstValueFrom(this.httpClient.get(`${ESI_UNIVERSE_TYPES}/${typeId}`)) as IType
      sub.next(type)
      sub.complete()
    }) })
  }

  /**
   * @returns 所有分类ID
   */
  public universeCategories(): Observable<number[]> {
    return new Observable<number[]>(sub => { setTimeout(async() => {
      let categories = await firstValueFrom(this.httpClient.get(ESI_UNIVERSE_CATEGORIES)) as number[]
      sub.next(categories)
      sub.complete()
    }) })
  }

  public universeCategory(categoryId: number): Observable<any> {
    return new Observable<any>(sub => {
      this.httpClient.get(`${ESI_UNIVERSE_CATEGORIES}/${categoryId}`).subscribe(response => {
        sub.next(response as any)
        sub.complete()
      })
    })
  }

  public universeGroups(): Observable<number[]> {
    return new Observable<number[]>(sub => {
      this.httpClient.get(ESI_UNIVERSE_GROUPS).subscribe(response => {
        sub.next(response as number[])
        sub.complete()
      })
    })
  }

  public universeGroup(groupId: number): Observable<IGroup> {
    return new Observable<IGroup>(sub => {
      this.httpClient.get(`${ESI_UNIVERSE_GROUPS}/${groupId}`).subscribe(response => {
        sub.next(response as IGroup)
        sub.complete()
      })
    })
  }

  /**
   * 获取所有市场分类
   * @returns
   */
  public marketsGroups(): Observable<number[]> {
    return new Observable<number[]>(sub => {
      this.httpClient.get(EIS_MARKETS_GROUPS).subscribe(response => {
        sub.next(response as number[])
        sub.complete()
      })
    })
  }

  /**
   * 获取市场分类
   * @param marketGroupId 市场分类ID
   * @returns
   */
  public marketsGroup(marketGroupId: number): Observable<IMarketGroup | null> {
    return new Observable<IMarketGroup | null>(sub => {
      this.httpClient.get(`${EIS_MARKETS_GROUPS}/${marketGroupId}`).subscribe(response => {
        if (response) {
          sub.next(response as IMarketGroup)
        } else {
          sub.next(null)
        }

        sub.complete()
      })
    })
  }

  /**
   * 获取所有图片id的数据
   * @returns
   */
  public universeGraphics(): Observable<number[]> {
    return new Observable(sub => { setTimeout(async() => {
      let graphicsIds = await firstValueFrom(this.httpClient.get(ESI_UNIVERSE_GRAPHICS)) as number[]
      sub.next(graphicsIds)
      sub.complete()
    }) })
  }

  /**
   * 获取图片id的数据
   * @param graphicsId 图片id
   * @returns
   */
  public universeGraphic(graphicsId: number): Observable<any> {
    return new Observable(sub => { setTimeout(async() => {
      let graphic = await firstValueFrom(this.httpClient.get(`${ESI_UNIVERSE_GRAPHICS}/${graphicsId}`))
      sub.next(graphic)
      sub.complete()
    }) })
  }

  /**
   *
   * @returns 所有星域的id
   */
  public universeRegions(): Observable<number[]> {
    return new Observable(sub => { setTimeout(async() => {
      let regionIds = await firstValueFrom(this.httpClient.get(`${ESI_UNIVERSE_REGIONS}`)) as number[]
      sub.next(regionIds)
      sub.complete()
    }) })
  }

  /**
   * 获取星域id的数据
   * @param regionId 星域id
   * @returns
   */
  public universeRegion(regionId: number): Observable<any> {
    return new Observable(sub => { setTimeout(async() => {
      let region = await firstValueFrom(this.httpClient.get(`${ESI_UNIVERSE_REGIONS}/${regionId}`))
      sub.next(region)
      sub.complete()
    }) })
  }

  /**
   * 获取星域物品历史价格信息
   * @param regionId
   * @param typeId
   * @returns
   */
  marketsRegionHistory(regionId: number, typeId: number): Observable<IEsiMarketHistory[]> {
    return new Observable(sub => {
      this.httpClient.get(getEsiMarketsRegionHistoryUrl(regionId, typeId)).subscribe(response => {
        sub.next(response as IEsiMarketHistory[])
        sub.complete()
      })
    })
  }

  /**
   * 获取星域物品订单信息
   *
   * 接口的数据缓存时间：300s
   * 每次请求最大数据返回条数：maxItems: 1000
   * @param regionId 星域id
   * @param page 页码
   * @param orderType 订单类型
   * @param type_id 物品id
   */
  marketsRegionOrders(regionId: number, orderType: 'buy' | 'sell' | 'all' = 'all', page: number = 1, type_id?: number): Observable<IEsiOrder[]> {
    return new Observable(sub => { setTimeout(async() => {
      this.httpClient.get(getEsiMarketsRegionOrdersUrl(regionId, orderType, page, type_id)).subscribe({
        next: v => {
          sub.next(v as IEsiOrder[])
          sub.complete()
        },
        error: e => {
          console.error(`EveEsiApi.marketsRegionOrders get region[${regionId}] orders[${page}] failed`, e)
          sub.next([])
          sub.complete()
        }
      })
    })})
  }

  universeSystems(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_SYSTEMS).pipe(map(response => response as number[]))
  }

  universeSystem(systemId: number): Observable<IEsiSystem> {
    return this.httpClient.get(`${ESI_UNIVERSE_SYSTEMS}/${systemId}`).pipe(map(response => response as IEsiSystem))
  }

  universeStation(stationId: number): Observable<IEsiStation> {
    return this.httpClient.get(`${ESI_UNIVERSE_STATIONS}/${stationId}`).pipe(map(response => response as IEsiStation))
  }

  universeConstellation(constellationId: number): Observable<IEsiConstellation> {
    return this.httpClient.get(`${ESI_UNIVERSE_CONSTELLATIONS}/${constellationId}`).pipe(map(response => response as IEsiConstellation))
  }

  /**
   * 获取建筑信息
   * @param structureId
   */
  universeStructure(accessToken: string, structureId: number): Observable<IEsiStructure | null> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/structures/${structureId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .pipe(map(response => response as IEsiStructure))
      .pipe(catchError(err => {
        console.error(`EveEsiApi.universeStructure(${structureId}) failed`, err);
        return of(null)
      }))
  }

  /**
   * 获取角色资产信息
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersAssets(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEisAsset>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/assets` + "?uuid=" + ValueHelper.uuid()
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
      let assets = response.body as IEisAsset[]
      return {
        page: 1,
        size: size,
        data: assets
      }
    }))
  }

  /**
   * 获取位置、物品的名字
   * @param accessToken
   * @param characterId
   * @param itemIds 最多1000个
   * @returns
   */
  charactersAssetsNames(accessToken: string, characterId: number, itemIds: number[]): Observable<IEsiCharactersAssetsNames[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/assets/names`, itemIds, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiCharactersAssetsNames[]))
  }

  /**
   * 获取角色所属联盟、军团、势力信息
   * @param characterIds
   * @returns
   */
  charactersAffiliation(characterIds: number[]): Observable<IEsiCharactersAffiliationItem[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/affiliation/`, characterIds)
      .pipe(map(response => response as IEsiCharactersAffiliationItem[]))
  }

  /**
   * 获取角色最近的击杀的损失
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersKillMailsRecent(accessToken: string, characterId: number): Observable<any> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/killmails/recent`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }

  /**
   * 获取角色公开信息
   * @param characterId
   * @returns
   */
  character(characterId: number): Observable<IEsiCharacter> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}`)
      .pipe(map(response => response as IEsiCharacter))
  }


  /**
   * 获取军团资产数据
   */
  corporationsAssets(accessToken: string, corporation_id: number, page: number | undefined = undefined): Observable<PageValue<IEisAsset>> {
    // https://esi.evetech.net/corporations/{corporation_id}/assets
    let url = `${ESI_BASE_URL}/corporations/${corporation_id}/assets` + "?uuid=" + ValueHelper.uuid()
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
      let assets = response.body as IEisAsset[]
      return {
        page: 1,
        size: size,
        data: assets
      }
    }))
  }
}
