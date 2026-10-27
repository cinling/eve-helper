import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiCharacterClones } from '../../structs/esi/CloneModels';

@Injectable({
  providedIn: 'root'
})
export class ClonesApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的克隆信息
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersClones(accessToken: string, characterId: number): Observable<IEsiCharacterClones> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/clones/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterClones))
  }

  /**
   * 获取角色的植入体列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersImplants(accessToken: string, characterId: number): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/implants/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as number[]))
  }
}
