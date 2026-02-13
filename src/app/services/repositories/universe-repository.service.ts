import { Injectable } from '@angular/core';
import { EveEsiApiService } from '../apis/eve-esi-api.service';
import { IndexedDBManagerService } from '../managers/indexed-dbmanager.service';
import { IEsiSystem } from '../../structs/esi/System';
import { IEsiStation } from '../../structs/esi/Station';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { LoadingViewItemVo } from '../../structs/view/LoadingViewVo';
import { ObservableValue } from '../../structs/ObservableValue';
import { LoadingViewManagerService } from '../managers/loading-view-manager.service';
import { IEsiConstellation } from '../../structs/esi/Constellation';
import { CommonMessageService } from '../messages/common-message.service';
import { IEsiStructure } from '../../structs/esi/Structure';
import { IStoreStructure } from '../../structs/store/StructureStore';
import { TimeHelper } from '../../statics/helpers/TimeHelper';
import { InstanceMessageService } from '../messages/instance-message.service';

/**
 * 宇宙数据
 * 提供 星域、星座、星系、空间站、行星等数据存取。目标：取代分散的 RegionRepository、ConstellationRepository、StationRepository
 */
@Injectable({
  providedIn: 'root'
})
export class UniverseRepositoryService {

  constructor(
    private eveEsiApi: EveEsiApiService,
    private indexedDBManager: IndexedDBManagerService,
    private loadingViewManager: LoadingViewManagerService,
    private instanceMessage: InstanceMessageService,
  ) {
    this.initLoadingViewVo = this.loadingViewManager.register("SystemRepositoryService", "从ESI获取星系数据", 1)
    this.init().subscribe(() => {
      this.loadingViewManager.finished(this.initLoadingViewVo)
    })
  }

  private initLoadingViewVo: LoadingViewItemVo

  /**
   * 星系数据
   */
  private systemDict: ObservableValue<Map<number, IEsiSystem>> = new ObservableValue()

  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      await firstValueFrom(this.initSystemDict())
      sub.next()
      sub.complete()
    })})
  }

  /**
   * 从ESI中加载星系数据
   * @returns
   */
  private initSystemDict(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      const SystemDictCacheKey = "UniverseRepositoryService:SystemDict"
      let getSetTool = await firstValueFrom(this.instanceMessage.getSetTool)
      let systemDict = await firstValueFrom(getSetTool.get<Map<number, IEsiSystem>>(SystemDictCacheKey))
      let systemIds = await firstValueFrom(this.eveEsiApi.universeSystems())
      if (systemDict != null && systemDict.size == systemIds.length) {
        this.systemDict.setValue(systemDict)
        sub.next()
        sub.complete()
        return
      }

      this.initLoadingViewVo.totalStep += systemIds.length

      let systems: IEsiSystem[] = []
      let index = 0
      do {
        let requests = []
        for (let i = 0; i < 100; i++) {
          if (index >= systemIds.length) {
            break
          }
          let systemId = systemIds[index]
          requests.push(this.getSystemByIndededDBOrEsi(systemId).pipe(map(system => {
            this.initLoadingViewVo.doneStep++
            return system
          })))
          index++
        }

        // 并发请求
        let partSystems = await firstValueFrom(forkJoin(requests)
          .pipe<IEsiSystem[]>(map(systems => systems.filter(system => system != null) as IEsiSystem[])))
        systems.push(...partSystems)
      } while (index < systemIds.length);

      // 设置内存中的数值
      let dict = new Map<number, IEsiSystem>()
      systems.forEach(system => {
        dict.set(system.system_id, system)
      })
      await firstValueFrom(getSetTool.set(SystemDictCacheKey, dict))
      this.systemDict.setValue(dict)

      sub.next()
      sub.complete()
    })})
  }

  /**
   * 获取星系数据
   * @param systemId
   * @returns
   */
  getSystem(systemId: number): Observable<IEsiSystem | null> {
    return new Observable(sub => {
      this.getSystemDict().subscribe(dict => {
        sub.next(dict.get(systemId) ?? null)
      })
    })
  }

  getSystemDict(): Observable<Map<number, IEsiSystem>> {
    return this.systemDict
  }

  /**
   * 从 IndexedDB 中获取 如果没有则从 ESI 获取
   */
  private getSystemByIndededDBOrEsi(systemId: number): Observable<IEsiSystem | null> {
    return new Observable(sub => {setTimeout(async() => {
      // 从IndededDB中获取
      let store = await firstValueFrom(this.indexedDBManager.getSystemStore())
      let system = await firstValueFrom(new Observable<IEsiSystem | null>(sub => {
        let ctx = store.get(systemId)
        ctx.onsuccess = (event) => {
          /** @ts-ignore */
          sub.next(event.target.result)
          sub.complete()
        }
        ctx.onerror = (event) => {
          console.error("UniverseRepositoryService.getSystemByIndededDBOrEsi error", event)
          sub.next(null)
          sub.complete()
        }
      }))

      // 从 ESI 中获取
      if (system == null) {
        system = await firstValueFrom(this.eveEsiApi.universeSystem(systemId))
      }

      // 存储到 IndededDB 中
      if (system != null) {
        await firstValueFrom(new Observable<void>(sub => {setTimeout(async() => {
          let store = await firstValueFrom(this.indexedDBManager.getSystemStore())
          let ctx = store.put(system)
          ctx.onsuccess = () => {
            sub.next()
            sub.complete()
          }
          ctx.onerror = (event) => {
            console.error("UniverseRepositoryService.getSystemByIndededDBOrEsi put error", event)
            sub.next()
            sub.complete()
          }
        })}))
      }

      sub.next(system)
      sub.complete()
    })})
  }

  getStationsBySystem(system: IEsiSystem): Observable<IEsiStation[]> {
    return new Observable(sub => {setTimeout(async() => {
      // 星系没有空间站数据，直接返回空数组
      if (system.stations === undefined || system.stations === null || system.stations.length === 0) {
        sub.next([])
        sub.complete()
        return
      }

      let requests = []
      for (let i in system.stations) {
        let stationId = system.stations[i]
        requests.push(this.getStation(stationId))
      }
      let stations = await firstValueFrom(forkJoin(requests))
      sub.next(stations)
      sub.complete()
    })})
  }

  /**
   * 获取星座数据
   * @param constellationId
   * @returns
   */
  getConstellation(constellationId: number): Observable<IEsiConstellation | null> {
    return new Observable(sub => {setTimeout(async() => {
      let constellation = await firstValueFrom(new Observable<IEsiConstellation | null>(sub => {setTimeout(async() => {
        let store = await firstValueFrom(this.indexedDBManager.getConstellationStore())
        let ctx = store.get(constellationId)
        ctx.onsuccess = (event) => {
          let target = event.target as IDBRequest
          sub.next(target.result)
          sub.complete()
        }
        ctx.onerror = (event) => {
          console.error('ConstellationRepositoryService.getConstellation get constellation from IndexedDB error:', event)
          sub.next(null)
          sub.complete()
        }
      })}))

      if (constellation == null) { // 数据库中没有，从ESI中加载
        constellation = await firstValueFrom(this.eveEsiApi.universeConstellation(constellationId))
        if (constellation != null) {
          let store = await firstValueFrom(this.indexedDBManager.getConstellationStore())
          store.put(constellation)
        }
      }

      sub.next(constellation)
      sub.complete()
    })})

  }

  getStation(stationId: number): Observable<IEsiStation> {
    return new Observable(sub => {setTimeout(async() => {
      // 从数据库中加载
      let station: IEsiStation | null = await firstValueFrom(new Observable<IEsiStation | null>(sub => {setTimeout(async() => {
        let store = await firstValueFrom(this.indexedDBManager.getStationStore())
        let ctx = store.get(stationId)
        ctx.onsuccess = event => {
          /** @ts-ignore */
          let station = event.target.result
          if (station) {
            sub.next(station)
          } else {
            sub.next(null)
          }
          sub.complete()
        }
        ctx.onerror = event => {
          console.error("StationRepositoryService.getStation error", event)
          sub.next(null)
          sub.complete()
        }
      })}))

      if (station == null) { // 数据库中没有，从 ESI 中加载并存储到数据库中
        station = await firstValueFrom(this.eveEsiApi.universeStation(stationId))
      }

      // 存储到数据库中
      await firstValueFrom(new Observable<void>(sub => {setTimeout(async() => {
        let store = await firstValueFrom(this.indexedDBManager.getStationStore())
        let ctx = store.put(station)
        ctx.onsuccess = () => {
          sub.next()
          sub.complete()
        }
        ctx.onerror = event => {
          console.error("StationRepositoryService.getStation put error", event)
          sub.next()
          sub.complete()
        }
      })}))

      sub.next(station)
      sub.complete()
    })})
  }

  /**
   * 获取建筑信息
   * @param structureId
   * @returns
   */
  getStructure(accessToken: string, structureId: number): Observable<IEsiStructure | null> {
    return new Observable(sub => {setTimeout(async() => {
      // 从数据库中加载
      let structure: IEsiStructure | null = await firstValueFrom(new Observable<IEsiStructure | null>(sub => {setTimeout(async() => {
        let store = await firstValueFrom(this.indexedDBManager.getStructureStore())
        let ctx = store.get(structureId)
        ctx.onsuccess = (event) => {
          /** @ts-ignore */
          let sturctureStore = event.target.result as IStoreStructure
          sub.next(sturctureStore?.structure)
          sub.complete()
        }
        ctx.onerror = (event) => {
          console.error('UniverseRepositoryService.getStructure get structure from IndexedDB error:', event)
          sub.next(null)
          sub.complete()
        }
      })}))

      if (structure == null) { // 没有数据，从 ESI 中加载
        structure = await firstValueFrom(this.eveEsiApi.universeStructure(accessToken, structureId))
        if (structure != null) {
          await firstValueFrom(new Observable<void>(sub => {setTimeout(async() => {
            // 保存到数据库中
            let store = await firstValueFrom(this.indexedDBManager.getStructureStore())
            let structureStore: IStoreStructure = {
              structureId: structureId,
              structure: structure!,
              getAt: TimeHelper.timestampMS()
            }
            let ctx = store.put(structureStore)
            ctx.onsuccess = () => {
              sub.next()
              sub.complete()
            }
            ctx.onerror = err => {
              console.error(`UniverseRepositoryService.getStructure save failed.`, err)
              sub.next()
              sub.complete()
            }
          })}))
        }
      }

      sub.next(structure)
      sub.complete()
    })})
  }

  /**
   * 使用 星系id[systemId] 获取 星域id[regionId]
   * @param systemId
   * @returns
   */
  getRegionIdBySystemid(systemId: number): Observable<number> {
    return new Observable(sub => {setTimeout(async() => {
      let system = await firstValueFrom(this.getSystem(systemId))
      if (system == null) {
        console.error(`UniverseRepositoryService.getRegionIdBySystemid not found system [systemId: ${systemId}]`)
        sub.next(0)
        sub.complete()
        return
      }
      let constellation = await firstValueFrom(this.getConstellation(system.constellation_id))
      if (constellation == null) {
        console.error(`UniverseRepositoryService.getRegionIdBySystemid not found constellation [constellationId: ${system.constellation_id}]`)
        sub.next(0)
        sub.complete()
        return
      }
      sub.next(constellation.region_id)
      sub.complete()
    })})
  }
}
