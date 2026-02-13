import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IndexedDBManagerService } from '../managers/indexed-dbmanager.service';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { IStoreKeyValue } from '../../structs/store/KeyValue';
import { TimeHelper } from '../../statics/helpers/TimeHelper';
import { LoadingViewManagerService } from '../managers/loading-view-manager.service';
import { CommonMessageService } from '../messages/common-message.service';
import { IGetSetTool } from '../../statics/interfaces/IGetSetTool';
import { InstanceMessageService } from '../messages/instance-message.service';

/**
 * Key Value 存储仓库
 * TODO: 将 KeyValue 接口化，将实例存到 message 层中，repository 层不允许直接注入 KeyValueRepositoryService
 */
@Injectable({
  providedIn: 'root'
})
export class KeyValueRepositoryService implements IGetSetTool {

  constructor(
    private indexedDBManager: IndexedDBManagerService,
    private loadingViewManager: LoadingViewManagerService,
    private instanceMessage: InstanceMessageService,
  ) {
    let vo = this.loadingViewManager.register("KeyValueRepositoryService", "便捷存储服务", 1)
    this.init().subscribe(() => {
      this.loadingViewManager.finished(vo)
    })
  }

  /**
   * 市场树状结构数据。蓝图模式
   */
  private static readonly KEY_MARKET_BLUEPRINT_TREE_NODES: string = "KEY_MARKET_BLUEPRINT_TREE_NODES"

  /**
   * 市场树状结构数据。市场模式（即所有数据）
   */
  private static readonly KEY_MARKET_TREE_NODES: string = "KEY_MARKET_TREE_NODES"


  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let keyRepository = this
      this.instanceMessage.getSetTool.setValue(keyRepository)
      sub.next()
      sub.complete()
    })})
  }

  foo() {}


  getWithKeyValue<T>(key: string): Observable<IStoreKeyValue<T> | null> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.get(key)
      let value = await firstValueFrom(this.indexedDBManager.dbRequestGetOrDefault<T>(request))
      if (value != null) {
        sub.next(value)
      } else {
        sub.next(null)
      }
      sub.complete()
    })})
  }

  get<T>(key: string): Observable<T | null> {
    return this.getWithKeyValue<T>(key).pipe(map(x => x?.value ?? null))
  }

  set<T>(key: string, value: T): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.put(this.buildKeyValue(key, value))
      await firstValueFrom(this.indexedDBManager.dbRequestWait(request))
      sub.next()
      sub.complete()
    })})
  }

  /**
   *
   * @returns 市场树形结构数据
   */
  public getMarketTreeNodes(): Observable<NzTreeNodeOptions[]> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.get(KeyValueRepositoryService.KEY_MARKET_TREE_NODES)
      let nodes = await firstValueFrom(this.indexedDBManager.dbRequestGetOrDefault(request).pipe(map(x => x?.value ?? []))) as NzTreeNodeOptions[]
      sub.next(nodes)
      sub.complete()
    })})
  }

  public setMarketTreeNodes(nodes: NzTreeNodeOptions[]): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.put(this.buildKeyValue(KeyValueRepositoryService.KEY_MARKET_TREE_NODES, nodes))
      await firstValueFrom(this.indexedDBManager.dbRequestWait(request))
      sub.next()
      sub.complete
    })})
  }

  public getMarketBlueprintTreeNodes(): Observable<NzTreeNodeOptions[]> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.get(KeyValueRepositoryService.KEY_MARKET_BLUEPRINT_TREE_NODES)
      let nodes = await firstValueFrom(this.indexedDBManager.dbRequestGetOrDefault(request).pipe(map(x => x?.value ?? []))) as NzTreeNodeOptions[]
      sub.next(nodes)
      sub.complete()
    })})
  }

  public setMarketBlueprintTreeNodes(nodes: NzTreeNodeOptions[]): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.put(this.buildKeyValue(KeyValueRepositoryService.KEY_MARKET_BLUEPRINT_TREE_NODES, nodes))
      await firstValueFrom(this.indexedDBManager.dbRequestWait(request))
      sub.next()
      sub.complete
    })})
  }

  /**
   * 构建存储的数据
   * @param key
   * @param value
   * @returns
   */
  private buildKeyValue<T>(key: string, value: T): IStoreKeyValue<T> {
    return {key, value, timestamp: TimeHelper.timestampMS()}
  }

}