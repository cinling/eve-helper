import { Injectable } from '@angular/core';
import { ObservableValue } from '../../structs/ObservableValue';
import { IGetSetTool } from '../../statics/interfaces/IGetSetTool';
import { IEsiService } from '../../statics/interfaces/IEsiService';

/**
 * 实例服务
 * 可以将服务实例保存在这里，以接口形式调用
 */
@Injectable({
  providedIn: 'root'
})
export class InstanceMessageService {
    /**
     * 存取工具
     */
    getSetTool: ObservableValue<IGetSetTool> = new ObservableValue()

    /**
     * ESI 公开服务
     */
    esiService: ObservableValue<IEsiService> = new ObservableValue()
}
