import { Observable } from "rxjs";
import { IStoreCharacterAuth } from "../../structs/store/CharacterAuth";

/**
 * esi 服务公开的接口
 */
export interface IEsiService {

  /**
   * 获取所有授权esi的角色id
   */
  getChartacterIds(): Observable<number[]>

  /**
   * 获取角色的 accessToken
   * @param characterId 角色id
   */
  getAccessToken(characterId: number): Observable<string>

  /**
   * 获取角色名字
   * @param characterId
   */
  getCharacterName(characterId: number): Observable<string>
}