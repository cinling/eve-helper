import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin, Observable } from 'rxjs';
import { IndexedDBManagerService } from '../managers/indexed-dbmanager.service';
import { EsiApiService } from '../esi-api.service';
import { IGraphic } from '../../statics/entities/common';
import { TimeHelper } from '../../statics/helpers/TimeHelper';

@Injectable({
  providedIn: 'root'
})
export class GraphicRepositoryService {

  constructor(
    private indexedDbManager: IndexedDBManagerService
    , private esiApiService: EsiApiService
  ) { }

  /**
   * 初始化
   * @deprecated 因为数据量很多，暂时不考虑全部初始化，以后可能会改成需要时再获取
   */
  public init(): Observable<void> {
    return new Observable<void>(sub => { setTimeout(async() => {
      if (await firstValueFrom(this.isInit())) {
        sub.next()
        sub.complete()
        return // 已经初始化
      }

      // 没有初始化，现在执行初始化
      console.log("GraphicRepositoryService.init START")

      // 请求所有数据
      let ids = await firstValueFrom(this.esiApiService.universeGraphics())
      let requests = ids.map(id => this.esiApiService.universeGraphic(id))
      let graphics = await firstValueFrom(forkJoin(requests)) as IGraphic[]

      // 将数据写入 IndexedDB
      let store = await firstValueFrom(this.indexedDbManager.getGraphicStore())
      let completeNum = 0
      for (let i in graphics) {
        let graphic = graphics[i]
        let ctx = store.put(graphic)
        ctx.onsuccess = _ => {completeNum++}
      }

      // 等待所有数据写入完成。最多等待180秒
      for (let i = 0; i < 180; i++) {
        if (completeNum == graphics.length) {
          break
        }
        await firstValueFrom(TimeHelper.wait(1000))
      }

      console.log("GraphicRepositoryService.init DONE")
      sub.next()
      sub.complete()
    }) })
  }

  private isInit(): Observable<boolean> {
    return new Observable<boolean>(sub => { setTimeout(async() => {
      let store = await firstValueFrom(this.indexedDbManager.getGraphicStore())
      let count = await firstValueFrom(new Observable<number>(sub => {
        let ctx = store.count()
        ctx.onsuccess = (event: any) => {
          sub.next(event.target.result)
        }
        ctx.onerror = (event: any) => {
          console.error("GraphicRepositoryService.isInit", event)
          sub.next(0)
        }
      }))

      sub.next(count > 0)
      sub.complete()
    }) })
  }
}
