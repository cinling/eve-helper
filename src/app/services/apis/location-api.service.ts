import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiCharacterLocation, IEsiCharacterOnline, IEsiCharacterShip } from '../../structs/esi/LocationModels';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的当前位置
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersLocation(accessToken: string, characterId: number): Observable<IEsiCharacterLocation> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/location/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterLocation))
  }

  /**
   * 获取角色的在线状态
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersOnline(accessToken: string, characterId: number): Observable<IEsiCharacterOnline> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/online/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterOnline))
  }

  /**
   * 获取角色当前驾驶的飞船
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersShip(accessToken: string, characterId: number): Observable<IEsiCharacterShip> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/ship/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterShip))
  }
}
