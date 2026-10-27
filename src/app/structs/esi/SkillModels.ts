
/**
 * 角色的技能
 */
export interface IEsiCharacterSkills {
  skills: IEsiSkill[]
  total_sp: number
  unallocated_sp?: number
}

/**
 * 技能
 */
export interface IEsiSkill {
  active_skill_level: number
  skill_id: number
  skillpoints_in_skill: number
  trained_skill_level: number
}

/**
 * 技能队列项
 */
export interface IEsiSkillQueueItem {
  finish_date?: string
  finished_level: number
  level_end_sp?: number
  level_start_sp?: number
  queue_position: number
  skill_id: number
  start_date?: string
  training_start_sp?: number
}
