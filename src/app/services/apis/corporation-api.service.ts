import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiStanding } from '../../structs/esi/CharacterModels';
import {
  IEsiContainerLog,
  IEsiCorporation,
  IEsiCorporationAllianceHistory,
  IEsiCorporationBlueprint,
  IEsiCorporationFacility,
  IEsiCorporationIcon,
  IEsiCorporationMedal,
  IEsiCorporationMedalIssued,
  IEsiCorporationMember,
  IEsiCorporationMemberTitle,
  IEsiCorporationMemberTracking,
  IEsiCorporationName,
  IEsiCorporationRole,
  IEsiCorporationRoleHistory,
  IEsiCorporationStructure,
  IEsiCorporationTitle,
  IEsiDivision,
  IEsiShareholder,
} from '../../structs/esi/CorporationModels';

@Injectable({
  providedIn: 'root'
})
export class CorporationApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取军团公开信息
   * @param corporationId
   * @returns
   */
  corporation(corporationId: number): Observable<IEsiCorporation> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}`)
      .pipe(map(response => response as IEsiCorporation))
  }

  /**
   * 获取军团的联盟历史
   * @param corporationId
   * @returns
   */
  corporationsAllianceHistory(corporationId: number): Observable<IEsiCorporationAllianceHistory[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/alliancehistory`)
      .pipe(map(response => response as IEsiCorporationAllianceHistory[]))
  }

  /**
   * 获取军团的蓝图列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsBlueprints(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCorporationBlueprint>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/blueprints` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCorporationBlueprint[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的容器日志
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsContainerLogs(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiContainerLog>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/containers/logs` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiContainerLog[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的部门
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsDivisions(accessToken: string, corporationId: number): Observable<IEsiDivision> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/divisions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiDivision))
  }

  /**
   * 获取军团的设施
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsFacilities(accessToken: string, corporationId: number): Observable<IEsiCorporationFacility[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/facilities`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCorporationFacility[]))
  }

  /**
   * 获取军团图标
   * @param corporationId
   * @returns
   */
  corporationsIcons(corporationId: number): Observable<IEsiCorporationIcon> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/icons`)
      .pipe(map(response => response as IEsiCorporationIcon))
  }

  /**
   * 获取军团的勋章列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsMedals(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCorporationMedal>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/medals` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCorporationMedal[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团已颁发的勋章列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsMedalsIssued(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCorporationMedalIssued>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/medals/issued` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCorporationMedalIssued[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的成员列表
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsMembers(accessToken: string, corporationId: number): Observable<IEsiCorporationMember[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/members`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCorporationMember[]))
  }

  /**
   * 获取军团的成员数量上限
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsMembersLimit(accessToken: string, corporationId: number): Observable<number> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/members/limit`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 获取军团成员的头衔列表
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsMembersTitles(accessToken: string, corporationId: number): Observable<IEsiCorporationMemberTitle[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/members/titles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCorporationMemberTitle[]))
  }

  /**
   * 获取军团成员追踪信息
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsMemberTracking(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCorporationMemberTracking>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/membertracking` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCorporationMemberTracking[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团成员的角色权限
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsRoles(accessToken: string, corporationId: number): Observable<IEsiCorporationRole[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/roles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCorporationRole[]))
  }

  /**
   * 获取军团成员的角色权限历史
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsRolesHistory(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCorporationRoleHistory>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/roles/history` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCorporationRoleHistory[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的股东列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsShareholders(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiShareholder>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/shareholders` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiShareholder[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的声望
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsStandings(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiStanding>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/standings` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiStanding[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的建筑结构列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsStructures(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCorporationStructure>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/structures` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCorporationStructure[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的头衔列表
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsTitles(accessToken: string, corporationId: number): Observable<IEsiCorporationTitle[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/titles`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCorporationTitle[]))
  }

  /**
   * 批量获取军团的名称
   * @param corporationIds 最多1000个
   * @returns
   */
  corporationsNames(corporationIds: number[]): Observable<IEsiCorporationName[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/corporations/names/`, corporationIds)
      .pipe(map(response => response as IEsiCorporationName[]))
  }

  /**
   * 获取所有NPC军团的id
   * @returns
   */
  corporationsNpcCorps(): Observable<number[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/corporations/npccorps/`, {})
      .pipe(map(response => response as number[]))
  }
}
