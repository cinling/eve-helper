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
import { ObservableHelper } from '../../statics/helpers/ObservableHelper';

/**
 * Key Value 瀛樺偍浠撳簱
 * TODO: 灏?KeyValue 鎺ュ彛鍖栵紝灏嗗疄渚嬪瓨鍒?message 灞備腑锛宺epository 灞備笉鍏佽鐩存帴娉ㄥ叆 KeyValueRepositoryService
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
    let vo = this.loadingViewManager.register("KeyValueRepositoryService", "渚挎嵎瀛樺偍鏈嶅姟", 1)
    this.init().subscribe(() => {
      this.loadingViewManager.finished(vo)
    })
  }

  /**
   * 甯傚満鏍戠姸缁撴瀯鏁版嵁銆傝摑鍥炬ā寮?
   */
  private static readonly KEY_MARKET_BLUEPRINT_TREE_NODES: string = "KEY_MARKET_BLUEPRINT_TREE_NODES"

  /**
   * 甯傚満鏍戠姸缁撴瀯鏁版嵁銆傚競鍦烘ā寮忥紙鍗虫墍鏈夋暟鎹級
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
    return ObservableHelper.createDeferred(async sub => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.get(key)
      let value = await firstValueFrom(this.indexedDBManager.dbRequestGetOrDefault<T>(request))
      if (value != null) {
        sub.next(value)
      } else {
        sub.next(null)
      }
      sub.complete()
    })
  }

  get<T>(key: string): Observable<T | null> {
    return this.getWithKeyValue<T>(key).pipe(map(x => x?.value ?? null))
  }

  set<T>(key: string, value: T): Observable<void> {
    return ObservableHelper.createDeferred(async sub => {
      let store = await firstValueFrom(this.indexedDBManager.getKeyValueStore())
      let request = store.put(this.buildKeyValue(key, value))
      await firstValueFrom(this.indexedDBManager.dbRequestWait(request))
      sub.next()
      sub.complete()
    })
  }

  /**
   *
   * @returns 甯傚満鏍戝舰缁撴瀯鏁版嵁
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
      sub.complete()
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
      sub.complete()
    })})
  }

  /**
   * 鏋勫缓瀛樺偍鐨勬暟鎹?
   * @param key
   * @param value
   * @returns
   */
  private buildKeyValue<T>(key: string, value: T): IStoreKeyValue<T> {
    return {key, value, timestamp: TimeHelper.timestampMS()}
  }

}