import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IStoreKeyValue } from '../../structs/store/KeyValue';

/**
 * @inner 关于 IndexedDB 的一些经验：不要将 IndexedDB 当数据库使用，因为性能真的很慢。为了解决慢的问题，建议是减少数据的条数，尽可能控制数据在 1000条以内
 */
@Injectable({
  providedIn: 'root'
})
export class IndexedDBManagerService {

  constructor() {
    this.initIndexedDB()
  }

  private static readonly STORE_NAME_KEY_VALUES = 'key_values';
  private static readonly STORE_NAME_TYPES = 'types';
  private static readonly STORE_NAME_MARKET_GROUPS = 'market_groups';
  private static readonly STORE_NAME_GRAPHICS = 'graphics';
  private static readonly STORE_NAME_REGIONS = 'regions';
  private static readonly STORE_NAME_CONSTELLATIONS = 'constellations';
  private static readonly STORE_NAME_SYSTEMS = 'systems';
  private static readonly STORE_NAME_REGION_ORDERS = 'region_orders';
  private static readonly STORE_NAME_STATIONS = 'stations';
  private static readonly STORE_NAME_STRUCTURES = "structures"

  private request: any

  /**
   * 数据库实例
   */
  private db?: IDBDatabase

  /**
   * 初始化数据库
   */
  private initIndexedDB() {
    this.request = indexedDB.open("eve_helper", 13)

    // 数据库版本变化或首次创建时触发
    this.request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      /** @ts-ignore */
      const db = event.target.result as IDBDatabase
      let newVersion = event.newVersion ?? 0
      let oldVersion = event.oldVersion ?? 0
      if (newVersion == oldVersion) {
        return // 没有版本变化
      }
      if (oldVersion < 1) db.createObjectStore(IndexedDBManagerService.STORE_NAME_KEY_VALUES, { keyPath: "key" });
      if (oldVersion < 4) {
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_TYPES, { keyPath: "type_id" });
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_MARKET_GROUPS, { keyPath: "market_group_id" });
      }
      if (oldVersion < 5) {
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_GRAPHICS, { keyPath: "graphic_id" });
      }
      if (oldVersion < 6) {
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_REGIONS, { keyPath: "region_id" })

        let constellationStore = db.createObjectStore(IndexedDBManagerService.STORE_NAME_CONSTELLATIONS, { keyPath: "constellation_id" })
        constellationStore.createIndex("region_id", "region_id", { unique: false })

        let systemStore = db.createObjectStore(IndexedDBManagerService.STORE_NAME_SYSTEMS, { keyPath: "system_id" })
        systemStore.createIndex("constellation_id", "constellation_id", { unique: false })
        systemStore.createIndex("star_id", "star_id", { unique: false })
      }
      if (oldVersion < 7) {
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_REGION_ORDERS, { keyPath: "regionId" })
      }
      if (oldVersion < 8) {
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_STATIONS, { keyPath: "station_id" })
      }
      if (oldVersion < 12) {
        db.deleteObjectStore(IndexedDBManagerService.STORE_NAME_SYSTEMS)
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_SYSTEMS, { keyPath: "system_id" })
      }
      if (oldVersion < 13) {
        db.createObjectStore(IndexedDBManagerService.STORE_NAME_STRUCTURES, {keyPath: "structureId"})
      }

      console.debug("IndexedDBManagerService.initIndexedDB DONE")
    }

    // 数据库打开成功
    this.request.onsuccess = (event: any) => {
      this.db = event.target.result;
    }

    // 数据库打开失败
    this.request.onerror = (event: any) => {
      console.error("数据库打开失败")
    }
  }

  /**
   * 获取存储对象
   * @param storeName
   * @returns
   */
  private getObjectStore(storeName: string): Observable<IDBObjectStore> {
    return new Observable<IDBObjectStore>(sub => {
      this.getDB().subscribe(db => {
        let transaction = db.transaction(storeName, 'readwrite')
        let objectStore = transaction.objectStore(storeName)
        sub.next(objectStore)
        sub.complete()
      })
    })
  }

  /**
   * 获取DB实例
   * @returns
   */
  public getDB(): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>(sub => {
      if (this.db) {
        sub.next(this.db)
        sub.complete()
      } else {
        setTimeout(() => {
          this.getDB().subscribe(db => {
            sub.next(db)
            sub.complete()
          })
        }, 3000)
      }
    })
  }

  /**
   * 清空数据库
   * @returns
   */
  public clearDB(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let db = await firstValueFrom(this.getDB())
      db.close()
      let ctx = indexedDB.deleteDatabase("eve_helper")
      ctx.onsuccess = () => {
        sub.next()
        sub.complete()
      }
      ctx.onerror = (event) => {
        sub.error(event)
      }
    })})
  }

  /**
   * 将 IDBRequest 等待返回值的方法封装成 Observable
   * @param dbRequest
   * @param defaultValue
   * @returns
   */
  public dbRequestGetOrDefault<T>(dbRequest: IDBRequest<any>): Observable<IStoreKeyValue<T> | null> {
    return new Observable(sub => {
      dbRequest.onsuccess = event => {
        /** @ts-ignore */
        let obj = (event.target?.result ?? undefined) as T | undefined
        if (obj === undefined) {
          sub.next(null)
        } else {
           /** @ts-ignore */
          sub.next(obj as IStoreKeyValue<T>)
        }
        sub.complete()
      }
      dbRequest.onerror = event => {
          console.error("IndexedDBManagerService.getOrDefault", event)
          sub.next(null)
          sub.complete()
        }
    })
  }

  /**
   * 等待执行完成
   */
  public dbRequestWait(dbRequest: IDBRequest<any>): Observable<void> {
    return new Observable(sub => {
      dbRequest.onsuccess = _ => {
        sub.next()
        sub.complete()
      }
      dbRequest.onerror = event => {

        console.error("IndexedDBManagerService.dbRequestWait", event)
        sub.error(event)
      }
    })
  }

  /**
   * 获取地区订单的数据
   * @returns
   */
  public getRegionOrderStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_REGION_ORDERS)
  }

  public getKeyValueStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_KEY_VALUES)
  }

  public getTypeStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_TYPES)
  }

  public getMarketGroupStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_MARKET_GROUPS)
  }

  public getGraphicStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_GRAPHICS)
  }

  public getRegionStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_REGIONS)
  }

  public getConstellationStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_CONSTELLATIONS)
  }

  public getSystemStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_SYSTEMS)
  }

  getStationStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_STATIONS)
  }

  getStructureStore(): Observable<IDBObjectStore> {
    return this.getObjectStore(IndexedDBManagerService.STORE_NAME_STRUCTURES)
  }
}
