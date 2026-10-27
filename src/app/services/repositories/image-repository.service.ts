import { Injectable } from '@angular/core';

/**
 * 所有图片相关的服务
 */
@Injectable({
  providedIn: 'root'
})
export class ImageRepositoryService {

  constructor() { }

    /**
   * 授权角色头像
   * @param characterId
   * @param size
   * @returns
   */
  character(characterId: number, size: 32 | 64 | 128 | 256 | 512 = 64) {
    return `https://images.evetech.net/characters/${characterId}/portrait?size=${size}`
  }

  /**
   * 军团logo
   * @param corporationId
   * @param size
   * @returns
   */
  corporation(corporationId: number, size: 32 | 64 | 128 | 256 = 64) {
    return `https://images.evetech.net/corporations/${corporationId}/logo?size=${size}`
  }

  /**
   * 蓝图图片
   * @param blueprintTypeId
   * @param size
   * @returns
   */
  blueprint(blueprintTypeId: number, size: 32 | 64 | 128  = 32): string {
    return `https://images.evetech.net/types/${blueprintTypeId}/bp?size=${size}`
  }

  typeRender(typeId: number, size: 32 | 64 | 128 = 32): string {
    return `https://images.evetech.net/types/${typeId}/render?size=${size}`
  }

  /**
   * 物品类型图片
   * @param typeId
   * @param size
   * @returns
   */
  typeIcon(typeId: number, size: 32 | 64 | 128 = 32): string {
    return `https://images.evetech.net/types/${typeId}/icon?size=${size}`
  }

  /**
   * 市场组图标
   * @param iconId
   * @returns
   */
  marketGroupIcon(iconId: number): string {
    return `https://cn.c3q.cc:20080/eve/market/img/market_groups/${iconId}.png`
  }
}
