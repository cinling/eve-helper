import { Injectable } from '@angular/core';
import { first, firstValueFrom, Observable } from 'rxjs';
import { IBlueprintMaterial } from '../statics/entities/Blueprint';
import { BlueprintRepositoryService } from './repositories/blueprint-repository.service';
import { TypeRepositoryService } from './repositories/type-repository.service';
import { IWaitUntilInit, WaitUntilInitFuncImpl } from '../statics/interfaces/IWaitUntilInit';
import { LoadingViewManagerService } from './managers/loading-view-manager.service';
import { CommonMessageService } from './messages/common-message.service';
import { OrderRepositoryService } from './repositories/order-repository.service';
import { getMarketKeySystemId } from '../structs/store/Settings';
import { UniverseRepositoryService } from './repositories/universe-repository.service';
import { PriceTypeConstants } from '../statics/contants/market';


/**
 * 蓝图功能的逻辑部分代码
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintService implements IWaitUntilInit {

  constructor(
    private blueprintRepository: BlueprintRepositoryService,
    private typeRepository: TypeRepositoryService,
    private loadingViewManager: LoadingViewManagerService,
    private commonMessage: CommonMessageService,
    private orderRepository: OrderRepositoryService,
    private universeRepository: UniverseRepositoryService,
  ) {
    let loadingItem = this.loadingViewManager.register("BlueprintService", "蓝图数据", 1)
    this.init().subscribe((() => {
      this.loadingViewManager.finished(loadingItem)
    }))
  }
  isInit: boolean = false
  waitUntilInit(): Observable<void> { return WaitUntilInitFuncImpl(this)}

  /**
   * 物品id到蓝图id的映射
   */
  private typeIdBlueprintTypeIdDict: Map<number, number> = new Map()

  private init(): Observable<void> {
    return new Observable(sub => {setTimeout(async() => {
      let blueprintDict = await firstValueFrom(this.blueprintRepository.getBlueprintDict())
      for (let i in blueprintDict) {
        let blueprint = blueprintDict[i]
        let products = blueprint.activities.manufacturing?.products ?? []
        for (let j = 0; j < products.length; j++) {
          let product = products[j]
          this.typeIdBlueprintTypeIdDict.set(product.typeID, blueprint.blueprintTypeID)
        }
      }

      this.isInit = true
      sub.next()
      sub.complete()
    })})
  }

  /**
   * 计算蓝图的材料
   * @param blueprintTypeId 蓝图id
   * @returns 蓝图的材料
   */
  public getBlueprintMaterials(blueprintTypeId: number): Observable<IBlueprintMaterial[]> {
    return new Observable(sub => {setTimeout(async() =>{
      let blueprint = await firstValueFrom(this.blueprintRepository.getBlueprint(blueprintTypeId))
      if (blueprint == null) {
        sub.next([])
        sub.complete()
        console.warn("BlueprintService.getBlueprintMaterials", `blueprint[${blueprintTypeId}] is null`)
        return
      }
      let settings = await firstValueFrom(this.commonMessage.settings)
      let systemId = getMarketKeySystemId(settings.industry.material.marketKey)
      let regionId = await firstValueFrom(this.universeRepository.getRegionIdBySystemid(systemId))

      let regionOrder = await firstValueFrom(this.orderRepository.getRegionOrder(regionId))


      let materials = blueprint.activities.manufacturing?.materials ?? []
      let blueprintMaterials: IBlueprintMaterial[] = []
      for (let i in materials) {
        let material = materials[i]
        let type = await firstValueFrom(this.typeRepository.getType(material.typeID))
        if (type == null) {
          console.warn("BlueprintService.getBlueprintMaterials", `type[${material.typeID}] is null`)
          continue
        }
        let orders = (regionOrder?.orders ?? []).filter(order => order.type_id == type.typeID)


        let lowestSellPrice: number | undefined
        let highestBuyPrice: number | undefined
        for (let i in orders) {
          let order = orders[i]
          if (order.is_buy_order) {
            if (highestBuyPrice == undefined || highestBuyPrice < order.price) {
              highestBuyPrice = order.price
            }
          } else {
            if (lowestSellPrice == undefined || lowestSellPrice > order.price) {
              lowestSellPrice = order.price
            }
          }
        }
        let middlePrice: number | undefined
        if (lowestSellPrice && highestBuyPrice) {
          middlePrice = (lowestSellPrice + highestBuyPrice) / 2
        }



        let m: IBlueprintMaterial = {
          typeId: type.typeID,
          name: type.name,
          quantity: material.quantity,
        }
        // 这是价格信息
        if (settings.industry.material.priceType == PriceTypeConstants.Middle) {
          m.price = middlePrice
        } else if (settings.industry.material.priceType == PriceTypeConstants.LowestSell) {
          m.price = lowestSellPrice
        } else if (settings.industry.material.priceType == PriceTypeConstants.HighestBuy) {
          m.price = highestBuyPrice
        }
        if (m.price) {
          m.totalPrice = m.price * m.quantity
        }

        blueprintMaterials.push(m)
      }

      sub.next(blueprintMaterials)
      sub.complete()
    })})
  }

  public getBlueprintMaterialsByTypeId(typeId: number): Observable<IBlueprintMaterial[]> {
    return new Observable(sub => {setTimeout(async() => {
      let blueprintTypeId = await firstValueFrom(this.getBlueprintTypeIdByTypeId(typeId))
      if (blueprintTypeId == null) {
        sub.next([])
        sub.complete()
        console.warn("BlueprintService.getBlueprintMaterialsByTypeId", `typeId[${typeId}] not found blueprintTypeId`)
        return
      }
      sub.next(await firstValueFrom(this.getBlueprintMaterials(blueprintTypeId)))
      sub.complete()
    })})
  }

  private getTypeIdBlueprintTypeIdDict(): Observable<Map<number, number>> {
    return new Observable(sub => {setTimeout(async() => {
      await firstValueFrom(this.waitUntilInit())
      sub.next(this.typeIdBlueprintTypeIdDict)
      sub.complete()
    })})
  }

  /**
   * 通过物品id获取对应的蓝图id
   * @param typeId
   */
  public getBlueprintTypeIdByTypeId(typeId: number): Observable<number | null> {
    return new Observable(sub => {setTimeout(async() => {
      let dict = await firstValueFrom(this.getTypeIdBlueprintTypeIdDict())
      sub.next(dict.get(typeId) ?? null)
      sub.complete()
    })})
  }
}
