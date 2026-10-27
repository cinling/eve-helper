import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiKillmail, IEsiKillmailRecent } from '../../structs/esi/KillmailModels';

@Injectable({
  providedIn: 'root'
})
export class KillmailsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取击杀邮件的详情
   * @param killmailId
   * @param killmailHash
   * @returns
   */
  killmail(killmailId: number, killmailHash: string): Observable<IEsiKillmail> {
    return this.httpClient.get(`${ESI_BASE_URL}/killmails/${killmailId}/${killmailHash}/`)
      .pipe(map(response => response as IEsiKillmail))
  }

  /**
   * 获取角色的最近击杀记录
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersKillMailsRecent(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiKillmailRecent>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/killmails/recent/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiKillmailRecent[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的最近击杀记录
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsKillMailsRecent(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiKillmailRecent>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/killmails/recent/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiKillmailRecent[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }
}
