import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormatEmitEvent, NzTreeModule, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { firstValueFrom, Observable } from 'rxjs';
import { MarketService } from '../../services/market.service';
import { MarketTreeMode, MarketTreeModeConstants } from '../../statics/contants/market';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-market-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTreeModule,
    NzIconModule,
    NzInputModule,
    NzSkeletonModule,
  ],
  styleUrl: './market-tree.component.scss',
  template: `
<main #mainElement>
  <nz-input-group
    nzSearch
    [nzSuffix]="searchClearIcon"
  >
      <input
        nz-input
        placeholder="搜索"
        type="text"
        [(ngModel)]="searchValue"
        [disabled]="loading"
      />
    </nz-input-group>
    <ng-template #searchClearIcon>
      @if (searchValue) {
        <span
          nz-icon
          class="ant-input-clear-icon"
          nzTheme="fill"
          nzType="close-circle"
          (click)="searchValue = ''"
        ></span>
      }
    </ng-template>

    <nz-skeleton
     *ngIf="loading"
     [nzActive]="true"
    ></nz-skeleton>

    <nz-tree
      [nzData]="treeNodeOptions"
      [(nzSelectedKeys)]="selectedKeys"
      nzBlockNode
      [nzSearchValue]="searchValue"
      [nzSearchFunc]="searchFunc"
      nzHideUnMatched
      [nzVirtualHeight]="virtualHeight"
      [nzVirtualMinBufferPx]="500"
      [nzTreeTemplate]="nodeTreeTemplate"
      (nzClick)="_onNodeClick($event)"
    ></nz-tree>

    <ng-template #nodeTreeTemplate let-node>
      <div class="tree-node">
        <img class="type-img" [src]="imgsrc(node)" />
        {{ node.title }}
      </div>
    </ng-template>
</main>
  `
})
export class MarketTreeComponent implements AfterViewInit {
  constructor(
    private marketService: MarketService
  ) {}

  /**
   * 节点被点击时触发
   */
  @Output() onNodeClick = new EventEmitter<NzTreeNode>()

  /**
   * 模式
   * 'market' 市场模式
   * 'blueprint' 蓝图模式
   */
  @Input() set mode(mode: MarketTreeMode) {
    this._mode = mode
    this.reloadTreeNodeByMode().subscribe()
  }
  _mode: MarketTreeMode = MarketTreeModeConstants.Market

  /**
   * main标签
   */
  @ViewChild("mainElement") mainElementRef!: ElementRef

  /**
   * 搜索值
   */
  searchValue: string = ""

  /**
   * 树节点
   */
  treeNodeOptions: NzTreeNodeOptions[] = []

  /**
   * 选中的节点
   */
  selectedKeys: string[] = []

  /**
   * 勾选的节点
   */
  checkedKeys: string[] = []

  /**
   * 搜索方法
   */
  searchFunc = (node: NzTreeNodeOptions) => {
    try {
      if (this.searchValue == "") {
        return false
      }
      return node.title.includes(this.searchValue)
    } catch (e) {
      return false
    }
  }

  /**
   * tree的高度
   */
  virtualHeight = "400px"

  /**
   * 是否正在加载
   */
  loading: boolean = false


  ngAfterViewInit(): void {
    this.reloadTreeNodeByMode().subscribe()

    let mainResizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const mainHeight = entry.contentRect.height;
        this.virtualHeight = (mainHeight - 40) + "px"
      }
    })
    mainResizeObserver.observe(this.mainElementRef.nativeElement)
  }

  /**
   * 节点被点击触发
   * @param event
   */
  _onNodeClick(event: NzFormatEmitEvent) {
    this.selectedKeys = [] // 让节点不要处于选中状态
    if (event.node === undefined || event.node === null) {
      console.error(`MarketTreeComponent._onNodeClick event.node is undefined or null`, event)
      return
    }
    this.onNodeClick.emit(event.node)
  }

  /**
   * 节点图片
   * @param node
   * @returns
   */
  imgsrc(node: NzTreeNode): string {
    return this.marketService.getNodeImgsrc(node, 32)
  }

  /**
   * 重新加载树节点
   * @returns
   */
  private reloadTreeNodeByMode(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      this.loading = true
      this.treeNodeOptions = []
      let options = await firstValueFrom(this.marketService.getMarketTreeNodeOptions(this._mode))
      this.treeNodeOptions = options
      this.loading = false
      sub.next()
      sub.complete()
    })})
  }
}