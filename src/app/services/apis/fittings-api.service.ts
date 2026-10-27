import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiFitting, IEsiFittingCreated, IEsiFittingInput } from '../../structs/esi/FittingModels';

@Injectable({
  providedIn: 'root'
})
export class FittingsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的装配列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersFittings(accessToken: string, characterId: number): Observable<IEsiFitting[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/fittings/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiFitting[]))
  }

  /**
   * 添加角色的装配
   * @param accessToken
   * @param characterId
   * @param fitting 装配数据
   * @returns
   */
  charactersFittingsAdd(accessToken: string, characterId: number, fitting: IEsiFittingInput): Observable<IEsiFittingCreated> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/fittings/`, fitting, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiFittingCreated))
  }

  /**
   * 删除角色的装配
   * @param accessToken
   * @param characterId
   * @param fittingId
   * @returns
   */
  charactersFittingsDelete(accessToken: string, characterId: number, fittingId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/characters/${characterId}/fittings/${fittingId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }
}
