import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ESI_BASE_URL } from '../../statics/contants/esi-api';
import { ValueHelper } from '../../statics/helpers/ValueHelper';
import { PageValue } from '../../structs/PageValue';
import { IEsiCustomsOffice, IEsiPlanetDetails, IEsiPlanetSummary, IEsiSchematic } from '../../structs/esi/PlanetaryModels';

@Injectable({
  providedIn: 'root'
})
export class PlanetaryInteractionApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取角色的行星列表
   * @param accessToken
   * @param characterId
   * @returns
   */
  charactersPlanets(accessToken: string, characterId: number): Observable<IEsiPlanetSummary[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/planets/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiPlanetSummary[]))
  }

  /**
   * 获取角色行星的详细信息
   * @param accessToken
   * @param characterId
   * @param planetId
   * @returns
   */
  charactersPlanet(accessToken: string, characterId: number, planetId: number): Observable<IEsiPlanetDetails> {
    return this.httpClient.get(`${ESI_BASE_URL}/characters/${characterId}/planets/${planetId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }).pipe(map(response => response as IEsiPlanetDetails))
  }

  /**
   * 获取蓝图示意图信息
   * @param schematicId
   * @returns
   */
  universeSchematics(schematicId: number): Observable<IEsiSchematic> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/schematics/${schematicId}/`)
      .pipe(map(response => response as IEsiSchematic))
  }

  /**
   * 获取军团的海关办公室列表
   * @param accessToken
   * @param corporationId
   * @param page
   * @returns
   */
  corporationsCustomsOffices(accessToken: string, corporationId: number, page: number | undefined = undefined): Observable<PageValue<IEsiCustomsOffice>> {
    let url = `${ESI_BASE_URL}/corporations/${corporationId}/customs_offices/` + "?uuid=" + ValueHelper.uuid()
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
      let data = response.body as IEsiCustomsOffice[]
      return {
        page: 1,
        size: size,
        data: data
      }
    }))
  }
}
