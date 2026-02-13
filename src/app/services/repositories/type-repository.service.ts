import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ObservableValue } from '../../structs/ObservableValue';
import { LoadingViewManagerService } from '../managers/loading-view-manager.service';
import { ISdeGroup } from '../../structs/sde/Group';
import { ISdeType } from '../../structs/sde/Type';

/**
 * category - group - type
 * 分类、分组、类型
 * 物品数据仓库，处理物品类型、分组、分类
 */
@Injectable({
  providedIn: 'root'
})
export class TypeRepositoryService {

  constructor(
    private httpClient: HttpClient,
    private loadingViewManager: LoadingViewManagerService,
  ) {
    let vo = this.loadingViewManager.register("TypeRepositoryService.init", "物品数据", 1);
    this.init().subscribe(() => {
      this.loadingViewManager.finished(vo)
    })
  }

  /**
   * 物品字典
   */
  private typeDictOv: ObservableValue<SdeTypeDict> = new ObservableValue()

  /**
   * 分组字典
   */
  private groupDictOv: ObservableValue<{[groupId: number]: ISdeGroup}> = new ObservableValue()

  /**
   * 初始化数据。从 ESI 获取数据存储到 IndexedDB
   * @returns
   */
  public init(): Observable<void> {
    return new Observable(sub => { setTimeout(async() => {
      await firstValueFrom(forkJoin([
        this.httpClient.get<SdeTypeDict>("/assets/types.gen.json").pipe(map(dict => {
          this.typeDictOv.setValue(dict)
          return true
        })),
        this.httpClient.get<{[groupId: number]: ISdeGroup}>("/assets/groups.gen.json").pipe(map(dict => {
          this.groupDictOv.setValue(dict)
          return true
        }))
      ]))

      sub.next()
      sub.complete()
    })})
  }

  getGroupDict(): Observable<{[grouId: number]: ISdeGroup}> {
    return this.groupDictOv
  }

  public getTypeDict(): Observable<SdeTypeDict> {
    return this.typeDictOv
  }

  /**
   * 获取有市场分组id的数据
   */
  getTypeDictWhereHasMarketGroupId(): Observable<SdeTypeDict> {
    return new Observable(sub => {setTimeout(async() => {
      let typeDict = await firstValueFrom(this.getTypeDict())
      let dict: SdeTypeDict = {}
      for (let typeId in typeDict) {
        let type = typeDict[typeId]
        if (type.marketGroupID) {
          dict[typeId] = type
        }
      }
      sub.next(dict)
      sub.complete()
    })})
  }

  /**
   * 通过所有市场分组 ID 获取物品数据
   * @param marketGroupIds
   * @returns
   */
  getTypeDictByMarketGroupIds(marketGroupIds: number[]): Observable<SdeTypeDict> {
    return new Observable(sub => {setTimeout(async() => {
      let marketGroupIdSet = new Set(marketGroupIds)

      let typeDict = await firstValueFrom(this.getTypeDict())
      let dict: SdeTypeDict = {}
      for (let typeId in typeDict) {
        let type = typeDict[typeId]
        if (marketGroupIdSet.has(type.typeID)) {
          dict[typeId] = type
        }
      }
      sub.next(dict)
      sub.complete()
    })})
  }

  public getTypeDictWithMarketGroupID(marketGroupID: number | null = null): Observable<SdeTypeDict> {
    return new Observable<{[key: number]: ISdeType}>(sub => { setTimeout(async() => {
      let typeDict = await firstValueFrom(this.getTypeDict())

      let newTypeDict: SdeTypeDict = {}
      if (marketGroupID != null) {
        for (let typeId in typeDict) {
          let type = typeDict[typeId]
          if (type.marketGroupID == marketGroupID) {
            newTypeDict[typeId] = type
          }
        }
      } else {
        for (let typeId in typeDict) {
          let type = typeDict[typeId]
          if (type.marketGroupID) { // 所有包含市场分组的数据
            newTypeDict[typeId] = type
          }
        }
      }


      sub.next(typeDict)
      sub.complete()
    }) })
  }

  /**
   * 获取给定数组的物品数据
   * @param typeIds
   * @returns
   */
  public getTypeDictByTypeIds(typeIds: number[]): Observable<SdeTypeDict> {
    return new Observable(sub => {setTimeout(async () => {
      let typeDict = await firstValueFrom(this.getTypeDict())
      let dict: SdeTypeDict = {}
      for (let i in typeIds) {
        let typeId = typeIds[i]
        dict[typeId] = typeDict[typeId]
      }
      sub.next(dict)
      sub.complete()
    })})
  }

  public getType(typeId: number): Observable<ISdeType | null> {
    return new Observable(sub => {setTimeout(async() => {
      let typeDict = await firstValueFrom(this.getTypeDict())
      sub.next(typeDict[typeId] ?? null)
      sub.complete()
    })})
  }
}

export type SdeTypeDict = {[typeId: number]: ISdeType}
export type SdeGroupDict = {[groupId: number]: ISdeGroup}