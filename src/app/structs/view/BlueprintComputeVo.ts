import { IBlueprintMaterial } from "../../statics/entities/Blueprint";


/**
 * 蓝图极端页面显示数据
 */
export interface BlueprintComputeVo {

  imgsrc: string
  name: string

  /**
   * 原材料数据
   */
  materials: IBlueprintMaterial[]
}