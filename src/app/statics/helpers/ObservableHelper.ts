import { Observable, Subscriber } from "rxjs";


export class ObservableHelper {
  static create<T>(func: (sub: Subscriber<T>) => void) {
    return new Observable<T>(sub => {
      func(sub)
    })
  }

  /**
   * 创建一个错误的Observable
   * @param error 错误信息
   */
  static error<T>(error?: any) {
    return ObservableHelper.create<T>(sub => {
      sub.error(error)
    })
  }
}