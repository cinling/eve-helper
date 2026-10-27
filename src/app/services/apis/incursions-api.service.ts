import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiIncursion } from '../../structs/esi/IncursionModels';

@Injectable({
  providedIn: 'root'
})
export class IncursionsApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取当前入侵的列表
   * @returns
   */
  incursions(): Observable<IEsiIncursion[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/incursions/`)
      .pipe(map(response => response as IEsiIncursion[]))
  }
}
