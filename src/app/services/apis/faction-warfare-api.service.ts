import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import {
  IEsiFwCharacterStats,
  IEsiFwCorporationStats,
  IEsiFwLeaderboard,
  IEsiFwLeaderboardCharacter,
  IEsiFwLeaderboardCorporation,
  IEsiFwStat,
  IEsiFwSystem,
  IEsiFwWar,
} from '../../structs/esi/FactionWarfareModels';

@Injectable({
  providedIn: 'root'
})
export class FactionWarfareApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取势力战争的总体排行榜
   * @returns
   */
  fwLeaderboards(): Observable<IEsiFwLeaderboard> {
    return this.httpClient.get(`${ESI_BASE_URL}/fw/leaderboards/`)
      .pipe(map(response => response as IEsiFwLeaderboard))
  }

  /**
   * 获取势力战争的角色排行榜
   * @returns
   */
  fwLeaderboardsCharacters(): Observable<IEsiFwLeaderboardCharacter[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/fw/leaderboards/characters/`)
      .pipe(map(response => response as IEsiFwLeaderboardCharacter[]))
  }

  /**
   * 获取势力战争的军团排行榜
   * @returns
   */
  fwLeaderboardsCorporations(): Observable<IEsiFwLeaderboardCorporation[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/fw/leaderboards/corporations/`)
      .pipe(map(response => response as IEsiFwLeaderboardCorporation[]))
  }

  /**
   * 获取所有势力的战争统计
   * @returns
   */
  fwStats(): Observable<IEsiFwStat[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/fw/stats/`)
      .pipe(map(response => response as IEsiFwStat[]))
  }

  /**
   * 获取势力战争星系的状态
   * @returns
   */
  fwSystems(): Observable<IEsiFwSystem[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/fw/systems/`)
      .pipe(map(response => response as IEsiFwSystem[]))
  }

  /**
   * 获取进行中的势力战争列表
   * @returns
   */
  fwWars(): Observable<IEsiFwWar[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/fw/wars/`)
      .pipe(map(response => response as IEsiFwWar[]))
  }

  /**
   * 获取军团的势力战争统计
   * @param corporationId
   * @returns
   */
  corporationsFwStats(corporationId: number): Observable<IEsiFwCorporationStats> {
    return this.httpClient.get(`${ESI_BASE_URL}/corporations/${corporationId}/fw/stats/`)
      .pipe(map(response => response as IEsiFwCorporationStats))
  }

  /**
   * 获取角色的势力战争统计
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersFwStats(accessToken: string, characterId: number): Observable<IEsiFwCharacterStats> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/fw/stats/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiFwCharacterStats))
  }
}
