
/**
 * 每个加载中的项目
 */
export interface LoadingViewItemVo {
  /**
   * 项目key
   */
  key: string

  /**
   * 项目名称
   */
  name: string

  /**
   * 已完成的步数
   */
  doneStep: number

  /**
   * 总步数
   */
  totalStep: number

  // updateStep: (doneStep: number, totalStep: number) => void
}

export function createEmptyLoadingViewItemVo() {
  let item = {
    key: "",
    name: "",
    doneStep: 0,
    totalStep: 0,
    // updateStep: () => {}
  }
  return item
}