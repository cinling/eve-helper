import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @deprecated 移动到 LocalStorageTool 下，这里可以不适用 Manager 进行管理，因为 Api 也需要用
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageManagerService {

  constructor() { }

  /**
   * 设置的key
   */
  public static readonly SETTINGS = "settings"

  /**
   * 获取数据
   */
  public get<T>(key: string): Observable<T | null> {
    return new Observable(sub => {
      let value = localStorage.getItem(key)
      if (value == null) {
        sub.next(null)
        sub.complete()
      } else {
        sub.next(JSON.parse(value) as T)
        sub.complete()
      }
    })
  }

  /**
   * 设置数据
   * @param key
   * @param value
   * @returns
   */
  public set<T>(key: string, value: T): Observable<void> {
    return new Observable(sub => {
      localStorage.setItem(key, JSON.stringify(value))
      sub.next()
      sub.complete()
    })
  }
}
