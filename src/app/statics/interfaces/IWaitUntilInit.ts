import { firstValueFrom, Observable } from "rxjs"
import { TimeHelper } from "../../statics/helpers/TimeHelper"

/**
 * 等待直至完成
 *
 * @classdesc 是否可以通过 ObservableValue 实现功能？
 */
export interface IWaitUntilInit {
  isInit: boolean
  waitUntilInit(): Observable<void>
}

export function WaitUntilInitFuncImpl(ins: IWaitUntilInit): Observable<void> {
  return new Observable(sub => {
    setTimeout(async () => {
      if (ins.isInit) {
        sub.next()
        sub.complete()
        return
      }
      while (!ins.isInit) {
        await firstValueFrom(TimeHelper.wait(10))
      }

      sub.next()
      sub.complete()
    })
  })
}
