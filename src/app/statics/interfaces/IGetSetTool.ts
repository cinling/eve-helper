import { Observable } from "rxjs";
import { IStoreKeyValue } from "../../structs/store/KeyValue";

/**
 * 存取工具接口
 */
export interface IGetSetTool {
  getWithKeyValue<T>(key: string): Observable<IStoreKeyValue<T> | null>
  get<T>(key: string): Observable<T | null>
  set<T>(key: string, value: T): Observable<void>
}