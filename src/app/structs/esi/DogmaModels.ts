
/**
 * 教条属性
 */
export interface IEsiDogmaAttribute {
  attribute_id: number
  default_value?: number
  description?: string
  display_name?: string
  high_is_good?: boolean
  icon_id?: number
  name?: string
  published?: boolean
  stackable?: boolean
  unit_id?: number
}

/**
 * 教条动态物品
 */
export interface IEsiDogmaDynamicItem {
  created_by: number
  dogma_attributes: IEsiDogmaAttributeValue[]
  dogma_effects: IEsiDogmaEffectValue[]
  mutator_type_id: number
  source_type_id: number
}

/**
 * 教条属性值
 */
export interface IEsiDogmaAttributeValue {
  attribute_id: number
  value: number
}

/**
 * 教条效应值
 */
export interface IEsiDogmaEffectValue {
  effect_id: number
  is_default: boolean
}

/**
 * 教条效应
 */
export interface IEsiDogmaEffect {
  description?: string
  disallow_auto_repeat?: boolean
  discharge_attribute_id?: number
  display_name?: string
  duration_attribute_id?: number
  effect_category?: number
  effect_id: number
  electronic_chance?: boolean
  falloff_attribute_id?: number
  icon_id?: number
  is_assistance?: boolean
  is_offensive?: boolean
  is_warp_safe?: boolean
  items_modifier?: boolean
  modifier_info?: any
  name?: string
  post_expression?: number
  pre_expression?: number
  published?: boolean
  range_attribute_id?: number
  range_chance?: boolean
  tracking_speed_attribute_id?: number
}
