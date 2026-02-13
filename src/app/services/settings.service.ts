import { Injectable } from '@angular/core';
import { LocalStorageManagerService } from './managers/local-storage-manager.service';
import { firstValueFrom, Observable } from 'rxjs';
import { IStoreSettings, ISettingsMarketStation, makeMarketKeyByValue } from '../structs/store/Settings';
import { STATION_ID_JITA, SYSTEM_ID_JITA } from '../statics/contants/eve';
import { ValueHelper } from '../statics/helpers/ValueHelper';
import { PriceTypeConstants } from '../statics/contants/market';
import { NzOption } from '../structs/NzOptions';
import { CommonMessageService } from './messages/common-message.service';

/**
 * 设置服务
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private localStorageManager: LocalStorageManagerService,
    private commonMessage: CommonMessageService,
  ) {
    this.init().subscribe()
  }

  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let settings = await firstValueFrom(this.getOrCreateSettings())
      this.commonMessage.settings.setValue(settings)
      sub.next()
      sub.complete()
    })})
  }

  fooApp() {
    // 没有任何意义，只是看起来 SettingsService 在 AppComponent 中像是被使用的样子
  }

  /**
   * @returns 获取或创建 Settings
   */
  public getOrCreateSettings(): Observable<IStoreSettings> {
    return new Observable(sub => {setTimeout(async() => {
      let settings = await firstValueFrom(this.localStorageManager.get<IStoreSettings>(LocalStorageManagerService.SETTINGS))
      if (settings == null) {
        settings = this.createDefaultSettings()
      }

      let defaultSettings = this.createDefaultSettings()
      settings = ValueHelper.mergeObject(defaultSettings, settings) // 合并默认值，防止默认值修改导致数据缺失

      sub.next(settings)
      sub.complete()
    })})
  }

  /**
   * 设置数据
   * @param settings
   */
  public saveSettings(settings: IStoreSettings): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      await firstValueFrom(this.localStorageManager.set(LocalStorageManagerService.SETTINGS, settings))
      this.commonMessage.settings.setValue(settings)
      sub.next()
      sub.complete()
    })})
  }

  /**
   *
   * @returns 创建默认的数据
   */
  createDefaultSettings(): IStoreSettings {
    let jitaMarketKey = makeMarketKeyByValue(SYSTEM_ID_JITA, STATION_ID_JITA)

    return {
      industry: {
        material: {
          marketKey: jitaMarketKey,
          priceType: PriceTypeConstants.Middle,
          discount: 100
        },
        product: {
          marketKey: jitaMarketKey,
          priceType: PriceTypeConstants.Middle,
          discount: 100
        },
        meterialEfficiency: 0,
        timeEfficiency: 0,
      },
      market: {
        expireMin: 2 * 60, // 市场数据有效期。单位：分钟
        defaultMarketKey: jitaMarketKey,
        stations: [
          {
            systemId: SYSTEM_ID_JITA,
            stationId: STATION_ID_JITA,
            alias: '吉他',
            autoloading: true
          }
        ]
      },
      asset: {
        expireHour: 2 // 库存资产数据有效期。单位：小时
      }
    }
  }

  /**
   * 构建市场key
   * @param systemId
   * @param stationId
   * @returns
   */
  makeMarketKey(station: ISettingsMarketStation) {
    return makeMarketKeyByValue(station.systemId, station.stationId)
  }

  priceTypeOptions(): NzOption[] {
    return [
      {value: PriceTypeConstants.LowestSell, label: '卖价（最低）'},
      {value: PriceTypeConstants.Middle, label: '中间价'},
      {value: PriceTypeConstants.HighestBuy, label: '买价（最高）'},
      {value: PriceTypeConstants.Average, label: '平均成交价（昨日）'},
      {value: PriceTypeConstants.Average20d, label: '平均成交价（20天）'},
    ]
  }
}
