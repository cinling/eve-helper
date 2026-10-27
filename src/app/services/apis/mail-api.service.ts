import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiMail, IEsiMailCreated, IEsiMailHeader, IEsiMailLabel, IEsiMailLabels, IEsiMailSend } from '../../structs/esi/MailModels';

@Injectable({
  providedIn: 'root'
})
export class MailApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的邮件列表
   * @param accessToken
   * @param characterId
   * @param lastMailId 只返回该邮件id之前的邮件
   * @param page
   * @returns
   */
  charactersMails(accessToken: string, characterId: number, lastMailId: number | undefined = undefined, page: number | undefined = undefined): Observable<PageValue<IEsiMailHeader>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/mail/` + "?uuid=" + ValueHelper.uuid()
    if (lastMailId) {
      url += `&last_mail_id=${lastMailId}`
    }
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
      let data = response.body as IEsiMailHeader[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的邮件标签列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersMailLabels(accessToken: string, characterId: number): Observable<IEsiMailLabels> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/mail/labels/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiMailLabels))
  }

  /**
   * 添加角色的邮件标签
   * @param accessToken
   * @param characterId
   * @param name 标签名
   * @param color 标签颜色
   * @returns 新增的标签id
   */
  charactersMailLabelsAdd(accessToken: string, characterId: number, name: string, color: string = '#ffffff'): Observable<number> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/mail/labels/`, {
      name: name,
      color: color
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 删除角色的邮件标签
   * @param accessToken
   * @param characterId
   * @param labelId
   * @returns
   */
  charactersMailLabelsDelete(accessToken: string, characterId: number, labelId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/characters/${characterId}/mail/labels/${labelId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 获取角色的邮件详情
   * @param accessToken
   * @param characterId
   * @param mailId
   * @returns
   */
  charactersMail(accessToken: string, characterId: number, mailId: number): Observable<IEsiMail> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/mail/${mailId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiMail))
  }

  /**
   * 发送邮件
   * @param accessToken
   * @param characterId
   * @param mail 邮件数据
   * @returns
   */
  charactersMailSend(accessToken: string, characterId: number, mail: IEsiMailSend): Observable<IEsiMailCreated> {
    return this.httpClient.post(`${ESI_BASE_URL}/characters/${characterId}/mail/`, mail, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => response as IEsiMailCreated))
  }

  /**
   * 删除邮件
   * @param accessToken
   * @param characterId
   * @param mailId
   * @returns
   */
  charactersMailDelete(accessToken: string, characterId: number, mailId: number): Observable<void> {
    return this.httpClient.delete(`${ESI_BASE_URL}/characters/${characterId}/mail/${mailId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 更新邮件的阅读状态和标签
   * @param accessToken
   * @param characterId
   * @param mailId
   * @param read 是否已读
   * @param labelIds 标签id列表
   * @returns
   */
  charactersMailUpdate(accessToken: string, characterId: number, mailId: number, read: boolean | undefined = undefined, labelIds: number[] | undefined = undefined): Observable<void> {
    let body: { read?: boolean, labels?: number[] } = {}
    if (read != undefined) {
      body.read = read
    }
    if (labelIds != undefined) {
      body.labels = labelIds
    }

    return this.httpClient.put(`${ESI_BASE_URL}/characters/${characterId}/mail/${mailId}/`, body, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }
}
