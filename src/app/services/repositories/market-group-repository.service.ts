import { Injectable } from '@angular/core';
import { IndexedDBManagerService } from '../managers/indexed-dbmanager.service';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { IMarketGroup } from '../../statics/entities/MarketGroup';
import { HttpClient } from '@angular/common/http';
import { IWaitUntilInit, WaitUntilInitFuncImpl } from '../../statics/interfaces/IWaitUntilInit';
import { LoadingViewManagerService } from '../managers/loading-view-manager.service';

@Injectable({
  providedIn: 'root'
})
export class MarketGroupRepositoryService implements IWaitUntilInit {

  constructor(
    private indexedDBManager: IndexedDBManagerService,
    private httpClient: HttpClient,
    private loadingViewManager: LoadingViewManagerService,
  ) {
    let vo = this.loadingViewManager.register("MarketGroupRepositoryService.init", "市场分组数据", 1);
    this.init().subscribe(() => {
      this.loadingViewManager.finished(vo)
    })
   }

  private marketGroupDict: MarketGroupDict = {}

  isInit: boolean = false
  waitUntilInit(): Observable<void> { return WaitUntilInitFuncImpl(this) }

  /**
   * 从ESI初始化所有数据，并存储到IndexedDB
   * @returns
   */
  private init(): Observable<void> {
    return new Observable<void>(sub => { setTimeout(async () => {
      if (this.isInit) {
        sub.next()
        sub.complete()
        return
      }
      this.marketGroupDict = await firstValueFrom(this.httpClient.get<MarketGroupDict>("/assets/marketGroups.gen.json"))
      this.isInit = true

      sub.next()
      sub.complete()
    }) })
  }

  /**
   * 获取所有市场分组
   * @deprecated 获取数据方式已改变、数据结构不同
   * @returns
   */
  public getMarketGroups(): Observable<IMarketGroup[]> {
    return new Observable(sub => { setTimeout(async () => {
      let store = await firstValueFrom(this.indexedDBManager.getMarketGroupStore())
      let marketGroups: IMarketGroup[] = []
      store.getAll().onsuccess = (event: any) => {
        marketGroups = event.target.result
        sub.next(marketGroups)
        sub.complete()
      }
    }) })
  }

  /**
   * 获取所有市场分组数据
   * @returns
   */
  public getMarketGroupDict(): Observable<{[marketGroupId: number]: IMarketGroup}> {
    return new Observable(sub => { setTimeout(async () => {
      await firstValueFrom(this.waitUntilInit())
      sub.next(this.marketGroupDict)
      sub.complete()
    }) })
  }

  /**
   * 根据给定的id获取字典
   * @param marketGroupIds
   * @returns
   */
  public getMarketGroupDictByIds(marketGroupIds: number[]): Observable<MarketGroupDict> {
    return new Observable(sub => { setTimeout(async () => {
      let marketGroupDict = await firstValueFrom(this.getMarketGroupDict())
      let dict: {[marketGroupId: number]: IMarketGroup} = {}
      for (let i = 0; i < marketGroupIds.length; i++) {
        let marketGroupId = marketGroupIds[i]
        if (marketGroupDict[marketGroupId]) {
          dict[marketGroupId] = marketGroupDict[marketGroupId]
        }
      }

      sub.next(dict)
      sub.complete()
    }) })
  }

  /**
   * 获取所有父级分类，包括传入参数本身
   * @param marketGroupDict
   * @returns
   */
  public getMarketGroupDictByChildren(marketGroupDict: {[key: number]: IMarketGroup}): Observable<MarketGroupDict> {
    return new Observable(sub => { setTimeout(async () => {
      let parentIdSet = new Set<number>()
      for (let i in marketGroupDict) {
        let marketGroup = marketGroupDict[i]
        if (marketGroup.parentGroupID) {
          parentIdSet.add(marketGroup.parentGroupID)
        }
      }
      if (parentIdSet.size > 0) {
        let parentMarketGroupDict = await firstValueFrom(this.getMarketGroupDictByIds([...parentIdSet]))
        let superParentMarketGroupDict = await firstValueFrom(this.getMarketGroupDictByChildren(parentMarketGroupDict))
        for (let i in superParentMarketGroupDict) {
          marketGroupDict[i] = superParentMarketGroupDict[i]
        }
      }

      sub.next(marketGroupDict)
      sub.complete()
    }) })
  }
}

type MarketGroupDict = {[marketGroupId: number]: IMarketGroup}