
/**
 * 验证返回信息
 */
export interface IEsiVerifyReponse {
  CharacterID: number
  CharacterName: string
  CharacterOwnerHash: string
  ClientID: string
  ExpiresOn: string
  Scopes: string
  TokenType: string
}