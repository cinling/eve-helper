import { Observable, Observer, Subject, Subscribable, Subscriber, Subscription, Unsubscribable } from "rxjs";


/**
 * 可观察值
 */
export class ObservableValue<T> extends Observable<T>  {

  constructor() {
    super();
  }

  private static id = 0

  /**
   * 存储的数值
   */
  private value: T | null = null

  private subscriberDict: {[id: number]: Subscriber<T>} = {}

  override subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void)): Subscription;
  /** @deprecated Instead of passing separate callback arguments, use an observer argument. Signatures taking separate callback arguments will be removed in v8. Details: https://rxjs.dev/deprecations/subscribe-arguments */
  override subscribe(next?: ((value: T) => void) | null, error?: ((error: any) => void) | null, complete?: (() => void) | null): Subscription;
  override subscribe(
    observerOrNext?: any,
    error?: ((error: any) => void) | null,
    complete?: (() => void) | null
  ): Subscription {
    return new Observable(sub => {
      let id = this.nextId()

      if (this.value !== null) {
        sub.next(this.value) // 如果有值立刻返回
      }

      this.subscriberDict[id] = sub
      return {
        unsubscribe: () => {
          delete this.subscriberDict[id]
        }
      }
    }).subscribe(observerOrNext, error, complete)
  }

  // /**
  //  * 通过订阅获取数值
  //  * @param observer
  //  * @returns
  //  */
  // subscribe(observerOrNext?: Partial<Observer<T>> | ((value: T) => void) | undefined): Unsubscribable {
  //   return new Observable<T>(sub => {
  //     let id = this.nextId()

  //     if (this.value !== null) {
  //       sub.next(this.value) // 如果有值立刻返回
  //     }

  //     this.subscriberDict[id] = sub
  //     return {
  //       unsubscribe: () => {
  //         delete this.subscriberDict[id]
  //       }
  //     }
  //   }).subscribe(observerOrNext)
  // }

  /**
   * 设置值
   * @param value
   */
  setValue(value: T) {
    this.value = value
    setTimeout(() => {
      for (let id in this.subscriberDict) {
        this.subscriberDict[id].next(value)
      }
    })
  }

  /**
   *
   * @returns 是否有值
   */
  hasValue(): boolean {
    return this.value !== null
  }

  private nextId(): number {
    return ObservableValue.id++
  }
}