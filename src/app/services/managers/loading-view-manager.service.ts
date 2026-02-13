import { Injectable, NgZone } from '@angular/core';
import { createEmptyLoadingViewItemVo, LoadingViewItemVo } from '../../structs/view/LoadingViewVo';
import { RandomHelper } from '../../statics/helpers/RandomHelper';
import { TimeHelper } from '../../statics/helpers/TimeHelper';
import { ObservableValue } from '../../structs/ObservableValue';

@Injectable({
  providedIn: 'root'
})
export class LoadingViewManagerService {

  constructor(
    private zone: NgZone
  ) {
    this.startIntervalRefresh()
  }

  /**
   * 是否有东西在加载
   */
  get isLoading(): boolean {
    return Object.keys(this.itemDict).length > 0
  }

  /**
   * 当前加载显示的信息
   */
  get showItem(): LoadingViewItemVo {
    if (!this.isLoading) {
      return createEmptyLoadingViewItemVo()
    }

    let returnItem = createEmptyLoadingViewItemVo()
    returnItem.key = "total"
    returnItem.doneStep += this.finishedStep
    returnItem.totalStep += this.finishedStep
    for (let i in this.itemDict) {
      let item = this.itemDict[i]
      returnItem.doneStep += item.doneStep
      returnItem.totalStep += item.totalStep
    }

    let key = this.currentKey
    let now = TimeHelper.timestampMS()
    if (now - LoadingViewManagerService.SHOW_ITEM_CHANGE_INTERVAL > this.showItemChangeTime) {
      let keys = Object.keys(this.itemDict)
      let keyIndex = RandomHelper.randomInt(0, keys.length - 1)
      key = keys[keyIndex]
      this.currentKey = key
      this.showItemChangeTime = now

    }
    let showNameItem = this.itemDict[key]
    returnItem.name = showNameItem?.name ?? ""

    return returnItem
  }

  /**
   * 显示间隔时间
   */
  private static readonly SHOW_ITEM_CHANGE_INTERVAL = 5000

  /**
   * 上次修改 showItem 的时间
   */
  private showItemChangeTime: number = 0

  /**
   * 当前显示文字的key
   */
  private currentKey: string = ""

  /**
   * 所有加载中的数据对象
   */
  private itemDict: {[key: string]: LoadingViewItemVo} = {}

  /**
   * 累计已完成的步数
   */
  private finishedStep: number = 0

  /**
   * 当前显示的内容
   */
  showItemOV: ObservableValue<LoadingViewItemVo | null> = new ObservableValue()

  /**
   * 注册项目
   * @param item 项目
   */
  public register(key: string, name: string, totalStep: number): LoadingViewItemVo {
    let item = createEmptyLoadingViewItemVo()
    item.key = key
    item.name = name
    item.doneStep = 0
    item.totalStep = totalStep
    this.itemDict[key] = item
    return item
  }

  /**
   * 完成项目
   */
  public finished(item: LoadingViewItemVo) {
    this.finishedStep += item.totalStep
    delete this.itemDict[item.key]

    if (this.isLoading) {
      this.showItemOV.setValue(this.showItem)
    } else {
      this.showItemOV.setValue(null)
    }
  }

  /**
   * 定时刷新显示数据。
   * 如果定时触发数据变动， showItem.name  会一直保静止
   */
  private startIntervalRefresh(): void {
    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        if (!this.isLoading) {
          return
        }
        let item = this.register("_", " ", 0)
        this.finished(item)
      }, LoadingViewManagerService.SHOW_ITEM_CHANGE_INTERVAL)
    })
  }
}
