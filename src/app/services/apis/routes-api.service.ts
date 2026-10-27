import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { IEsiRouteConnection } from '../../structs/esi/RouteModels';

@Injectable({
  providedIn: 'root'
})
export class RoutesApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取安全航线（不经过低安和00）
   * @param origin 起点星系id
   * @param destination 终点星系id
   * @returns
   */
  route(origin: number, destination: number): Observable<number[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/route/${origin}/${destination}/`)
      .pipe(map(response => response as number[]))
  }

  /**
   * 使用自定义连接列表计算航线
   * @param origin 起点星系id
   * @param destination 终点星系id
   * @param connections 连接列表
   * @returns
   */
  routeWithConnections(origin: number, destination: number, connections: IEsiRouteConnection[]): Observable<number[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/route/${origin}/${destination}/`, {
      connections: connections
    }).pipe(map(response => response as number[]))
  }
}
