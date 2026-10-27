import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiAlliance, IEsiAllianceIcon, IEsiAllianceName } from '../../structs/esi/AllianceModels';

@Injectable({
  providedIn: 'root'
})
export class AllianceApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取所有联盟的id
   * @returns
   */
  alliances(): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/alliances/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取联盟公开信息
   * @param allianceId
   * @returns
   */
  alliance(allianceId: number): Observable<IEsiAlliance> {
    return this.httpClient.get(`${ESI_BASE_URL}/alliances/${allianceId}/`)
      .pipe(map(response => response as IEsiAlliance))
  }

  /**
   * 获取联盟的所有军团id
   * @param allianceId
   * @returns
   */
  alliancesCorporations(allianceId: number): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/alliances/${allianceId}/corporations/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取联盟图标
   * @param allianceId
   * @returns
   */
  alliancesIcons(allianceId: number): Observable<IEsiAllianceIcon> {
    return this.httpClient.get(`${ESI_BASE_URL}/alliances/${allianceId}/icons/`)
      .pipe(map(response => response as IEsiAllianceIcon))
  }

  /**
   * 批量获取联盟的名称
   * @param allianceIds 最多1000个
   * @returns
   */
  alliancesNames(allianceIds: number[]): Observable<IEsiAllianceName[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/alliances/names/`, allianceIds)
      .pipe(map(response => response as IEsiAllianceName[]))
  }
}
