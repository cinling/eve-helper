import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import {
  IEsiCharacterFleet,
  IEsiFleet,
  IEsiFleetInvite,
  IEsiFleetMember,
  IEsiFleetSquadCreated,
  IEsiFleetWing,
  IEsiFleetWingCreated,
} from '../../structs/esi/FleetModels';

@Injectable({
  providedIn: 'root'
})
export class FleetsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取舰队信息
   * @param accessToken
   * @param fleetId
   * @returns
   */
  fleets(accessToken: string, fleetId: number): Observable<IEsiFleet> {
    return this.httpClient.get(`${ESI_BASE_URL}/fleets/${fleetId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiFleet))
  }

  /**
   * 更新舰队信息
   * @param accessToken
   * @param fleetId
   * @param isFreeMove
   * @param isRegistered
   * @param motd
   * @returns
   */
  fleetsUpdate(accessToken: string, fleetId: number, isFreeMove: boolean | undefined = undefined, isRegistered: boolean | undefined = undefined, motd: string | undefined = undefined): Observable<void> {
    let body: { is_free_move?: boolean, is_registered?: boolean, motd?: string } = {}
    if (isFreeMove != undefined) {
      body.is_free_move = isFreeMove
    }
    if (isRegistered != undefined) {
      body.is_registered = isRegistered
    }
    if (motd != undefined) {
      body.motd = motd
    }

    return this.httpClient.put(`${ESI_BASE_URL}/fleets/${fleetId}/`, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取舰队的成员列表
   * @param accessToken
   * @param fleetId
   * @param page
   * @returns
   */
  fleetsMembers(accessToken: string, fleetId: number, page: number | undefined = undefined): Observable<PageValue<IEsiFleetMember>> {
    let url = `${ESI_BASE_URL}/fleets/${fleetId}/members/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiFleetMember[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 邀请成员加入舰队
   * @param accessToken
   * @param fleetId
   * @param members 邀请的成员列表
   * @returns
   */
  fleetsMembersInvite(accessToken: string, fleetId: number, members: IEsiFleetInvite[]): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/fleets/${fleetId}/members/`, members, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 将成员移出舰队
   * @param accessToken
   * @param fleetId
   * @param memberId
   * @returns
   */
  fleetsMembersKick(accessToken: string, fleetId: number, memberId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/fleets/${fleetId}/members/${memberId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 更新舰队成员的职位
   * @param accessToken
   * @param fleetId
   * @param memberId
   * @param role 职位
   * @param roleName
   * @param squadId
   * @param wingId
   * @returns
   */
  fleetsMembersUpdate(accessToken: string, fleetId: number, memberId: number, role: string | undefined = undefined, roleName: string | undefined = undefined, squadId: number | undefined = undefined, wingId: number | undefined = undefined): Observable<void> {
    let body: { role?: string, role_name?: string, squad_id?: number, wing_id?: number } = {}
    if (role != undefined) {
      body.role = role
    }
    if (roleName != undefined) {
      body.role_name = roleName
    }
    if (squadId != undefined) {
      body.squad_id = squadId
    }
    if (wingId != undefined) {
      body.wing_id = wingId
    }

    return this.httpClient.put(`${ESI_BASE_URL}/fleets/${fleetId}/members/${memberId}/`, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取舰队的翅膀列表
   * @param accessToken
   * @param fleetId
   * @returns
   */
  fleetsWings(accessToken: string, fleetId: number): Observable<IEsiFleetWing[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/fleets/${fleetId}/wings/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiFleetWing[]))
  }

  /**
   * 创建舰队的翅膀
   * @param accessToken
   * @param fleetId
   * @param name 翅膀名
   * @returns
   */
  fleetsWingsAdd(accessToken: string, fleetId: number, name: string | undefined = undefined): Observable<IEsiFleetWingCreated> {
    let body: { name?: string } = {}
    if (name != undefined) {
      body.name = name
    }

    return this.httpClient.post(`${ESI_BASE_URL}/fleets/${fleetId}/wings/`, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiFleetWingCreated))
  }

  /**
   * 删除舰队的翅膀
   * @param accessToken
   * @param fleetId
   * @param wingId
   * @returns
   */
  fleetsWingsDelete(accessToken: string, fleetId: number, wingId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/fleets/${fleetId}/wings/${wingId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 重命名舰队的翅膀
   * @param accessToken
   * @param fleetId
   * @param wingId
   * @param name 新名字
   * @returns
   */
  fleetsWingsUpdate(accessToken: string, fleetId: number, wingId: number, name: string): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/fleets/${fleetId}/wings/${wingId}/`, {
      name: name
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 创建翅膀下的小队
   * @param accessToken
   * @param fleetId
   * @param wingId
   * @param name 小队名
   * @returns
   */
  fleetsSquadsAdd(accessToken: string, fleetId: number, wingId: number, name: string | undefined = undefined): Observable<IEsiFleetSquadCreated> {
    let body: { name?: string } = {}
    if (name != undefined) {
      body.name = name
    }

    return this.httpClient.post(`${ESI_BASE_URL}/fleets/${fleetId}/wings/${wingId}/squads/`, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiFleetSquadCreated))
  }

  /**
   * 删除翅膀下的小队
   * @param accessToken
   * @param fleetId
   * @param wingId
   * @param squadId
   * @returns
   */
  fleetsSquadsDelete(accessToken: string, fleetId: number, wingId: number, squadId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/fleets/${fleetId}/wings/${wingId}/squads/${squadId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 重命名翅膀下的小队
   * @param accessToken
   * @param fleetId
   * @param wingId
   * @param squadId
   * @param name 新名字
   * @returns
   */
  fleetsSquadsUpdate(accessToken: string, fleetId: number, wingId: number, squadId: number, name: string): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/fleets/${fleetId}/wings/${wingId}/squads/${squadId}/`, {
      name: name
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取角色所在的舰队
   * @param accessToken
   * @param characterId
   * @returns
   */
  characterFleet(accessToken: string, characterId: number): Observable<IEsiCharacterFleet> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/fleet/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCharacterFleet))
  }
}
