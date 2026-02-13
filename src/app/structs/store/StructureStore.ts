import { IEsiStructure } from "../esi/Structure"


/**
 * 存储建筑的结构接口
 */
export interface IStoreStructure {

  /**
   * 建筑id
   */
  structureId: number

  /**
   * ESI 接口返回的数据
   */
  structure: IEsiStructure

  /**
   * 从 ESI 获取的时间戳
   * 单位：毫秒
   */
  getAt: number
}