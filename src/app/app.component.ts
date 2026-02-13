import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { IndexedDBManagerService } from './services/managers/indexed-dbmanager.service';
import { firstValueFrom, Observable } from 'rxjs';
import { LoadingViewItemVo } from './structs/view/LoadingViewVo';
import { LoadingViewManagerService } from './services/managers/loading-view-manager.service';
import { SettingsComponent } from "./pages/settings/settings.component";
import { SettingsService } from './services/settings.service';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { MarketService } from './services/market.service';
import { CommonMessageService } from './services/messages/common-message.service';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { MarketTreeModeConstants } from './statics/contants/market';
import { DownloadHelper } from './statics/helpers/DownloadHelper';
import { EsiService } from './services/esi.service';
import { KeyValueRepositoryService } from './services/repositories/key-value-repository.service';
import { NzTabLinkTemplateDirective } from "ng-zorro-antd/tabs";
import { NzMessageModule, NzMessageRef, NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzModalModule,
    SettingsComponent,
    NzGridModule,
    NzTagModule
],
  template: `
<!--
 菜单图标说明：
  file: 页面
  close-circle: 未可用的
  play-circle: 执行动作而非打开页面
 -->

<nz-layout class="app-layout">
  <nz-header>
    <ul
      nz-menu
      nzMode="horizontal"
      [nzSelectable]="false"
    >
      <li nz-submenu nzTitle="工业">
        <ul>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/blueprint-compute">蓝图计算</a>
          </li>
          <li nz-menu-item nzMatchRouter="">
            <a routerLink="/blueprint-rank">利润排行</a>
          </li>
          <li nz-menu-item>
            <a id="debugging">化矿</a>
          </li>
          <li nz-menu-item>
            <a id="debugging">行星工业</a>
          </li>
        </ul>
      </li>
      <li nz-submenu nzTitle="市场">
        <ul>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/market-trend">价格走势</a>
          </li>
          <li nz-menu-item>
            <a id="debugging">估价</a>
          </li>
          <li nz-menu-item>
            <a id="debugging">比价</a>
          </li>
        </ul>
      </li>
      <li nz-submenu nzTitle="物流">
      </li>
      <li nz-submenu nzTitle="库存">
        <ul>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/asset">资产</a>
          </li>
        </ul>
      </li>
      <li nz-submenu nzTitle="其他">
        <ul>
          <li nz-menu-item>
            <a id="debugging"><span nz-icon nzType="close-circle" nzTheme="outline"></span>技能点购买计算</a>
          </li>
          <li nz-menu-item>
            <a id="debugging"><span nz-icon nzType="close-circle" nzTheme="outline"></span>关于网站</a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/auth">ESI授权</a>
          </li>
        </ul>
      </li>
      <li nz-submenu>
        <span title>
          <span nz-icon nzType="setting" nzTheme="outline"></span>
        </span>
        <ul>
          <li nz-menu-item>
            <a (click)="onSettingsModalClick()">设置</a>
          </li>
          <li nz-menu-item>
            <a (click)="onClearCacheClick()">清空缓存</a>
          </li>
          <li nz-menu-item>
            <a (click)="developerModal.visible = true">开发工具</a>
          </li>
        </ul>
      </li>
    </ul>
  </nz-header>

  <nz-content>
    <div class="inner-content">
      <router-outlet></router-outlet>
    </div>
  </nz-content>

  <nz-footer>
    <nz-row>
      <nz-col [nzSpan]="4">
      </nz-col>
      <nz-col [nzSpan]="20">
        <div style="text-align: right;">
          @for (item of updateTimeArr; ; track item) {
            <nz-tag>{{ item.label }} <span class="footer-time">{{ item.time }}</span></nz-tag>
          }
        </div>
      </nz-col>
    </nz-row>

  </nz-footer>
</nz-layout>

<nz-modal
  nzTitle="设置"
  nzWidth="80%"
  [(nzVisible)]="settingsModalVisible"
  (nzOnCancel)="settingsModalVisible = false"
  [nzMaskClosable]="false"
  [nzFooter]="null"
>
  <ng-container *nzModalContent>
    <app-settings></app-settings>
  </ng-container>
</nz-modal>

<nz-modal
  nzTitle="开发工具"
  nzWidth="80%"
  [(nzVisible)]="developerModal.visible"
  (nzOnCancel)="developerModal.visible = false"
  [nzFooter]="null"
>
  <ng-container *nzModalContent>
    缓存文件下载
    <br>
    <a nz-button nzType="link" (click)="OnDownloadMarketOptionsClick()">/public/assets/market-options.cache.json</a>
    <br>
    <a nz-button nzType="link" (click)="OnDownloadBlueprintOptionsClick()">/public/assets/market-blueprint-options.cache.json</a>
  </ng-container>
</nz-modal>

<ng-template #loadingTpl>
  <span nz-typography>
    [{{loadingItem?.doneStep}}/{{loadingItem?.totalStep}}] {{loadingItem?.name}}
  </span>
</ng-template>

  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private modalService: NzModalService,
    private indexedDBManager: IndexedDBManagerService,
    private loadingViewManager: LoadingViewManagerService,
    private settingsService: SettingsService,
    private marketService: MarketService,
    private commonMessage: CommonMessageService,
    private esiService: EsiService,
    private keyValueRepository: KeyValueRepositoryService,
    private nzMessageService: NzMessageService,
  ) {
    this.init().subscribe()
    this.esiService.foo() // IDE看起来没有未使用的提示，仅此而已
    this.keyValueRepository.foo()
    this.loadingViewManager.showItemOV.subscribe(item => {
      this.loadingItem = item
      if (item == null) {
        if (this.loadingMessageRef != null) {
          this.nzMessageService.remove(this.loadingMessageRef.messageId)
          this.loadingMessageRef = null
        }
      } else {
        if (this.loadingMessageRef == null) {
          this.loadingMessageRef = this.nzMessageService.loading(this.loadingTplRef, {nzDuration: 0, nzPauseOnHover: true, nzAnimate: true})
        }
      }
    })
  }

  developerModal = {
    visible: false
  }

  /**
   * 设置页面可见性
   */
  settingsModalVisible: boolean = false

  updateTimeArr: {label: string, time: string}[] = []

  get isLoading(): boolean {
    return this.loadingViewManager.isLoading
  }

  /**
   * 当前加载显示的信息
   */
  loadingItem: LoadingViewItemVo | null = null

  /**
   * 加载模板
   */
  @ViewChild("loadingTpl")
  loadingTplRef!: TemplateRef<void>

  /**
   * 加载中的消息
   */
  loadingMessageRef: NzMessageRef | null = null

  private init(): Observable<void> {
    this.settingsService.fooApp()
    this.commonMessage.onRegionOrderChange.subscribe(async(_) => { // 当有任何值法身变化时候，更新显示时间
      this.updateTimeArr = await firstValueFrom(this.marketService.getMarketUpdateTimeArr())
    })
    return new Observable(sub => {setTimeout(async() => {
      this.marketService.getMarketUpdateTimeArr().subscribe(arr => {
        this.updateTimeArr = arr
      })
      sub.next()
      sub.complete()
    })})
  }

  public onClearCacheClick() {
    this.modalService.confirm({
      nzTitle: `<i>你确定要清楚所有缓存吗？</i>`,
      nzContent: `<b>用户授权数据将会保留。缓存清除完成后，页面将刷新重新加载数据</b>`,
      nzOnOk: () => {setTimeout(async() => {
        await firstValueFrom(this.indexedDBManager.clearDB())
        location.reload()
      })}
    })
  }

  async OnDownloadMarketOptionsClick() {
    let options = await firstValueFrom(this.marketService.getMarketTreeNodeOptions(MarketTreeModeConstants.Market))
    let jsonStr = JSON.stringify(options)
    DownloadHelper.downloadText("market-options.cache.json", jsonStr)
  }

  async OnDownloadBlueprintOptionsClick() {
    let options = await firstValueFrom(this.marketService.getMarketTreeNodeOptions(MarketTreeModeConstants.Blueprint))
    let jsonStr = JSON.stringify(options)
    DownloadHelper.downloadText("market-blueprint-options.cache.json", jsonStr)
  }

  onSettingsModalClick() {
    this.settingsModalVisible = true
  }
}
