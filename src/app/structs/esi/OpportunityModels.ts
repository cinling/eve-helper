
/**
 * 机遇任务组
 */
export interface IEsiOpportunityGroup {
  connected_groups: number[]
  description: string
  group_id: number
  name: string
  notification: string
  required_tasks: number[]
}

/**
 * 机遇任务
 */
export interface IEsiOpportunityTask {
  description: string
  name: string
  notification: string
  required_skills: IEsiOpportunityRequiredSkill[]
  task_id: number
}

/**
 * 机遇任务所需技能
 */
export interface IEsiOpportunityRequiredSkill {
  level: number
  type_id: number
}

/**
 * 已完成的任务
 */
export interface IEsiOpportunityCompleted {
  completed_at: string
  task_id: number
}
