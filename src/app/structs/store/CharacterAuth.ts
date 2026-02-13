
/**
 * 用户登录授权信息
 */
export interface IStoreCharacterAuth {
  /**
   * 角色id
   */
  characterId: number

  /**
   * 角色名
   */
  characterName: string

  /**
   * 当前授权 accessToken
   */
  accessToken: string

  /**
   * accessToken 有效截止时间戳
   * 单位：毫秒
   */
  accessTokenExpireTime: number

  /**
   * 刷新 accessToken 用的 token
   */
  refreshToken: string
}