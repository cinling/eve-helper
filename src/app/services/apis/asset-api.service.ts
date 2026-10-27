import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEisAsset } from '../../structs/esi/Asset';
import { IEsiCharactersAssetsLocations } from '../../structs/esi/CharactersAssetsLocations';
import { ObservableHelper } from '../../statics/helpers/ObservableHelper';
import { IEsiAssetsNames } from '../../structs/esi/AssetsModels';

@Injectable({
  providedIn: 'root'
})
export class AssetApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

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
   * 获取角色资产的名字
   * @param accessToken
   * @param characterId
   * @param itemIds 最多1000个
   * @returns
   */
  charactersAssetsNames(accessToken: string, characterId: number, itemIds: number[]): Observable<IEsiAssetsNames[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/assets/names`, itemIds, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiAssetsNames[]))
  }

  /**
   * 获取角色资产的位置
   * @param accessToken
   * @param characterId
   * @param itemIds 最多1000个
   * @returns
   */
  charactersAssetsLocations(accessToken: string, characterId: number, itemIds: number[]): Observable<IEsiCharactersAssetsLocations[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/assets/locations`, itemIds, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiCharactersAssetsLocations[]))
  }

  /**
   * 获取军团资产数据
   * @param accessToken
   * @param corporation_id
   * @param page
   * @returns
   */
  corporationsAssets(accessToken: string, corporation_id: number, page: number | undefined = undefined): Observable<PageValue<IEisAsset>> {
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

  /**
   * 获取军团资产的名字
   * 仅适用于自定义名字的物品。如舰船、货柜等
   * @param accessToken
   * @param corporation_id
   * @param itemIds 最多1000个
   * @returns
   */
  corporationsAssetsNames(accessToken: string, corporation_id: number, itemIds: number[]): Observable<IEsiAssetsNames[]> {
    if (itemIds.length > 1000) {
      return ObservableHelper.error<IEsiAssetsNames[]>("itemIds 最多1000个")
    }

    return this.httpClient.post(`${ESI_BASE_URL}/corporations/${corporation_id}/assets/names`, itemIds, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiAssetsNames[]))
  }

  /**
   * 获取军团资产的位置
   * @param accessToken
   * @param corporation_id
   * @param itemIds 最多1000个
   * @returns
   */
  corporationsAssetsLocations(accessToken: string, corporation_id: number, itemIds: number[]): Observable<IEsiCharactersAssetsLocations[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/corporations/${corporation_id}/assets/locations`, itemIds, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiCharactersAssetsLocations[]))
  }
}
