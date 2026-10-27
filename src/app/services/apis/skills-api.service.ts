import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiCharacterSkills, IEsiSkillQueueItem } from '../../structs/esi/SkillModels';

@Injectable({
  providedIn: 'root'
})
export class SkillsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的技能
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersSkills(accessToken: string, characterId: number): Observable<IEsiCharacterSkills> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/skills/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterSkills))
  }

  /**
   * 获取角色的技能队列
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersSkillQueue(accessToken: string, characterId: number): Observable<IEsiSkillQueueItem[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/skillqueue/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiSkillQueueItem[]))
  }
}
