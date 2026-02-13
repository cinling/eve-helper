

export interface IStoreKeyValue<T> {
  key: string
  value: T

  /**
   * 存储时的时间戳
   */
  timestamp?: number
}