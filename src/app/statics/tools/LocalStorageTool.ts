import { Observable } from "rxjs";


export class LocalStorageTool {

  /**
   * 所有设置
   */
  static readonly SETTINGS = "settings"

  /**
   * 验证码
   */
  static readonly CodeVerifier = "code_verifier"

  /**
   * 角色授权字典
   */
  static readonly CharacterAuthDict = "esi:characterAuthDict"


  static get<T>(key: string): Observable<T | null> {
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

  static set<T>(key: string, value: T): Observable<void> {
    return new Observable(sub => {
      localStorage.setItem(key, JSON.stringify(value))
      sub.next()
      sub.complete()
    })
  }
}