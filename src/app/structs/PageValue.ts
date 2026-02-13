
/**
 * 分页数据
 */
export interface PageValue<T> {
  /**
   * 当前页码
   */
  page: number

  /**
   * 一共有多少页
   */
  size: number

  /**
   * 当前页的数据
   */
  data: T[]
}