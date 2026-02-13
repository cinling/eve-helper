

/**
 * 随机助手
 */
export class RandomHelper {

  /**
   * 生成随机整数
   * @param min 最大值
   * @param max 最小值
   * @returns 范围 [min, max]
   */
  public static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}