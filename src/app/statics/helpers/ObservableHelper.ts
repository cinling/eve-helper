import { Observable, Subscriber } from "rxjs";


export class ObservableHelper {
  /**
   * 创建一个 Observable。
   * func 允许是 async 函数：内部的 Promise 抛错时会调用 sub.error，
   * 避免异常被吞掉导致订阅方（firstValueFrom 等）永久挂起。
   */
  static create<T>(func: (sub: Subscriber<T>) => void | Promise<void>) {
    return new Observable<T>(sub => {
      const fail = (error: any) => {
        if (!sub.closed) {
          sub.error(error)
        }
      }
      try {
        const result = func(sub) as any
        if (result && typeof result.then === 'function') {
          result.then(undefined, fail)
        }
      } catch (error) {
        fail(error)
      }
    })
  }

  /**
   * 创建一个延迟执行的 Observable（兼容原有的 setTimeout 写法）。
   * async 函数抛错时同样会调用 sub.error，而不是让订阅方一直等待。
   */
  static createDeferred<T>(func: (sub: Subscriber<T>) => void | Promise<void>) {
    return new Observable<T>(sub => {
      setTimeout(() => {
        const fail = (error: any) => {
          if (!sub.closed) {
            sub.error(error)
          }
        }
        try {
          const result = func(sub) as any
          if (result && typeof result.then === 'function') {
            result.then(undefined, fail)
          }
        } catch (error) {
          fail(error)
        }
      })
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
