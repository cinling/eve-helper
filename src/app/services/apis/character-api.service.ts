import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiCharacter } from '../../structs/esi/Character';
import { IEsiCharactersAffiliationItem } from '../../structs/esi/CharactersAffiliationItem';
import {
  IEsiAgentsResearch,
  IEsiCharacterBlueprint,
  IEsiCharacterCorporationRoles,
  IEsiCharacterFatigue,
  IEsiCharacterMedal,
  IEsiCharacterPortrait,
  IEsiCharacterRoles,
  IEsiCharacterTitle,
  IEsiContactNotification,
  IEsiCspaRequest,
  IEsiNotification,
  IEsiStanding,
} from '../../structs/esi/CharacterModels';

@Injectable({
  providedIn: 'root'
})
export class CharacterApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

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
   * 获取角色的研究进度
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersAgentsResearch(accessToken: string, characterId: number): Observable<IEsiAgentsResearch[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/agents_research`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiAgentsResearch[]))
  }

  /**
   * 获取角色的蓝图列表
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersBlueprints(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCharacterBlueprint>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/blueprints` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCharacterBlueprint[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的军团职位
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersCorporationRoles(accessToken: string, characterId: number): Observable<IEsiCharacterCorporationRoles> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/corporationroles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterCorporationRoles))
  }

  /**
   * 获取角色的疲劳度
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersFatigue(accessToken: string, characterId: number): Observable<IEsiCharacterFatigue> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/fatigue`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterFatigue))
  }

  /**
   * 获取角色的勋章列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersMedals(accessToken: string, characterId: number): Observable<IEsiCharacterMedal[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/medals`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterMedal[]))
  }

  /**
   * 获取角色的通知列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersNotifications(accessToken: string, characterId: number): Observable<IEsiNotification[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/notifications`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiNotification[]))
  }

  /**
   * 获取角色的联系人通知列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersNotificationsContacts(accessToken: string, characterId: number): Observable<IEsiContactNotification[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/notifications/contacts`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContactNotification[]))
  }

  /**
   * 获取角色头像
   * @param characterId
   * @returns
   */
  charactersPortrait(characterId: number): Observable<IEsiCharacterPortrait> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/portrait`)
      .pipe(map(response => response as IEsiCharacterPortrait))
  }

  /**
   * 获取角色的权限
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersRoles(accessToken: string, characterId: number): Observable<IEsiCharacterRoles> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/roles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterRoles))
  }

  /**
   * 获取角色的声望
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersStandings(accessToken: string, characterId: number): Observable<IEsiStanding[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/standings`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiStanding[]))
  }

  /**
   * 获取角色的头衔列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersTitles(accessToken: string, characterId: number): Observable<IEsiCharacterTitle[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/titles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterTitle[]))
  }

  /**
   * 计算角色间发送邮件所需的CSPA费用
   * @param accessToken
   * @param characterId
   * @param characterIds 目标角色id列表
   * @returns
   */
  charactersCspa(accessToken: string, characterId: number, characterIds: number[]): Observable<number> {
    let request: IEsiCspaRequest = {
      characters: characterIds
    }
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/cspa`, request, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 批量获取角色的归属信息（军团、联盟、势力）
   * @param characterIds 最多1000个
   * @returns
   */
  charactersAffiliation(characterIds: number[]): Observable<IEsiCharactersAffiliationItem[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/affiliation/`, characterIds)
      .pipe(map(response => response as IEsiCharactersAffiliationItem[]))
  }
}
