import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiCalendarAttendee, IEsiCalendarEvent, IEsiCalendarEventSummary, IEsiCalendarEventTypes } from '../../structs/esi/CalendarModels';

@Injectable({
  providedIn: 'root'
})
export class CalendarApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的日历事件列表
   * @param accessToken
   * @param characterId
   * @param fromEvent 只返回该事件id之后的事件
   * @param page
   * @returns
   */
  charactersCalendar(accessToken: string, characterId: number, fromEvent: number | undefined = undefined, page: number | undefined = undefined): Observable<PageValue<IEsiCalendarEventSummary>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/calendar/` + "?uuid=" + ValueHelper.uuid()
    if (fromEvent) {
      url += `&from_event=${fromEvent}`
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
      let data = response.body as IEsiCalendarEventSummary[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的日历事件详情
   * @param accessToken
   * @param characterId
   * @param eventId
   * @returns
   */
  charactersCalendarEvent(accessToken: string, characterId: number, eventId: number): Observable<IEsiCalendarEvent> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/calendar/${eventId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCalendarEvent))
  }

  /**
   * 更新角色的日历事件回复状态
   * @param accessToken
   * @param characterId
   * @param eventId
   * @param response 回复状态
   * @returns
   */
  charactersCalendarEventUpdate(accessToken: string, characterId: number, eventId: number, response: 'accepted' | 'declined' | 'tentative'): Observable<void> {
    return this.httpClient.put(`${ESI_BASE_URL}/characters/${characterId}/calendar/${eventId}/`, {
      response: response
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(r => undefined))
  }

  /**
   * 获取角色的日历事件的参加者列表
   * @param accessToken
   * @param characterId
   * @param eventId
   * @returns
   */
  charactersCalendarAttendees(accessToken: string, characterId: number, eventId: number): Observable<IEsiCalendarAttendee[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/calendar/${eventId}/attendees/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCalendarAttendee[]))
  }

  /**
   * 获取角色的日历事件类型列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersCalendarEventTypes(accessToken: string, characterId: number): Observable<IEsiCalendarEventTypes[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/calendar/event_types/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiCalendarEventTypes[]))
  }
}
