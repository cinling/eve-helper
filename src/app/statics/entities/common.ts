
/**
 * 组信息
 * @deprecated 如果需要使用 请转移到 structs/esi 中
 */
export interface IGroup {
  category_id: number
  group_id: number
  name: string
  published: boolean
  types: number[]
}

/**
 * 物品属性
 */
interface DogmaAttribute {
  /** 属性 ID */
  attribute_id: number;
  /** 属性值 */
  value: number;
}

/**
 * 物品效果
 */
interface DogmaEffect {
  /** 效果 ID */
  effect_id: number;
  /** 是否为默认效果 */
  is_default: boolean;
}

/**
 * 物品类型信息
 * @deprecated
 */
export interface IType {
  /** 物品容量 */
  capacity: number;
  /** 物品描述 */
  description: string;
  /** 物品属性列表，最多 1000 个 */
  dogma_attributes: DogmaAttribute[];
  /** 物品效果列表，最多 1000 个 */
  dogma_effects: DogmaEffect[];
  /** 图形 ID */
  graphic_id?: number;
  /** 物品所属组 ID */
  group_id: number;
  /** 图标 ID */
  icon_id?: number;
  /** 市场组 ID，仅对可上架市场的物品有效 */
  market_group_id?: number;
  /** 物品质量 */
  mass: number;
  /** 物品名称 */
  name: string;
  /** 物品打包后的体积 */
  packaged_volume: number;
  /** 物品单位数量 */
  portion_size: number;
  /** 物品是否已发布 */
  published: boolean;
  /** 物品半径 */
  radius: number;
  /** 物品类型 ID */
  type_id: number;
  /** 物品体积 */
  volume: number;
}

/**
 * 物品图形信息
 */
export interface IGraphic {
  /**
   * 碰撞文件路径
   * @title get_universe_graphics_graphic_id_collision_file
   */
  collision_file: string;
  /**
   * 图形文件路径
   * @title get_universe_graphics_graphic_id_graphic_file
   */
  graphic_file: string;
  /**
   * 图形 ID，该字段为必填项
   * @title get_universe_graphics_graphic_id_graphic_id
   */
  graphic_id: number;
  /**
   * 图标文件夹路径
   * @title get_universe_graphics_graphic_id_icon_folder
   */
  icon_folder: string;
  /**
   * 舰船 DNA 信息
   * @title get_universe_graphics_graphic_id_sof_dna
   */
  sof_dna: string;
  /**
   * 舰船阵营名称
   * @title get_universe_graphics_graphic_id_sof_fation_name
   */
  sof_fation_name: string;
  /**
   * 舰船船体名称
   * @title get_universe_graphics_graphic_id_sof_hull_name
   */
  sof_hull_name: string;
  /**
   * 舰船种族名称
   * @title get_universe_graphics_graphic_id_sof_race_name
   */
  sof_race_name: string;
}