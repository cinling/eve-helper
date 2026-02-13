import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, map, Observable, Subscriber } from 'rxjs';
import { IEsiOrder } from '../../structs/esi/Order';
import { IndexedDBManagerService } from '../managers/indexed-dbmanager.service';
import { createRegionOrder, IStoreRegionOrder } from '../../structs/store/RegionOrder';
import { LoadingViewManagerService } from '../managers/loading-view-manager.service';
import { EveEsiApiService } from '../apis/eve-esi-api.service';
import { CommonMessageService } from '../messages/common-message.service';

@Injectable({
  providedIn: 'root'
})
export class OrderRepositoryService {

  constructor(
    private indexedDBManager: IndexedDBManagerService,
    private loadingViewManager: LoadingViewManagerService,
    private eveEsiApi: EveEsiApiService,
    private commonMessage: CommonMessageService,
  ) { }

  /**
   * 地区订单数据是否加载中
   */
  private loadingDict: {[regionId: number]: boolean} = {}

  /**
   * 地区订单数据加载完成的 observable
   */
  private loadingSubscribersDict: {[regionId: number]: Subscriber<void>[]} = {}

  /**
   * 重新加载星域下所有订单的数据
   * @param regionId
   */
  public reloadOrdersByRegionId(regionId: number): Observable<void> {
    // 正在加载中，直接返回 observable 等待
    if (this.loadingDict[regionId]) {
      let obs = new Observable<void>(sub => {
        if (!this.loadingSubscribersDict[regionId]) {
          this.loadingSubscribersDict[regionId] = []
        }
        this.loadingSubscribersDict[regionId].push(sub)
      })
      return obs
    }
    this.loadingDict[regionId] = true

    let loadingItem = this.loadingViewManager.register(`OrderRepositoryService.reloadOrdersByRegionId:{${regionId}}`, "星域订单", 1)
    return new Observable<void>(sub => {setTimeout(async() => {
      let page = 1
      let orders: IEsiOrder[] = []
      let hasNext = true
      do {
        // 每次并发10页数据
        let requests = []
        for (let i = 0; i < 10; i++) {
          requests.push(this.eveEsiApi.marketsRegionOrders(regionId, 'all', page))
          page++
        }
        let results = await firstValueFrom(forkJoin(requests)) as IEsiOrder[][]
        for (let i in results) {
          let requestOrders = results[i]
          orders.push(...requestOrders)

          if (requestOrders.length == 0) {
            hasNext = false
          }
        }
        loadingItem.doneStep += 1
        loadingItem.totalStep += 1
      } while (hasNext) // 还有下一页

      // 将数据写入 indexedDB
      let store = await firstValueFrom(this.indexedDBManager.getRegionOrderStore())
      let ctx = store.put(createRegionOrder(regionId, orders))
      ctx.onsuccess = () => {
        this.commonMessage.onRegionOrderChange.next(true)
        sub.next()
        sub.complete()
      }
      ctx.onerror = e => {
        console.error(`OrderRepositoryService.reloadOrdersByRegionId put region[${regionId}] failed`, e)
        sub.next()
        sub.complete()
      }
    })}).pipe(map(() => {
      this.loadingViewManager.finished(loadingItem)
      this.loadingDict[regionId] = false
      // 完成所有的等待项
      if (this.loadingSubscribersDict[regionId]) {
        let subscribers = this.loadingSubscribersDict[regionId]
        for (let i in subscribers) {
          let sub = subscribers[i]
          sub.next()
          sub.complete()
        }
      }
    }))
  }

  /**
   * 获取星域所有订单
   * @param regionId
   * @returns
   */
  public getRegionOrder(regionId: number): Observable<IStoreRegionOrder | null> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getRegionOrderStore())
      let ctx = store.get(regionId)
      ctx.onsuccess = (event) => {
        let target = event.target as IDBRequest
        if (target.result == null) { // 没有数据，立刻去请求
          this.reloadOrdersByRegionId(regionId).subscribe(() => {setTimeout(async() => {
            let result = await firstValueFrom(this.getRegionOrder(regionId))
            sub.next(result)
            sub.complete()
          })})
        } else {
          sub.next(target.result)
          sub.complete()
        }
      }
      ctx.onerror = e => {
        console.error(`OrderRepositoryService.getOrdersByRegionId get region[${regionId}] failed`, e)
        sub.next(null)
        sub.complete()
      }
    })})
  }

  /**
   * 获取星域下的指定物品的所有订单
   * @param regionId
   * @param typeId
   */
  getOrdersByTypeId(regionId: number, typeId: number): Observable<IEsiOrder[]> {
    return new Observable(sub => {setTimeout(async() => {
      let hasDBOrders = await firstValueFrom(this.hasDBOrdersByRegionId(regionId))
      let orders: IEsiOrder[] = []
      if (hasDBOrders) { // 有数据，从数据库中加载
        let regionOrder = await firstValueFrom(this.getRegionOrder(regionId))
        if (regionOrder === null) {
          sub.next(orders)
          sub.complete()
          return
        }

        for (let i in regionOrder.orders) {
          let order = regionOrder.orders[i]
          if (order.type_id == typeId) {
            orders.push(order)
          }
        }
      } else { // 没有数据，直接从 ESI 中加载
        let hasNext = true
        let page = 1
        do {
          // 每次并发10页数据
          let requests = []
          for (let i = 0; i < 10; i++) {
            requests.push(this.eveEsiApi.marketsRegionOrders(regionId, 'all', page, typeId))
            page++
          }
          let results = await firstValueFrom(forkJoin(requests)) as IEsiOrder[][]
          for (let i in results) {
            let requestOrders = results[i]
            orders.push(...requestOrders)

            if (requestOrders.length == 0) {
              hasNext = false
            }
          }
        } while(hasNext)
      }


      sub.next(orders)
      sub.complete()
    })})
  }

  /**
   * 判断数据库中是否有该星域订单
   * @param regionId 星域ID
   */
  private hasDBOrdersByRegionId(regionId: number): Observable<boolean> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getRegionOrderStore())
      let ctx = store.get(regionId)
      ctx.onsuccess = () => {
        sub.next(ctx.result !== undefined)
      }
      ctx.onerror = e => {
        console.error(`OrderRepositoryService.hasDBOrdersByRegionId get region[${regionId}] failed`, e)
        sub.next(false)
        sub.complete()
      }
    })})
  }
}
