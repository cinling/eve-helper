import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiWalletDivision, IEsiWalletJournalItem, IEsiWalletTransaction } from '../../structs/esi/WalletModels';

@Injectable({
  providedIn: 'root'
})
export class WalletApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的钱包余额
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersWallet(accessToken: string, characterId: number): Observable<number> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/wallet/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 获取角色的钱包流水
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersWalletJournal(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiWalletJournalItem>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/wallet/journal/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiWalletJournalItem[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的钱包交易记录
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersWalletTransactions(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiWalletTransaction>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/wallet/transactions/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiWalletTransaction[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的当前钱包余额
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsWallet(accessToken: string, corporationId: number): Observable<number> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/wallet/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as number))
  }

  /**
   * 获取军团的钱包流水
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsWalletJournal(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiWalletJournalItem>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/wallet/journal/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiWalletJournalItem[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的钱包交易记录
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsWalletTransactions(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiWalletTransaction>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/wallet/transactions/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiWalletTransaction[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的钱包部门及余额
   * @param accessToken
   * @param corporationId
   * @returns
   */
  corporationsWalletDivisions(accessToken: string, corporationId: number): Observable<IEsiWalletDivision[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/wallets/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiWalletDivision[]))
  }
}
