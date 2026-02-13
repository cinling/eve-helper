import { Component, OnInit } from '@angular/core';
import { MarketTreeComponent } from "../../components/market-tree/market-tree.component";
import { MarketService } from '../../services/market.service';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { MarketNodeTypeConstants } from '../../statics/contants/market';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, CustomChart, LineChart } from 'echarts/charts';
import { DataZoomComponent, GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption, number } from 'echarts';
import { IMarketTrendVo } from '../../structs/view/MarketTrendVo';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from "ng-zorro-antd/form";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { firstValueFrom, forkJoin, map, Observable } from 'rxjs';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FALLBACK_IMAGE_BASE64 } from '../../statics/contants/common';

echarts.use([
  BarChart,
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent,
  LineChart,
  CustomChart,
]);

@Component({
  selector: 'app-market-trend',
  standalone: true,
  imports: [
    CommonModule,
    MarketTreeComponent,
    NgxEchartsDirective,
    NzEmptyModule,
    NzFormModule,
    NzGridModule,
    NzStatisticModule,
    NzImageModule,
    NzDividerModule,
    NzSkeletonModule,
    NzSpinModule,
],
  providers: [
    provideEchartsCore({ echarts })
  ],
  styleUrl: './market-trend.component.scss',
  template: `
<main>
  <div class="left">
    <app-market-tree
      mode="market"
      (onNodeClick)="onNodeClick($event)"
    ></app-market-tree>
  </div>

  <div class="right">
    <div class="right-head">
      <img nz-image width="64px" height="64px" [nzSrc]="trendVo.imgsrc" [nzFallback]="fallbackImageBase64"/>
      <span>{{trendVo.name}}</span>
    </div>

    <nz-divider></nz-divider>

    <nz-row>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="最低卖价" [nzValueTemplate]="lowSellPriceValueTpl"></nz-statistic>
        <ng-template #lowSellPriceValueTpl>
          @if (trendVo.lowSellPrice == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.lowSellPrice | number:'1.2-2' }}
          }
        </ng-template>
      </nz-col>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="最高买价" [nzValueTemplate]="highBuyPriceValueTpl"></nz-statistic>
        <ng-template #highBuyPriceValueTpl>
          @if (trendVo.highBuyPrice == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.highBuyPrice | number:'1.2-2' }}
          }
        </ng-template>
      </nz-col>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="中间价" [nzValueTemplate]="middlePriceValueTpl"></nz-statistic>
        <ng-template #middlePriceValueTpl>
          @if (trendVo.middlePrice == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.middlePrice | number:'1.2-2' }}
          }
        </ng-template>
      </nz-col>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="订单数" [nzValueTemplate]="orderCountValueTpl"></nz-statistic>
        <ng-template #orderCountValueTpl>
          @if (trendVo.orderCount == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.orderCount }}
          }
        </ng-template>
      </nz-col>

      <nz-col nzSpan="6">
        <nz-statistic nzTitle="昨日平均价格" [nzValueTemplate]="lastDayAveragePriceValueTpl"></nz-statistic>
        <ng-template #lastDayAveragePriceValueTpl>
          @if (trendVo.lastDayAveragePrice == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.lastDayAveragePrice | number:'1.2-2' }}
          }
        </ng-template>
      </nz-col>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="昨日成交量" [nzValueTemplate]="lastDayVolumeValueTpl"></nz-statistic>
        <ng-template #lastDayVolumeValueTpl>
          @if (trendVo.lastDayVolume == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.lastDayVolume }}
          }
        </ng-template>
      </nz-col>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="20日平均价格" [nzValueTemplate]="twentyDayAveragePriceValueTpl"></nz-statistic>
        <ng-template #twentyDayAveragePriceValueTpl>
          @if (trendVo.twentyDayAveragePrice == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.twentyDayAveragePrice | number:'1.2-2' }}
          }
        </ng-template>
      </nz-col>
      <nz-col nzSpan="6">
        <nz-statistic nzTitle="20日成交量" [nzValueTemplate]="twentyDayVolumeValueTpl"></nz-statistic>
        <ng-template #twentyDayVolumeValueTpl>
          @if (trendVo.twentyDayVolume == 0) {
            <nz-skeleton-element
              nzType="input"
              [nzActive]="loading"
            ></nz-skeleton-element>
          } @else {
            {{ trendVo.twentyDayVolume }}
          }
        </ng-template>
      </nz-col>
    </nz-row>

    <nz-divider></nz-divider>

    <nz-spin [nzSpinning]="chartsLoading">
      <nz-empty
        *ngIf="!currentNode"
        nzNotFoundContent="从左侧点击所需查询的物品以开始"
      ></nz-empty>

      <div
        *ngIf="currentNode"
        echarts
        [options]="options"
      ></div>
    </nz-spin>
  </div>
</main>
  `,
})
export class MarketTrendComponent implements OnInit {

  constructor(
    private marketService: MarketService,
  ) {
  }
  ngOnInit(): void {}

  /**
   * 图表数据
   */
  options: EChartsOption = {
    // 顶部显示数据条名字
    legend: {
      data: [ '最高', '最低', '平均(1天)', '平均(20天)','成交量']
    },
    /** @ts-ignore */
    tooltip: {
       // 鼠标移动到图表上时显示的提示框
      trigger: 'axis',
      valueFormatter: (value: number | string) => {
        return Number(value).toLocaleString('en-US', {
          style: 'decimal',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      },
    },
    // 底部区间拖动滑块
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 95,
        end: 100,
        xAxisIndex: [0, 1]
      },
    ],
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: [
      {
        name: "价格",
        type: 'value',
        scale: true,
        min: value => value.min * 0.8,
      },
      {
        name: "成交量",
        type: 'value',
        max: value => value.max * 5
      }
    ],
    series: [
      {
        name: "最高",
        data: [],
        type: 'line',
        lineStyle: {
          opacity: 0.15
        },
        showSymbol: false,
      },
      {
        name: "最低",
        data: [],
        type: 'line',
        lineStyle: {
          opacity: 0.15
        },
        showSymbol: false,
      },
      {
        name: "平均(1天)",
        data: [],
        type: 'line',
        showSymbol: false,
      },
      {
        name: "平均(20天)",
        data: [],
        type: 'line',
        showSymbol: false,
      },
      {
        name: "成交量",
        data: [],
        yAxisIndex: 1,
        type: 'bar'
      },
    ],
  }

  /**
   * 页面显示数据
   */
  trendVo: IMarketTrendVo = this.createEmptyTrendVo()

  /**
   * 当前需要展示的节点
   */
  currentNode: NzTreeNode | null = null

  /**
   * 是否加载中
   */
  loading: boolean = false

  /**
   * 图表数据加载中
   */
  chartsLoading: boolean = false

  /**
   * 物品图片
   */
  get imgsrc(): string {
     if (this.currentNode == null) {
      return 'error'
    }
    let src = this.marketService.getNodeImgsrc(this.currentNode, 64)
    if (src == '') {
      src = 'error'
    }
    return src
  }

  /**
   * 默认图片
   */
  fallbackImageBase64 = FALLBACK_IMAGE_BASE64

  /**
   * 物品被点击
   * @param node
   * @returns
   */
  onNodeClick(node: NzTreeNode) {
    if (this.marketService.getMarketNodeType(node) != MarketNodeTypeConstants.Type) {
      return // 不是物品节点，不处理
    }

    this.loading = true
    this.chartsLoading = true

    new Observable<void>(sub => {setTimeout(async() => {
      this.resetTrendVo()
      this.currentNode = node

      // 更新名字和图片
      this.trendVo.name = node.title
      let src = this.marketService.getNodeImgsrc(node, 64)
      if (src == '') {
        src = 'error'
      }
      this.trendVo.imgsrc = src

      // 等待所有数据处理完成
      await firstValueFrom(forkJoin([
        // 请求历史数据
        this.marketService.getHistoryByNode(node).pipe(map(vo => {
          /**
           * 保留两位小数的数据
           */
          let average_20d: number[] = []
          for (let i in vo.average_20d) {
            let tmpItem = vo.average_20d[i]
            average_20d.push(Number(tmpItem.toFixed(2)))
          }

          let options = JSON.parse(JSON.stringify(this.options)) as EChartsOption
          // 非数据类数据转存
          /** @ts-ignore  */
          options.tooltip.valueFormatter = this.options.tooltip.valueFormatter
          /** @ts-ignore  */
          options.yAxis[0].min = this.options.yAxis[0].min
          /** @ts-ignore  */
          options.yAxis[1].max = this.options.yAxis[1].max

          /** @ts-ignore  */
          options.xAxis.data = vo.date.map(v => v.substring(0, 4) + "\n" + v.substring(5))
          /** @ts-ignore  */
          options.series[0].data = vo.highest
          /** @ts-ignore  */
          options.series[1].data = vo.lowest
          /** @ts-ignore  */
          options.series[2].data = vo.average
          /** @ts-ignore  */
          options.series[3].data = average_20d
          /** @ts-ignore  */
          options.series[4].data = vo.volume

          // 刷新表格数据
          this.options = options
          this.chartsLoading = false

          this.trendVo.lastDayAveragePrice = vo.average[vo.average.length - 1]
          this.trendVo.lastDayVolume = vo.volume[vo.volume.length - 1]
          this.trendVo.twentyDayAveragePrice = average_20d[average_20d.length - 1]
          let twentyDayVolume = 0
          for (let i = vo.volume.length - 1; i >= vo.volume.length - 20 && i >= 0; i--) {
            twentyDayVolume += vo.volume[i]
          }
          this.trendVo.twentyDayVolume = twentyDayVolume
        })),
        // 请求现有订单数据
        this.marketService.getOrderByNode(node).pipe(map(orders => {
          let orderCount = 0
          let highBuyPrice = 0
          let lowSellPrice = 0
          for (let i in orders) {
            let order = orders[i]
            orderCount += order.volume_remain
            if (order.is_buy_order) {
              highBuyPrice = order.price > highBuyPrice ? order.price : highBuyPrice
            } else {
              lowSellPrice = order.price < lowSellPrice || lowSellPrice == 0 ? order.price : lowSellPrice
            }
          }
          let middlePrice = Number(((highBuyPrice + lowSellPrice) / 2).toFixed())

          this.trendVo.highBuyPrice = highBuyPrice
          this.trendVo.lowSellPrice = lowSellPrice
          this.trendVo.middlePrice = middlePrice
          this.trendVo.orderCount = orderCount
        })),
      ]))


      sub.next()
      sub.complete()
    })}).subscribe(() => {
      this.loading = false
      this.chartsLoading = false
    })
  }

  private createEmptyTrendVo() {
    return {
      imgsrc: 'error',
      name: '',

      lowSellPrice: 0,
      highBuyPrice: 0,
      middlePrice: 0,
      orderCount: 0,
      lastDayAveragePrice: 0,
      lastDayVolume: 0,
      twentyDayAveragePrice: 0,
      twentyDayVolume: 0,
    }
  }

  private resetTrendVo() {
    this.trendVo = this.createEmptyTrendVo()
  }
}
