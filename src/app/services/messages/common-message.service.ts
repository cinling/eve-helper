import { Injectable } from '@angular/core';
import { IStoreSettings } from '../../structs/store/Settings';
import { ObservableValue } from '../../structs/ObservableValue';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonMessageService {

  constructor() { }

  /**
   * 全局设置
   */
  settings: ObservableValue<IStoreSettings> = new ObservableValue()

  /**
   * 区域订单改变时触发
   */
  onRegionOrderChange: Subject<boolean> = new Subject()

}
