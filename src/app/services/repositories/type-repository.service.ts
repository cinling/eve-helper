import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, forkJoin, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ObservableValue } from '../../structs/ObservableValue';
import { LoadingViewManagerService } from '../managers/loading-view-manager.service';
import { ISdeGroup } from '../../structs/sde/Group';
import { ISdeType } from '../../structs/sde/Type';
import { ESI_UNIVERSE_TYPES } from '../../statics/contants/esi-api';
import { IType } from '../../statics/entities/common';

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
          // types.gen.json 部分类型的 name 是多语言对象 {de,en,zh,...}，统一归一化为中文名
          for (let typeId in dict) {
            let name = dict[typeId].name as unknown
            if (name && typeof name === 'object') {
              let multilingualName = name as { zh?: string, en?: string }
              dict[typeId].name = multilingualName.zh ?? multilingualName.en ?? ""
            }
          }
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
   * 本地 SDE 缺失、运行时从 ESI 在线补全的物品类型缓存
   */
  private onlineTypeDict: SdeTypeDict = {}

  /**
   * 获取给定数组的物品数据（本地 SDE 缺失的新类型从 ESI 在线补全）
   * @param typeIds
   * @returns
   */
  public getTypeDictByTypeIds(typeIds: number[]): Observable<SdeTypeDict> {
    return new Observable(sub => {setTimeout(async () => {
      let typeDict = await firstValueFrom(this.getTypeDict())
      let dict: SdeTypeDict = {}
      let missingTypeIds: number[] = []
      for (let i in typeIds) {
        let typeId = typeIds[i]
        if (typeDict[typeId]) {
          dict[typeId] = typeDict[typeId]
        } else if (this.onlineTypeDict[typeId]) {
          dict[typeId] = this.onlineTypeDict[typeId]
        } else {
          missingTypeIds.push(typeId)
        }
      }
      missingTypeIds = [...new Set(missingTypeIds)]

      // 本地 SDE 缺失的类型（如新涂装/新装备），从 ESI 在线补全中文名
      if (missingTypeIds.length > 0) {
        let onlineTypes = await firstValueFrom(forkJoin(
          missingTypeIds.map(typeId => this.httpClient.get<IType>(`${ESI_UNIVERSE_TYPES}/${typeId}`, {
            params: { language: 'zh', datasource: 'tranquility' }
          }).pipe(catchError(() => of(null))))
        ))
        for (let onlineType of onlineTypes) {
          if (!onlineType) continue
          let sdeType: ISdeType = {
            typeID: onlineType.type_id,
            groupID: onlineType.group_id,
            name: onlineType.name,
            marketGroupID: onlineType.market_group_id,
            description: onlineType.description
          }
          this.onlineTypeDict[sdeType.typeID] = sdeType
          dict[sdeType.typeID] = sdeType
        }
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