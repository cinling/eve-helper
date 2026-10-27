import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiDogmaAttribute, IEsiDogmaDynamicItem, IEsiDogmaEffect } from '../../structs/esi/DogmaModels';

@Injectable({
  providedIn: 'root'
})
export class DogmaApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取所有教条属性的id
   * @returns
   */
  dogmaAttributes(): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/dogma/attributes/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取教条属性
   * @param attributeId
   * @returns
   */
  dogmaAttribute(attributeId: number): Observable<IEsiDogmaAttribute> {
    return this.httpClient.get(`${ESI_BASE_URL}/dogma/attributes/${attributeId}/`)
      .pipe(map(response => response as IEsiDogmaAttribute))
  }

  /**
   * 获取教条动态物品
   * @param typeId
   * @param itemId
   * @returns
   */
  dogmaDynamicItems(typeId: number, itemId: number): Observable<IEsiDogmaDynamicItem> {
    return this.httpClient.get(`${ESI_BASE_URL}/dogma/dynamic/items/${typeId}/${itemId}/`)
      .pipe(map(response => response as IEsiDogmaDynamicItem))
  }

  /**
   * 获取所有教条效应的id
   * @returns
   */
  dogmaEffects(): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/dogma/effects/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取教条效应
   * @param effectId
   * @returns
   */
  dogmaEffect(effectId: number): Observable<IEsiDogmaEffect> {
    return this.httpClient.get(`${ESI_BASE_URL}/dogma/effects/${effectId}/`)
      .pipe(map(response => response as IEsiDogmaEffect))
  }
}
