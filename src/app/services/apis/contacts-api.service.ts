import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiContact, IEsiContactInput, IEsiContactLabel } from '../../structs/esi/ContactModels';

@Injectable({
  providedIn: 'root'
})
export class ContactsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的联系人列表
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersContacts(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiContact>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/contacts/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiContact[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 添加角色的联系人
   * @param accessToken
   * @param characterId
   * @param contacts 联系人列表
   * @returns 新增的联系人id
   */
  charactersContactsAdd(accessToken: string, characterId: number, contacts: IEsiContactInput[]): Observable<number[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/contacts/`, contacts, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as number[]))
  }

  /**
   * 更新角色的联系人
   * @param accessToken
   * @param characterId
   * @param contacts 联系人列表
   * @returns
   */
  charactersContactsUpdate(accessToken: string, characterId: number, contacts: IEsiContactInput[]): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/characters/${characterId}/contacts/`, contacts, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 删除角色的联系人
   * @param accessToken
   * @param characterId
   * @param contactIds 联系人id列表
   * @returns
   */
  charactersContactsDelete(accessToken: string, characterId: number, contactIds: number[]): Observable<void> {
    return this.httpClient.request('delete', `${ESI_BASE_URL}/characters/${characterId}/contacts/`, {
      body: contactIds,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取角色的联系人标签列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersContactsLabels(accessToken: string, characterId: number): Observable<IEsiContactLabel[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/contacts/labels/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContactLabel[]))
  }

  /**
   * 添加角色的联系人标签
   * @param accessToken
   * @param characterId
   * @param labelName 标签名
   * @returns 新增的标签id
   */
  charactersContactsLabelsAdd(accessToken: string, characterId: number, labelName: string): Observable<number> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/contacts/labels/`, {
      label_name: labelName
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 更新角色的联系人标签
   * @param accessToken
   * @param characterId
   * @param labelId
   * @param labelName 新标签名
   * @returns
   */
  charactersContactsLabelsUpdate(accessToken: string, characterId: number, labelId: number, labelName: string): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/characters/${characterId}/contacts/labels/${labelId}/`, {
      label_name: labelName
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 删除角色的联系人标签
   * @param accessToken
   * @param characterId
   * @param labelId
   * @returns
   */
  charactersContactsLabelsDelete(accessToken: string, characterId: number, labelId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/characters/${characterId}/contacts/labels/${labelId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取军团的联系人列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsContacts(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiContact>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/contacts/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiContact[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 添加军团的联系人
   * @param accessToken
   * @param corporationId
   * @param contacts 联系人列表
   * @returns 新增的联系人id
   */
  corporationsContactsAdd(accessToken: string, corporationId: number, contacts: IEsiContactInput[]): Observable<number[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/corporations/${corporationId}/contacts/`, contacts, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as number[]))
  }

  /**
   * 更新军团的联系人
   * @param accessToken
   * @param corporationId
   * @param contacts 联系人列表
   * @returns
   */
  corporationsContactsUpdate(accessToken: string, corporationId: number, contacts: IEsiContactInput[]): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/corporations/${corporationId}/contacts/`, contacts, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 删除军团的联系人
   * @param accessToken
   * @param corporationId
   * @param contactIds 联系人id列表
   * @returns
   */
  corporationsContactsDelete(accessToken: string, corporationId: number, contactIds: number[]): Observable<void> {
    return this.httpClient.request('delete', `${ESI_BASE_URL}/corporations/${corporationId}/contacts/`, {
      body: contactIds,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取军团的联系人标签列表
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsContactsLabels(accessToken: string, corporationId: number): Observable<IEsiContactLabel[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/contacts/labels/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContactLabel[]))
  }

  /**
   * 添加军团的联系人标签
   * @param accessToken
   * @param corporationId
   * @param labelName 标签名
   * @returns 新增的标签id
   */
  corporationsContactsLabelsAdd(accessToken: string, corporationId: number, labelName: string): Observable<number> {
    return this.httpClient.post(`${ESI_BASE_URL}/corporations/${corporationId}/contacts/labels/`, {
      label_name: labelName
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 更新军团的联系人标签
   * @param accessToken
   * @param corporationId
   * @param labelId
   * @param labelName 新标签名
   * @returns
   */
  corporationsContactsLabelsUpdate(accessToken: string, corporationId: number, labelId: number, labelName: string): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/corporations/${corporationId}/contacts/labels/${labelId}/`, {
      label_name: labelName
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 删除军团的联系人标签
   * @param accessToken
   * @param corporationId
   * @param labelId
   * @returns
   */
  corporationsContactsLabelsDelete(accessToken: string, corporationId: number, labelId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/corporations/${corporationId}/contacts/labels/${labelId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取联盟的联系人列表
   * @param allianceId
   * @returns
   */
  alliancesContacts(allianceId: number): Observable<IEsiContact[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/alliances/${allianceId}/contacts/`)
      .pipe(map(response => response as IEsiContact[]))
  }

  /**
   * 获取联盟的联系人标签列表
   * @param allianceId
   * @returns
   */
  alliancesContactsLabels(allianceId: number): Observable<IEsiContactLabel[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/alliances/${allianceId}/contacts/labels/`)
      .pipe(map(response => response as IEsiContactLabel[]))
  }
}
