import { Component } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { AssetService } from '../../services/asset.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AssetItemTypeConstants, IAssetItemVo, IAssetViewVo } from '../../structs/view/AssetItemVo';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ImageRepositoryService } from '../../services/repositories/image-repository.service';

@Component({
  selector: 'app-asset',
  standalone: true,
  imports: [
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTypographyModule,
    NzToolTipModule,
    NzImageModule,
  ],
  template: `
<div class="top-container">
  <button
    nz-button
    nzType="primary"
    nzShape="circle"
    [nzLoading]="loading"
    nz-tooltip="资产ESI原数据每小时更新一次，因此以下数据也是有不高于一小时的延迟"
    (click)="reloadAssetViewVo(true)"
  >
    <span nz-icon nzType="redo"></span>
  </button>

   <p nz-typography>上次更新时间：{{ assetViewVo?.lastUpdateTime }}</p>
</div>

<nz-table
  #table
  [nzData]="assetItemVos"
  [nzLoading]="loading"
  nzSize="small"
>
  <thead>
    <tr>
      <th>名称</th>
      <th>数量</th>
      <th>预估价</th>
    </tr>
  </thead>
  <tbody>
     @for (data of table.data; track data) {
        @for (item of mapOfExpandedData[data.key]; track item) {
          @if ((item.parent && item.parent.expand) || !item.parent) {
            <tr>
              <td
                [nzIndentSize]="item.level! * 20"
                [nzShowExpand]="item.children && item.children.length > 0"
                [(nzExpand)]="item.expand"
                (nzExpandChange)="collapse(mapOfExpandedData[data.key], item, $event)"
              >
                <img
                  nz-image
                  width="24px"
                  height="24px"
                  [nzDisablePreview]="true"
                  [nzSrc]="imgsrc(item)"
                />{{ item.name }}
              </td>
              <td></td>
              <td></td>
            </tr>
          }
        }
     }
  </tbody>
</nz-table>
  `,
  styleUrl: './asset.component.scss'
})
export class AssetComponent {

  constructor(
    private assetService: AssetService,
    private imageRepository: ImageRepositoryService,
  ) {
    this.init().subscribe()
  }

  assetItemVos: IAssetItemVo[] = []
  mapOfExpandedData: { [key: string]: IAssetItemVo[] } = {};
  loading = false

  assetViewVo: IAssetViewVo | undefined

  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      await this.reloadAssetViewVo(false)
      sub.next()
      sub.complete()
    })})
  }

  /**
   * 重新加载页面数据
   * @param reloadNow
   */
  async reloadAssetViewVo(reloadNow: boolean = false) {
    this.loading = true
    let vo = await firstValueFrom(this.assetService.getAssetViewVo(reloadNow))
    this.setAssetitemVos(vo.assetItemVos)
    this.assetViewVo = vo
    this.loading = false
  }

  private setAssetitemVos(assetItemVos: IAssetItemVo[]) {
    this.assetItemVos = assetItemVos
    this.assetItemVos.forEach(vo => {
      this.mapOfExpandedData[vo.key] = this.convertTreeToList(vo);
    })
  }

  imgsrc(vo: IAssetItemVo): string {
    if (vo.type == AssetItemTypeConstants.Character) {
      return this.imageRepository.character(vo.id)
    }
    if (vo.type == AssetItemTypeConstants.Station && vo.typeId) {
      return this.imageRepository.typeIcon(vo.typeId)
    }
    return ""
  }

  convertTreeToList(root: IAssetItemVo): IAssetItemVo[] {
    const stack: IAssetItemVo[] = [];
    const array: IAssetItemVo[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: IAssetItemVo, hashMap: { [key: string]: boolean }, array: IAssetItemVo[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  collapse(array: IAssetItemVo[], data: IAssetItemVo, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
}
