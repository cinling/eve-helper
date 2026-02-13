import { Observable } from "rxjs";


export class TimeHelper {

  public static wait(ms: number): Observable<void> {
    return new Observable<void>(sub => {
      setTimeout(() => {
        sub.next()
        sub.complete()
      }, ms)
    })
  }

  /**
   * 获取毫秒级时间戳
   * @returns
   */
  public static timestampMS() {
    return Date.now()
  }

  /**
   * 毫秒级时间戳转日期字符串
   * @param timestampMS
   */
  public static datetime(timestampMS: number): string {
    return TimeHelper.formatDate(timestampMS, 'YYYY-MM-DD HH:mm:ss')
  }

   /**
   * 毫秒级时间戳转自定义格式时间字符串
   * @param timestampMS 毫秒级时间戳
   * @param format 自定义格式，例如: 'YYYY-MM-DD HH:mm:ss'
   * @returns 自定义格式时间字符串
   */
  public static formatDate(timestampMS: number, format: string): string {
    const date = new Date(timestampMS);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }
}
