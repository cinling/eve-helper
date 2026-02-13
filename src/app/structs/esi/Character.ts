

/**
 * ESI 角色公开信息
 */
export interface IEsiCharacter {

  alliance_id?: number
  birthday: string
  bloodline_id: number
  corporation_id: number
  description?: string
  faction_id?: number
  gender: 'female' | 'male'
  name: string
  race_id: number
  security_status?: number
  title?: string
}