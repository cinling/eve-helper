import { AfterContentInit, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { firstValueFrom, map, Observable } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { UniverseService } from '../../services/universe.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzOption } from '../../structs/NzOptions';
import { ISettingsMarketStation } from '../../structs/store/Settings';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSliderModule } from 'ng-zorro-antd/slider';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSpaceModule,
    NzToolTipModule,
    NzIconModule,
    NzTableModule,
    NzSwitchModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzTabsModule,
    NzSliderModule,
],
  template: `
<main>
  <div class="settings-body">
    <nz-tabset>
      <nz-tab nzTitle="工业">
        <nz-form-item>
          <nz-form-label nzSpan="4">
            原料价格来源
          </nz-form-label>
          <nz-form-control nzSpan="20">
            <nz-row>
              <nz-col [nzSpan]="8">
                <nz-form-control>
                  <nz-select
                    nzShowSearch
                    [(ngModel)]="settings.industry.material.marketKey"
                    [ngModelOptions]="{standalone: true}"
                    [nzOptions]="marketKeyOptions"
                    nz-tooltip
                    nzTooltipTitle="市场"
                  ></nz-select>
                </nz-form-control>
              </nz-col>
              <nz-col [nzSpan]="8">
                <nz-form-control>
                  <nz-select
                    nzShowSearch
                    [(ngModel)]="settings.industry.material.priceType"
                    [ngModelOptions]="{standalone: true}"
                    [nzOptions]="priceTypeOptions"
                    nz-tooltip
                    nzTooltipTitle="价格类型"
                  ></nz-select>
                </nz-form-control>
              </nz-col>
              <nz-col [nzSpan]="8">
                <nz-form-control>
                  <nz-input-group
                    nzPrefix="折扣"
                    nzSuffix="%"
                    nz-tooltip
                    nzTooltipTitle="价格计算时，将乘上这个值。如果想按95折扣看最终价格，可以输入95"
                  >
                    <input
                      type="number"
                      nz-input
                      [(ngModel)]="settings.industry.material.discount"
                      [ngModelOptions]="{standalone: true}"
                      style="text-align: right;"
                    />
                  </nz-input-group>
                </nz-form-control>
              </nz-col>
            </nz-row>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzSpan="4">
            产品价格来源
          </nz-form-label>
          <nz-form-control nzSpan="20">
            <nz-row>
              <nz-col [nzSpan]="8">
                <nz-form-control>
                  <nz-select
                    nzShowSearch
                    [(ngModel)]="settings.industry.product.marketKey"
                    [ngModelOptions]="{standalone: true}"
                    [nzOptions]="marketKeyOptions"
                    nz-tooltip
                    nzTooltipTitle="市场"
                  ></nz-select>
                </nz-form-control>
              </nz-col>
              <nz-col [nzSpan]="8">
                <nz-form-control>
                  <nz-select
                    nzShowSearch
                    [(ngModel)]="settings.industry.product.priceType"
                    [ngModelOptions]="{standalone: true}"
                    [nzOptions]="priceTypeOptions"
                    nz-tooltip
                    nzTooltipTitle="价格类型"
                  ></nz-select>
                </nz-form-control>
              </nz-col>
              <nz-col [nzSpan]="8">
                <nz-form-control>
                  <nz-input-group
                    nzPrefix="折扣"
                    nzSuffix="%"
                    nz-tooltip
                    nzTooltipTitle="价格计算时，将乘上这个值。如果想按95折扣看最终价格，可以输入95"
                  >
                    <input
                      type="number"
                      nz-input
                      [(ngModel)]="settings.industry.product.discount"
                      [ngModelOptions]="{standalone: true}"
                      style="text-align: right;"
                    />
                  </nz-input-group>
                </nz-form-control>
              </nz-col>
            </nz-row>
          </nz-form-control>
        </nz-form-item>

        <nz-divider></nz-divider>

        <nz-form-item>
          <nz-form-label [nzSpan]="4">
            默认蓝图材料效率
          </nz-form-label>
          <nz-form-control [nzSpan]="4">
            <nz-slider
              [(ngModel)]="settings.industry.meterialEfficiency"
              [ngModelOptions]="{standalone: true}"
              [disabled]="formLoading"
              [nzMin]="0"
              [nzMax]="10"
            ></nz-slider>
          </nz-form-control>
          <nz-form-control [nzSpan]="4">
            <nz-input-number
              [(ngModel)]="settings.industry.meterialEfficiency"
              [ngModelOptions]="{standalone: true}"
              [disabled]="formLoading"
              [nzMin]="0"
              [nzMax]="10"
            ></nz-input-number>
          </nz-form-control>
          <nz-form-label [nzSpan]="4">
            默认蓝图时间效率
          </nz-form-label>
          <nz-form-control [nzSpan]="4">
            <nz-slider
              [(ngModel)]="settings.industry.timeEfficiency"
              [ngModelOptions]="{standalone: true}"
              [disabled]="formLoading"
              [nzMin]="0"
              [nzMax]="20"
            ></nz-slider>
          </nz-form-control>
          <nz-form-control [nzSpan]="4">
            <nz-input-number
              [(ngModel)]="settings.industry.timeEfficiency"
              [ngModelOptions]="{standalone: true}"
              [disabled]="formLoading"
              [nzMin]="0"
              [nzMax]="20"
            ></nz-input-number>
          </nz-form-control>
        </nz-form-item>
      </nz-tab>
      <nz-tab nzTitle="市场">
        <nz-form-item>
          <nz-form-label nzSpan="4">
            市场数据时效
            <span
              nz-icon
              nzType="info-circle"
              nzTheme="outline"
              nz-tooltip
              nzTooltipTitle="当数据有效性超过这个时间，将会重新从ESI服务器拉去新的数据。因为ESI接口有5-10分钟的滞后，因此无法获取到最新的数据"
            ></span>
          </nz-form-label>
          <nz-form-control nzSpan="20">
            <nz-input-number
              [(ngModel)]="settings.market.expireMin"
              [ngModelOptions]="{standalone: true}"
              [disabled]="formLoading"
              [nzMin]="5"
            ></nz-input-number>分钟
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzSpan="4">
            默认市场
            <span
              nz-icon
              nzType="info-circle"
              nzTheme="outline"
              nz-tooltip
              nzTooltipTitle="市场页面价格数据将取自这个市场"
            ></span>
          </nz-form-label>
          <nz-form-control nzSpan="20">
            <nz-select
              nzShowSearch
              [(ngModel)]="settings.market.defaultMarketKey"
              [ngModelOptions]="{standalone: true}"
              [nzStatus]="isDefalutMarketKeyOk ? '' : 'error'"
              [nzOptions]="marketKeyOptions"
              nzPlaceHolder="默认市场空间站"
              [nzLoading]="formLoading"
            ></nz-select>
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label nzSpan="4">
            市场地点
            <span
              nz-icon
              nzType="info-circle"
              nzTheme="outline"
              nz-tooltip
              nzTooltipTitle="会根据情况自动/手动更新数据。【工业】设置中可以选择使用这些数据来作为价格参考"
            ></span>
          </nz-form-label>
          <nz-form-control nzSpan="20">
            <nz-table
              [nzData]="settings.market.stations"
              nzSize="small"
            >
              <thead>
                <tr>
                  <th>位置</th>
                  <th>别称</th>
                  <th>自动更新</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                @for (station of settings.market.stations; track station) {
                  <tr>
                    <td>{{ getSystemOrStationName(station.systemId, station.stationId) }}</td>
                    <td>
                      <input
                        nz-input
                        [(ngModel)]="station.alias"
                        [ngModelOptions]="{standalone: true}"
                        (ngModelChange)="onStationAliasChange()"
                        type="text"
                      />
                    </td>
                    <td>
                      <nz-switch
                        [(ngModel)]="station.autoloading"
                        [ngModelOptions]="{standalone: true}"
                        (ngModelChange)="onStationAutoloadingChange()"
                      ></nz-switch>
                    </td>
                    <td>
                      <button
                        nz-button
                        nzDanger
                        nz-popconfirm
                        nzPopconfirmTitle="确认删除吗？"
                        (nzOnConfirm)="onDeleteMarketStationConfirm(station)"
                      >删除</button>
                    </td>
                  </tr>
                }

                <!-- 添加市场空间站 -->
                 @if (marketTableAddForm.adding) {
                  <tr>
                    <td>
                      <!--星系-->
                      <nz-select
                        nzShowSearch
                        [nzOptions]="systemOptions"
                        [(ngModel)]="marketTableAddForm.systemId"
                        (ngModelChange)="onSystemIdChange()"
                        nzPlaceHolder="请选择星系"
                      >
                      </nz-select>
                      <!--空间站-->
                      <nz-select
                        nzShowSearch
                        [nzOptions]="stationOptions"
                        [(ngModel)]="marketTableAddForm.stationId"
                        [nzLoading]="stationOptionsLoading"
                        nzPlaceHolder="请选择NPC空间站（可选）"
                      >
                      </nz-select>
                    </td>
                    <td>
                      <input
                        nz-input
                        [(ngModel)]="marketTableAddForm.alias"
                        type="text"
                      />
                    </td>
                    <td>
                      <nz-switch
                        [(ngModel)]="marketTableAddForm.autoloading"
                        ></nz-switch>
                    </td>
                    <td>
                      <button
                        nz-button
                        nzType="primary"
                        (click)="onSubmitAddMarketStationClick()"
                        [disabled]="addMarketStationSubmitButtonDisable"
                      >确定</button>
                      <button
                        nz-button
                        (click)="onCancelAddMarketStationClick()"
                      >取消</button>
                    </td>
                  </tr>
                 } @else {
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <button
                        nz-button
                        (click)="onAddMarketStationClick()"
                      >新增</button>
                    </td>
                  </tr>
                 }
              </tbody>
            </nz-table>
          </nz-form-control>
        </nz-form-item>
      </nz-tab>
      <nz-tab nzTitle="库存">
        <nz-form-item>
          <nz-form-label nzSpan="4">
            库存数据时效
            <span
              nz-icon
              nzType="info-circle"
              nzTheme="outline"
              nz-tooltip
              nzTooltipTitle="当数据有效性超过这个时间，将会重新从ESI服务器拉去新的数据。ESI数据是每小时缓存一次，因此时效性最少为1小时"
            ></span>
          </nz-form-label>
          <nz-form-control nzSpan="20">
            <nz-input-number
              [(ngModel)]="settings.asset.expireHour"
              [ngModelOptions]="{standalone: true}"
              [disabled]="formLoading"
              [nzMin]="1"
            ></nz-input-number>小时
          </nz-form-control>
        </nz-form-item>
      </nz-tab>
    </nz-tabset>
  </div>

  <nz-divider></nz-divider>

  <div class="settings-footer">
    <nz-space>
      <button
        *nzSpaceItem
        nz-button
        nzType="primary"
        [disabled]="submitButtonConfig.disable"
        [nzLoading]="formLoading"
        nz-tooltip
        [nzTooltipTitle]="submitButtonConfig.tip"
        nzTooltipColor="red"
        (click)="onSubmitClickAsync()"
      >确认修改</button>

      <button
        *nzSpaceItem
        nz-button
        [nzLoading]="formLoading"
        [disabled]="!isFormValueChange"
        nz-tooltip
        nzTooltipTitle="放弃本次修改，将数据还原成没有修改前的样子"
        (click)="onRevertClickAsync()"
      >还原修改</button>

      <button
        *nzSpaceItem
        nz-button
        [nzLoading]="formLoading"
        nz-tooltip
        nzTooltipTitle="将配置恢复到默认值"
        (click)="onLoadDefaultClickAsync()"
      >加载默认配置</button>
    </nz-space>
  </div>
</main>
  `,
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements AfterContentInit {

  constructor(
    private settingsService: SettingsService,
    private universeService: UniverseService,
  ) {}

  ngAfterContentInit() {
    this.formLoading = true
    this.init().subscribe(() => {
      this.formLoading = false
    })
  }

  /**
   * 表单数据
   */
  settings = this.settingsService.createDefaultSettings()

  /**
   * 原始配置
   * 用于对照数据是否被修改
   */
  originSettings = this.settingsService.createDefaultSettings()

  /**
   * 表单是否加载中
   */
  formLoading: boolean = true

  /**
   * 市场表格添加表单数据
   */
  marketTableAddForm: MarketTableAddForm = this.createDefaultMarketTableAddForm()

  /**
   * 星系选项数据
   */
  systemOptions: NzOption[] = []

  /**
   * 空间站选项数据
   */
  stationOptions: NzOption[] = []

  /**
   * 空间站选项加载中标志
   */
  stationOptionsLoading: boolean = false

  /**
   * 市场key选项
   */
  marketKeyOptions: NzOption[] = []

  /**
   * 价格类型选项
   */
  priceTypeOptions: NzOption[] =[]

  /**
   * 星系或空间站名称字典
   * 因为是异步加载，因此额外起一个变量
   */
  systemOrStationNameDict: {[key: string]: string} = {}

  get isFormValueChange(): boolean {
    return JSON.stringify(this.settings) != JSON.stringify(this.originSettings)
  }


  /**
   * 添加市场空间站提交按钮禁用
   */
  get addMarketStationSubmitButtonDisable(): boolean {
    return this.marketTableAddForm.systemId == undefined || this.marketTableAddForm.alias == ''
  }

  get submitButtonConfig(): {disable: boolean, tip: string} {
    let config = {
      disable: false,
      tip: ''
    }

    if (!this.isDefalutMarketKeyOk) {
      config.disable = true
      config.tip = '默认市场空间站未设置或不正确，请检查'
    } else if (!this.isFormValueChange) {
      config.disable = true
      config.tip = ''
    }
    return config
  }

  /**
   * 是否设置好了默认市场
   */
  get isDefalutMarketKeyOk(): boolean {
    return this.inOptions(this.settings.market.defaultMarketKey,this.marketKeyOptions)
  }

  private init(): Observable<void> {
    this.formLoading = true

    // 获取星系选项数据
    this.universeService.systemOptions().subscribe(options => {
      this.systemOptions = options;
    })
    this.priceTypeOptions = this.settingsService.priceTypeOptions()

    return new Observable<void>(sub => {setTimeout(async() => {
      this.settings = await firstValueFrom(this.settingsService.getOrCreateSettings())
      this.originSettings = JSON.parse(JSON.stringify(this.settings))
      await this.reloadSystemOrStationNamesCacheAsync()
      this.resetMarketKeyOptions()
      sub.next()
      sub.complete()
    })}).pipe(map(() => {
      this.formLoading = false
    }))
  }

  private resetMarketKeyOptions() {
    let options: NzOption[] = []
    this.settings.market.stations.forEach(station => {
      options.push({
        label: station.alias,
        value: this.settingsService.makeMarketKey(station)
      })
    })
    this.marketKeyOptions = options
  }

  async onSubmitClickAsync() {
    this.formLoading = true
    await firstValueFrom(this.settingsService.saveSettings(this.settings))
    this.originSettings = JSON.parse(JSON.stringify(this.settings))
    this.formLoading = false
  }

  async onRevertClickAsync() {
    this.formLoading = true
    this.settings = JSON.parse(JSON.stringify(this.originSettings))
    this.resetMarketKeyOptions()
    this.formLoading = false
  }

  async onLoadDefaultClickAsync() {
    this.formLoading = true
    this.settings = this.settingsService.createDefaultSettings()
    this.formLoading = false
  }

  async onAddMarketStationClick() {
    this.marketTableAddForm = this.createDefaultMarketTableAddForm()
    this.marketTableAddForm.adding = true
  }

  async onCancelAddMarketStationClick() {
    this.marketTableAddForm.adding = false
  }

  async onStationAliasChange() {
    this.resetMarketKeyOptions()
  }

  async onStationAutoloadingChange() {
    this.resetMarketKeyOptions()
  }

  async onSubmitAddMarketStationClick() {
    this.settings.market.stations.push({
      systemId: this.marketTableAddForm.systemId!,
      stationId: this.marketTableAddForm.stationId,
      alias: this.marketTableAddForm.alias,
      autoloading: this.marketTableAddForm.autoloading,
    })
    this.marketTableAddForm.adding = false
    this.reloadSystemOrStationNamesCacheAsync().then()
    this.resetMarketKeyOptions()
  }

  private createDefaultMarketTableAddForm(): MarketTableAddForm {
    return {
      adding: false,
      systemId: undefined,
      stationId: undefined,
      alias: '',
      autoloading: false,
    }
  }

  async onSystemIdChange() {
    this.stationOptionsLoading = true
    this.marketTableAddForm.alias = await firstValueFrom(this.universeService.getSystemName(this.marketTableAddForm.systemId!))
    this.marketTableAddForm.stationId = undefined
    this.stationOptions = await firstValueFrom(this.universeService.stationOptions(this.marketTableAddForm.systemId!))
    this.stationOptionsLoading = false
  }

  /**
   * 获取星系或者空间站的名字
   * @param systemId
   * @param stationId
   */
  getSystemOrStationName(systemId: number, stationId?: number): string {
    let key = systemId + "_"
    if (stationId) {
      key += stationId
    }
    return this.systemOrStationNameDict[key] ?? "-"
  }

  /**
   * 重新加载星系或星系空间站的名字字典数据
   */
  private async reloadSystemOrStationNamesCacheAsync() {
    let cache: {[key: string]: string} = {}
    for (let i in this.settings.market.stations) {
      let station = this.settings.market.stations[i]
      let key = station.systemId + "_"
      if (station.stationId) {
        key += station.stationId
      }

      let name = station.stationId ? await firstValueFrom(this.universeService.getStationName(station.stationId)) : await firstValueFrom(this.universeService.getSystemName(station.systemId))
      cache[key] = name
    }
    this.systemOrStationNameDict = cache
  }

  /**
   * 确认删除市场数据
   * @param station
   */
  async onDeleteMarketStationConfirm(station: ISettingsMarketStation) {
    let deleteIndex = -1
    for (let i = 0; i < this.settings.market.stations.length; i++) {
      let tmpStation = this.settings.market.stations[i]
      if (tmpStation.systemId == station.systemId && tmpStation.stationId == station.stationId) {
        deleteIndex = i
        break
      }
    }
    if (deleteIndex >= 0) {
      this.settings.market.stations.splice(deleteIndex, 1)
      this.resetMarketKeyOptions()
    }
  }

  /**
   * 数值是否在选项中
   * @returns
   */
  inOptions(value: string | number, options: NzOption[]): boolean {
    let inOptions = false
    for (let i in options) {
      let option = options[i]
      if (option.value == value) {
        inOptions = true
        break
      }
    }
    return inOptions
  }
}

/**
 * 市场表格添加表单
 */
interface MarketTableAddForm {
  adding: boolean
  systemId?: number
  stationId?: number
  alias: string
  autoloading: boolean
}