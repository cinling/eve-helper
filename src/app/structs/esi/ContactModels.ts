
/**
 * 联系人
 */
export interface IEsiContact {
  contact_id: number
  contact_type: 'character' | 'corporation' | 'alliance' | 'faction'
  is_blocked?: boolean
  is_watched?: boolean
  label_ids?: number[]
  standing: number
}

/**
 * 联系人标签
 */
export interface IEsiContactLabel {
  label_id: number
  label_name: string
}

/**
 * 联系人提交数据
 */
export interface IEsiContactInput {
  contact_id: number
  label_ids?: number[]
  standing: number
  watch?: boolean
  block?: boolean
}
