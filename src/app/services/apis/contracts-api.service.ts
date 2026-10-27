import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiContract, IEsiContractBid, IEsiContractItem } from '../../structs/esi/ContractModels';

@Injectable({
  providedIn: 'root'
})
export class ContractsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的合同列表
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersContracts(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiContract>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/contracts/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiContract[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的合同详情
   * @param accessToken
   * @param characterId
   * @param contractId
   * @returns
   */
  charactersContract(accessToken: string, characterId: number, contractId: number): Observable<IEsiContract> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/contracts/${contractId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContract))
  }

  /**
   * 获取角色的合同的竞标列表
   * @param accessToken
   * @param characterId
   * @param contractId
   * @returns
   */
  charactersContractBids(accessToken: string, characterId: number, contractId: number): Observable<IEsiContractBid[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/contracts/${contractId}/bids/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContractBid[]))
  }

  /**
   * 获取角色的合同的物品列表
   * @param accessToken
   * @param characterId
   * @param contractId
   * @returns
   */
  charactersContractItems(accessToken: string, characterId: number, contractId: number): Observable<IEsiContractItem[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/contracts/${contractId}/items/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContractItem[]))
  }

  /**
   * 获取军团的合同列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsContracts(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiContract>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/contracts/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiContract[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的合同详情
   * @param accessToken
   * @param corporationId
   * @param contractId
   * @returns
   */
  corporationsContract(accessToken: string, corporationId: number, contractId: number): Observable<IEsiContract> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/contracts/${contractId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContract))
  }

  /**
   * 获取军团的合同的竞标列表
   * @param accessToken
   * @param corporationId
   * @param contractId
   * @returns
   */
  corporationsContractBids(accessToken: string, corporationId: number, contractId: number): Observable<IEsiContractBid[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/contracts/${contractId}/bids/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContractBid[]))
  }

  /**
   * 获取军团的合同的物品列表
   * @param accessToken
   * @param corporationId
   * @param contractId
   * @returns
   */
  corporationsContractItems(accessToken: string, corporationId: number, contractId: number): Observable<IEsiContractItem[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/contracts/${contractId}/items/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiContractItem[]))
  }
}
