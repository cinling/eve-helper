import { sha256 } from 'js-sha256'
import { Base64 } from 'js-base64';


/**
 * 加密工具
 */
export class EncryptHelper {

  /**
   * sha256 加密
   * @param origin
   * @returns
   */
  static sha256(origin: string): string {
    return sha256(origin)
  }

  /**
   * 将字符串转换为 Base64 编码
   * @param origin
   * @returns
   */
  static base64Encode(origin: string): string {
    return Base64.encode(origin)
  }
}