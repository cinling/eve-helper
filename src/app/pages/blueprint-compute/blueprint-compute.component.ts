import { Component, OnInit } from '@angular/core';
import { NzTreeModule, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { firstValueFrom } from 'rxjs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BlueprintService } from '../../services/blueprint.service';
import { IBlueprintMaterial } from '../../statics/entities/Blueprint';
import { MarketService } from '../../services/market.service';
import { MarketTreeComponent } from "../../components/market-tree/market-tree.component";
import { FALLBACK_IMAGE_BASE64 } from '../../statics/contants/common';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-blueprint-compute',
  standalone: true,
  imports: [
    NzTreeModule,
    NzLayoutModule,
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    CommonModule,
    NzTabsModule,
    NzTableModule,
    MarketTreeComponent,
    NzImageModule,
],
  styleUrl: './blueprint-compute.component.scss',
  template: `
<main>
  <div class="left">
    <app-market-tree
      mode="blueprint"
      (onNodeClick)="onNodeClick($event)"
    ></app-market-tree>
  </div>
  <div class="right">
    <nz-table
      #singleTable
      [nzData]="tableData"
      nzSize="small"
    >
      <thead>
        <tr>
          <th>材料</th>
          <th>数量</th>
          <th>单价</th>
          <th>总价</th>
        </tr>
        @for (row of singleTable.data; track $index) {
          <tr>
            <td>
              <img width="32px" height="32px" [src]="imgsrc(row.typeId)"/>
              {{ row.name }}
            </td>
            <td> {{ row.quantity | number: '1.0-0' }} </td>
            <td> {{ row.price | number: '1.2-2' }} </td>
            <td> {{ row.totalPrice | number: '1.2-2' }} </td>
          </tr>
        }
      </thead>
    </nz-table>
  </div>
</main>

  `,
})
export class BlueprintComputeComponent implements OnInit {

  constructor(
    private blueprintService: BlueprintService,
    private marketService: MarketService,
  ) {
  }

  /**
   * 当前激活的页签下标
   */
  selectedTabIndex = 0

  /**
   * 表格数据
   */
  tableData: IBlueprintMaterial[] = []

  /**
   * 材料的图片地址
   */
  materialImgsrcDict: {[typeId: number]: string} = {}

  /**
   * 当前页的物品id
   */
  singleTypeId: number = 0

  /**
   * 默认显示的图片
   */
  fallbackImageBase64 = FALLBACK_IMAGE_BASE64

  ngOnInit(): void {

  }

  /**
   * 节点点击事件
   * @param event
   */
  onNodeClick(node: NzTreeNodeOptions) {
    setTimeout(async() => {
      let typeId = this.getTypeNodeId(node)
      let blueprintMaterials = await firstValueFrom(this.blueprintService.getBlueprintMaterialsByTypeId(typeId))
      this.tableData = blueprintMaterials
    })
  }

  imgsrc(typeId: number): string {
    if (this.materialImgsrcDict[typeId] && this.materialImgsrcDict[typeId] != "error") {
      return this.materialImgsrcDict[typeId]
    }
    this.materialImgsrcDict[typeId] = "error"
    // 开启异步加载数据
    this.marketService.getImgSrcByTypeId(typeId).subscribe(src => {
      this.materialImgsrcDict[typeId] = src
    })
    return this.materialImgsrcDict[typeId]
  }

  /**
   * 获取节点的类型id
   * @param node
   * @returns
   */
  private getTypeNodeId(node: NzTreeNodeOptions): number {
    if (node.key.startsWith("t_")) {
      return parseInt(node.key.substring(2))
    }
    return 0
  }
}
