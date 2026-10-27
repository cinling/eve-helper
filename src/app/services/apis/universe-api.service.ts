import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
  ESI_BASE_URL,
  ESI_UNIVERSE_CATEGORIES,
  ESI_UNIVERSE_CONSTELLATIONS,
  ESI_UNIVERSE_GRAPHICS,
  ESI_UNIVERSE_GROUPS,
  ESI_UNIVERSE_REGIONS,
  ESI_UNIVERSE_STATIONS,
  ESI_UNIVERSE_SYSTEMS,
  ESI_UNIVERSE_TYPES,
} from '../../statics/contants/esi-api';
import { IGroup, IType } from '../../statics/entities/common';
import { IEsiConstellation } from '../../structs/esi/Constellation';
import { IEsiStation } from '../../structs/esi/Station';
import { IEsiStructure } from '../../structs/esi/Structure';
import { IEsiSystem } from '../../structs/esi/System';
import {
  IEsiAncestry,
  IEsiAsteroidBelt,
  IEsiBloodline,
  IEsiFaction,
  IEsiMoon,
  IEsiPlanet,
  IEsiRace,
  IEsiStargate,
  IEsiStar,
  IEsiUniverseName,
} from '../../structs/esi/UniverseModels';

@Injectable({
  providedIn: 'root'
})
export class UniverseApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * 获取所有血统祖先
   * @returns
   */
  universeAncestries(): Observable<IEsiAncestry[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/ancestries/`)
      .pipe(map(response => response as IEsiAncestry[]))
  }

  /**
   * 获取小行星带信息
   * @param asteroidBeltId
   * @returns
   */
  universeAsteroidBelt(asteroidBeltId: number): Observable<IEsiAsteroidBelt> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/asteroid_belts/${asteroidBeltId}/`)
      .pipe(map(response => response as IEsiAsteroidBelt))
  }

  /**
   * 获取所有血统
   * @returns
   */
  universeBloodlines(): Observable<IEsiBloodline[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/bloodlines/`)
      .pipe(map(response => response as IEsiBloodline[]))
  }

  /**
   * 获取所有分类ID
   * @returns
   */
  universeCategories(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_CATEGORIES)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取分类信息
   * @param categoryId
   * @returns
   */
  universeCategory(categoryId: number): Observable<any> {
    return this.httpClient.get(`${ESI_UNIVERSE_CATEGORIES}/${categoryId}`)
      .pipe(map(response => response as any))
  }

  /**
   * 获取所有星座ID
   * @returns
   */
  universeConstellations(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_CONSTELLATIONS)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取星座信息
   * @param constellationId
   * @returns
   */
  universeConstellation(constellationId: number): Observable<IEsiConstellation> {
    return this.httpClient.get(`${ESI_UNIVERSE_CONSTELLATIONS}/${constellationId}`)
      .pipe(map(response => response as IEsiConstellation))
  }

  /**
   * 获取所有势力
   * @returns
   */
  universeFactions(): Observable<IEsiFaction[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/factions/`)
      .pipe(map(response => response as IEsiFaction[]))
  }

  /**
   * 获取所有图片id的数据
   * @returns
   */
  universeGraphics(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_GRAPHICS)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取图片id的数据
   * @param graphicsId 图片id
   * @returns
   */
  universeGraphic(graphicsId: number): Observable<any> {
    return this.httpClient.get(`${ESI_UNIVERSE_GRAPHICS}/${graphicsId}`)
      .pipe(map(response => response as any))
  }

  /**
   * 获取所有分组ID
   * @returns
   */
  universeGroups(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_GROUPS)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取分组信息
   * @param groupId
   * @returns
   */
  universeGroup(groupId: number): Observable<IGroup> {
    return this.httpClient.get(`${ESI_UNIVERSE_GROUPS}/${groupId}`)
      .pipe(map(response => response as IGroup))
  }

  /**
   * 获取卫星信息
   * @param moonId
   * @returns
   */
  universeMoon(moonId: number): Observable<IEsiMoon> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/moons/${moonId}/`)
      .pipe(map(response => response as IEsiMoon))
  }

  /**
   * 批量获取宇宙对象的名称
   * @param ids 最多1000个
   * @returns
   */
  universeNames(ids: number[]): Observable<IEsiUniverseName[]> {
    return this.httpClient.post(`${ESI_BASE_URL}/universe/names/`, ids)
      .pipe(map(response => response as IEsiUniverseName[]))
  }

  /**
   * 获取行星信息
   * @param planetId
   * @returns
   */
  universePlanet(planetId: number): Observable<IEsiPlanet> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/planets/${planetId}/`)
      .pipe(map(response => response as IEsiPlanet))
  }

  /**
   * 获取所有种族
   * @returns
   */
  universeRaces(): Observable<IEsiRace[]> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/races/`)
      .pipe(map(response => response as IEsiRace[]))
  }

  /**
   * 获取所有星域的id
   * @returns
   */
  universeRegions(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_REGIONS)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取星域id的数据
   * @param regionId 星域id
   * @returns
   */
  universeRegion(regionId: number): Observable<any> {
    return this.httpClient.get(`${ESI_UNIVERSE_REGIONS}/${regionId}`)
      .pipe(map(response => response as any))
  }

  /**
   * 获取星门信息
   * @param stargateId
   * @returns
   */
  universeStargate(stargateId: number): Observable<IEsiStargate> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/stargates/${stargateId}/`)
      .pipe(map(response => response as IEsiStargate))
  }

  /**
   * 获取恒星信息
   * @param starId
   * @returns
   */
  universeStar(starId: number): Observable<IEsiStar> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/stars/${starId}/`)
      .pipe(map(response => response as IEsiStar))
  }

  /**
   * 获取空间站信息
   * @param stationId
   * @returns
   */
  universeStation(stationId: number): Observable<IEsiStation> {
    return this.httpClient.get(`${ESI_UNIVERSE_STATIONS}/${stationId}`)
      .pipe(map(response => response as IEsiStation))
  }

  /**
   * 获取建筑信息
   * @param accessToken
   * @param structureId
   * @returns
   */
  universeStructure(accessToken: string, structureId: number): Observable<IEsiStructure | null> {
    return this.httpClient.get(`${ESI_BASE_URL}/universe/structures/${structureId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .pipe(map(response => response as IEsiStructure))
      .pipe(catchError(err => {
        console.error(`UniverseApi.universeStructure(${structureId}) failed`, err);
        return of(null)
      }))
  }

  /**
   * 获取所有星系的id
   * @returns
   */
  universeSystems(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_SYSTEMS)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取星系信息
   * @param systemId
   * @returns
   */
  universeSystem(systemId: number): Observable<IEsiSystem> {
    return this.httpClient.get(`${ESI_UNIVERSE_SYSTEMS}/${systemId}`)
      .pipe(map(response => response as IEsiSystem))
  }

  /**
   * 获取所有物品类型的id
   * @returns
   */
  universeTypes(): Observable<number[]> {
    return this.httpClient.get(ESI_UNIVERSE_TYPES)
      .pipe(map(response => response as number[]))
  }

  /**
   * 获取物品类型信息
   * @param typeId
   * @returns
   */
  universeType(typeId: number): Observable<IType> {
    return this.httpClient.get(`${ESI_UNIVERSE_TYPES}/${typeId}`)
      .pipe(map(response => response as IType))
  }
}
