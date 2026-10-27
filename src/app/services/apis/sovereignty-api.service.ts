import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiSovereigntyCampaign, IEsiSovereigntyStructure, IEsiSovereigntySystem } from '../../structs/esi/SovereigntyModels';

@Injectable({
  providedIn: 'root'
})
export class SovereigntyApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取主权战争行动列表
   * @returns
   */
  sovereigntyCampaigns(): Observable<IEsiSovereigntyCampaign[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/sovereignty/campaigns/`)
      .pipe(map(response => response as IEsiSovereigntyCampaign[]))
  }

  /**
   * 获取主权星系列表
   * @returns
   */
  sovereigntyMap(): Observable<IEsiSovereigntySystem[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/sovereignty/map/`)
      .pipe(map(response => response as IEsiSovereigntySystem[]))
  }

  /**
   * 获取主权结构列表
   * @returns
   */
  sovereigntyStructures(): Observable<IEsiSovereigntyStructure[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/sovereignty/structures/`)
      .pipe(map(response => response as IEsiSovereigntyStructure[]))
  }
}
