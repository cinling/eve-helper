import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import {
  IEsiIndustryCoefficient,
  IEsiIndustryFacility,
  IEsiIndustryJob,
  IEsiIndustrySystem,
  IEsiMiningExtraction,
  IEsiMiningLedger,
  IEsiMiningObserver,
  IEsiMiningObserverItem,
} from '../../structs/esi/IndustryModels';

@Injectable({
  providedIn: 'root'
})
export class IndustryApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取所有工业设施
   * @returns
   */
  industryFacilities(): Observable<IEsiIndustryFacility[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/industry/facilities/`)
      .pipe(map(response => response as IEsiIndustryFacility[]))
  }

  /**
   * 获取所有工业系统的成本指数
   * @returns
   */
  industrySystems(): Observable<IEsiIndustrySystem[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/industry/systems/`)
      .pipe(map(response => response as IEsiIndustrySystem[]))
  }

  /**
   * 获取工业成本系数
   * @returns
   */
  industryCoefficient(): Observable<IEsiIndustryCoefficient[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/industry/coefficient/`)
      .pipe(map(response => response as IEsiIndustryCoefficient[]))
  }

  /**
   * 获取角色的工业工作列表
   * @param accessToken
   * @param characterId
   * @param page
   * @param includeCompleted 是否包含已完成的工作
   * @returns
   */
  charactersIndustryJobs(accessToken: string, characterId: number, page: number | undefined = undefined, includeCompleted: boolean = false): Observable<PageValue<IEsiIndustryJob>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/industry/jobs/` + "?include_completed=" + includeCompleted + "&uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiIndustryJob[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的工业工作列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @param includeCompleted 是否包含已完成的工作
   * @returns
   */
  corporationsIndustryJobs(accessToken: string, corporationId: number, page: number | undefined = undefined, includeCompleted: boolean = false): Observable<PageValue<IEsiIndustryJob>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/industry/jobs/` + "?include_completed=" + includeCompleted + "&uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiIndustryJob[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的挖矿记录
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersMining(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiMiningLedger>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/mining/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiMiningLedger[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的采矿提取列表
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsMiningExtractions(accessToken: string, corporationId: number): Observable<IEsiMiningExtraction[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/mining/extractions/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiMiningExtraction[]))
  }

  /**
   * 获取军团的采矿观察者列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsMiningObservers(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiMiningObserver>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/mining/observers/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiMiningObserver[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的采矿观察者记录
   * @param accessToken
   * @param corporationId
   * @param observerId
   * @param page
   * @returns
   */
  corporationsMiningObserver(accessToken: string, corporationId: number, observerId: number, page: number | undefined = undefined): Observable<PageValue<IEsiMiningObserverItem>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/mining/observers/${observerId}/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiMiningObserverItem[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }
}
