import { v4 } from "uuid";

/**
 * 值相关的助手
 */
export class ValueHelper {

  /**
   * 深合并对象
   * 如果有相同的属性，后面的数据会覆盖前面的数据
   * @param target
   * @param sources
   */
  static mergeObject<T extends Object>(target: T, ...sources: T[]): T {
    for (let source of sources) {
      if (source == null) continue;
      for (let key in source) {
        if (source[key] != null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = this.mergeObject<any>(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  /**
   * 判断值是否为空
   * @param value
   * @returns
   */
  static isEmpty<T>(value: T): boolean {
    if (value == null || value === undefined || value === 0) return true
    if (typeof value === 'string' && value.trim() === "") return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === 'object' && Object.keys(value).length === 0) return true
    return false
  }

  static uuid(): string {
    return v4()
  }
}