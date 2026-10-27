import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiSearchResults } from '../../structs/esi/SearchModels';

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的搜索范围内的搜索结果
   * @param accessToken
   * @param characterId
   * @param categories 搜索的类别
   * @param search 搜索关键字
   * @param strict 是否精确匹配
   * @returns
   */
  charactersSearch(accessToken: string, characterId: number, categories: string[], search: string, strict: boolean = false): Observable<IEsiSearchResults> {
    const params = new HttpParams()
      .set('categories', categories.join(','))
      .set('search', search)
      .set('strict', strict)

    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/search/`, {
      params: params,
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiSearchResults))
  }

  /**
   * 获取全宇宙的搜索结果
   * @param categories 搜索的类别
   * @param search 搜索关键字
   * @param strict 是否精确匹配
   * @returns
   */
  search(categories: string[], search: string, strict: boolean = false): Observable<IEsiSearchResults> {
    const params = new HttpParams()
      .set('categories', categories.join(','))
      .set('search', search)
      .set('strict', strict)

    return this.httpClient.get(`${ESI_BASE_URL}/search/`, {
      params: params
    }).pipe(map(response => response as IEsiSearchResults))
  }
}
