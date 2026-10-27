import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiBookmark, IEsiBookmarkFolder } from '../../structs/esi/BookmarkModels';

@Injectable({
  providedIn: 'root'
})
export class BookmarksApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的书签列表
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersBookmarks(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiBookmark>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/bookmarks/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiBookmark[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取角色的书签文件夹列表
   * @param accessToken
   * @param characterId
   * @param page
   * @returns
   */
  charactersBookmarksFolders(accessToken: string, characterId: number, page: number | undefined = undefined): Observable<PageValue<IEsiBookmarkFolder>> {
    let url = `${ESI_BASE_URL}/characters/${characterId}/bookmarks/folders/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiBookmarkFolder[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的书签列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsBookmarks(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiBookmark>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/bookmarks/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiBookmark[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }

  /**
   * 获取军团的书签文件夹列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsBookmarksFolders(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiBookmarkFolder>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/bookmarks/folders/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiBookmarkFolder[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }
}
