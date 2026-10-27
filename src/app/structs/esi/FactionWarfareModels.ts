
/**
 * 势力战争排行榜
 */
export interface IEsiFwLeaderboard {
  kills: IEsiFwLeaderboardKills
  victory_points: IEsiFwLeaderboardVictoryPoints
}

/**
 * 势力战争击杀榜
 */
export interface IEsiFwLeaderboardKills {
  active_total: IEsiFwLeaderboardTotal[]
  last_week: IEsiFwLeaderboardTotal[]
  yesterday: IEsiFwLeaderboardTotal[]
}

/**
 * 势力战争胜利点数榜
 */
export interface IEsiFwLeaderboardVictoryPoints {
  active_total: IEsiFwLeaderboardTotal[]
  last_week: IEsiFwLeaderboardTotal[]
  yesterday: IEsiFwLeaderboardTotal[]
}

/**
 * 排行榜条目
 */
export interface IEsiFwLeaderboardTotal {
  amount: number
  faction_id?: number
}

/**
 * 角色势力战争排行
 */
export interface IEsiFwLeaderboardCharacter {
  character_id: number
  faction_id: number
  kills: IEsiFwKillStat
  victory_points: IEsiFwVictoryPointStat
}

/**
 * 军团势力战争排行
 */
export interface IEsiFwLeaderboardCorporation {
  corporation_id: number
  faction_id: number
  kills: IEsiFwKillStat
  victory_points: IEsiFwVictoryPointStat
}

/**
 * 势力战争统计
 */
export interface IEsiFwStat {
  faction_id: number
  kills: IEsiFwKillStat
  victory_points: IEsiFwVictoryPointStat
}

/**
 * 击杀统计
 */
export interface IEsiFwKillStat {
  last_week: number
  total: number
  yesterday: number
}

/**
 * 胜利点数统计
 */
export interface IEsiFwVictoryPointStat {
  last_week: number
  total: number
  yesterday: number
}

/**
 * 势力战争星系
 */
export interface IEsiFwSystem {
  contested: boolean
  defender: string
  faction_id: number
  occupier_faction_id?: number
  solar_system_id: number
  victory_points: number
  victory_points_threshold: number
}

/**
 * 势力战争
 */
export interface IEsiFwWar {
  against_id: number
  faction_id: number
  faction_score: number
  to_score: number
}

/**
 * 军团势力战争统计
 */
export interface IEsiFwCorporationStats {
  enlisted_on?: string
  faction_id: number
  kills: IEsiFwKillStat
  victory_points: IEsiFwVictoryPointStat
}

/**
 * 角色势力战争统计
 */
export interface IEsiFwCharacterStats {
  current_rank?: number
  enlisted_on?: string
  faction_id?: number
  highest_rank?: number
  kills: IEsiFwKillStat
  victory_points: IEsiFwVictoryPointStat
}
