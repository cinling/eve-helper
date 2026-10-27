import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiUiNewMail, IEsiUiOpenWindowContract, IEsiUiOpenWindowInformation, IEsiUiOpenWindowMarketDetails, IEsiUiWaypoint } from '../../structs/esi/UiModels';

@Injectable({
  providedIn: 'root'
})
export class UserInterfaceApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 设置自动导航航点
   * @param accessToken
   * @param waypoint
   * @returns
   */
  uiAutopilotWaypoint(accessToken: string, waypoint: IEsiUiWaypoint): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/ui/autopilot/waypoint/`, waypoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 打开合同窗口
   * @param accessToken
   * @param request
   * @returns
   */
  uiOpenWindowContract(accessToken: string, request: IEsiUiOpenWindowContract): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/ui/openwindow/contract/`, request, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 打开信息窗口
   * @param accessToken
   * @param request
   * @returns
   */
  uiOpenWindowInformation(accessToken: string, request: IEsiUiOpenWindowInformation): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/ui/openwindow/information/`, request, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 打开市场详情窗口
   * @param accessToken
   * @param request
   * @returns
   */
  uiOpenWindowMarketDetails(accessToken: string, request: IEsiUiOpenWindowMarketDetails): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/ui/openwindow/marketdetails/`, request, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }

  /**
   * 打开新邮件窗口
   * @param accessToken
   * @param request
   * @returns
   */
  uiOpenWindowNewMail(accessToken: string, request: IEsiUiNewMail): Observable<void> {
    return this.httpClient.post(`${ESI_BASE_URL}/ui/openwindow/newmail/`, request, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).pipe(map(response => undefined))
  }
}
